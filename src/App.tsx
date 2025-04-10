import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Sellers from './pages/Sellers';
import Support from './pages/Support';
import Banners from './pages/Banners';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/sellers" element={
              <PrivateRoute>
                <Sellers />
              </PrivateRoute>
            } />
            <Route path="/support" element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            } />
            <Route path="/banners" element={
              <PrivateRoute>
                <Banners />
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;