from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from all_profile.models import CustomerProfile
from all_profile.serializers import CustomerProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class AllCustomersView(APIView):
    permission_classes = [IsAdminUser] 

    def get(self, request):
        customers = CustomerProfile.objects.select_related('user').all()
        serializer = CustomerProfileSerializer(customers, many=True, context={'request': request})
        return Response(serializer.data)


class CustomerDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id):
        try:
            profile = CustomerProfile.objects.select_related('user').get(user__id=user_id)
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=404)

        serializer = CustomerProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    

class ToggleBlockCustomerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, user_type='customer')
        except User.DoesNotExist:
            return Response({'error': 'Customer not found.'}, status=404)

        user.is_blocked = not user.is_blocked
        user.save()
        status_text = 'blocked' if user.is_blocked else 'unblocked'
        return Response({'message': f'Customer has been {status_text}.'})
