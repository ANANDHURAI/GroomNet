from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import(
    HomeView, 
    RegisterView,
    LogoutView,
    VerifyOTPView,
    AdminDashboardView, 
    AdminLoginView,
    RegisterView, 
    CreateUserView,
    ResendOTPView,
)
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('home/', HomeView.as_view(), name='home'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('create-user/', CreateUserView.as_view(), name='create_user'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),

    path('aadmin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    
]
