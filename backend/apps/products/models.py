"""
Product and Category models for Ness Food E-commerce.
"""

from django.db import models
from django.utils.text import slugify
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.files.base import ContentFile
from apps.core.models import TimeStampedModel
from io import BytesIO
from PIL import Image


class Category(TimeStampedModel):
    """
    Product category.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(TimeStampedModel):
    """
    Tags/Badges for products.
    """
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    color = models.CharField(
        max_length=20, 
        default='#var(--color-primary)', 
        help_text='Code couleur CSS ou Hex'
    )

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(TimeStampedModel):
    """
    Product model for Plakalidrom and other products.
    """
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True, blank=True,
        help_text='Prix barré (promotion)'
    )
    weight = models.CharField(max_length=50, default='500g')
    stock = models.PositiveIntegerField(default=0)
    
    # Categorization
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='products'
    )
    tags = models.ManyToManyField(
        Tag,
        related_name='products',
        blank=True
    )
    related_products = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        help_text='Produits suggérés (cross-selling)'
    )
    
    # Additional info
    instructions = models.TextField(
        blank=True,
        help_text='Instructions de réchauffage'
    )
    nutrition_info = models.JSONField(
        null=True, blank=True,
        help_text='Valeurs nutritionnelles'
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_hero_slider = models.BooleanField(
        default=False, 
        help_text='Afficher dans le slider principal de l\'accueil'
    )
    
    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-is_featured', '-created_at']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def in_stock(self):
        return self.stock > 0
    
    @property
    def discount_percentage(self):
        if self.original_price and self.original_price > self.price:
            return int((1 - self.price / self.original_price) * 100)
        return 0


class ProductImage(models.Model):
    """
    Multiple images for a product.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = 'Image produit'
        verbose_name_plural = 'Images produits'
        ordering = ['order', '-is_primary']
    
    def __str__(self):
        return f"Image for {self.product.name}"
    
    def save(self, *args, **kwargs):
        # Optimization: Generate WebP format
        if self.image and not self.image.name.lower().endswith('.webp'):
            img = Image.open(self.image)
            img = img.convert('RGB') # WebP doesn't support RGBA in some cases without setup, but RGB is safer for photos
            output = BytesIO()
            img.save(output, format='WEBP', quality=85)
            output.seek(0)
            
            filename = f"{self.image.name.rsplit('.', 1)[0]}.webp"
            filename = filename.replace('products/', '') # prevent duplicate folders
            self.image = ContentFile(output.read(), name=filename)
            
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product, is_primary=True
            ).update(is_primary=False)
        super().save(*args, **kwargs)


class Review(TimeStampedModel):
    """
    Customer review and rating for a product.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Note de 1 à 5'
    )
    comment = models.TextField(blank=True)
    is_approved = models.BooleanField(
        default=True,
        help_text='Indique si l\'avis est visible sur le site'
    )

    class Meta:
        verbose_name = 'Avis'
        verbose_name_plural = 'Avis'
        ordering = ['-created_at']
        unique_together = [['product', 'user']]

    def __str__(self):
        return f"Avis de {self.user.email} sur {self.product.name} ({self.rating}/5)"
