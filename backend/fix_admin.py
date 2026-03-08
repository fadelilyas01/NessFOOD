import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nessfood.settings')
django.setup()

from apps.users.models import User

email = "admin@nessfood.com"
password = "Admin123!"

user = User.objects.filter(email=email).first()

if user:
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"Mot de passe pour {email} réinitialisé avec succès !")
else:
    User.objects.create_superuser(
        email=email,
        password=password,
        first_name="Admin",
        last_name="NessFood"
    )
    print(f"Superutilisateur {email} créé avec succès !")
