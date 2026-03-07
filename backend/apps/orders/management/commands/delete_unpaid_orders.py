import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.orders.models import Order

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Deletes unpaid (PENDING) orders older than 48 hours'

    def handle(self, *args, **options):
        threshold = timezone.now() - timedelta(hours=48)
        
        orders_to_delete = Order.objects.filter(
            status='PENDING',
            created_at__lte=threshold
        )
        
        count = orders_to_delete.count()
        if count > 0:
            orders_to_delete.delete()
        
        success_msg = f'Successfully deleted {count} unpaid orders older than 48h.'
        self.stdout.write(self.style.SUCCESS(success_msg))
        logger.info(success_msg)
