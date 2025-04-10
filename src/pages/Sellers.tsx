import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '../services/api';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface Seller {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  phoneNo: number;
  shopName: string;
  isBrandAssured: boolean;
  ProductRating: number;
  totalProductSales: number;
  totalRevenue: number;
  featuredScore: number;
  rank: number;
}

const Sellers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

  const { data: analytics } = useQuery({
    queryKey: ['sellerAnalytics'],
    queryFn: sellerService.getAnalytics
  });

  const { data: sellers } = useQuery({
    queryKey: ['sellers'],
    queryFn: () => sellerService.getAllSellers()
  });

  const { data: sellerSales } = useQuery({
    queryKey: ['sellerSales', selectedSeller],
    queryFn: () => selectedSeller ? sellerService.getSellerSales(selectedSeller) : null,
    enabled: !!selectedSeller
  });

  const { data: sellerProducts } = useQuery({
    queryKey: ['sellerProducts', selectedSeller],
    queryFn: () => selectedSeller ? sellerService.getSellerProducts(selectedSeller) : null,
    enabled: !!selectedSeller
  });

  const activateSellerMutation = useMutation({
    mutationFn: sellerService.activateSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  const disableSellerMutation = useMutation({
    mutationFn: sellerService.disableSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    }
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Total Sellers</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {analytics?.data?.totalSellers || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Active Sellers</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {analytics?.data?.activeSellersCount || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700">Pending Registrations</h2>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {analytics?.data?.PendingRegistrations || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers?.data?.sellers.map((seller: Seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={seller.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{seller.fullName}</div>
                        <div className="text-sm text-gray-500">{seller.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.shopName}</div>
                    {seller.isBrandAssured && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Brand Assured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.ProductRating.toFixed(1)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.totalProductSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{seller.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedSeller(seller._id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => activateSellerMutation.mutate(seller._id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => disableSellerMutation.mutate(seller._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedSeller && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Seller Details</h3>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Sales</h4>
                  <div className="space-y-2">
                    {sellerSales?.data?.salesData.map((sale: any) => (
                      <div key={sale._id} className="p-2 border rounded">
                        <p className="font-medium">{sale.productName}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {sale.totalQuantitySold} | Revenue: ₹{sale.totalRevenue}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {sellerProducts?.data?.products.map((product: any) => (
                      <div key={product._id} className="p-2 border rounded">
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{product.price} | Rating: {product.avgRating}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sellers;