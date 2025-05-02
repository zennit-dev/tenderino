from typing import Any, Dict, Tuple

from django.contrib.auth.hashers import check_password, make_password
from django.db.models import QuerySet
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from accounts.models import User, UserApplication, UserPermissions, UserStatus
from accounts.serializers import UserApplicationSerializer, UserSerializer
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

        if user.access == UserPermissions.ADMIN:
            return User.objects.all().order_by("id")
        elif user.access == UserPermissions.STAFF:
            return User.objects.filter(access=UserPermissions.USER).order_by("id")
        else:
            return User.objects.filter(id=user.id).order_by("id")

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer: Serializer) -> None:
        user = serializer.save()
        user.save()


class UserApplicationViewSet(viewsets.ModelViewSet, PermissionPolicyMixin):
    serializer_class = UserApplicationSerializer
    permission_classes_per_method = {
        "retrieve": [IsAuthenticated],
        "list": [IsAuthenticated],
        "create": [AllowAny],
        "update": [CanManageUsers],
        "partial_update": [CanManageUsers],
        "destroy": [CanManageUsers],
    }
    pagination_class = QuerySetPagination

    def get_queryset(self):
        user = self.request.user
        if user.access == UserPermissions.ADMIN:
            return UserApplication.objects.all().order_by("-created_at")
        elif user.access == UserPermissions.STAFF:
            return UserApplication.objects.filter(status=UserStatus.PENDING).order_by(
                "-created_at"
            )
        else:
            return UserApplication.objects.none()

    def perform_update(self, serializer):
        application = serializer.save()

        # If application is approved, create the user
        if application.status == UserStatus.ACTIVE:
            # Check if user already exists
            if User.objects.filter(email=application.email).exists():
                raise ValidationError("A user with this email already exists.")

            # Create the user
            user = User.objects.create(
                name=f"{application.name} {application.surname}",
                email=application.email,
                access=UserPermissions.USER,
                status=UserStatus.ACTIVE,
                is_active=True,
            )
            user.set_password(application.password)
            user.save()

            # Send email notification
            data = {
                "name": application.name,
                "email": application.email,
                "timestamp": timezone.now().strftime("%d-%m-%Y | %H:%M"),
            }
            try:
                template_html = "emails/html/application_approved.html"
                template_txt = "emails/txt/application_approved.txt"
                send_email_function(None, user, data, template_html, template_txt)
            except Exception as e:
                # Log the error but don't fail the request
                print(f"Failed to send email: {str(e)}")


class SignIn(ObtainAuthToken):
    permission_classes = [AllowAny]

    def post(
        self, request: Request, *args: Tuple[Any], **kwargs: Dict[str, Any]
    ) -> Response:
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data["token"])
        user = User.objects.get(id=token.user_id)

        return Response(
            {"token": token.key, "access": user.access},
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
        application_data = request.data.get("application")

        if not application_data:
            return Response(
                {"message": "Application details are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user with inactive status
        data["access"] = UserPermissions.USER
        data["status"] = UserStatus.PENDING
        data["is_active"] = False
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(password)
        user.save()

        # Create application
        application_serializer = UserApplicationSerializer(data=application_data)
        application_serializer.is_valid(raise_exception=True)
        application_serializer.save(user=user)

        user_data = UserSerializer(user).data
        token, created = Token.objects.get_or_create(user_id=user_data.get("id"))

        return Response(
            {
                "message": "Account created successfully. Please wait for admin approval.",
                "user": user_data,
                "token": token.key,
            },
            status=status.HTTP_201_CREATED,
        )


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


class CreateApplication(CreateAPIView):
    serializer_class = UserApplicationSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if email already exists in applications or users
        email = request.data.get("email")
        if UserApplication.objects.filter(email=email).exists():
            return Response(
                {"message": "An application with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {"message": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        application = serializer.save()

        # Send confirmation email
        data = {
            "name": application.name,
            "email": application.email,
            "business_name": application.business_name,
            "timestamp": timezone.now().strftime("%d-%m-%Y | %H:%M"),
        }
        try:
            template_html = "emails/html/application_submitted.html"
            template_txt = "emails/txt/application_submitted.txt"
            send_email_function(None, application, data, template_html, template_txt)
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Failed to send email: {str(e)}")

        return Response(
            {
                "message": "Application submitted successfully. You will be notified once it's approved.",
                "application": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class ListApplications(ListAPIView):
    serializer_class = UserApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = QuerySetPagination

    def get_queryset(self):
        user = self.request.user
        if user.access == UserPermissions.ADMIN:
            return UserApplication.objects.all().order_by("-created_at")
        elif user.access == UserPermissions.STAFF:
            return UserApplication.objects.filter(status=UserStatus.PENDING).order_by(
                "-created_at"
            )
        else:
            return UserApplication.objects.none()


class EditApplication(UpdateAPIView):
    serializer_class = UserApplicationSerializer
    permission_classes = [CanManageUsers]
    queryset = UserApplication.objects.all()

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        application = self.get_object()
        serializer = self.get_serializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Save the application first to update its status
        application = serializer.save()

        # If status is being changed to Active, create or update user
        if application.status == UserStatus.ACTIVE:
            try:
                # Try to get existing user
                user = User.objects.get(email=application.email)
                # Update existing user
                user.name = f"{application.name} {application.surname}"
                user.access = UserPermissions.USER
                user.status = UserStatus.ACTIVE
                user.is_active = True
                user.set_password(application.password)
                user.save()
            except User.DoesNotExist:
                # Create new user if doesn't exist
                user = User.objects.create(
                    name=f"{application.name} {application.surname}",
                    email=application.email,
                    access=UserPermissions.USER,
                    status=UserStatus.ACTIVE,
                    is_active=True,
                )
                user.set_password(application.password)
                user.save()

            # Send email notification
            data = {
                "name": application.name,
                "email": application.email,
                "timestamp": timezone.now().strftime("%d-%m-%Y | %H:%M"),
            }
            try:
                template_html = "emails/html/application_approved.html"
                template_txt = "emails/txt/application_approved.txt"
                send_email_function(None, user, data, template_html, template_txt)
            except Exception as e:
                print(f"Failed to send email: {str(e)}")

        return Response(serializer.data)


class CreateUser(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        # Check if user is admin
        if request.user.access != UserPermissions.ADMIN:
            return Response(
                {"message": "Only administrators can create users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Validate required fields
        required_fields = ["email", "password", "access"]
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"message": f"{field} is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Validate access level
        access = request.data.get("access")
        if access not in [choice[0] for choice in UserPermissions.choices]:
            return Response(
                {"message": "Invalid access level."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if email already exists
        if User.objects.filter(email=request.data["email"]).exists():
            return Response(
                {"message": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Set password
        user.set_password(request.data["password"])
        user.save()

        # Send welcome email
        data = {
            "name": user.name or user.email,
            "email": user.email,
            "access": user.access,
            "timestamp": timezone.now().strftime("%d-%m-%Y | %H:%M"),
        }
        try:
            template_html = "emails/html/user_created.html"
            template_txt = "emails/txt/user_created.txt"
            send_email_function(None, user, data, template_html, template_txt)
        except Exception as e:
            print(f"Failed to send email: {str(e)}")

        return Response(
            {
                "message": "User created successfully.",
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
