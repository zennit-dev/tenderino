import os
from typing import Any

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils.translation import gettext_lazy as _

from provider import settings, validators
from provider.settings import MEDIA_ROOT


def user_dir_path(instance, filename: str) -> str:
    if not settings.DEBUG and not filename.startswith(f"api.{settings.ACME_DOMAIN}"):
        return filename

    os.makedirs(os.path.join(MEDIA_ROOT, "avatar"), exist_ok=True)
    return os.path.join(f"avatar_{instance}", filename)


class UserPermissions(models.TextChoices):
    USER = "User", _("User")
    STAFF = "Staff", _("Staff")
    ADMIN = "Admin", _("Admin")


class UserStatus(models.TextChoices):
    ACTIVE = "Active", _("Active")
    PENDING = "Pending", _("Pending")
    SUSPENDED = "Suspended", _("Suspended")


class UserManager(BaseUserManager):
    def create_superuser(
        self,
        email: str,
        password: str,
        access: str = UserPermissions.ADMIN,
    ) -> "User":
        return self.create_user(
            email,
            password=password,
            is_superuser=True,
            is_staff=True,
            access=access,
        )

    def create_user(
        self,
        email: str,
        password: str,
        is_superuser: bool = False,
        is_staff: bool = False,
        access: str = UserPermissions.USER,
        status: str = UserStatus.ACTIVE,
        is_active: bool = True,
    ) -> "User":
        user: "User" = self.model(
            email=self.normalize_email(email),
            is_superuser=is_superuser,
            is_staff=is_staff,
            access=access,
            status=status,
            is_active=is_active,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=50, null=True, blank=True)
    access = models.CharField(
        max_length=12,
        choices=UserPermissions.choices,
        default=UserPermissions.USER,
    )
    status = models.CharField(
        max_length=9, choices=UserStatus.choices, default=UserStatus.PENDING
    )
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    temp_login_id = models.CharField(max_length=255, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["password"]

    def __str__(self) -> str:
        return f"{self.id} - {self.username} - {self.email}"
