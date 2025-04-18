import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image,
  HeadphonesIcon,
  Store,
  Sun,
  Cat,
  User,
  Menu,
  X,
  LogOut
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false); // close the dialog first
    localStorage.clear();
    setTimeout(() => {
      navigate("/login");
    }, 100); // short delay to allow React to update state
  };
  
  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/sellers", icon: Store, label: "Sellers" },
    { path: "/pending-registrations", icon: Users, label: "Pending Registrations" },
    { path: "/banners", icon: Image, label: "Banners" },
    { path: "/support", icon: HeadphonesIcon, label: "Support" },
    { path: "/seasons", icon: Sun, label: "Seasons" },
    { path: "/category", icon: Cat, label: "Category" },
    { path: "/customer", icon: User, label: "Customer" }
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md">
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {/* <span className="text-sm font-medium text-gray-700"></span> */}
      </div>

      {/* Sidebar */}
      <div className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}>
        <div className="p-4 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowSidebar(false)} // close sidebar on mobile click
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                  isActive ? "bg-gray-100" : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center px-4 py-3 text-red-600 hover:bg-gray-100 w-full"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
