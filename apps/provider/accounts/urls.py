from django.urls import path
from rest_framework import routers

from accounts.views import (
    ChangePassword,
    CurrentUser,
    RequestResetPassword,
    ResetPassword,
    SignIn,
    SignOut,
    SignUp,
    UserViewSet,
    get_total_users,
)

router = routers.SimpleRouter()

router.register(r"users", UserViewSet, basename="users")

urlpatterns = [
    path("current-user/", CurrentUser.as_view(), name="current-user"),
    # Authentication
    path("sign-in/", SignIn.as_view(), name="sign-in"),
    path("sign-out/", SignOut.as_view(), name="sign-out"),
    path("sign-up/", SignUp.as_view(), name="sign-up"),
    # Email verification and password reset
    path("change-password/", ChangePassword.as_view(), name="change-password"),
    path(
        "reset-password/<str:temp_login_id>/",
        ResetPassword.as_view(),
        name="reset-password",
    ),
    path(
        "request-reset-password/",
        RequestResetPassword.as_view(),
        name="request-reset-password",
    ),
    # Total users
    path("total-users/", get_total_users, name="total-users"),
]

urlpatterns += router.urls
