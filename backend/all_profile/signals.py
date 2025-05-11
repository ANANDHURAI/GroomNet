
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AdminProfile, BarberProfile, CustomerProfile
from authservice.models import User


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'admin':
            AdminProfile.objects.create(user=instance)
        elif instance.role == 'barber':
            BarberProfile.objects.create(user=instance)
        elif instance.role == 'customer':
            CustomerProfile.objects.create(user=instance)
