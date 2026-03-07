"""
Views for Orders app.
"""

from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import (
    OrderListSerializer,
    OrderDetailSerializer,
    CreateOrderSerializer,
    UpdateOrderStatusSerializer,
)
from apps.cart.models import Cart


class OrderListView(generics.ListAPIView):
    """
    List user's orders.
    """
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """
    Retrieve order details.
    """
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_number'
    
    def get_queryset(self):
        # Regular users can only see their own orders
        user = self.request.user
        if user.is_admin or user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)


class CreateOrderView(APIView):
    """
    Create a new order from the user's cart.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({
                'error': 'Votre panier est vide.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not cart.items.exists():
            return Response({
                'error': 'Votre panier est vide.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            subtotal=cart.total,
            shipping_cost=cart.shipping_cost,
            total=cart.grand_total,
            **serializer.validated_data
        )
        
        # Create order items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_price=cart_item.product.price,
                product_weight=cart_item.product.weight,
                quantity=cart_item.quantity
            )
            
            # decrease stock only if stock management is stricly enforced at order creation time
            # For now, we just snapshot the product info without decreasing stock immediately 
            # as stock should be decreased on payment success or pending reserved
            # cart_item.product.stock -= cart_item.quantity 
            # cart_item.product.save()
        
        # Clear cart (will be cleared after successful payment)
        # cart.clear()
        
        return Response({
            'message': 'Commande créée avec succès.',
            'order': OrderDetailSerializer(order).data
        }, status=status.HTTP_201_CREATED)


class AdminOrderListView(generics.ListAPIView):
    """
    List all orders (admin only).
    """
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Order.objects.all()
    filterset_fields = ['status']


class AdminUpdateOrderView(APIView):
    """
    Update order status (admin only).
    """
    permission_classes = [permissions.IsAdminUser]
    
    def patch(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({
                'error': 'Commande non trouvée.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order.status = serializer.validated_data['status']
        if 'admin_notes' in serializer.validated_data:
            order.admin_notes = serializer.validated_data['admin_notes']
        order.save()
        
        return Response({
            'message': 'Statut de la commande mis à jour.',
            'order': OrderDetailSerializer(order).data
        })
