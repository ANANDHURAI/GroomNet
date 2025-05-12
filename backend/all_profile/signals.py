# profile/signals.py

from .models import CustomerProfile, BarberProfile, AdminProfile
from authservice.models import User

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 'barber':
            BarberProfile.objects.create(user=instance)
        elif instance.user_type == 'customer':
            CustomerProfile.objects.create(user=instance)
        elif instance.user_type == 'admin':
            AdminProfile.objects.create(user=instance)
