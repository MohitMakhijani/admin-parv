import axios from 'axios';

const BASE_URL = 'https://api.mytrands.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sellerService = {
  getPendingRegistrations: () => api.get('/admin/nastrigo/pending-registration'),
  approveSeller: (sellerId: string, data: { isBrandAssured: boolean; isRegistrationDone: boolean }) =>
    api.post(`/admin/nastrigo/approve-registration/${sellerId}`, data),
  rejectSeller: (sellerId: string, data: { rejectionReason: string }) =>
    api.post(`/admin/nastrigo/reject-registration/${sellerId}`, data),
  getAnalytics: () => api.get('/admin/nastrigo/sellers-analytics'),
  getAllSellers: (params?: { city?: string; sortBy?: string; order?: 'asc' | 'desc'; page?: number; limit?: number }) =>
    api.get('/admin/nastrigo/seller/list', { params }),
  searchSellers: (query: string) => api.get(`/seller/search?seller=${query}`),
  activateSeller: (sellerId: string) => api.post(`/admin/nastrigo/activate/${sellerId}`),
  disableSeller: (sellerId: string) => api.post(`/admin/nastrigo/disable/${sellerId}`),
  getDisabledSellers: () => api.get('/admin/nastrigo/get-disabled-sellers'),
  getSellerSales: (sellerId: string) => api.get(`/admin/nastrigo/seller/sales/${sellerId}`),
  getSellerProducts: (sellerId: string) => api.get(`/admin/nastrigo/seller/products/${sellerId}`)
};

export const supportService = {
  getQueries: (userType?: 'Customer' | 'Seller') =>
    api.get(`/admin/nastrigo/SupportQuery${userType ? `?userType=${userType}` : ''}`),
};

export const bannerService = {
  create: (data: { targetAudience: 'Customer' | 'Seller'; image: string }) =>
    api.post('/admin/nastrigo/CreateBanner', data),
  getAll: () => api.get('/admin/nastrigo/GetBanner'),
  update: (bannerId: string, active: boolean) =>
    api.patch(`/admin/nastrigo/UpdateBanner/${bannerId}`, { active }),
};

export const notificationService = {
  notifySellers: (data: { title: string; body: string }) =>
    api.post('/admin/nastrigo/notify-all-sellers', data),
  notifyCustomers: (data: { title: string; body: string }) =>
    api.post('/admin/nastrigo/notify-all-customers', data),
};

export const analyticsService = {
  getTodaysDemand: () => api.get('/admin/nastrigo/get-todays-demand-count'),
  getLast7DaysDemand: () => api.get('/admin/nastrigo/get-last-7-days-demand-analysis'),
  getTodaysProducts: () => api.get('/admin/nastrigo/get-todays-product-count'),
  getMonthlyProducts: (month: number) =>
    api.get(`/admin/nastrigo/get-monthly-product-analysis?month=${month}`),
  getTotalProducts: () => api.get('/admin/nastrigo/get-total-product-count'),
  getTodaysSellers: () => api.get('/admin/nastrigo/get-todays-seller-registrations'),
  getTodaysSales: () => api.get('/admin/nastrigo/get-todays-sales-count'),
  getLast7DaysSales: () => api.get('/admin/nastrigo/get-last-7-days-sales-analysis'),
  getTodaysCustomers: () => api.get('/admin/nastrigo/get-todays-customer-registrations'),
  getCustomerAnalysis: (params: { month?: number; year?: number }) =>
    api.get('/admin/nastrigo/get-customer-registration-analysis', { params }),
  getSellerAnalysis: (params: { month?: number; year?: number }) =>
    api.get('/admin/nastrigo/get-seller-registration-analysis', { params }),
  getSalesAnalysis: (params: { month?: number; year?: number }) =>
    api.get('/admin/nastrigo/get-sales-complete-analysis', { params }),
  getTotalSalesStatus: () => api.get('/admin/nastrigo/get-total-sales-status'),
  getTotalRevenue: () => api.get('/admin/nastrigo/get-total-revenue'),
};

export default api;