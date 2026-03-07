"""
Admin configuration for Cart app.
"""

from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['get_subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal
    get_subtotal.short_description = "Sous-total"


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_total_items', 'get_total', 'updated_at']
    search_fields = ['user__email']
    inlines = [CartItemInline]

    def get_total_items(self, obj):
        return obj.total_items
    get_total_items.short_description = "Nb Articles"

    def get_total(self, obj):
        return f"{obj.total} €"
    get_total.short_description = "Total"


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'subtotal']
    list_filter = ['added_at']
