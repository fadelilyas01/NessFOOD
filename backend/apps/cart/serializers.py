"""
Serializers for Cart app.
"""

from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for cart items.
    """
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_weight = serializers.CharField(source='product.weight', read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.ReadOnlyField()
    in_stock = serializers.BooleanField(source='product.in_stock', read_only=True)
    available_stock = serializers.IntegerField(source='product.stock', read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product_id', 'product_name', 'product_price',
            'product_weight', 'product_image', 'quantity', 'subtotal',
            'in_stock', 'available_stock'
        ]
    
    def get_product_image(self, obj):
        primary = obj.product.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.product.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None


class CartSerializer(serializers.ModelSerializer):
    """
    Full cart serializer with items and totals.
    """
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    shipping_cost = serializers.ReadOnlyField()
    grand_total = serializers.ReadOnlyField()
    free_shipping_threshold = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'total', 'total_items',
            'shipping_cost', 'grand_total', 'free_shipping_threshold',
            'updated_at'
        ]
    
    def get_free_shipping_threshold(self, obj):
        from django.conf import settings
        return settings.SHIPPING_CONFIG['FREE_SHIPPING_THRESHOLD']


class AddToCartSerializer(serializers.Serializer):
    """
    Serializer for adding item to cart.
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(pk=value, is_active=True)
            if not product.in_stock:
                raise serializers.ValidationError('Ce produit est en rupture de stock.')
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError('Produit non trouvé.')


class UpdateCartItemSerializer(serializers.Serializer):
    """
    Serializer for updating cart item quantity.
    """
    quantity = serializers.IntegerField(min_value=0)
