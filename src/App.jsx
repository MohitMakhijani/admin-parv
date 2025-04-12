import React, { useEffect } from "react";
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
import SellerDetail from "./pages/SellerDetail";
import ProductList from "./pages/ProductList";
import SeasonsComponent from "./pages/Seasons";
import Category from "./pages/Category";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:8000/api/v1";
axios.interceptors.request.use((config) => {
	// console.log(localStorage.getItem("token"));

	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

function App() {
	const refreshAccessToken = async () => {
		try {
			const res = await axios.post(
				`admin/nastrigo/refresh-token`
			);
			if (res) {
				localStorage.setItem(
					"token",
					res.data.data.accessToken
				);
				console.log("access token refreshed successfully");
			}
		} catch (error) {
			console.log(
				"error in refreshing access token",
				error
			);
		}
	};
	useEffect(() => {
		if (localStorage.getItem("refreshToken")) {
			refreshAccessToken();
		}
	}, []);

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
							path="/seller/:id"
							element={
								<LoggedInRoutes>
									<SellerDetail />
								</LoggedInRoutes>
							}
						/>
						<Route
							path="/products/:id"
							element={
								<LoggedInRoutes>
									<ProductList />
								</LoggedInRoutes>
							}
						/>
						<Route
							path="/seasons"
							element={
								<LoggedInRoutes>
									<SeasonsComponent />
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
							path="/category"
							element={
								<LoggedInRoutes>
									<Category />
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
