import React, { useEffect, useState } from 'react';
import { contactsAPI } from '../services/api';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
  
  const statusChoices = [
    { value: '', label: 'All' },
    { value: 'initial', label: 'Initial' },
    { value: 'in_contact', label: 'In Contact' },
    { value: 'done', label: 'Done' },
    { value: 'no_response', label: 'No Response' },
    { value: 'ignore', label: 'Ignore' },
  ];
  
  const statusColors = {
    initial: 'bg-gray-200 text-gray-800',
    in_contact: 'bg-blue-200 text-blue-800',
    done: 'bg-green-200 text-green-800',
    no_response: 'bg-red-200 text-red-800',
    ignore: 'bg-yellow-200 text-yellow-800',
  };

  useEffect(() => {
    fetchContacts();
  }, [currentStatus]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsAPI.getContacts(currentStatus);
      setContacts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contacts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await contactsAPI.updateStatus(contactId, newStatus);
      // Update the contact's status in the local state
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, serving_status: newStatus }
          : contact
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 my-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={currentStatus}
          onChange={handleStatusChange}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
        >
          {statusChoices.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white dark:bg-dark-light shadow overflow-hidden rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No contacts found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-light shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.map((contact) => (
              <li key={contact.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[contact.serving_status]
                          }`}
                        >
                          {statusChoices.find(s => s.value === contact.serving_status)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <select
                      value={contact.serving_status}
                      onChange={(e) => handleStatusUpdate(contact.id, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-dark-lighter text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      {statusChoices.filter(s => s.value !== '').map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>Email: {contact.email}</p>
                    {contact.phone_number && <p>Phone: {contact.phone_number}</p>}
                    <p>Service: {contact.service}</p>
                    <p className="mt-1">Description: {contact.description}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>Created: {new Date(contact.created_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContactList; 