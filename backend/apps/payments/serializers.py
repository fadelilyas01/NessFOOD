"""
Serializers for Payments app.
"""

from rest_framework import serializers
from .models import Payment, WebhookEvent


class CreateCheckoutSerializer(serializers.Serializer):
    """
    Serializer for creating a checkout session.
    """
    order_number = serializers.CharField(max_length=20)


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for payment records.
    """
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    stripe_dashboard_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order_number', 'amount', 'currency', 'status',
            'status_display', 'payment_method_type', 'card_brand',
            'last_four', 'refunded_amount', 'completed_at',
            'stripe_dashboard_url', 'created_at'
        ]


class RefundSerializer(serializers.Serializer):
    """
    Serializer for creating a refund.
    """
    amount = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        required=False,
        help_text='Montant à rembourser (vide = remboursement total)'
    )
    reason = serializers.ChoiceField(
        choices=[
            ('requested_by_customer', 'Demandé par le client'),
            ('duplicate', 'Doublon'),
            ('fraudulent', 'Frauduleux'),
        ],
        default='requested_by_customer'
    )


class WebhookEventSerializer(serializers.ModelSerializer):
    """
    Serializer for webhook events (admin).
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = WebhookEvent
        fields = [
            'id', 'stripe_event_id', 'event_type', 'status',
            'status_display', 'error_message', 'processing_attempts',
            'received_at', 'processed_at'
        ]
