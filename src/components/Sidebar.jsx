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
} from "lucide-react";

function Sidebar() {
	const location = useLocation();
	const navigate = useNavigate();
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);

	const menuItems = [
		{ path: "/", icon: LayoutDashboard, label: "Dashboard" },
		{ path: "/sellers", icon: Store, label: "Sellers" },
		{ path: "/pending-registrations", icon: Users, label: "Pending Registrations" },
		{ path: "/banners", icon: Image, label: "Banners" },
		{ path: "/support", icon: HeadphonesIcon, label: "Support" },
		{ path: "/seasons", icon: Sun, label: "Seasons" },
		{ path: "/category", icon: Cat, label: "Category" },
		{ path: "/customer", icon: User, label: "Customer" },
	];

	const handleLogoutClick = (e) => {
		e.preventDefault();
		setShowLogoutDialog(true);
	};

	const confirmLogout = () => {
		localStorage.clear();
		navigate("/login");
	};

	return (
		<div className="w-64 bg-white shadow-lg">
			<div className="p-4">
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
							className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
								isActive ? "bg-gray-100" : ""
							}`}
						>
							<Icon className="w-5 h-5 mr-3" />
							<span>{item.label}</span>
						</Link>
					);
				})}

				{/* Logout item */}
				<button
					onClick={handleLogoutClick}
					className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50"
				>
					<User className="w-5 h-5 mr-3" />
					<span>Log Out</span>
				</button>
			</nav>

			{/* Confirmation Dialog */}
			{showLogoutDialog && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center">
						<h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
						<p className="mb-6">Are you sure you want to log out?</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={confirmLogout}
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
							>
								Yes
							</button>
							<button
								onClick={() => setShowLogoutDialog(false)}
								className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Sidebar;
