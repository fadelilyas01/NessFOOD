import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nessfood.settings')
django.setup()

from apps.orders.models import Coupon
from apps.products.models import Product
from apps.users.models import User

print("--- BONS DE RÉDUCTION (COUPONS) ---")
for c in Coupon.objects.all():
    print(f"Code: {c.code} | Remise: {c.discount_value}{'%' if c.is_percentage else '$CAD'} | Actif: {c.active}")

print("\n--- PRODUITS ---")
for p in Product.objects.all()[:10]:
    print(f"Nom: {p.name} | Prix: {p.price} $CAD")

print("\n--- ADMINISTRATEURS ---")
for a in User.objects.filter(is_superuser=True):
    print(f"Email: {a.email}")
