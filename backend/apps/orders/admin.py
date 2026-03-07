"""
Admin configuration for Orders app.
"""

from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_price', 'product_weight', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user', 'status', 'total', 
        'shipping_city', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'shipping_country']
    search_fields = ['order_number', 'user__email', 'shipping_name']
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'paid_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Informations de commande', {
            'fields': ('order_number', 'user', 'status')
        }),
        ('Livraison', {
            'fields': (
                'shipping_name', 'shipping_email', 'shipping_phone',
                'shipping_address', 'shipping_city', 'shipping_postal_code',
                'shipping_country'
            )
        }),
        ('Montants', {
            'fields': ('subtotal', 'shipping_cost', 'total')
        }),
        ('Paiement', {
            'fields': ('stripe_payment_intent_id', 'stripe_checkout_session_id', 'paid_at'),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('customer_notes', 'admin_notes')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'subtotal']
    list_filter = ['order__status']
    search_fields = ['product_name', 'order__order_number']
