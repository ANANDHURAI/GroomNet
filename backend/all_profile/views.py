# all_profile/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomerProfile, BarberProfile, AdminProfile
from .serializers import CustomerProfileSerializer, BarberProfileSerializer, AdminProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class BarberProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user

        if user.user_type != 'barber':
            return Response({"error": "Access denied. User is not a barber."}, status=403)

        profile, _ = BarberProfile.objects.get_or_create(user=user)
        serializer = BarberProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user

        if user.user_type != 'barber':
            return Response({"error": "Access denied. User is not a barber."}, status=403)

        profile, _ = BarberProfile.objects.get_or_create(user=user)
        serializer = BarberProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        
        if user.user_type != 'customer':
            return Response({"error": "Access denied. User is not a customer."}, status=403)
            
        profile, _ = CustomerProfile.objects.get_or_create(user=user)
        serializer = CustomerProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        
        if user.user_type != 'customer':
            return Response({"error": "Access denied. User is not a customer."}, status=403)
            
        profile, _ = CustomerProfile.objects.get_or_create(user=user)
        serializer = CustomerProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        
        if user.user_type != 'admin':
            return Response({"error": "Access denied. User is not an admin."}, status=403)
            
        profile, _ = AdminProfile.objects.get_or_create(user=user)
        serializer = AdminProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        
        if user.user_type != 'admin':
            return Response({"error": "Access denied. User is not an admin."}, status=403)
            
        profile, _ = AdminProfile.objects.get_or_create(user=user)
        serializer = AdminProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)