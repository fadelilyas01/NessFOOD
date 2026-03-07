
from django.db import models
from apps.core.models import TimeStampedModel

class Subscriber(TimeStampedModel):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Abonné Newsletter"
        verbose_name_plural = "Abonnés Newsletter"
