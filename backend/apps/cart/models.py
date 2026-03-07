"""
Cart models for Ness Food E-commerce.
"""

from django.db import models
from django.conf import settings
from apps.products.models import Product


class Cart(models.Model):
    """
    Shopping cart linked to a user.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Panier'
        verbose_name_plural = 'Paniers'
    
    def __str__(self):
        return f"Panier de {self.user.email}"
    
    @property
    def total(self):
        """Calculate cart total."""
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def total_items(self):
        """Count total items in cart."""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def shipping_cost(self):
        """Calculate shipping cost."""
        from django.conf import settings
        from decimal import Decimal
        config = settings.SHIPPING_CONFIG
        # Ensure comparison is done with same types
        if self.total >= Decimal(str(config['FREE_SHIPPING_THRESHOLD'])):
            return Decimal('0.00')
        return Decimal(str(config['STANDARD_SHIPPING_COST']))
    
    @property
    def grand_total(self):
        """Total with shipping."""
        return self.total + self.shipping_cost
    
    def clear(self):
        """Remove all items from cart."""
        self.items.all().delete()


class CartItem(models.Model):
    """
    Item in a shopping cart.
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Article du panier'
        verbose_name_plural = 'Articles du panier'
        unique_together = ['cart', 'product']
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    
    @property
    def subtotal(self):
        """Calculate item subtotal."""
        return self.product.price * self.quantity
    
    def save(self, *args, **kwargs):
        # Ensure quantity doesn't exceed stock
        if self.quantity > self.product.stock:
            self.quantity = self.product.stock
        super().save(*args, **kwargs)
