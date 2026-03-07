"""
Order models for Ness Food E-commerce.
"""

import uuid
from django.db import models
from django.conf import settings
from apps.products.models import Product
from apps.core.models import TimeStampedModel


class Order(models.Model):
    """
    Customer order.
    """
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'En attente'
        PAID = 'paid', 'Payée'
        PREPARING = 'preparing', 'En préparation'
        SHIPPED = 'shipped', 'Expédiée'
        DELIVERED = 'delivered', 'Livrée'
        CANCELLED = 'cancelled', 'Annulée'
        REFUNDED = 'refunded', 'Remboursée'
    
    # Order identification
    order_number = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='orders'
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    
    # Shipping information (snapshot at order time)
    shipping_name = models.CharField(max_length=100)
    shipping_email = models.EmailField()
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.CharField(max_length=255)
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default='France')
    
    # Pricing (snapshot at order time)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # Notes
    customer_notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Commande {self.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_order_number():
        """Generate unique order number."""
        import random
        import string
        prefix = 'NF'
        unique_id = ''.join(random.choices(string.digits, k=8))
        return f"{prefix}{unique_id}"
    
    @property
    def is_paid(self):
        return self.status in [
            self.Status.PAID,
            self.Status.PREPARING,
            self.Status.SHIPPED,
            self.Status.DELIVERED
        ]


class OrderItem(models.Model):
    """
    Item in an order (snapshot of product at order time).
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True
    )
    
    # Snapshot of product at order time
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_weight = models.CharField(max_length=50)
    
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = "Article de commande"
        verbose_name_plural = "Articles de commande"
    
    def __str__(self):
        return f"{self.quantity}x {self.product_name}"
    
    def save(self, *args, **kwargs):
        if self.product:
            if not self.product_name:
                self.product_name = self.product.name
            if not self.product_price:
                self.product_price = self.product.price
            if not self.product_weight:
                self.product_weight = self.product.weight
            
            # Calculate subtotal
            if self.product_price and self.quantity:
                self.subtotal = self.product_price * self.quantity
                
        super().save(*args, **kwargs)


class OrderStatusHistory(TimeStampedModel):
    """
    History of status changes for an order.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    status = models.CharField(
        max_length=20,
        choices=Order.Status.choices
    )
    notes = models.TextField(
        blank=True, 
        help_text='Commentaire optionnel sur le changement de statut'
    )

    class Meta:
        verbose_name = 'Historique de statut'
        verbose_name_plural = 'Historiques de statuts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order.order_number} - {self.get_status_display()}"
