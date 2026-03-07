
import os
import django
from django.apps import apps

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nessfood.settings")
django.setup()

print("App configurations:")
for app_config in apps.get_app_configs():
    if 'apps.' in app_config.name:
         print(f"Path: {app_config.name}, Label: {app_config.label}")
