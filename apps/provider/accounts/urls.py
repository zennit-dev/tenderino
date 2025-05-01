from django.urls import path
from rest_framework import routers

from accounts.views import (
    ChangePassword,
    CreateApplication,
    CreateUser,
    CurrentUser,
    EditApplication,
    ListApplications,
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
    # Applications
    path("apply/", CreateApplication.as_view(), name="create-application"),
    path("applications/", ListApplications.as_view(), name="list-applications"),
    path("applications/<int:pk>/", EditApplication.as_view(), name="edit-application"),
    # Admin user management
    path("admin/create-user/", CreateUser.as_view(), name="admin-create-user"),
]
urlpatterns += router.urls
