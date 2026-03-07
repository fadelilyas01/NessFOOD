# Ness Food - E-commerce Platform

Bienvenue sur le dépôt de **Ness Food**, une plateforme e-commerce moderne spécialisée dans la vente de plats ivoiriens (Plakalidrom). Ce document est conçu pour aider les développeurs à comprendre l'architecture, à configurer l'environnement local et à contribuer au projet.

---

## 🏗️ Architecture du Projet

Le projet suit une architecture **Fullstack découplée** :

- **Frontend** : Application mono-page (SPA) développée avec React (Vite).
- **Backend** : API RESTful propulsée par Django & Django REST Framework (DRF).
- **Cache** : Redis pour l'optimisation des requêtes API et des tâches de fond.
- **Base de Données** : SQLite (Dev) / PostgreSQL (Prod).

---

## 💻 Stack Technique Détaillée

### Frontend (`/frontend`)

- **Core** : React 18, React Router v6
- **Build Tool** : Vite
- **Data Fetching & State** :
  - `@tanstack/react-query` pour le cache et la synchronisation avec l'API
  - `axios` (via une instance custom `apiClient.js` avec intercepteurs JWT)
  - `Context API` (Auth, Cart, Products) pour l'état global natif
- **Styling & UI** :
  - CSS Vanilla (Design System et variables CSS dans `index.css`)
  - `framer-motion` (Animations)
  - `react-hot-toast` (Notifications)

### Backend (`/backend`)

- **Core** : Django 5.0, Python 3.10+
- **API** : Django REST Framework (DRF)
- **Authentification** : `djangorestframework-simplejwt` (Tokens JWT avec rotation)
- **Outils** :
  - `django-filter` (Filtrage avancé des querysets)
  - `django-cors-headers` (Gestion CORS)
  - `Pillow` (Traitement d'images et génération WebP)
  - `redis` (Système de cache backend)
- **Admin** : `django-jazzmin` pour un tableau de bord administrateur moderne.

---

## 📂 Structure du Répertoire

```text
E-COMMERCE/
├── backend/
│   ├── apps/                    # Modules Django indépendants
│   │   ├── cart/                # Logique du panier utilisateur
│   │   ├── core/                # Modèles et utilitaires communs (ex: TimeStampedModel)
│   │   ├── newsletter/          # Inscription newsletter
│   │   ├── orders/              # Commandes et historique des statuts
│   │   ├── payments/            # Intégration Stripe
│   │   ├── products/            # Catalogue, tags, avis, conversion WebP
│   │   └── users/               # Modèle Custom User, authentification
│   ├── nessfood/                # Configuration globale (settings.py, urls.py)
│   ├── requirements.txt         # Dépendances Python
│   └── manage.py                # CLI Django
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Composants UI (Header, Footer, ProductCard, etc.)
│   │   ├── context/             # React Contexts (AuthContext, CartContext)
│   │   ├── hooks/               # Custom Hooks (ex: useProductsQuery)
│   │   ├── pages/               # Vues principales de routage
│   │   └── services/            # Pont API (fichiers isolés par domaine via apiClient Axios)
│   └── package.json             # Dépendances Node.js
│
└── docker-compose.yml           # Configuration Docker (Optionnelle pour dev local)
```

---

## 🚀 Guide de Démarrage (Développement Local)

Pour modifier le code et voir les résultats en direct, nous recommandons de lancer le backend et le frontend séparément sans Docker.

### 1. Configuration du Backend

Assurez-vous d'avoir Python 3.10+ et un serveur Redis local (ou Dockerisé) tournant sur le port 6379.

```bash
# Se rendre dans le dossier backend
cd backend

# Créer et activer un environnement virtuel
python -m venv venv
source venv/Scripts/activate  # Sous Windows : venv\Scripts\activate
# Sous Mac/Linux : source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données SQLite et appliquer les migrations
python manage.py migrate

# (Optionnel) Créer un superutilisateur pour accéder à l'admin
python manage.py createsuperuser

# Démarrer le serveur API (tourne sur http://127.0.0.1:8000)
python manage.py runserver
```

> **Note sur les Tâches Cron** :
Le backend dispose de scripts de maintenance (`delete_unpaid_orders`, `abandoned_carts_reminder`) situés dans les dossiers `management/commands` de leurs apps respectives. En local, exécutez-les manuellement via `python manage.py <nom_commande>`.

### 2. Configuration du Frontend

Assurez-vous d'avoir Node.js (v18+) installé.

```bash
# Dans un nouveau terminal, se rendre dans le dossier frontend
cd frontend

# Installer les packages NPM
npm install

# Démarrer le serveur de développement Vite
npm run dev
```

L'application front sera disponible sur `http://localhost:5173`. L'API (`http://localhost:8000/api/v1`) est déjà configurée par défaut dans `frontend/src/services/apiClient.js`.

---

## 🔌 Fonctionnement de l'Authentification et des API

1. **Client API (`apiClient.js`)** : Toutes les requêtes sortantes vers Django utilisent l'instance `axios` configurée dans `apiClient.js`.
2. **Intercepteurs JWT** : Le header `Authorization: Bearer <token>` est automatiquement injecté par Axios. Si l'API retourne une erreur `401 Unauthorized` liée à un token expiré, l'intercepteur tente de rafraîchir le token (`/auth/refresh/`) automatiquement avant de réessayer la requête.
3. **React Query** : Est utilisé massivement pour récupérer, cacher et invalider les données provenant de l'API (cf. `frontend/src/hooks/`).

---

## 🤝 Bonnes pratiques de contribution

- **Backend** : Suivez les standards PEP-8 (vous pouvez utiliser `black` et `isort`). Pensez à faire un `python manage.py makemigrations` chaque fois que vous modifiez le dictionnaire d'un modèle (fichier `models.py`).
- **Frontend** :
  - Privilégiez l'utilisation de React Query pour tout nouvel appel `GET`.
  - Isoler la logique de fetch dans les fichiers `services/*.service.js`.
  - Maintenir les imports propres et gérés.

Merci de participer à l'amélioration de Ness Food ! 🍲
