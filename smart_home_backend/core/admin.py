from django.contrib import admin
from .models import User, Appliance, ApplianceStatus, AuditLog
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

# Extend the built-in user admin
@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    fieldsets = DefaultUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )


@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'connection', 'user')


@admin.register(ApplianceStatus)
class ApplianceStatusAdmin(admin.ModelAdmin):
    list_display = ('appliance', 'status', 'energy_usage', 'updated_at')


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'appliance', 'action', 'scheduled_at')
