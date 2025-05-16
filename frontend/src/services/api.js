import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods for contacts
export const contactsAPI = {
  // Get all contacts
  getContacts: async (statusFilter = '') => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/contacts/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Submit a new contact form
  submitContactForm: async (formData) => {
    try {
      const response = await api.post('/contacts/submit/', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  // Update contact status
  updateStatus: async (contactId, status) => {
    try {
      const response = await api.post(`/contacts/update_status/${contactId}/`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },
};

export default api; 