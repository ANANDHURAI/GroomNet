from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import (
    RegisterSerializer, OTPVerificationSerializer, 
    CreateUserSerializer, CustomTokenObtainPairSerializer ,
    ForgotPasswordSerializer, ResetPasswordSerializer
)
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import random
from django.core.cache import cache
from django.contrib.auth import authenticate
from .models import User  # Changed from CustomerModel to User
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import logging
from django.contrib.auth import get_user_model

User = get_user_model()


class HomeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'message': 'Welcome to Home page'})

class SendOTP:
    @staticmethod
    def send(email, otp):
        try:
            print(f"DEV MODE: OTP for {email}: {otp}")
        
            subject = 'GroomNet - Email Verification OTP'
            message = f'Your OTP for email verification is: {otp}'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [email]
            
            send_mail(
                subject,
                message,
                email_from,
                recipient_list,
                fail_silently=False
            )
           
            return True
        except Exception as e:
            print(f"Error in SendOTP.send: {str(e)}")
            return True 
        
class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        
        
        print(f"Registration data received: {request.data}")
        
        
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)
        
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            
            return Response({"error": "Validation failed", "details": serializer.errors}, status=400)
        
        registration_data = request.data
        cache.set(f"registration_{email}", registration_data, timeout=600)  
        
        
        otp = random.randint(1000, 9999)
        cache.set(f"otp_{email}", str(otp), timeout=300)  
        
        print(f"Generated OTP for {email}: {otp}")
        
        try:
        
            result = SendOTP.send(email=email, otp=otp)
            
            if result:
                return Response({
                    "message": "OTP sent to your email for verification.",
                    "email": email
                }, status=200)
            else:
                return Response({"error": "Failed to send OTP"}, status=500)
                
        except Exception as e:
            print(f"Failed to send OTP: {str(e)}")
            print(f"DEV MODE: Continuing despite email error. Use OTP: {otp}")
            return Response({
                "message": "OTP generated for verification (check server logs).",
                "email": email,
                "dev_note": f"Email sending failed but continuing. OTP: {otp}"
            }, status=200)
        


class VerifyOTPView(APIView):
   
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
            
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        cached_otp = cache.get(f"otp_{email}")
        
        if not cached_otp:
            return Response({"error": "OTP expired. Please request a new one."}, status=400)
            
        if cached_otp != otp:
            return Response({"error": "Invalid OTP."}, status=400)

        cache.set(f"verified_{email}", True, timeout=600) 
        
        return Response({"message": "OTP verified successfully."}, status=200)




class CreateUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        print(f"Create user request data: {request.data}")
        
        verified = cache.get(f"verified_{email}")
        if not verified:
            print(f"Email verification check failed for {email}")
            return Response({"error": "Email not verified. Please verify OTP first."}, status=400)
            
        registration_data = cache.get(f"registration_{email}")
        if not registration_data:
            print(f"Registration data not found in cache for {email}")
            return Response({"error": "Registration data expired. Please register again."}, status=400)
        
        print(f"Registration data from cache: {registration_data}")
        
        merged_data = {**registration_data}
        
        if 'user_type' in merged_data and 'user_type' not in request.data:
            merged_data['user_type'] = merged_data.get('user_type')
            
        print(f"Merged data for serializer: {merged_data}")
        
        serializer = CreateUserSerializer(data=merged_data)
        if not serializer.is_valid():
            print(f"Serializer validation errors: {serializer.errors}")
            return Response(serializer.errors, status=400)
            
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        cache.delete(f"otp_{email}")
        cache.delete(f"verified_{email}")
        cache.delete(f"registration_{email}")
        
        return Response({
            "message": "User created successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "user_type": user.user_type
        }, status=201)



class ResendOTPView(APIView):
   
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=400)
            
        registration_data = cache.get(f"registration_{email}")
        if not registration_data:
            return Response({"error": "Registration data not found. Please register again."}, status=400)
            
       
        otp = random.randint(1000, 9999)
        cache.set(f"otp_{email}", str(otp), timeout=300)
        
        SendOTP.send(email=email, otp=otp)
        
        return Response({
            "message": "OTP resent successfully.",
            "email": email
        }, status=200)



class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

logger = logging.getLogger(__name__)


    
class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except Exception as e:
            print(f"Token view error: {str(e)}")
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        
        
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            logger.warning("Admin login attempt missing email or password")
            return Response({
                'message': 'Please provide both email and password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(email=email, password=password)
        
        if not user:
            logger.warning(f"Failed admin login attempt for email: {email}")
            return Response({
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_staff:
            logger.warning(f"Non-admin user attempted admin login: {email}")
            return Response({
                'message': 'You do not have admin privileges'
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        logger.info(f"Successful admin login for: {email}")
        
        response_data = {
            'user': {
                'name': user.name,
                'email': user.email,
                'is_superuser': user.is_superuser,
            },
            'access': access_token,
            'refresh': str(refresh),
            'message': 'Admin login successful'
        }
        logger.info(f"Returning response with keys: {', '.join(response_data.keys())}")
        
        return Response(response_data, status=status.HTTP_200_OK)
    


class AdminDashboardView(APIView):
    def get(self, request):
        return Response({
            'message': 'Welcome to Admin Dashboard',
            'user': request.user.email,
            'is_superuser': request.user.is_superuser,
        })
    

User = get_user_model()
def send_otp(email, otp):
    try:
        subject = 'Password Reset OTP'
        message = f'Your OTP for resetting the password is: {otp}'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]
        
        send_mail(
            subject,
            message,
            email_from,
            recipient_list,
            fail_silently=False
        )
        return True
    except Exception as e:
        print(f"Error in sending OTP: {str(e)}")
        return False


class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
    
        if not User.objects.filter(email=email).exists():
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

        otp = random.randint(1000, 9999)
        cache.set(f"otp_{email}", str(otp), timeout=300)  

        
        if send_otp(email, otp):
            return Response({
                "message": "OTP sent to your email for password reset.",
                "email": email
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send OTP"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        cached_otp = cache.get(f"otp_{email}")
        if not cached_otp:
            return Response({"error": "OTP expired. Please request a new OTP."}, status=status.HTTP_400_BAD_REQUEST)
        
        if cached_otp != otp:
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        cache.delete(f"otp_{email}")
        
        return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
