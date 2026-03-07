"""
Serializers for Orders app.
"""

from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order items.
    """
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'product_price', 'product_weight',
            'quantity', 'subtotal'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """
    Serializer for order list (minimal data).
    """
    items_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'total', 'items_count', 'created_at'
        ]
    
    def get_items_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for order detail (full data).
    """
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'shipping_name', 'shipping_email', 'shipping_phone',
            'shipping_address', 'shipping_city', 'shipping_postal_code',
            'shipping_country', 'subtotal', 'shipping_cost', 'total',
            'customer_notes', 'items', 'paid_at', 'created_at', 'updated_at'
        ]


class CreateOrderSerializer(serializers.Serializer):
    """
    Serializer for creating an order from cart.
    """
    shipping_name = serializers.CharField(max_length=100)
    shipping_email = serializers.EmailField()
    shipping_phone = serializers.CharField(max_length=20)
    shipping_address = serializers.CharField(max_length=255)
    shipping_city = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100, default='France')
    customer_notes = serializers.CharField(required=False, allow_blank=True)


class UpdateOrderStatusSerializer(serializers.Serializer):
    """
    Serializer for updating order status (admin).
    """
    status = serializers.ChoiceField(choices=Order.Status.choices)
    admin_notes = serializers.CharField(required=False, allow_blank=True)
