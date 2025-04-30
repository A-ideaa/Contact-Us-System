from django.db import models
from django.utils import timezone

class Contact(models.Model):
    STATUS_CHOICES = [
        ('initial', 'Initial'),
        ('in_contact', 'In Contact'),
        ('done', 'Done'),
        ('no_response', 'No Response'),
        ('ignore', 'Ignore'),
    ]

    SERVICE_CHOICES = [
        ('web_development', 'Web Development'),
        ('mobile_app', 'Mobile App Development'),
        ('ui_ux', 'UI/UX Design'),
        ('consulting', 'IT Consulting'),
        ('maintenance', 'Maintenance & Support'),
        ('other', 'Other'),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    service = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    other_service = models.CharField(max_length=100, blank=True, null=True, help_text="Please specify if you selected 'Other' as service")
    email = models.EmailField()
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField()
    serving_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='initial'
    )
    created_at = models.DateTimeField(default=timezone.now)

    def get_status_color(self):
        status_colors = {
            'initial': 'bg-gray-200',
            'in_contact': 'bg-blue-200',
            'done': 'bg-green-200',
            'no_response': 'bg-red-200',
            'ignore': 'bg-yellow-200'
        }
        return status_colors.get(self.serving_status, 'bg-gray-200')

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.service}"

    class Meta:
        ordering = ['-created_at']
