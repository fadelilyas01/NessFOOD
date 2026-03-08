"""
Admin configuration for Products app.
"""

from django.contrib import admin
from .models import Category, Product, ProductImage, Tag


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


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Product admin.
    """
    list_display = ['name', 'price', 'stock', 'category', 'is_active', 'is_featured', 'is_hero_slider']
    list_filter = ['category', 'is_active', 'is_featured', 'is_hero_slider', 'created_at']
    search_fields = ['name', 'description', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['tags', 'related_products']
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'slug', 'short_description', 'description', 'category')
        }),
        ('Prix et stock', {
            'fields': ('price', 'original_price', 'weight', 'stock')
        }),
        ('Tags et suggéstions', {
            'fields': ('tags', 'related_products')
        }),
        ('Contenu additionnel', {
            'fields': ('instructions', 'nutrition_info')
        }),
        ('Statut et visibilité', {
            'fields': ('is_active', 'is_featured', 'is_hero_slider')
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """
    Product Image admin.
    """
    list_display = ['product', 'is_primary', 'order']
    list_filter = ['is_primary', 'product']
