from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from contacts.models import Contact
from .serializers import ContactSerializer
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.

@api_view(['GET'])
def get_contacts(request):
    status_filter = request.query_params.get('status', '')
    contacts = Contact.objects.all()
    
    # Apply status filter if provided
    if status_filter:
        contacts = contacts.filter(serving_status=status_filter)
    
    serializer = ContactSerializer(contacts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def submit_contact_form(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        contact = serializer.save()
        
        # Send email notification
        subject = 'New Contact Form Submission'
        message = f"""
        New contact form submission:
        Name: {contact.first_name} {contact.last_name}
        Service: {contact.service}
        Email: {contact.email}
        Phone: {contact.phone_number or 'Not provided'}
        Description: {contact.description}
        """
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {e}")
            
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_status(request, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return Response({'error': 'Contact not found'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if new_status and new_status in dict(Contact.STATUS_CHOICES):
        contact.serving_status = new_status
        contact.save()
        serializer = ContactSerializer(contact)
        return Response(serializer.data)
    
    return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
