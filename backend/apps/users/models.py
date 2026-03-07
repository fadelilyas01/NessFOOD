"""
Custom User model for Ness Food E-commerce.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with role-based access.
    """
    
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Administrateur'
        CLIENT = 'client', 'Client'
    
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CLIENT
    )
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN or self.is_superuser


class ShippingAddress(models.Model):
    """
    Shipping address for users.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shipping_addresses'
    )
    full_name = models.CharField(max_length=100)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='France')
    phone = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Adresse de livraison'
        verbose_name_plural = 'Adresses de livraison'
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f"{self.full_name} - {self.city}"
    
    def save(self, *args, **kwargs):
        # If this is set as default, unset other defaults
        if self.is_default:
            ShippingAddress.objects.filter(
                user=self.user, is_default=True
            ).update(is_default=False)
        super().save(*args, **kwargs)
