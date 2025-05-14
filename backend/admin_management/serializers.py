from rest_framework import serializers
from all_profile.models import CustomerProfile

class CustomerProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name')
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    registered_at = serializers.DateTimeField(source='user.created_at')
    is_blocked = serializers.BooleanField(source='user.is_blocked')

    class Meta:
        model = CustomerProfile
        fields = ['id', 'profile_image', 'name', 'email', 'phone', 'registered_at', 'is_blocked']