
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nessfood.settings")
django.setup()

User = get_user_model()
emails = User.objects.values_list('email', flat=True)

print("Liste des emails dans la base de données :")
for email in emails:
    print(f"- {email}")
