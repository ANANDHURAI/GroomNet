from rest_framework import serializers
from .models import CustomerModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class RegisterSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    user_type = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)
    
    def validate_email(self, value):
        if CustomerModel.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    user_type = serializers.CharField(required=True)  

    class Meta:
        model = CustomerModel
        fields = ['name', 'email', 'phone', 'user_type', 'password']

    def create(self, validated_data):
        print(f"Creating user with data: {validated_data}")
        password = validated_data.pop('password')

        user = CustomerModel.objects.create_user(
            name=validated_data.get('name'),
            email=validated_data.get('email'),
            phone=validated_data.get('phone'),
            user_type=validated_data.get('user_type')
        )
        user.set_password(password)
        user.save()
        return user


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=4)



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        print(f"Login attempt with email: {attrs.get('email', 'N/A')}")
        
        try:
            data = super().validate(attrs)
            data.update({
                'name': self.user.name,
                'email': self.user.email,
                'user_type': self.user.user_type,
                'phone': getattr(self.user, 'phone', ''),  
            })
            return data
        except Exception as e:
            print(f"Token validation error: {str(e)}")
            raise  
