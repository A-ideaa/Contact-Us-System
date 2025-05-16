from django import forms
from .models import Contact

class ContactForm(forms.ModelForm):
    country_code = forms.CharField(required=False, widget=forms.Select(attrs={
        'class': 'form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
    }))
    
    full_phone_number = forms.CharField(required=False, widget=forms.HiddenInput())
    
    class Meta:
        model = Contact
        fields = ['first_name', 'last_name', 'service', 'other_service', 'email', 'phone_number', 'description']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'placeholder': 'Enter your first name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'placeholder': 'Enter your last name'
            }),
            'service': forms.Select(attrs={
                'class': 'form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'onchange': 'toggleOtherService(this.value)'
            }),
            'other_service': forms.TextInput(attrs={
                'class': 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'placeholder': 'Please specify your service',
                'style': 'display: none;'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'placeholder': 'your.email@example.com'
            }),
            'phone_number': forms.TextInput(attrs={
                'class': 'form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'placeholder': 'Phone number',
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                'rows': 4,
                'placeholder': 'Please describe what you need...'
            }),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        full_phone_number = cleaned_data.get('full_phone_number')
        
        # If full_phone_number is provided, use it instead of phone_number
        if full_phone_number:
            cleaned_data['phone_number'] = full_phone_number
            
        return cleaned_data 