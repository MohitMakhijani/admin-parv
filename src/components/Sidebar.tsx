import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HeadphonesIcon, 
  ImageIcon, 
  BellIcon,
  LogOut
} from 'lucide-react';
import { authService } from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/sellers', icon: Users, label: 'Sellers' },
    { path: '/support', icon: HeadphonesIcon, label: 'Support' },
    { path: '/banners', icon: ImageIcon, label: 'Banners' },
    { path: '/notifications', icon: BellIcon, label: 'Notifications' },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-3 text-red-600 hover:bg-gray-100 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;