from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from accounts.models import User, UserApplication
from provider.custom_functions import generate_temp_login_id, send_email_function
from provider.settings import SENDER_EMAIL


class UserApplicationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    class Meta:
        model = UserApplication
        fields = (
            "id",
            "name",
            "surname",
            "business_name",
            "nipt",
            "phone_number",
            "email",
            "password",
            "status",
            "created_at",
        )
        read_only_fields = ("status", "created_at")

    def create(self, validated_data):
        # Hash the password before saving
        password = validated_data.pop("password")
        application = UserApplication(**validated_data)
        application.password = password  # Store the password temporarily
        application.save()
        return application


class UserSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(read_only=True, source="is_active")

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "temp_login_id",
            "access",
            "status",
            "isActive",
        )
        read_only_fields = ("access", "status", "isActive")
