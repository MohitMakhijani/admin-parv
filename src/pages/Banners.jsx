import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Banners() {
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    targetAudience: 'Customer',
    image: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/admin/nastrigo/GetBanner');
      setBanners(response.data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('targetAudience', newBanner.targetAudience);
      formData.append('image', newBanner.image);

      await axios.post('/admin/nastrigo/CreateBanner', formData);
      fetchBanners();
      setNewBanner({ targetAudience: 'Customer', image: '' });
    } catch (error) {
      console.error('Error creating banner:', error);
    }
  };

  const toggleBannerStatus = async (bannerId, currentStatus) => {
    try {
      await axios.patch(`/admin/nastrigo/UpdateBanner/${bannerId}`, {
        active: !currentStatus
      });
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Banners</h1>

      {/* Create Banner Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <select
              value={newBanner.targetAudience}
              onChange={(e) => setNewBanner({ ...newBanner, targetAudience: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="Customer">Customer</option>
              <option value="Seller">Seller</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Image</label>
            <input
              type="file"
              onChange={(e) => setNewBanner({ ...newBanner, image: e.target.files[0] })}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Banner
          </button>
        </form>
      </div>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={banner.imageUrl} alt="Banner" className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-sm text-gray-600">Target: {banner.targetAudience}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded ${banner.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => toggleBannerStatus(banner._id, banner.active)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banners;