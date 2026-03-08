"""
Views for user authentication and profile management.
"""

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    ShippingAddressSerializer,
)
from .models import ShippingAddress

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that returns JWT tokens with user info.
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(generics.CreateAPIView):
    """
    Register a new user account.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Inscription réussie !',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update user profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    Change user password.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({
            'message': 'Mot de passe modifié avec succès.'
        })


class LogoutView(APIView):
    """
    Logout user by blacklisting refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({
                'message': 'Déconnexion réussie.'
            })
        except Exception:
            return Response({
                'error': 'Token invalide.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ShippingAddressListCreateView(generics.ListCreateAPIView):
    """
    List and create shipping addresses for the authenticated user.
    """
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)


class ShippingAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a shipping address.
    """
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user)


from apps.orders.models import Coupon
from django.utils import timezone
from datetime import timedelta
import uuid

class RedeemLoyaltyView(APIView):
    """
    Convert loyalty points into a discount coupon.
    100 points = $10 discount.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'loyalty_profile'):
            return Response({'error': 'Profil de fidélité non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
            
        points_to_redeem = 100
        discount_value = 10.00
            
        profile = user.loyalty_profile
        if profile.points < points_to_redeem:
            return Response({'error': f'Solde insuffisant. Il vous faut {points_to_redeem} points.'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Deduct points
        profile.points -= points_to_redeem
        profile.save()
        
        # Generates a code like LOYALTY10-A1B2C3D4
        suffix = str(uuid.uuid4()).split('-')[0].upper()
        code = f"LOYALTY10-{suffix}"
        
        # Create Coupon
        coupon = Coupon.objects.create(
            code=code,
            valid_from=timezone.now(),
            valid_to=timezone.now() + timedelta(days=90),
            is_active=True,
            is_percentage=False,
            discount_value=discount_value,
            max_uses=1
        )
        
        return Response({
            'message': 'Points convertis avec succès !',
            'coupon_code': coupon.code,
            'discount': coupon.discount_value,
            'remaining_points': profile.points
        }, status=status.HTTP_201_CREATED)
