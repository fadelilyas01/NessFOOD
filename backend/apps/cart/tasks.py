import logging
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from apps.cart.models import Cart
from django.db.models import Count

logger = logging.getLogger(__name__)

@shared_task
def send_abandoned_carts_reminder():
    """Sends reminder emails for abandoned carts older than 24 hours"""
    threshold = timezone.now() - timedelta(hours=24)
    
    # Consider a cart abandoned if it has items, was updated older than 24h ago, and no order placed
    carts = Cart.objects.annotate(item_count=Count('items')).filter(
        item_count__gt=0,
        updated_at__lte=threshold,
        user__is_active=True
    )
    
    count = 0
    for cart in carts:
        try:
            user = cart.user
            
            subject = 'Vous avez oublié quelque chose ? 🛒'
            message = f'Bonjour {user.get_full_name() or user.email},\n\n'
            message += f'Votre panier contenant {cart.total_items} article(s) vous attend sur Ness Food.\n'
            message += f'N\'attendez plus pour savourer nos délicieuses spécialités ivoiriennes !\n\n'
            message += f'Rendez-vous sur {settings.FRONTEND_URL}/panier pour finaliser votre commande.\n\n'
            message += f'À bientôt,\nL\'équipe Ness Food'
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            # To prevent resending indefinitely, update the cart's updated_at
            cart.save(update_fields=['updated_at'])
            count += 1
            
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi du mail de relance au panier {cart.id}: {e}")
            
    success_msg = f'Envoyé {count} relances de paniers abandonnés.'
    logger.info(success_msg)
    return success_msg
