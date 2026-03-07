"""
Enhanced Views for Payments app with robust Stripe integration.
"""

import stripe
import logging
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.orders.models import Order
from apps.orders.serializers import OrderDetailSerializer
from .models import Payment, WebhookEvent
from .services import StripeService
from .serializers import (
    CreateCheckoutSerializer,
    PaymentSerializer,
    RefundSerializer,
)

logger = logging.getLogger(__name__)


class CreateCheckoutSessionView(APIView):
    """
    Create a Stripe Checkout Session for an order.
    Validates order ownership and payment status.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = CreateCheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_number = serializer.validated_data['order_number']
        
        try:
            order = Order.objects.get(
                order_number=order_number,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response({
                'error': 'Commande non trouvée.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if order is already paid
        if order.status != Order.Status.PENDING:
            return Response({
                'error': 'Cette commande a déjà été traitée.',
                'status': order.get_status_display()
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate order total
        if order.total <= 0:
            return Response({
                'error': 'Le montant de la commande est invalide.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Build success/cancel URLs
        frontend_url = settings.FRONTEND_URL
        success_url = f"{frontend_url}/paiement/succes?order={order.order_number}"
        cancel_url = f"{frontend_url}/paiement/annule?order={order.order_number}"
        
        try:
            session = StripeService.create_checkout_session(
                order=order,
                success_url=success_url,
                cancel_url=cancel_url
            )
            
            return Response({
                'checkout_url': session.url,
                'session_id': session.id,
                'expires_at': session.expires_at,
            })
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error creating checkout: {e}")
            return Response({
                'error': 'Erreur lors de la création du paiement. Veuillez réessayer.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class PaymentStatusView(APIView):
    """
    Check payment status for an order.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, order_number):
        try:
            order = Order.objects.get(
                order_number=order_number,
                user=request.user
            )
        except Order.DoesNotExist:
            return Response({
                'error': 'Commande non trouvée.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get session status from Stripe if pending
        if order.status == Order.Status.PENDING and order.stripe_checkout_session_id:
            session = StripeService.retrieve_session(order.stripe_checkout_session_id)
            if session and session.payment_status == 'paid':
                # Update order if webhook hasn't processed yet
                order.status = Order.Status.PAID
                order.paid_at = timezone.now()
                order.save()
        
        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'status_display': order.get_status_display(),
            'is_paid': order.is_paid,
            'total': str(order.total),
        })


