"""
Test utilities for Stripe payments.
Provides helper functions for testing payment flows.
"""

import stripe
from django.conf import settings


class StripeTestCards:
    """
    Stripe test card numbers for different scenarios.
    Use these with Stripe's test mode.
    """
    
    # Successful payments
    VISA_SUCCESS = '4242424242424242'
    MASTERCARD_SUCCESS = '5555555555554444'
    AMEX_SUCCESS = '378282246310005'
    
    # Declined cards
    GENERIC_DECLINE = '4000000000000002'
    INSUFFICIENT_FUNDS = '4000000000009995'
    EXPIRED_CARD = '4000000000000069'
    INCORRECT_CVC = '4000000000000127'
    PROCESSING_ERROR = '4000000000000119'
    
    # 3D Secure
    REQUIRES_3DS = '4000000000003220'
    REQUIRES_3DS_2 = '4000000000003063'
    
    # Special cases
    CARD_STOLEN = '4000000000009979'
    FRAUD_WARNING = '4100000000000019'


def get_test_mode_status():
    """
    Check if Stripe is in test mode.
    
    Returns:
        dict with test mode information
    """
    is_test = 'test' in settings.STRIPE_SECRET_KEY
    
    return {
        'is_test_mode': is_test,
        'warning': None if is_test else 'ATTENTION: Mode production actif!',
        'test_cards_available': is_test,
    }


def simulate_webhook_event(event_type, data):
    """
    Create a simulated webhook event for testing.
    NOTE: Only use in development/testing.
    
    Args:
        event_type: Type of Stripe event
        data: Event data object
        
    Returns:
        Dict mimicking Stripe event structure
    """
    import time
    import uuid
    
    return {
        'id': f'evt_test_{uuid.uuid4().hex[:24]}',
        'type': event_type,
        'created': int(time.time()),
        'data': {
            'object': data
        },
        'livemode': False,
    }


def create_test_checkout_session(order):
    """
    Create a test checkout session without actual Stripe API call.
    For unit testing purposes.
    
    Args:
        order: Order instance
        
    Returns:
        Dict mimicking Stripe session
    """
    import uuid
    import time
    
    return {
        'id': f'cs_test_{uuid.uuid4().hex[:24]}',
        'url': f'https://checkout.stripe.com/pay/cs_test_{uuid.uuid4().hex[:8]}',
        'payment_status': 'unpaid',
        'status': 'open',
        'expires_at': int(time.time()) + 1800,
        'metadata': {
            'order_id': str(order.id),
            'order_number': order.order_number,
        },
    }


# Webhook event types handled
HANDLED_WEBHOOK_EVENTS = [
    'checkout.session.completed',
    'checkout.session.expired',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.refunded',
]


# Test mode helper message
TEST_MODE_MESSAGE = """
=== STRIPE TEST MODE ===

Utilisez ces numéros de carte pour tester:

✅ Paiement réussi:
   4242 4242 4242 4242

❌ Carte refusée:
   4000 0000 0000 0002

⚠️ Fonds insuffisants:
   4000 0000 0000 9995

🔐 Authentification 3DS:
   4000 0000 0000 3220

Expiration: N'importe quelle date future
CVC: N'importe quels 3 chiffres
Code postal: N'importe quel code valide
"""
