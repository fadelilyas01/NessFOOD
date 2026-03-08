# Plateforme E-commerce Ness Food

Ness Food est une plateforme e-commerce moderne et full-stack dédiée aux produits culinaires. Ce dépôt contient le code source de l'interface utilisateur (storefront) ainsi que du back-office administratif.

La plateforme est conçue avec une architecture découplée, garantissant évolutivité, maintenabilité et une expérience utilisateur fluide.

## Architecture du Système

Le projet adopte une architecture client-serveur découplée :

* **Frontend (Client)** : Une application monopage (SPA) développée avec React et Vite. Elle utilise React Query pour une récupération des données et une gestion d'état efficaces, ainsi qu'Axios pour la communication avec l'API.
* **Backend (API)** : Une API RESTful propulsée par Django et Django REST Framework (DRF). Elle gère la logique métier, la gestion de la base de données et l'authentification.
* **Mise en Cache & Tâches de Fond** : Redis est utilisé pour le cache côté backend afin d'optimiser les temps de réponse de l'API.
* **Base de Données** : SQLite est utilisé pour le développement local, avec PostgreSQL ciblé pour les environnements de production.

## Pile Technologique

### Frontend

* **Cœur** : React 18, React Router v6
* **Outil de Build** : Vite
* **Client API & État** : `axios`, `@tanstack/react-query`, API Context React
* **Style** : CSS Vanilla avec un Design System défini (Variables CSS)
* **Éléments d'Interface** : `framer-motion` (animations), `react-hot-toast` (notifications)

### Backend

* **Cœur** : Python 3.10+, Django 5.0
* **API** : Django REST Framework (DRF)
* **Authentification** : `djangorestframework-simplejwt` (JWT avec rotation des tokens de rafraîchissement)
* **Outils & Bibliothèques** :
  * `django-filter` (Filtrage avancé des requêtes)
  * `django-cors-headers` (Gestion CORS)
  * `Pillow` (Traitement d'images et génération WebP)
  * `redis` & `django-redis` (Couche de mise en cache)
* **Administration** : `django-jazzmin` (Interface d'administration améliorée)

## Structure du Dépôt

```text
E-COMMERCE/
├── backend/                    # Application API Django
│   ├── apps/                   # Applications Django indépendantes
│   │   ├── cart/               # Logique du panier d'achat 
│   │   ├── core/               # Modèles et utilitaires partagés
│   │   ├── newsletter/         # Gestion des inscriptions à la newsletter
│   │   ├── orders/             # Traitement des commandes et historique des statuts
│   │   ├── payments/           # Intégration de la passerelle de paiement (Stripe)
│   │   ├── products/           # Catalogue, catégories, tags et avis
│   │   └── users/              # Modèles utilisateurs personnalisés et authentification
│   ├── nessfood/               # Configuration principale Django (settings, wsgi, asgi)
│   ├── requirements.txt        # Dépendances des paquets Python
│   └── manage.py               # Utilitaire en ligne de commande Django
│
├── frontend/                   # Application Web React
│   ├── src/
│   │   ├── components/         # Composants d'interface réutilisables
│   │   ├── context/            # Fournisseurs de Context React (Auth, Cart, Products)
│   │   ├── hooks/              # Hooks React personnalisés (ex: hooks React Query)
│   │   ├── pages/              # Vues de routage de l'application
│   │   └── services/           # Couche d'intégration API (Instances et appels Axios)
│   └── package.json            # Dépendances Node.js et scripts
│
├── docker-compose.yml          # Configuration d'orchestration Docker (Optionnel)
└── README.md                   # Documentation du projet
```

## Démarrage (Développement Local)

Les instructions suivantes vous aideront à configurer le projet sur votre machine locale pour le développement et les tests.

### 1. Configuration du Backend

Assurez-vous d'avoir **Python 3.10+** et une instance de **Redis** en cours d'exécution (port par défaut 6379) sur votre système.

```bash
# Naviguer vers le répertoire backend
cd backend

# Initialiser et activer un environnement virtuel Python
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Installer les paquets Python requis
pip install -r requirements.txt

# Appliquer les migrations de la base de données
python manage.py migrate

# (Optionnel) Créer un compte utilisateur administrateur
python manage.py createsuperuser

# Démarrer le serveur de développement Django (tourne sur http://127.0.0.1:8000)
python manage.py runserver
```

> **Note sur les Tâches de Fond** : Le backend inclut des scripts de maintenance (`delete_unpaid_orders`, `abandoned_carts_reminder`). Dans un environnement local sans planificateur de tâches comme Celery ou Cron, ceux-ci peuvent être exécutés manuellement via `python manage.py <nom_de_la_commande>`.

### 2. Configuration du Frontend

Assurez-vous d'avoir **Node.js (v18+)** installé.

```bash
# Naviguer vers le répertoire frontend
cd frontend

# Installer les modules Node
npm install

# Démarrer le serveur de développement Vite
npm run dev
```

L'application frontend sera servie sur `http://localhost:5173`. Les points de terminaison de l'API sont préconfigurés pour cibler `http://localhost:8000/api/v1` dans `frontend/src/services/apiClient.js`.

## Comptes de Test (Défaut)

Pour faciliter vos tests et l'exploration de la plateforme en environnement local, les profils de test suivants sont pré-générés ou peuvent être créés simplement :

### 👑 Administrateur (Gestion Backoffice)

* **Email** : `admin@nessfood.com`
* **Mot de passe** : `Admin123!`
* **Accès** : `http://localhost:8000/admin` (Gestion des produits, codes promo, commandes)

### 👤 Client (Boutique Frontend)

* **Email** : `client@nessfood.com`
* **Mot de passe** : `Client123!`
* **Accès** : `http://localhost:5173/` (Commandes, paiement Stripe, wishlist)

## Intégration API & Authentification

1. **Client API** : Toutes les requêtes HTTP sortantes vers le backend Django sont acheminées via une instance Axios configurée (`apiClient.js`).
2. **Intercepteurs JWT** : Les en-têtes `Authorization: Bearer <token>` sont injectés automatiquement. Lors de la réception d'une réponse `401 Unauthorized` due à l'expiration du token, l'intercepteur Axios tente de rafraîchir le token de session de manière transparente (`/auth/refresh/`) avant de relancer la requête originale.
3. **Synchronisation d'État** : `React Query` agit comme couche principale de récupération et de mise en cache des données pour assurer la synchronisation de l'interface utilisateur avec l'état du backend.

## Directives de Contribution

* **Backend** : Respecter les normes de codage PEP-8 (`black` et `isort` sont recommandés). S'assurer que les migrations de base de données sont générées et validées chaque fois que les définitions `models.py` sont modifiées.
* **Frontend** :
  * Utiliser React Query pour les requêtes `GET` avec état inter-composants.
  * Isoler les opérations de fetch dans les fichiers de service spécifiques au domaine (`services/*.service.js`).
  * Maintenir une stricte séparation des préoccupations dans les composants.
