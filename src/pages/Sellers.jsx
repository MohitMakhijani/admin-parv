import React, { useState, useEffect } from "react";
import axios from "axios";
import { set } from "react-hook-form";

function Sellers() {
	const [sellers, setSellers] = useState([]);
	const [
		todaysSellerRegestration,
		setTodaysSellerRegestration,
	] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedCity, setSelectedCity] = useState("");

	useEffect(() => {
		fetchSellers();
		todaySellerRegestration();
	}, [currentPage, selectedCity]);

	const fetchSellers = async () => {
		try {
			const params = {
				page: currentPage,
				limit: 10,
			};

			if (selectedCity) {
				params.city = selectedCity;
			}

			const response = await axios.get(
				"/admin/nastrigo/seller/list",
				{ params }
			);
			setSellers(response.data.data.sellers);
			setTotalPages(response.data.data.totalPages);
		} catch (error) {
			console.error("Error fetching sellers:", error);
		}
	};
	const todaySellerRegestration = async () => {
		try {
			const response = await axios.get(
				"/admin/nastrigo/get-todays-seller-registrations"
			);
			console.log(response.data);
			setTodaysSellerRegestration(response.data.data);
		} catch (error) {
			console.error("Error fetching sellers:", error);
		}
	};

	const toggleSellerStatus = async (sellerId, isActive) => {
		try {
			const endpoint = isActive
				? `/admin/nastrigo/disable/${sellerId}`
				: `/admin/nastrigo/activate/${sellerId}`;

			await axios.post(endpoint);
			fetchSellers();
		} catch (error) {
			console.error("Error toggling seller status:", error);
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">
				Sellers Management
			</h1>
			<h1>Todays Seller Regestration</h1>
			<div>
				{todaysSellerRegestration.map((i) => (
					<div>
						<p>{i.count}</p>
						<p>{i.status}</p>
					</div>
				))}
			</div>
			{/* Search and Filter */}
			<div className="mb-6 flex gap-4">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Search sellers..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 rounded-lg border"
					/>
				</div>
				<button
					// onClick={handleSearch}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					Search
				</button>
				<select
					value={selectedCity}
					onChange={(e) => setSelectedCity(e.target.value)}
					className="px-4 py-2 rounded-lg border"
				>
					<option value="">All Cities</option>
					<option value="Jabalpur">Jabalpur</option>
					<option value="Bulandshahr">Bulandshahr</option>
					<option value="Katni">Katni</option>
				</select>
			</div>

			{/* Sellers List */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Shop
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								City
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Rating
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Revenue
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{sellers.map((seller) => (
							<tr key={seller._id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<img
											src={seller.avatar}
											alt={seller.fullName}
											className="h-10 w-10 rounded-full mr-3"
										/>
										<div>
											<div className="font-medium">
												{seller.fullName}
											</div>
											<div className="text-sm text-gray-500">
												{seller.brand || "No Brand"}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{seller.shopName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{seller.city}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{seller.ProductRating.toFixed(2)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									${seller.totalRevenue.toLocaleString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<button
										onClick={() =>
											toggleSellerStatus(
												seller._id,
												seller.isActive
											)
										}
										className={`px-3 py-1 rounded-full text-sm ${
											seller.isActive
												? "bg-red-100 text-red-800 hover:bg-red-200"
												: "bg-green-100 text-green-800 hover:bg-green-200"
										}`}
									>
										{seller.isActive
											? "Disable"
											: "Activate"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="mt-4 flex justify-center">
				<div className="flex gap-2">
					{Array.from(
						{ length: totalPages },
						(_, i) => i + 1
					).map((page) => (
						<button
							key={page}
							onClick={() => setCurrentPage(page)}
							className={`px-3 py-1 rounded ${
								currentPage === page
									? "bg-blue-600 text-white"
									: "bg-gray-100 hover:bg-gray-200"
							}`}
						>
							{page}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default Sellers;
