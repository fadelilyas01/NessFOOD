"""
Payment models for tracking Stripe transactions.
"""

from django.db import models
from django.conf import settings
from apps.orders.models import Order


class Payment(models.Model):
    """
    Payment record for tracking Stripe transactions.
    """
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'En attente'
        SUCCEEDED = 'succeeded', 'Réussi'
        FAILED = 'failed', 'Échoué'
        REFUNDED = 'refunded', 'Remboursé'
        PARTIALLY_REFUNDED = 'partially_refunded', 'Partiellement remboursé'
    
    # Relationships
    order = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='payments'
    )
    
    # Stripe IDs
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True)
    stripe_charge_id = models.CharField(max_length=255, blank=True)
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='CAD')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Refund tracking
    refunded_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0
    )
    
    # Customer info
    customer_email = models.EmailField()
    
    # Metadata
    payment_method_type = models.CharField(max_length=50, blank=True)
    last_four = models.CharField(max_length=4, blank=True)
    card_brand = models.CharField(max_length=20, blank=True)
    
    # Error info
    error_message = models.TextField(blank=True)
    error_code = models.CharField(max_length=50, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Paiement {self.stripe_payment_intent_id[:20]}... - {self.amount} {self.currency}"
    
    @property
    def stripe_dashboard_url(self):
        """Get link to Stripe dashboard for this payment."""
        base_url = "https://dashboard.stripe.com"
        if 'test' in settings.STRIPE_SECRET_KEY:
            base_url += "/test"
        return f"{base_url}/payments/{self.stripe_payment_intent_id}"
    
    @property
    def is_refundable(self):
        """Check if payment can be refunded."""
        return (
            self.status == self.Status.SUCCEEDED and
            self.refunded_amount < self.amount
        )
    
    @property
    def remaining_refundable(self):
        """Amount that can still be refunded."""
        return self.amount - self.refunded_amount


class WebhookEvent(models.Model):
    """
    Log of Stripe webhook events for debugging and audit.
    """
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'En attente'
        PROCESSED = 'processed', 'Traité'
        FAILED = 'failed', 'Échoué'
        IGNORED = 'ignored', 'Ignoré'
    
    # Stripe event info
    stripe_event_id = models.CharField(max_length=255, unique=True)
    event_type = models.CharField(max_length=100)
    
    # Processing status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Payload (JSON)
    payload = models.JSONField()
    
    # Error tracking
    error_message = models.TextField(blank=True)
    processing_attempts = models.PositiveIntegerField(default=0)
    
    # Timestamps
    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Événement Webhook'
        verbose_name_plural = 'Événements Webhook'
        ordering = ['-received_at']
    
    def __str__(self):
        return f"{self.event_type} - {self.stripe_event_id[:20]}..."
