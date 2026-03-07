"""
URL routes for Orders app.
"""

from django.urls import path
from .views import (
    OrderListView,
    OrderDetailView,
    CreateOrderView,
    AdminOrderListView,
    AdminUpdateOrderView,
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order_list'),
    path('create/', CreateOrderView.as_view(), name='create_order'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order_detail'),
    
    # Admin routes
    path('admin/list/', AdminOrderListView.as_view(), name='admin_order_list'),
    path('admin/<str:order_number>/', AdminUpdateOrderView.as_view(), name='admin_update_order'),
]
