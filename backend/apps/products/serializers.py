"""
Serializers for Products app.
"""

from rest_framework import serializers
from django.db.models import Avg
from .models import Category, Product, ProductImage, Tag, Review


class CategorySerializer(serializers.ModelSerializer):
    """
    Category serializer.
    """
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """
    Product image serializer.
    """
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'color']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Serializer for product list (minimal data).
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    in_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'price', 
            'original_price', 'weight', 'category_name', 'tags',
            'primary_image', 'in_stock', 'is_featured', 'is_hero_slider', 
            'average_rating', 'discount_percentage'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(reviews.aggregate(Avg('rating'))['rating__avg'], 1)
        return 0


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for product detail (full data).
    """
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    related_products = ProductListSerializer(many=True, read_only=True)
    in_stock = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'price', 'original_price', 'weight', 'stock', 'category',
            'tags', 'instructions', 'nutrition_info', 'images',
            'reviews', 'average_rating', 'related_products',
            'in_stock', 'is_featured', 'is_hero_slider', 'discount_percentage',
            'created_at', 'updated_at'
        ]

    def get_reviews(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        return ReviewSerializer(reviews, many=True).data

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(reviews.aggregate(Avg('rating'))['rating__avg'], 1)
        return 0


class ProductAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for product admin (create/update).
    """
    class Meta:
        model = Product
        fields = '__all__'
