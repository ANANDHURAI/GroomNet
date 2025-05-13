# urls.py
from django.urls import path
from .views import AllCustomersView , ToggleBlockCustomerView , CustomerDetailView

urlpatterns = [
    path('admin/customers/', AllCustomersView.as_view(), name='admin-customer-list'),
    path('admin/customers/<int:user_id>/block-toggle/', ToggleBlockCustomerView.as_view(), name='toggle-block-customer'),
    path('admin/customers/<int:user_id>/', CustomerDetailView.as_view(), name='customer-detail'),
]
