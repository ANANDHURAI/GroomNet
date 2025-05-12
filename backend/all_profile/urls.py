# all_profile/urls.py
from django.urls import path
from .views import CustomerProfileView, BarberProfileView, AdminProfileView

app_name = 'all_profile'

urlpatterns = [
    path('customer/profile/', CustomerProfileView.as_view(), name='customer-profile'),
    path('barber/profile/', BarberProfileView.as_view(), name='barber-profile'),
    path('admin/profile/', AdminProfileView.as_view(), name='admin-profile'),
]