"""
Enhanced Stripe Payment Service for Ness Food.
Handles checkout sessions, webhooks, and payment processing.
"""

import stripe
import uuid
import logging
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from .utils import generate_invoice_pdf

# Initialize Stripe with API key
stripe.api_key = settings.STRIPE_SECRET_KEY

# Configure logging
logger = logging.getLogger(__name__)


class StripeService:
    """
    Service class for all Stripe operations.
    Implements PCI-DSS compliant payment processing.
    """
    
    # Default currency (Canadian Dollar)
    DEFAULT_CURRENCY = 'cad'
    
    @classmethod
    def create_checkout_session(cls, order, success_url, cancel_url):
        """
        Create a Stripe Checkout Session for an order.
        
        Args:
            order: Order instance
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect if payment is cancelled
            
        Returns:
            Stripe Checkout Session object
            
        Raises:
            stripe.error.StripeError: If Stripe API call fails
        """
        # Generate idempotency key to prevent duplicate charges
        idempotency_key = f"checkout_{order.order_number}_{uuid.uuid4().hex[:8]}"
        
        # Build line items from order
        line_items = cls._build_line_items(order)
        
        # Create checkout session with all options
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=cancel_url,
            customer_email=order.shipping_email,
            currency=cls.DEFAULT_CURRENCY,
            
            # Metadata for webhook processing
            metadata={
                'order_id': str(order.id),
                'order_number': order.order_number,
                'user_id': str(order.user.id) if order.user else '',
            },
            
            # Payment intent data
            payment_intent_data={
                'metadata': {
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                },
                'description': f"Commande Ness Food #{order.order_number}",
            },
            
            # Shipping address collection (optional)
            # shipping_address_collection={'allowed_countries': ['CA', 'FR']},
            
            # Billing address collection
            billing_address_collection='auto',
            
            # Allow promotion codes (future feature)
            allow_promotion_codes=True,
            
            # Expiration (30 minutes)
            expires_at=int((timezone.now() + timezone.timedelta(minutes=30)).timestamp()),
            
            idempotency_key=idempotency_key,
        )
        
        # Save session ID to order
        order.stripe_checkout_session_id = session.id
        order.save(update_fields=['stripe_checkout_session_id'])
        
        logger.info(f"Created checkout session {session.id} for order {order.order_number}")
        
        return session
    
    @classmethod
    def _build_line_items(cls, order):
        """
        Build Stripe line items from order items.
        
        Args:
            order: Order instance
            
        Returns:
            List of line item dictionaries
        """
        line_items = []
        
        for item in order.items.all():
            line_items.append({
                'price_data': {
                    'currency': cls.DEFAULT_CURRENCY,
                    'unit_amount': cls._to_cents(item.product_price),
                    'product_data': {
                        'name': item.product_name,
                        'description': f"Poids: {item.product_weight}",
                        'metadata': {
                            'product_id': str(item.product_id) if item.product else '',
                        },
                    },
                },
                'quantity': item.quantity,
            })
        
        # Add shipping as a line item if applicable
        if order.shipping_cost > 0:
            line_items.append({
                'price_data': {
                    'currency': cls.DEFAULT_CURRENCY,
                    'unit_amount': cls._to_cents(order.shipping_cost),
                    'product_data': {
                        'name': 'Frais de livraison',
                        'description': 'Livraison standard',
                    },
                },
                'quantity': 1,
            })
        
        return line_items
    
    @staticmethod
    def _to_cents(amount):
        """
        Convert decimal amount to cents for Stripe.
        
        Args:
            amount: Decimal amount in dollars
            
        Returns:
            Integer amount in cents
        """
        return int(Decimal(str(amount)) * 100)
    
    @classmethod
    def retrieve_session(cls, session_id):
        """
        Retrieve a Stripe Checkout Session by ID.
        
        Args:
            session_id: Stripe session ID
            
        Returns:
            Stripe Session object or None
        """
        try:
            return stripe.checkout.Session.retrieve(session_id)
        except stripe.error.StripeError as e:
            logger.error(f"Failed to retrieve session {session_id}: {e}")
            return None
    
    @classmethod
    def verify_webhook_signature(cls, payload, sig_header):
        """
        Verify Stripe webhook signature.
        
        Args:
            payload: Raw request body
            sig_header: Stripe signature header
            
        Returns:
            Stripe Event object
            
        Raises:
            ValueError: If payload is invalid
            stripe.error.SignatureVerificationError: If signature is invalid
        """
        return stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    
    @classmethod
    def handle_checkout_completed(cls, session):
        """
        Handle successful checkout session completion.
        Creates/updates order and sends confirmation email.
        
        Args:
            session: Stripe Checkout Session object
            
        Returns:
            Order instance or None
        """
        from apps.orders.models import Order
        
        order_id = session.get('metadata', {}).get('order_id')
        if not order_id:
            logger.error("No order_id in session metadata")
            return None
        
        try:
            order = Order.objects.get(id=order_id)
            
            # Prevent double processing
            if order.status != Order.Status.PENDING:
                logger.warning(f"Order {order.order_number} already processed, status: {order.status}")
                return order
            
            # Update order status
            order.status = Order.Status.PAID
            order.stripe_payment_intent_id = session.get('payment_intent', '')
            order.paid_at = timezone.now()
            order.save()
            
            # Clear user's cart
            if order.user and hasattr(order.user, 'cart'):
                order.user.cart.clear()
            
            # Send confirmation email
            cls._send_payment_confirmation_email(order)
            
            logger.info(f"Order {order.order_number} marked as paid")
            
            return order
            
        except Order.DoesNotExist:
            logger.error(f"Order {order_id} not found")
            return None
        except Exception as e:
            logger.error(f"Error processing checkout completion: {e}")
            return None
    
    @classmethod
    def handle_payment_succeeded(cls, payment_intent):
        """
        Handle successful payment intent.
        
        Args:
            payment_intent: Stripe PaymentIntent object
        """
        from apps.orders.models import Order
        
        order_number = payment_intent.get('metadata', {}).get('order_number')
        if not order_number:
            return
        
        try:
            order = Order.objects.get(order_number=order_number)
            if order.status == Order.Status.PENDING:
                order.status = Order.Status.PAID
                order.stripe_payment_intent_id = payment_intent['id']
                order.paid_at = timezone.now()
                order.save()
                
                logger.info(f"Payment succeeded for order {order_number}")
        except Order.DoesNotExist:
            logger.error(f"Order {order_number} not found for payment intent")
    
    @classmethod
    def handle_payment_failed(cls, payment_intent):
        """
        Handle failed payment intent.
        
        Args:
            payment_intent: Stripe PaymentIntent object
        """
        from apps.orders.models import Order
        
        order_number = payment_intent.get('metadata', {}).get('order_number')
        if not order_number:
            return
        
        try:
            order = Order.objects.get(order_number=order_number)
            
            # Restore stock
            for item in order.items.all():
                if item.product:
                    item.product.stock += item.quantity
                    item.product.save()
            
            order.status = Order.Status.CANCELLED
            order.admin_notes = f"Paiement échoué - {timezone.now().strftime('%Y-%m-%d %H:%M')}"
            order.save()
            
            # Send failure notification email
            cls._send_payment_failed_email(order)
            
            logger.info(f"Order {order_number} cancelled due to payment failure")
            
        except Order.DoesNotExist:
            logger.error(f"Order {order_number} not found")
    
    @classmethod
    def handle_session_expired(cls, session):
        """
        Handle expired checkout session.
        
        Args:
            session: Stripe Checkout Session object
        """
        from apps.orders.models import Order
        
        order_id = session.get('metadata', {}).get('order_id')
        if not order_id:
            return
        
        try:
            order = Order.objects.get(id=order_id)
            
            if order.status == Order.Status.PENDING:
                # Restore stock
                for item in order.items.all():
                    if item.product:
                        item.product.stock += item.quantity
                        item.product.save()
                
                order.status = Order.Status.CANCELLED
                order.admin_notes = "Session de paiement expirée"
                order.save()
                
                logger.info(f"Order {order.order_number} cancelled - session expired")
                
        except Order.DoesNotExist:
            pass
    
    @classmethod
    def create_refund(cls, order, amount=None, reason='requested_by_customer'):
        """
        Create a refund for an order.
        
        Args:
            order: Order instance
            amount: Amount to refund (None for full refund)
            reason: Refund reason
            
        Returns:
            Stripe Refund object or None
        """
        if not order.stripe_payment_intent_id:
            logger.error(f"No payment intent for order {order.order_number}")
            return None
        
        try:
            refund_params = {
                'payment_intent': order.stripe_payment_intent_id,
                'reason': reason,
                'metadata': {
                    'order_number': order.order_number,
                },
            }
            
            if amount:
                refund_params['amount'] = cls._to_cents(amount)
            
            refund = stripe.Refund.create(**refund_params)
            
            # Update order status
            order.status = Order.Status.REFUNDED
            order.admin_notes = f"Remboursement: {refund.id}"
            order.save()
            
            logger.info(f"Refund {refund.id} created for order {order.order_number}")
            
            return refund
            
        except stripe.error.StripeError as e:
            logger.error(f"Refund failed for order {order.order_number}: {e}")
            return None
    
    @classmethod
    def _send_payment_confirmation_email(cls, order):
        """
        Send payment confirmation email to customer.
        
        Args:
            order: Order instance
        """
        try:
            subject = f"Confirmation de commande #{order.order_number} - Ness Food"
            
            message = f"""
Bonjour {order.shipping_name},

Merci pour votre commande chez Ness Food !

RÉCAPITULATIF DE VOTRE COMMANDE
================================
Numéro de commande : {order.order_number}
Date : {order.paid_at.strftime('%d/%m/%Y à %H:%M')}

ARTICLES :
"""
            for item in order.items.all():
                message += f"  - {item.product_name} x{item.quantity} : {item.subtotal:.2f} $CAD\n"
            
            message += f"""
--------------------------------
Sous-total : {order.subtotal:.2f} $CAD
Livraison : {order.shipping_cost:.2f} $CAD
TOTAL : {order.total:.2f} $CAD

LIVRAISON :
{order.shipping_name}
{order.shipping_address}
{order.shipping_postal_code} {order.shipping_city}
{order.shipping_country}

Votre commande sera préparée et expédiée dans les 24-48h.

À très bientôt sur Ness Food !
L'équipe Ness Food

---
Ceci est un email automatique, merci de ne pas y répondre.
Contact : contact@nessfood.com
"""

            # Generate PDF invoice
            pdf_invoice = generate_invoice_pdf(order)

            msg = EmailMessage(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[order.shipping_email]
            )
            msg.attach(f'Facture_NessFood_{order.order_number}.pdf', pdf_invoice, 'application/pdf')
            msg.send(fail_silently=True)
            
            logger.info(f"Confirmation email with PDF sent for order {order.order_number}")
            
        except Exception as e:
            logger.error(f"Failed to send confirmation email: {e}")
    
    @classmethod
    def _send_payment_failed_email(cls, order):
        """
        Send payment failure notification email.
        
        Args:
            order: Order instance
        """
        try:
            subject = f"Échec du paiement - Commande #{order.order_number}"
            
            message = f"""
Bonjour {order.shipping_name},

Nous n'avons malheureusement pas pu traiter votre paiement pour la commande #{order.order_number}.

Votre commande a été annulée et votre carte n'a pas été débitée.

Si vous souhaitez réessayer, vous pouvez recréer une commande sur notre site :
{settings.FRONTEND_URL}/boutique

Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.

L'équipe Ness Food
contact@nessfood.com
"""
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.shipping_email],
                fail_silently=True,
            )
            
        except Exception as e:
            logger.error(f"Failed to send payment failed email: {e}")
