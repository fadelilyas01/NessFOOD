"""
URL routes for enhanced Payments app.
"""

from django.urls import path
from .views import (
    CreateCheckoutSessionView,
    PaymentStatusView,
    PaymentSuccessView,
    StripeWebhookView,
    PaymentConfigView,
    UserPaymentsView,
    AdminRefundView,
)

urlpatterns = [
    # Configuration
    path('config/', PaymentConfigView.as_view(), name='payment_config'),
    
    # Checkout
    path('checkout/', CreateCheckoutSessionView.as_view(), name='create_checkout'),
    path('success/', PaymentSuccessView.as_view(), name='payment_success'),
    
    # Status
    path('status/<str:order_number>/', PaymentStatusView.as_view(), name='payment_status'),
    
    # User payments
    path('history/', UserPaymentsView.as_view(), name='payment_history'),
    
    # Webhook (no auth)
    path('webhook/', StripeWebhookView.as_view(), name='stripe_webhook'),
    
    # Admin
    path('admin/refund/<str:order_number>/', AdminRefundView.as_view(), name='admin_refund'),
]
