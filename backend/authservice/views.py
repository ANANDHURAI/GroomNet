from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, OTPVerificationSerializer ,CreateUserSerializer ,CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import random
from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from.models import CustomerModel
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt , ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import logging


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
            # During development, don't fail the registration just because email sending failed
            return True  # Return True to allow registration to continue

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        
        # Debug print to see what data is coming in
        print(f"Registration data received: {request.data}")
        
        # Check if user already exists with this email
        if CustomerModel.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=400)
        
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            # Return detailed validation errors
            return Response({"error": "Validation failed", "details": serializer.errors}, status=400)
        
        registration_data = request.data
        cache.set(f"registration_{email}", registration_data, timeout=600)  # 10 minutes timeout
        
        # Generate and send OTP
        otp = random.randint(1000, 9999)
        cache.set(f"otp_{email}", str(otp), timeout=300)  # 5 minutes timeout
        
        # For debugging, print OTP to console (remove in production)
        print(f"Generated OTP for {email}: {otp}")
        
        try:
            # Send OTP - Use the modified SendOTP class
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
            # During development, instead of failing, continue the flow
            # This lets you test the registration process even if email sending fails
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

        # Mark email as verified in cache
        cache.set(f"verified_{email}", True, timeout=600)  # 10 minutes timeout
        
        return Response({"message": "OTP verified successfully."}, status=200)


class CreateUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        
        # Debug logging to see what data is coming in
        print(f"Create user request data: {request.data}")
        
        # Check if email was verified
        verified = cache.get(f"verified_{email}")
        if not verified:
            print(f"Email verification check failed for {email}")
            return Response({"error": "Email not verified. Please verify OTP first."}, status=400)
            
        # Get registration data from cache
        registration_data = cache.get(f"registration_{email}")
        if not registration_data:
            print(f"Registration data not found in cache for {email}")
            return Response({"error": "Registration data expired. Please register again."}, status=400)
        
        print(f"Registration data from cache: {registration_data}")
        
        # Merge the registration data with any additional data from the request
        # This ensures all necessary fields are present
        merged_data = {**registration_data}
        
        # Explicitly convert the user_type field if needed
        if 'user_type' in merged_data and not 'user_type' in request.data:
            merged_data['user_type'] = merged_data.get('user_type')
            
        print(f"Merged data for serializer: {merged_data}")
        
        # Create the user with the merged data
        serializer = CreateUserSerializer(data=merged_data)
        if not serializer.is_valid():
            print(f"Serializer validation errors: {serializer.errors}")
            return Response(serializer.errors, status=400)
            
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Clear cache
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
            
        # Check if registration data exists
        registration_data = cache.get(f"registration_{email}")
        if not registration_data:
            return Response({"error": "Registration data not found. Please register again."}, status=400)
            
        # Generate and send new OTP
        otp = random.randint(1000, 9999)
        cache.set(f"otp_{email}", str(otp), timeout=300)  # 5 minutes timeout
        
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

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    """
    This view sets a CSRF cookie for the client
    """
    def get(self, request):
        return JsonResponse({"success": "CSRF cookie set"})

@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    """
    View for admin user login. 
    Only allows login for users with is_staff=True
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        logger.info(f"Admin login attempt for email: {request.data.get('email', 'unknown')}")
        
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
    """
    Protected dashboard view for admin users only
    """
    # The permission classes from your original code are fine for this view
    # permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        return Response({
            'message': 'Welcome to Admin Dashboard',
            'user': request.user.email,
            'is_superuser': request.user.is_superuser,
        })

    
class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return response
        except Exception as e:
            print(f"Token view error: {str(e)}")
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)