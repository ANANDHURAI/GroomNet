# all_profile/serializers.py
from rest_framework import serializers
from .models import CustomerProfile, BarberProfile, AdminProfile

class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = ['id', 'profile_image', 'email', 'phone', 'name']
    
    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return None

class BarberProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    
    class Meta:
        model = BarberProfile
        fields = [
            'id', 'profile_image', 'bio', 'travel_radius_km', 
            'available_now', 'email', 'name', 'phone',
            'is_verified', 'rating', 'upload_document'
        ]
        read_only_fields = ['id', 'is_verified', 'rating']

class AdminProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = ['id', 'profile_image', 'bio', 'email', 'name']