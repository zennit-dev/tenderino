from typing import Any, Dict, Tuple

from django.contrib.auth.hashers import check_password
from django.db.models import QuerySet
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from accounts.models import User, UserPermissions
from accounts.serializers import UserSerializer
from provider.custom_functions import generate_temp_login_id, send_email_function
from provider.minxin import CanManageUsers, PermissionPolicyMixin
from provider.views import QuerySetPagination


def get_total_users(request: Request) -> JsonResponse:
    return JsonResponse({"totalUsers": User.objects.all().count()})


class CurrentUser(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self) -> User:
        return self.request.user

    def perform_update(self, serializer: Serializer) -> None:
        user = serializer.save()
        user.save()

    def get_serializer_context(self) -> dict:
        return {"user": self.request.user, "request": self.request}


class UserViewSet(viewsets.ModelViewSet, PermissionPolicyMixin):
    serializer_class = UserSerializer
    permission_classes_per_method = {
        "retrieve": [IsAuthenticated],
        "list": [IsAuthenticated],
        "create": [CanManageUsers],
        "update": [CanManageUsers],
        "partial_update": [CanManageUsers],
        "destroy": [CanManageUsers],
    }
    pagination_class = QuerySetPagination

    def get_queryset(self):
        user = self.request.user
        queryset = User.objects.all().order_by("id")
        name = self.request.query_params.get("name")

        if name:
            queryset = queryset.filter(name__contains=name)

        if user.access == UserPermissions.SUPERUSER:
            return User.objects.all().order_by("id")
        else:
            return User.objects.filter(id=user.id).order_by("id")

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer: Serializer) -> None:
        user = serializer.save()
        user.save()


class SignIn(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(
        self, request: Request, *args: Tuple[Any], **kwargs: Dict[str, Any]
    ) -> Response:
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Please provide both email and password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                return Response(
                    {"error": "Invalid credentials."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "access": user.access,
                "email": user.email,
                "name": user.name,
            },
            status=status.HTTP_200_OK,
        )


class SignOut(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.none()

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        request.user.auth_token.delete()
        return Response(
            {"message": "Signed out successfully."}, status=status.HTTP_200_OK
        )


class SignUp(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        data = request.data.copy()
        password = request.data.get("password")

        if (
            request.user.is_authenticated
            and request.user.access == UserPermissions.ADMIN
        ):
            access = request.data.get("access", UserPermissions.USER)
            if access not in [UserPermissions.USER, UserPermissions.STAFF]:
                return Response(
                    {"error": "Admin can only create users with USER or STAFF access."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            data["access"] = access
        else:
            data["access"] = UserPermissions.USER

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user.set_password(password)
        user.save()

        user_data = UserSerializer(user).data
        token, created = Token.objects.get_or_create(user_id=user_data.get("id"))
        user_data["token"] = token.key

        return Response(user_data, status=status.HTTP_201_CREATED)


class ResetPassword(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.none()

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        temp_login_id = self.kwargs.get("temp_login_id")
        password = request.data.get("password")
        if temp_login_id is None or password is None:
            raise ValidationError("Temp login id and new password are required.")
        try:
            user = User.objects.get(temp_login_id=temp_login_id)
        except User.DoesNotExist:
            raise ValidationError("Invalid temp login id.")

        user.set_password(password)
        user.temp_login_id = None
        user.save()
        data = {
            "username": user.email,
            "acme_domain": "localhost",
            "timestamp": timezone.now().strftime("%d-%m-%Y | %H:%M"),
        }
        try:
            template_html = "emails/html/resset_password_success.html"
            template_txt = "emails/txt/resset_password_success.txt"
            send_email_function(None, user, data, template_html, template_txt)
        except TimeoutError:
            template_html = "emails/htmls/resset_password_fail.html"
            template_txt = "emails/txt/resset_password_fail.txt"
            send_email_function(None, user, data, template_html, template_txt)

        return Response(
            {"message": "Password reset successfully."}, status=status.HTTP_200_OK
        )


class RequestResetPassword(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.none()

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        email = request.data.get("email")

        if email is None:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.get(email=email)
        user.temp_login_id = generate_temp_login_id()
        user.save()

        data = {
            "temp_login_id": user.temp_login_id,
        }
        template_html = "emails/html/resset_password.html"
        template_txt = "emails/txt/resset_password.txt"

        send_email_function(None, user, data, template_html, template_txt)

        return Response(
            {"message": "Password reset request sent successfully."},
            status=status.HTTP_200_OK,
        )


class ChangePassword(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.none()

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        user = request.user
        old_password = request.data.get("oldPassword")
        new_password = request.data.get("password")

        if old_password is None or new_password is None:
            raise ValidationError("Old password and new password are required.")

        if not check_password(old_password, user.password):
            raise ValidationError("Old password is incorrect.")

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )
