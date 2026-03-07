"""
Admin configuration for Users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ShippingAddress


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin.
    """
    list_display = ['email', 'username', 'full_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('role', 'phone')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('email', 'first_name', 'last_name', 'role', 'phone')
        }),
    )


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    """
    Shipping Address admin.
    """
    list_display = ['full_name', 'user', 'city', 'postal_code', 'is_default']
    list_filter = ['country', 'is_default']
    search_fields = ['full_name', 'city', 'user__email']
