from rest_framework import serializers
from .models import CustomerModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class Registerserializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomerModel
        fields = ['name', 'email', 'phone', 'user_type', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomerModel.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'name': self.user.name,
            'email': self.user.email,
            'user_type': self.user.user_type,
        })
        return data


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=4)
