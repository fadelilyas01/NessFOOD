
import os
import django
from django.core.files.base import ContentFile

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nessfood.settings")
django.setup()

from apps.products.models import Product, Category

def create_products():
    # Ensure category exists
    category, _ = Category.objects.get_or_create(
        name="Plats Traditionnels",
        defaults={'description': 'Saveurs authentiques'}
    )

    products_data = [
        {
            "name": "Attiéké Poisson Braisé",
            "description": "L'Attiéké est un couscous de manioc, spécialité culinaire de la Côte d'Ivoire. Servi avec du poisson braisé et des légumes frais.",
            "short_description": "Couscous de manioc avec poisson braisé",
            "price": 15.00,
            "weight": "600g",
            "is_featured": True,
            "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop" # Generic food image placeholder
        },
        {
            "name": "Kabato Sauce Gombo",
            "description": "Le Kabato est une pâte de maïs, servie ici avec une délicieuse sauce gombo riche et savoureuse.",
            "short_description": "Pâte de maïs avec sauce gombo",
            "price": 12.50,
            "weight": "550g",
            "is_featured": True,
            "image_url": "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop" # Generic food image placeholder
        }
    ]

    for p_data in products_data:
        product, created = Product.objects.get_or_create(
            name=p_data["name"],
            defaults={
                "description": p_data["description"],
                "short_description": p_data["short_description"],
                "price": p_data["price"],
                "weight": p_data["weight"],
                "category": category,
                "stock": 50,
                "is_featured": p_data["is_featured"],
                "badges": ["Fait Maison", "Authentique"]
            }
        )
        if created:
            print(f"Produit créé: {product.name}")
        else:
            print(f"Produit existant: {product.name}")
            product.is_featured = True
            product.save()

if __name__ == "__main__":
    create_products()
