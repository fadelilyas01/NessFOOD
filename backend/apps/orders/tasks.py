import logging
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.orders.models import Order

logger = logging.getLogger(__name__)

@shared_task
def delete_unpaid_orders():
    """Deletes unpaid (PENDING) orders older than 48 hours"""
    threshold = timezone.now() - timedelta(hours=48)
    
    orders_to_delete = Order.objects.filter(
        status='PENDING',
        created_at__lte=threshold
    )
    
    count = orders_to_delete.count()
    if count > 0:
        orders_to_delete.delete()
    
    success_msg = f'Successfully deleted {count} unpaid orders older than 48h.'
    logger.info(success_msg)
    return success_msg
