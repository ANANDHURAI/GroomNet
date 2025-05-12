# all_profile/models.py
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

class CustomerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_profile')
    profile_image = models.ImageField(upload_to='customer/', null=True, blank=True)

    def __str__(self):
        return f"Customer: {self.user.name}"

class BarberProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='barber_profile')
    bio = models.TextField(null=True, blank=True)
    travel_radius_km = models.IntegerField(default=5)
    available_now = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    current_location = models.TextField(null=True, blank=True)
    available_until = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='barber/', null=True, blank=True)
    upload_document = models.FileField(upload_to='barber_docs/', null=True, blank=True)

    def __str__(self):
        return f"Barber: {self.user.name}"

class AdminProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_profile')
    profile_image = models.ImageField(upload_to='admin/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Admin: {self.user.name}"

# Signal to create appropriate profile based on user_type
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 'barber':
            BarberProfile.objects.create(user=instance)
        elif instance.user_type == 'customer':
            CustomerProfile.objects.create(user=instance)
        elif instance.user_type == 'admin':
            AdminProfile.objects.create(user=instance)