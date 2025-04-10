import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supportService } from '../services/api';

const Support = () => {
  const [userType, setUserType] = useState<'Customer' | 'Seller' | undefined>();

  const { data: queries } = useQuery({
    queryKey: ['supportQueries', userType],
    queryFn: () => supportService.getQueries(userType)
  });

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Support Queries</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setUserType(undefined)}
            className={`px-4 py-2 rounded ${!userType ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setUserType('Customer')}
            className={`px-4 py-2 rounded ${userType === 'Customer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Customers
          </button>
          <button
            onClick={() => setUserType('Seller')}
            className={`px-4 py-2 rounded ${userType === 'Seller' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Sellers
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          {queries?.data?.map((query: any) => (
            <div key={query._id} className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{query.senderType}</p>
                  <p className="mt-1">{query.message}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(query.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Support;