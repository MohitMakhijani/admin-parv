import React from 'react';
import Layout from '../components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '../services/api';

const Banners = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['banners'],
    queryFn: bannerService.getAll,
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ bannerId, active }: { bannerId: string; active: boolean }) =>
      bannerService.update(bannerId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    }
  });

  const banners = data?.data ?? []; // 🟢 Ensure it's always an array

  if (isLoading) return <Layout><p>Loading...</p></Layout>;
  if (isError) return <Layout><p>Error loading banners</p></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner: any) => (
            <div key={banner._id} className="bg-white rounded-lg shadow p-6">
              <img
                src={banner.imageUrl}
                alt="Banner"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Target: {banner.targetAudience}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(banner.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => updateBannerMutation.mutate({
                    bannerId: banner._id,
                    active: !banner.active
                  })}
                  className={`px-4 py-2 rounded ${
                    banner.active ? 'bg-red-600' : 'bg-green-600'
                  } text-white`}
                >
                  {banner.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Banners;
