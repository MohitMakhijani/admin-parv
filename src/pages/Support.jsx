import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Support() {
  const [queries, setQueries] = useState([]);
  const [userType, setUserType] = useState('Customer');

  useEffect(() => {
    fetchQueries();
  }, [userType]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`/admin/nastrigo/SupportQuery?userType=${userType}`);
      setQueries(response.data.data);
    } catch (error) {
      console.error('Error fetching support queries:', error);
    }
  };

  const sendNotification = async (type) => {
    const title = prompt('Enter notification title:');
    const body = prompt('Enter notification body:');
    
    if (!title || !body) return;

    try {
      const endpoint = type === 'Customer' 
        ? '/admin/nastrigo/notify-all-customers'
        : '/admin/nastrigo/notify-all-sellers';

      await axios.post(endpoint, { title, body });
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Support Queries</h1>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Customer">Customer Queries</option>
            <option value="Seller">Seller Queries</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => sendNotification(userType)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send Notification to All {userType}s
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {queries.map((query) => (
            <div key={query._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">From: {query.senderType}</p>
                  <p className="text-sm text-gray-600">ID: {query.senderId}</p>
                  <p className="mt-2">{query.message}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(query.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Support;