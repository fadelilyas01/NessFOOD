
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nessfood.settings")
django.setup()

User = get_user_model()

if not User.objects.filter(email="admin@nessfood.com").exists():
    User.objects.create_superuser("admin", "admin@nessfood.com", "admin")
    print("Superuser created: admin@nessfood.com / admin")
else:
    print("Superuser already exists")
