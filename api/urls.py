from django.urls import path
from . import views

urlpatterns = [
    path('contacts/', views.get_contacts, name='api_get_contacts'),
    path('contacts/submit/', views.submit_contact_form, name='api_submit_contact'),
    path('contacts/update_status/<int:contact_id>/', views.update_status, name='api_update_status'),
] 