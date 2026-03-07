"""
URL routes for Cart app.
"""

from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('add/', AddToCartView.as_view(), name='add_to_cart'),
    path('items/<int:item_id>/', UpdateCartItemView.as_view(), name='update_cart_item'),
]
