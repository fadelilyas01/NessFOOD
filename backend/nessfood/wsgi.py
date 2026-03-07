"""
WSGI config for Ness Food project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nessfood.settings')
application = get_wsgi_application()
