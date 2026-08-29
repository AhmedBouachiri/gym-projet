from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'role', 'status', 'hire_date', 'created_at')
    list_filter = ('role', 'status', 'created_at', 'hire_date')
    search_fields = ('full_name', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('full_name', 'email', 'phone', 'user')
        }),
        ('Poste', {
            'fields': ('role', 'status', 'hire_date', 'salary')
        }),
        ('Détails supplémentaires', {
            'fields': ('address', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
