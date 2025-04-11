import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sellers from "./pages/Sellers";
import PendingRegistrations from "./pages/PendingRegistrations";
import Banners from "./pages/Banners";
import Support from "./pages/Support";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import LoggedInRoutes from "./components/LoggedInRoutes";
import Login from "./pages/Login";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:8000/api/v1";
axios.interceptors.request.use((config) => {
	console.log(localStorage.getItem("token"));

	const token = localStorage.getItem("token");
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
						<Route path="/login" element={<Login />} />
						<Route
							path="/"
							element={
								<LoggedInRoutes>
									<Dashboard />
								</LoggedInRoutes>
							}
						/>
						<Route
							path="/sellers"
							element={
								<LoggedInRoutes>
									<Sellers />
								</LoggedInRoutes>
							}
						/>
						<Route
							path="/pending-registrations"
							element={
								<LoggedInRoutes>
									<PendingRegistrations />
								</LoggedInRoutes>
							}
						/>
						<Route
							path="/banners"
							element={
								<LoggedInRoutes>
									<Banners />
								</LoggedInRoutes>
							}
						/>
						<Route
							path="/support"
							element={
								<LoggedInRoutes>
									<Support />
								</LoggedInRoutes>
							}
						/>
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
