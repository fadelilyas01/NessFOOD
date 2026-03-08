"""
URL routes for user profile.
"""

from django.urls import path

from .views import (
    UserProfileView,
    ChangePasswordView,
    ShippingAddressListCreateView,
    ShippingAddressDetailView,
    RedeemLoyaltyView,
)

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('addresses/', ShippingAddressListCreateView.as_view(), name='address_list'),
    path('addresses/<int:pk>/', ShippingAddressDetailView.as_view(), name='address_detail'),
    path('loyalty/redeem/', RedeemLoyaltyView.as_view(), name='redeem_loyalty'),
]
