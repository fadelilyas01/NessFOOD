
from rest_framework import viewsets, filters, permissions, decorators, response
from django_filters.rest_framework import DjangoFilterBackend
from apps.core.pagination import StandardResultsSetPagination
from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductAdminSerializer,
)
from .permissions import IsAdminOrReadOnly


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List and retrieve categories.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    """
    Standardized ViewSet for Products.
    - Public: List/Retrieve active products
    - Admin: Full CRUD on all products
    """
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category__slug': ['exact'],
        'is_featured': ['exact'],
        'is_active': ['exact'],
        'price': ['gte', 'lte'],
        'tags__slug': ['exact', 'in'],
    }
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['price', 'name', 'created_at']
    ordering = ['-is_featured', '-created_at']
    # lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductAdminSerializer

    def get_queryset(self):
        """
        Admins see all products, Users see only active ones.
        """
        if self.request.user.is_staff:
            return Product.objects.all().select_related('category').prefetch_related('images')
        return super().get_queryset()

    @decorators.action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Custom action to get featured products.
        """
        featured = self.get_queryset().filter(is_featured=True)[:6]
        serializer = ProductListSerializer(featured, many=True, context={'request': request})
        return response.Response(serializer.data)
