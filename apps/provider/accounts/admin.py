from django.contrib import admin

from accounts.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'access', 'status', 'is_active')
    list_filter = ('access', 'status', 'is_active')
    search_fields = ('name', 'email')
    ordering = ('id',)

    class Meta:
        model = User


admin.site.register(User, UserAdmin)
