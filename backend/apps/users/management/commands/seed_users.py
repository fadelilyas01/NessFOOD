
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with default users (Admin, Manager, User)'

    def handle(self, *args, **options):
        users_to_create = [
            {
                'email': 'admin@nessfood.com',
                'password': 'AdminPassword123!',
                'role': 'admin',
                'first_name': 'Admin',
                'last_name': 'System',
                'is_staff': True,
                'is_superuser': True
            },
            {
                'email': 'manager@nessfood.com',
                'password': 'ManagerPassword123!',
                'role': 'admin',
                'first_name': 'Jane',
                'last_name': 'Manager',
                'is_staff': True,
                'is_superuser': False
            },
            {
                'email': 'user@nessfood.com',
                'password': 'UserPassword123!',
                'role': 'client',
                'first_name': 'John',
                'last_name': 'Doe',
                'is_staff': False,
                'is_superuser': False
            }
        ]

        for user_data in users_to_create:
            email = user_data['email']
            try:
                if not User.objects.filter(email=email).exists():
                    user = User.objects.create_user(
                        username=email,
                        email=email,
                        password=user_data['password'],
                        first_name=user_data['first_name'],
                        last_name=user_data['last_name'],
                        role=user_data['role'],
                        is_staff=user_data['is_staff'],
                        is_superuser=user_data['is_superuser']
                    )
                    self.stdout.write(self.style.SUCCESS(f'Successfully created user: {email}'))
                else:
                    self.stdout.write(self.style.WARNING(f'User {email} already exists'))
            except IntegrityError as e:
                self.stdout.write(self.style.ERROR(f'Error creating {email}: {str(e)}'))
            
        self.stdout.write(self.style.SUCCESS('User seeding completed!'))
