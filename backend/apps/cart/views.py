"""
Views for Cart app.
"""

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
)
from apps.products.models import Product


class CartView(APIView):
    """
    View and manage the user's cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get the current user's cart."""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
    def delete(self, request):
        """Clear the cart."""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.clear()
        return Response({'message': 'Panier vidé.'})


class AddToCartView(APIView):
    """
    Add a product to the cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product = Product.objects.get(pk=serializer.validated_data['product_id'])
        quantity = serializer.validated_data['quantity']
        
        # Check stock
        if quantity > product.stock:
            return Response({
                'error': f'Stock insuffisant. Disponible: {product.stock}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add or update cart item
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response({
                    'error': f'Stock insuffisant. Maximum: {product.stock}'
                }, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_quantity
            cart_item.save()
        
        return Response({
            'message': 'Produit ajouté au panier.',
            'cart': CartSerializer(cart, context={'request': request}).data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    """
    Update cart item quantity or remove it.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, item_id):
        """Update item quantity."""
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            cart_item = CartItem.objects.get(
                pk=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Article non trouvé.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        quantity = serializer.validated_data['quantity']
        
        # If quantity is 0, delete the item
        if quantity == 0:
            cart_item.delete()
            return Response({'message': 'Article supprimé du panier.'})
        
        # Check stock
        if quantity > cart_item.product.stock:
            return Response({
                'error': f'Stock insuffisant. Maximum: {cart_item.product.stock}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item.quantity = quantity
        cart_item.save()
        
        cart = cart_item.cart
        return Response({
            'message': 'Quantité mise à jour.',
            'cart': CartSerializer(cart, context={'request': request}).data
        })
    
    def delete(self, request, item_id):
        """Remove item from cart."""
        try:
            cart_item = CartItem.objects.get(
                pk=item_id,
                cart__user=request.user
            )
            cart = cart_item.cart
            cart_item.delete()
            
            return Response({
                'message': 'Article supprimé du panier.',
                'cart': CartSerializer(cart, context={'request': request}).data
            })
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Article non trouvé.'
            }, status=status.HTTP_404_NOT_FOUND)
