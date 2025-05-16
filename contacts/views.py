from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .forms import ContactForm

def index(request):
    status_filter = request.GET.get('status', '')  # Get status from query parameters
    contacts = Contact.objects.all()
    
    # Apply status filter if provided
    if status_filter:
        contacts = contacts.filter(serving_status=status_filter)
    
    # Get all possible status choices for the filter dropdown
    status_choices = Contact.STATUS_CHOICES
    
    context = {
        'contacts': contacts,
        'status_choices': status_choices,
        'current_status': status_filter
    }
    return render(request, 'contacts/index.html', context)

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Form processing is handled in the form's clean method
            contact = form.save()
            
            # Send email notification
            subject = 'New Contact Form Submission'
            message = f"""
            New contact form submission:
            Name: {contact.first_name} {contact.last_name}
            Service: {contact.service}
            Email: {contact.email}
            Phone: {contact.phone_number}
            Description: {contact.description}
            """
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            
            messages.success(request, 'Your message has been sent successfully!')
            return redirect('index')
    else:
        form = ContactForm()
    
    return render(request, 'contacts/contact.html', {'form': form})

def update_status(request, contact_id):
    if request.method == 'POST':
        contact = Contact.objects.get(id=contact_id)
        new_status = request.POST.get('status')
        if new_status in dict(Contact.STATUS_CHOICES):
            contact.serving_status = new_status
            contact.save()
    return redirect('index')
