import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useMutation } from '@tanstack/react-query';
import { notificationService } from '../services/api';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const notifySellersMutation = useMutation({
    mutationFn: notificationService.notifySellers
  });

  const notifyCustomersMutation = useMutation({
    mutationFn: notificationService.notifyCustomers
  });

  const handleSubmit = (type: 'sellers' | 'customers') => {
    const mutation = type === 'sellers' ? notifySellersMutation : notifyCustomersMutation;
    mutation.mutate({ title, body });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Send Notifications</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit('sellers')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Notify All Sellers
              </button>
              <button
                onClick={() => handleSubmit('customers')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Notify All Customers
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;