from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomerProfile, BarberProfile
from .serializers import CustomerProfileSerializer, BarberProfileSerializer
from authservice.models import BarberModel
from rest_framework.parsers import MultiPartParser, FormParser

class BarberProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user

        if user.user_type != 'barber':
            return Response({"error": "Access denied. User is not a barber."}, status=403)

        barber, _ = BarberModel.objects.get_or_create(user=user)

        profile, _ = BarberProfile.objects.get_or_create(barber=barber)
        serializer = BarberProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user

        if user.user_type != 'barber':
            return Response({"error": "Access denied. User is not a barber."}, status=403)

        barber, _ = BarberModel.objects.get_or_create(user=user)

        profile, _ = BarberProfile.objects.get_or_create(barber=barber)

        serializer = BarberProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = CustomerProfile.objects.get_or_create(customer=request.user)
        serializer = CustomerProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        profile, _ = CustomerProfile.objects.get_or_create(customer=request.user)
        serializer = CustomerProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)