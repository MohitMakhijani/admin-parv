import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sellers from './pages/Sellers';
import PendingRegistrations from './pages/PendingRegistrations';
import Banners from './pages/Banners';
import Support from './pages/Support';
import Sidebar from './components/Sidebar';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000//api/v1';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sellers" element={<Sellers />} />
            <Route path="/pending-registrations" element={<PendingRegistrations />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;