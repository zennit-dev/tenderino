from django.contrib import admin
from django.utils.html import format_html

from accounts.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "access")


admin.site.register(User, UserAdmin)
