from django.contrib import admin
from django.utils.html import format_html

from accounts.models import User, UserApplication


class UserApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "business_name",
        "name",
        "surname",
        "email",
        "nipt",
        "phone_number",
        "status",
        "created_at",
        "approve_button",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "business_name",
        "name",
        "surname",
        "email",
        "nipt",
        "phone_number",
    )
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
    actions = ["approve_applications"]

    def approve_applications(self, request, queryset):
        for application in queryset:
            if application.status != "Active":
                application.status = "Active"
                application.save()

    approve_applications.short_description = "Approve selected applications"

    def approve_button(self, obj):
        if obj.status != "Active":
            return format_html(
                '<a class="button" href="{}">Approve</a>',
                f"/admin/accounts/userapplication/{obj.id}/change/",
            )
        return "Approved"

    approve_button.short_description = "Approve"


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "access", "status", "is_active")
    list_filter = ("access", "status", "is_active")
    search_fields = ("name", "email")
    ordering = ("id",)

    class Meta:
        model = User


admin.site.register(User, UserAdmin)
admin.site.register(UserApplication, UserApplicationAdmin)
