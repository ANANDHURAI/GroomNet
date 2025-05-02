from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class UserBaseModel(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    class Meta:
        abstract = True

class CustomerModel(UserBaseModel):
    USER_TYPE_CHOICES = (
        ('customer', 'Customer'),
        ('barber', 'Barber'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')
    
    def __str__(self):
        return self.name


class BarberModel(models.Model):
    user = models.OneToOneField(CustomerModel, on_delete=models.CASCADE)
    upload_document = models.FileField(upload_to='media/barber_docs/', null=True, blank=True)
    is_premium = models.BooleanField(default=False)  
    bio = models.TextField(null=True, blank=True)
    travel_radius_km = models.IntegerField(default=5)
    available_now = models.BooleanField(null=True , blank=True)
    rating = models.FloatField(default=0.0)
    current_location = models.TextField(null=True, blank=True)
    available_until = models.DateTimeField(null=True, blank=True)    
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Barber: {self.user.name}"

