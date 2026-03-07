import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nessfood.settings')
django.setup()

from apps.orders.models import Coupon
from django.utils import timezone
from datetime import timedelta

# Create default coupon if not exists
coupon_code = "NESSFOOD20"
if not Coupon.objects.filter(code=coupon_code).exists():
    Coupon.objects.create(
        code=coupon_code,
        discount_value=20,
        is_percentage=True,
        valid_from=timezone.now(),
        valid_to=timezone.now() + timedelta(days=30),
        is_active=True
    )
    print(f"Coupon {coupon_code} créé avec succès !")
else:
    print(f"Coupon {coupon_code} existe déjà.")
