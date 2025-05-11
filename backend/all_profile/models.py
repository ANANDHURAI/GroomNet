from django.db import models


class CustomerProfile(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='customer_profile')
    profile_image = models.ImageField(upload_to='customer/', null=True, blank=True)

    def __str__(self):
        return f"Customer: {self.user.name}"

class BarberProfile(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='barber_profile')
    upload_document = models.FileField(upload_to='barber_docs/', null=True, blank=True)
    profile_image = models.ImageField(upload_to='barber/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    travel_radius_km = models.IntegerField(default=5)
    available_now = models.BooleanField(null=True , blank=True)
    rating = models.FloatField(default=0.0)
    current_location = models.TextField(null=True, blank=True)
    available_until = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Barber: {self.user.name}"


class AdminProfile(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='admin_profile')
    profile_image = models.ImageField(upload_to='admin/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Admin: {self.user.name}"
