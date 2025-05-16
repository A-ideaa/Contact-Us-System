import React, { useState } from 'react';
import { contactsAPI } from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    service: '',
    other_service: '',
    description: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const serviceOptions = [
    { value: '', label: 'Select a service' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'mobile_app', label: 'Mobile App Development' },
    { value: 'ui_ux', label: 'UI/UX Design' },
    { value: 'consulting', label: 'IT Consulting' },
    { value: 'maintenance', label: 'Maintenance & Support' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.service) {
      errors.service = 'Please select a service';
    }
    
    if (formData.service === 'other' && !formData.other_service.trim()) {
      errors.other_service = 'Please specify the service';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      await contactsAPI.submitContactForm(formData);
      setSubmitSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        service: '',
        other_service: '',
        description: ''
      });
    } catch (error) {
      setSubmitError('Failed to submit your request. Please try again later.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-dark-light shadow-md rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h2>
        
        {submitSuccess && (
          <div className="mb-6 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4">
            <p>Your message has been sent successfully! We'll get back to you soon.</p>
          </div>
        )}
        
        {submitError && (
          <div className="mb-6 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4">
            <p>{submitError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`block w-full shadow-sm rounded-md px-3 py-2 border ${
                  formErrors.first_name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                } bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100`}
              />
              {formErrors.first_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.first_name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`block w-full shadow-sm rounded-md px-3 py-2 border ${
                  formErrors.last_name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                } bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100`}
              />
              {formErrors.last_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.last_name}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full shadow-sm rounded-md px-3 py-2 border ${
                formErrors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
              } bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full shadow-sm rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`block w-full shadow-sm rounded-md px-3 py-2 border ${
                formErrors.service
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
              } bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100`}
            >
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.service && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.service}</p>
            )}
          </div>
          
          {formData.service === 'other' && (
            <div>
              <label htmlFor="other_service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Please Specify Service *
              </label>
              <input
                type="text"
                id="other_service"
                name="other_service"
                value={formData.other_service}
                onChange={handleChange}
                className={`block w-full shadow-sm rounded-md px-3 py-2 border ${
                  formErrors.other_service
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                } bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100`}
              />
              {formErrors.other_service && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.other_service}</p>
              )}
            </div>
          )}
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`block w-full shadow-sm rounded-md px-3 py-2 border ${
                formErrors.description
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
              } bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100`}
            ></textarea>
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.description}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm; 