from django.urls import path
from .views import CustomerProfileView, BarberProfileView

app_name = 'all_profile'

urlpatterns = [
    path('customer/profile/', CustomerProfileView.as_view(), name='customer-profile'),
    path('barber/profile/', BarberProfileView.as_view(), name='barber-profile'),
]