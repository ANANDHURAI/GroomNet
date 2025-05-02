from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import Registerserializers, OTPVerificationSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
import random
from django.core.cache import cache

class HomeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'message': 'Welcome to Home page'})


class RegisterView(APIView):
    def post(self, request):
        serializer = Registerserializers(data=request.data)
        if serializer.is_valid():
            serializer.save()

            otp = random.randint(1000, 9999)
            email = request.data.get("email")

            cache.set(email, str(otp), timeout=300)

            SendOTP.send(email=email, otp=otp)

            return Response({
                "message": "Registered successfully. OTP sent to your email.",
                "user": serializer.data
            }, status=201)

        return Response(serializer.errors, status=400)

class SendOTP:
    @staticmethod
    def send(email, otp):
        send_mail(
            subject="GroomNet - Email Verification",
            message=f"Your OTP is {otp}",
            from_email="GroomNet <groomnet@gmail.com>",
            recipient_list=[email],
            fail_silently=False,
        )
    

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            cached_otp = cache.get(email)
            print('cashed data : ', cached_otp)

            if cached_otp == otp:
                return Response({"message": "OTP verified successfully."}, status=200)
            else:
                return Response({"error": "Invalid or expired OTP."}, status=400)

        return Response(serializer.errors, status=400)


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
