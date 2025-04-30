from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('contact/', views.contact, name='contact'),
    path('update_status/<int:contact_id>/', views.update_status, name='update_status'),
] 