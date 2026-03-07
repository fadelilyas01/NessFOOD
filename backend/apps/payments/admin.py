"""
Admin configuration for Payments app.
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import Payment, WebhookEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Payment admin with Stripe dashboard link.
    """
    list_display = [
        'id', 'order_link', 'amount_display', 'status_badge', 
        'payment_method_display', 'completed_at'
    ]
    list_filter = ['status', 'currency', 'payment_method_type', 'created_at']
    search_fields = [
        'stripe_payment_intent_id', 'order__order_number', 
        'customer_email', 'user__email'
    ]
    readonly_fields = [
        'stripe_payment_intent_id', 'stripe_checkout_session_id',
        'stripe_charge_id', 'stripe_dashboard_link',
        'created_at', 'updated_at', 'completed_at'
    ]
    
    fieldsets = (
        ('Commande', {
            'fields': ('order', 'user', 'customer_email')
        }),
        ('Paiement', {
            'fields': ('amount', 'currency', 'status', 'refunded_amount')
        }),
        ('Stripe', {
            'fields': (
                'stripe_payment_intent_id', 'stripe_checkout_session_id',
                'stripe_charge_id', 'stripe_dashboard_link'
            )
        }),
        ('Carte', {
            'fields': ('payment_method_type', 'card_brand', 'last_four'),
            'classes': ('collapse',)
        }),
        ('Erreurs', {
            'fields': ('error_message', 'error_code'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'completed_at', 'updated_at')
        }),
    )
    
    def order_link(self, obj):
        if obj.order:
            return format_html(
                '<a href="/admin/orders/order/{}/change/">{}</a>',
                obj.order.id,
                obj.order.order_number
            )
        return '-'
    order_link.short_description = 'Commande'
    
    def amount_display(self, obj):
        return f"{obj.amount:.2f} {obj.currency.upper()}"
    amount_display.short_description = 'Montant'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'succeeded': '#28A745',
            'failed': '#DC3545',
            'refunded': '#6C757D',
            'partially_refunded': '#17A2B8',
        }
        color = colors.get(obj.status, '#6C757D')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 4px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Statut'
    
    def payment_method_display(self, obj):
        if obj.card_brand and obj.last_four:
            return f"{obj.card_brand.capitalize()} •••• {obj.last_four}"
        return obj.payment_method_type or '-'
    payment_method_display.short_description = 'Moyen de paiement'
    
    def stripe_dashboard_link(self, obj):
        if obj.stripe_payment_intent_id:
            return format_html(
                '<a href="{}" target="_blank" style="color: #635BFF;">'
                '🔗 Voir sur Stripe Dashboard</a>',
                obj.stripe_dashboard_url
            )
        return '-'
    stripe_dashboard_link.short_description = 'Lien Stripe'


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    """
    Webhook event admin for debugging.
    """
    list_display = [
        'stripe_event_id_short', 'event_type', 'status_badge',
        'processing_attempts', 'received_at', 'processed_at'
    ]
    list_filter = ['status', 'event_type', 'received_at']
    search_fields = ['stripe_event_id', 'event_type']
    readonly_fields = [
        'stripe_event_id', 'event_type', 'payload',
        'received_at', 'processed_at'
    ]
    
    def stripe_event_id_short(self, obj):
        return f"{obj.stripe_event_id[:25]}..."
    stripe_event_id_short.short_description = 'Event ID'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'processed': '#28A745',
            'failed': '#DC3545',
            'ignored': '#6C757D',
        }
        color = colors.get(obj.status, '#6C757D')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 4px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Statut'
