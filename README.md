# Ness Food E-commerce Platform

Ness Food is a modern, full-stack e-commerce platform dedicated to culinary products. This repository contains the source code for both the user-facing storefront and the administrative backend.

The platform is designed with a decoupled architecture, ensuring scalability, maintainability, and a seamless user experience.

## System Architecture

The project adopts a decoupled client-server architecture:

* **Frontend (Client)**: A Single Page Application (SPA) built with React and Vite. It leverages React Query for efficient data fetching and state management, and Axios for API communication.
* **Backend (API)**: A RESTful API driven by Django and Django REST Framework (DRF). It handles business logic, database management, and authentication.
* **Caching & Background Tasks**: Redis is utilized for backend caching and optimizing API response times.
* **Database**: SQLite is provisioned for local development, with PostgreSQL targeted for production environments.

## Technology Stack

### Frontend

* **Core**: React 18, React Router v6
* **Build System**: Vite
* **API Client & State**: `axios`, `@tanstack/react-query`, React Context API
* **Styling**: Vanilla CSS with a defined Design System (CSS variables)
* **UI Assets**: `framer-motion` (animations), `react-hot-toast` (notifications)

### Backend

* **Core**: Python 3.10+, Django 5.0
* **API**: Django REST Framework (DRF)
* **Authentication**: `djangorestframework-simplejwt` (JWT with refresh token rotation)
* **Tools & Libraries**:
  * `django-filter` (Advanced query filtering)
  * `django-cors-headers` (CORS management)
  * `Pillow` (Image processing and WebP generation)
  * `redis` & `django-redis` (Caching layer)
* **Administration**: `django-jazzmin` (Enhanced admin interface)

## Repository Structure

```text
E-COMMERCE/
├── backend/                    # Django API Application
│   ├── apps/                   # Django independent applications
│   │   ├── cart/               # Shopping cart logic 
│   │   ├── core/               # Shared models and utilities
│   │   ├── newsletter/         # Newsletter subscription management
│   │   ├── orders/             # Order processing and status history
│   │   ├── payments/           # Payment gateway integration (Stripe)
│   │   ├── products/           # Product catalog, categories, tags, and reviews
│   │   └── users/              # Custom user models and authentication
│   ├── nessfood/               # Core Django configuration (settings, wsgi, asgi)
│   ├── requirements.txt        # Python package dependencies
│   └── manage.py               # Django command-line utility
│
├── frontend/                   # React Web Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context providers (Auth, Cart, Products)
│   │   ├── hooks/              # Custom React hooks (e.g., React Query hooks)
│   │   ├── pages/              # Application routing views
│   │   └── services/           # API integration layer (Axios instances and calls)
│   └── package.json            # Node.js dependencies and scripts
│
├── docker-compose.yml          # Docker orchestration configuration (Optional)
└── README.md                   # Project documentation
```

## Getting Started (Local Development)

The following instructions will help you set up the project on your local machine for development and testing purposes.

### 1. Backend Setup

Ensure you have **Python 3.10+** and a running instance of **Redis** (default port 6379) on your system.

```bash
# Navigate to the backend directory
cd backend

# Initialize and activate a Python virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install required Python packages
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# (Optional) Create an administrative user account
python manage.py createsuperuser

# Start the Django development server (runs on http://127.0.0.1:8000)
python manage.py runserver
```

> **Note on Background Tasks**: The backend includes maintenance scripts (`delete_unpaid_orders`, `abandoned_carts_reminder`). In a local environment without a task scheduler like Celery or Cron, these can be executed manually via `python manage.py <command_name>`.

### 2. Frontend Setup

Ensure you have **Node.js (v18+)** installed.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```

The frontend application will be served at `http://localhost:5173`. The API endpoints are pre-configured to target `http://localhost:8000/api/v1` in `frontend/src/services/apiClient.js`.

## API Integration & Authentication

1. **API Client**: All outbound HTTP requests to the Django backend are routed through a configured Axios instance (`apiClient.js`).
2. **JWT Interceptors**: `Authorization: Bearer <token>` headers are injected automatically. Upon encountering a `401 Unauthorized` response due to token expiration, the Axios interceptor attempts to refresh the session token transparently (`/auth/refresh/`) before retrying the original request.
3. **State Synchronization**: `React Query` acts as the primary data fetching and caching layer to ensure UI synchronization with the backend state.

## Contribution Guidelines

* **Backend**: Adhere to PEP-8 coding standards (`black` and `isort` are recommended). Ensure database migrations are generated and committed whenever `models.py` definitions are mutated.
* **Frontend**:
  * Utilize React Query for stateful cross-component `GET` requests.
  * Isolate fetch operations within domain-specific service files (`services/*.service.js`).
  * Maintain strict component separation of concerns.
