"""
Admin configuration for Products app.
"""

from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    """
    Inline for product images.
    """
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Category admin.
    """
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Product admin.
    """
    list_display = ['name', 'price', 'stock', 'category', 'is_active', 'is_featured']
    list_filter = ['category', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'slug', 'short_description', 'description', 'category')
        }),
        ('Prix et stock', {
            'fields': ('price', 'original_price', 'weight', 'stock')
        }),
        ('Badges et informations', {
            'fields': ('badges', 'instructions', 'nutrition_info')
        }),
        ('Statut', {
            'fields': ('is_active', 'is_featured')
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """
    Product Image admin.
    """
    list_display = ['product', 'is_primary', 'order']
    list_filter = ['is_primary', 'product']
