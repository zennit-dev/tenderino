from django.contrib import admin

from accounts.models import User, UserApplication


class UserApplicationAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'name', 'surname', 'nipt', 'phone_number', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('business_name', 'name', 'surname', 'nipt', 'phone_number')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'access', 'status', 'is_active')
    list_filter = ('access', 'status', 'is_active')
    search_fields = ('name', 'email')
    ordering = ('id',)

    class Meta:
        model = User


admin.site.register(User, UserAdmin)
admin.site.register(UserApplication, UserApplicationAdmin)
