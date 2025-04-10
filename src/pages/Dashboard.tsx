import React from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/api';

const Dashboard = () => {
  const { data: todaysDemand } = useQuery({
    queryKey: ['todaysDemand'],
    queryFn: analyticsService.getTodaysDemand
  });

  const { data: todaysSales } = useQuery({
    queryKey: ['todaysSales'],
    queryFn: analyticsService.getTodaysSales
  });

  const { data: totalRevenue } = useQuery({
    queryKey: ['totalRevenue'],
    queryFn: analyticsService.getTotalRevenue
  });

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Today's Demand</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {todaysDemand?.data?.count || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Today's Sales</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {todaysSales?.data?.count || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ₹{totalRevenue?.data?.total?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;