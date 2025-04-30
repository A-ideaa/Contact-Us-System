from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'service', 'email', 'serving_status', 'created_at')
    list_filter = ('serving_status', 'service')
    search_fields = ('first_name', 'last_name', 'email', 'service')
    ordering = ('-created_at',)
