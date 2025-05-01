from typing import Dict, List, Type

from django.http import HttpRequest
from rest_framework import permissions
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.views import APIView

from accounts.models import UserStatus


class PermissionPolicyMixin(APIView):
    permission_classes_per_method: Dict[str, List[Type[BasePermission]]]

    def check_permissions(self, request: HttpRequest) -> None:
        try:
            handler = getattr(self, request.method.lower()) if request.method else None
        except AttributeError:
            handler = None

        if (
            handler
            and self.permission_classes_per_method
            and self.permission_classes_per_method.get(handler.__name__)
        ):
            self.permission_classes = self.permission_classes_per_method.get(
                handler.__name__
            )

        super().check_permissions(request)


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        is_authenticated = IsAuthenticated()
        return bool(
            is_authenticated.has_permission(request, view) and request.user.is_superuser
        )


class IsRECEPTIONISTUser(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        is_authenticated = IsAuthenticated()
        return bool(
            is_authenticated.has_permission(request, view)
            and request.user.is_receptionist
        )


class CanManageUsers(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            IsAuthenticated().has_permission(request, view)
            and (
                IsSuperUser().has_permission(request, view) or request.user.is_superuser
            )
        )


class IsNotPendingUser(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user.status != UserStatus.PENDING)
