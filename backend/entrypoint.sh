#!/bin/sh

# Verify database connection (optional waiting logic could be added here)
echo "Starting backend..."

# Apply database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start server
# If DEBUG is true, run manage.py runserver, otherwise use Gunicorn
if [ "$DEBUG" = "True" ]; then
    echo "Running in DEBUG mode"
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "Running in PRODUCTION mode"
    exec gunicorn nessfood.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
