from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from accounts.models import User
from provider.custom_functions import generate_temp_login_id, send_email_function
from provider.settings import SENDER_EMAIL


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    isActive = serializers.BooleanField(read_only=True, source="is_active")

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "temp_login_id",
            "password",
            "access",
            "status",
            "isActive",
        )

    def create(self, validated_data: dict) -> User:
        keys = [
            "name",
            "email",
            "password",
            "access",
            "status",
        ]
        new_validated_data = {
            key: validated_data[key] for key in keys if key in validated_data
        }

        user = User(**new_validated_data)
        user.set_password(validated_data["password"])
        user.save()

        user.temp_login_id = generate_temp_login_id()
        data: dict = {
            "temp_login_id": user.temp_login_id,
        }

        user.save()
        return user
