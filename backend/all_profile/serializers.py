from rest_framework import serializers
from .models import CustomerProfile, BarberProfile

class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='customer.email', read_only=True)
    phone = serializers.CharField(source='customer.phone', read_only=True)
    name = serializers.CharField(source='customer.name', read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = ['id', 'profile_image', 'email', 'phone', 'name']
    
    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return None

class BarberProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='barber.user.email', read_only=True)
    name = serializers.CharField(source='barber.user.name', read_only=True)
    phone = serializers.CharField(source='barber.user.phone', read_only=True)
    bio = serializers.CharField(source='barber.bio', allow_blank=True, required=False)
    travel_radius_km = serializers.IntegerField(source='barber.travel_radius_km', required=False)
    available_now = serializers.BooleanField(source='barber.available_now', required=False)
    is_verified = serializers.BooleanField(source='barber.is_verified', read_only=True)
    rating = serializers.FloatField(source='barber.rating', read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = BarberProfile
        fields = [
            'id', 'barber', 'profile_image',
            'bio', 'travel_radius_km', 'available_now',
            'email', 'name', 'phone',
            'is_verified', 'rating'
        ]
        read_only_fields = ['barber']

    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return None

    def update(self, instance, validated_data):
        barber_data = validated_data.pop('barber', {})
        barber = instance.barber
        for attr, value in barber_data.items():
            setattr(barber, attr, value)
        barber.save()
        return super().update(instance, validated_data)

