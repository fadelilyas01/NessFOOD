import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nessfood.settings')
django.setup()

from apps.products.models import Product, ProductImage

# Collection of food images (stews, rice, meat, etc.) representing African cuisine
unsplash_urls = [
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1000",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000"
]

products = Product.objects.all()
print(f"Assigning images to {products.count()} products...")

for i, product in enumerate(products):
    url = unsplash_urls[i % len(unsplash_urls)]
    print(f"Processing {product.name}...")
    
    # Remove existing images to start fresh (optional, but good for testing)
    product.images.all().delete()
        
    response = requests.get(url)
    if response.status_code == 200:
        filename = f"{product.slug}.jpg"
        ProductImage.objects.create(
            product=product,
            is_primary=True,
            image=ContentFile(response.content, name=filename)
        )
        print(f"Added primary image to {product.name}")
    else:
        print(f"Failed to download image: HTTP {response.status_code}")

print("Done!")