class PaymentSuccessView(APIView):
    """
    Handle successful payment redirect.
    Called after Stripe redirects back to frontend.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        session_id = request.query_params.get('session_id')
        order_number = request.query_params.get('order')
        
        if not order_number:
            return Response({
                'error': 'Numéro de commande manquant.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = Order.objects.get(order_number=order_number)
            
            # Verify session if provided
            if session_id:
                session = StripeService.retrieve_session(session_id)
                if session and session.payment_status == 'paid':
                    if order.status == Order.Status.PENDING:
                        order.status = Order.Status.PAID
                        order.paid_at = timezone.now()
                        if session.payment_intent:
                            order.stripe_payment_intent_id = session.payment_intent
                        order.save()
            
            return Response({
                'message': 'Paiement réussi !',
                'order': OrderDetailSerializer(order).data
            })
            
        except Order.DoesNotExist:
            return Response({
                'error': 'Commande non trouvée.'
            }, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """
    Handle Stripe webhooks.
    Verifies signature and processes events.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        if not sig_header:
            logger.warning("Webhook received without signature")
            return HttpResponse(status=400)
        
        # Verify webhook signature
        try:
            event = StripeService.verify_webhook_signature(payload, sig_header)
        except ValueError as e:
            logger.error(f"Invalid webhook payload: {e}")
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {e}")
            return HttpResponse(status=400)
        
        # Log webhook event
        webhook_event, created = WebhookEvent.objects.get_or_create(
            stripe_event_id=event['id'],
            defaults={
                'event_type': event['type'],
                'payload': event['data'],
            }
        )
        
        if not created:
            # Already processed
            logger.info(f"Webhook {event['id']} already processed")
            return HttpResponse(status=200)
        
        # Process event
        try:
            self._process_event(event, webhook_event)
            webhook_event.status = WebhookEvent.Status.PROCESSED
            webhook_event.processed_at = timezone.now()
            
        except Exception as e:
            logger.error(f"Error processing webhook {event['id']}: {e}")
            webhook_event.status = WebhookEvent.Status.FAILED
            webhook_event.error_message = str(e)
            webhook_event.processing_attempts += 1
        
        webhook_event.save()
        
        return HttpResponse(status=200)
    
    def _process_event(self, event, webhook_event):
        """Process different event types."""
        event_type = event['type']
        data = event['data']['object']
        
        logger.info(f"Processing webhook event: {event_type}")
        
        if event_type == 'checkout.session.completed':
            StripeService.handle_checkout_completed(data)
            self._create_payment_record(data)
            
        elif event_type == 'checkout.session.expired':
            StripeService.handle_session_expired(data)
            
        elif event_type == 'payment_intent.succeeded':
            StripeService.handle_payment_succeeded(data)
            
        elif event_type == 'payment_intent.payment_failed':
            StripeService.handle_payment_failed(data)
            
        elif event_type == 'charge.refunded':
            self._handle_refund(data)
            
        else:
            # Event not handled
            webhook_event.status = WebhookEvent.Status.IGNORED
            logger.info(f"Webhook event type {event_type} not handled")
    
    def _create_payment_record(self, session):
        """Create Payment record from checkout session."""
        try:
            from apps.orders.models import Order
            
            order_id = session.get('metadata', {}).get('order_id')
            if not order_id:
                return
            
            order = Order.objects.get(id=order_id)
            
            # Get payment intent details
            payment_intent = None
            if session.get('payment_intent'):
                payment_intent = stripe.PaymentIntent.retrieve(
                    session['payment_intent']
                )
            
            Payment.objects.create(
                order=order,
                user=order.user,
                stripe_payment_intent_id=session.get('payment_intent', ''),
                stripe_checkout_session_id=session.get('id', ''),
                amount=order.total,
                currency='CAD',
                status=Payment.Status.SUCCEEDED,
                customer_email=session.get('customer_email', order.shipping_email),
                payment_method_type=payment_intent.payment_method_types[0] if payment_intent else '',
                completed_at=timezone.now(),
            )
            
        except Exception as e:
            logger.error(f"Failed to create payment record: {e}")
    
    def _handle_refund(self, charge):
        """Handle refund event."""
        try:
            payment = Payment.objects.get(
                stripe_payment_intent_id=charge.get('payment_intent')
            )
            
            # Update refunded amount
            refunded = charge.get('amount_refunded', 0) / 100
            payment.refunded_amount = refunded
            
            if refunded >= payment.amount:
                payment.status = Payment.Status.REFUNDED
            else:
                payment.status = Payment.Status.PARTIALLY_REFUNDED
            
            payment.save()
            
        except Payment.DoesNotExist:
            logger.warning(f"Payment not found for refund: {charge.get('payment_intent')}")


class PaymentConfigView(APIView):
    """
    Get Stripe publishable key and configuration for frontend.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            'publishable_key': settings.STRIPE_PUBLISHABLE_KEY,
            'currency': 'cad',
            'currency_symbol': '$CAD',
            'free_shipping_threshold': settings.SHIPPING_CONFIG['FREE_SHIPPING_THRESHOLD'],
        })


class UserPaymentsView(APIView):
    """
    List user's payment history.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        payments = Payment.objects.filter(user=request.user)
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)


class AdminRefundView(APIView):
    """
    Process refund for an order (admin only).
    """
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, order_number):
        serializer = RefundSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({
                'error': 'Commande non trouvée.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not order.stripe_payment_intent_id:
            return Response({
                'error': 'Aucun paiement trouvé pour cette commande.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        amount = serializer.validated_data.get('amount')
        reason = serializer.validated_data.get('reason', 'requested_by_customer')
        
        refund = StripeService.create_refund(order, amount=amount, reason=reason)
        
        if refund:
            return Response({
                'message': 'Remboursement effectué.',
                'refund_id': refund.id,
                'amount': refund.amount / 100,
            })
        else:
            return Response({
                'error': 'Échec du remboursement.'
            }, status=status.HTTP_400_BAD_REQUEST)
