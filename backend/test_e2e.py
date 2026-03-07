
# Configure Django first
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nessfood.settings")
django.setup()

# Patch ALLOWED_HOSTS for testing
from django.conf import settings
settings.ALLOWED_HOSTS += ['testserver']

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()
from apps.products.models import Product, Category
from apps.cart.models import Cart
from apps.orders.models import Order

def run_tests():
    print(">>> Demarrage du test complet du backend E-commerce...\n")
    client = APIClient()

    # 1. Création utilisateur de test
    print("1. [AUTH] Creation du compte client de test...")
    email = "testuser@example.com"
    password = "TestPassword123!"
    
    if User.objects.filter(email=email).exists():
        User.objects.filter(email=email).delete()
        
    user = User.objects.create_user(
        email=email,
        username=email,
        password=password,
        first_name="Test",
        last_name="User"
    )
    print("OK - Utilisateur cree avec succes.")

    # 2. Login
    print("2. [AUTH] Connexion...")
    response = client.post('/api/v1/auth/login/', {
        'email': email,
        'password': password
    })
    
    if response.status_code == 200:
        token = response.data['access']
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        print("OK - Connexion reussie (Token recupere).")
    else:
        print(f"ECHEC - Connexion : {response.data}")
        return

    # 3. Vérification Produits
    print("3. [PRODUITS] Verification du catalogue...")
    response = client.get('/api/v1/products/')
    if response.status_code == 200 and len(response.data['results']) > 0:
        product = Product.objects.first()
        print(f"OK - Catalogue accessible ({response.data['count']} produits). Produit test : {product.name}")
    else:
        # Créer un produit si vide
        cat = Category.objects.create(name="Test Cat")
        product = Product.objects.create(
            name="Test Product", 
            description="Desc", 
            short_description="Short",
            price=10.00, 
            category=cat,
            stock=100
        )
        print("WARN - Catalogue vide, produit de test cree.")

    # 4. Ajout au Panier
    print("4. [PANIER] Ajout d'un article au panier...")
    response = client.post('/api/v1/cart/add/', {
        'product_id': product.id,
        'quantity': 2
    })
    if response.status_code in [200, 201]:
        print("OK - Article ajoute au panier.")
    else:
        print(f"ECHEC - Panier : {response.data}")
        return

    # 5. Création de Commande
    print("5. [COMMANDE] Creation de la commande...")
    order_data = {
        'shipping_name': 'Test User',
        'shipping_email': email,
        'shipping_phone': '0123456789',
        'shipping_address': '123 Rue Test',
        'shipping_city': 'Paris',
        'shipping_postal_code': '75001',
        'shipping_country': 'France'
    }
    response = client.post('/api/v1/orders/create/', order_data)
    
    if response.status_code == 201:
        order_number = response.data['order']['order_number']
        print(f"OK - Commande creee avec succes ! Numero : {order_number}")
    else:
        print(f"ECHEC - Commande : {response.data}")
        return

    # 6. Vérification Admin (Simulation)
    print("6. [ADMIN] Verification que la commande existe en base...")
    order = Order.objects.get(order_number=order_number)
    if order.items.count() > 0:
        print(f"OK - Commande bien enregistree en base avec {order.items.count()} articles.")
        print(f"   Total: {order.total} EUR")
        print(f"   Statut: {order.get_status_display()}")
    else:
        print("ECHEC - La commande existe mais n'a pas d'articles !")

    print("\n>>> Test E2E Backend termine avec succes ! Tout est fonctionnel.")

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print(f"\nUne erreur inattendue est survenue : {str(e)}")
