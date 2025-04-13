import React, { useState, useEffect } from "react";
import axios from "axios";
import { set } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Sellers() {
	const [sellers, setSellers] = useState([]);
	const [disabledsellers, setDisabledSellers] = useState(
		[]
	);
	const [
		todaysSellerRegestration,
		setTodaysSellerRegestration,
	] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedCity, setSelectedCity] = useState("");
	const [sort, setSort] = useState("");
	const [order, setOrder] = useState("asc");
	const navigate = useNavigate();
	useEffect(() => {
		fetchSellers();
		todaySellerRegestration();
		fetchDisabledSellers();
	}, [currentPage, selectedCity, sort, order]);

	const fetchSellers = async () => {
		try {
			const params = {
				page: currentPage,
				limit: 10,
			};

			if (selectedCity) {
				params.city = selectedCity;
			}
			if (order || sort) {
				params.orderBy = order;
				params.sort = sort;
			}
			console.log("order=", order);
			console.log("sort=", sort);

			const response = await axios.get(
				`/admin/nastrigo/seller/list?search=${searchTerm}&order=${order}&sortBy=${sort}`,
				{ params }
			);
			console.log("seller list=", response.data.data);
			setSellers(response.data.data.sellers);
			setTotalPages(response.data.data.totalPages);
		} catch (error) {
			console.error("Error fetching sellers:", error);
		}
	};
	const fetchDisabledSellers = async () => {
		try {
			const response = await axios.get(
				"/admin/nastrigo/get-disabled-sellers"
			);
			console.log(
				" disabled seller list=",
				response.data.data
			);
			setDisabledSellers(response.data.data);
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

	const toggleSellerStatus = async (sellerId) => {
		try {
			const endpoint = `/admin/nastrigo/disable/${sellerId}`;

			await axios.put(endpoint);
			fetchSellers();
		} catch (error) {
			console.error(
				"Error Disabling seller status:",
				error
			);
		}
	};
	const toggleActiveSellerStatus = async (sellerId) => {
		try {
			const endpoint = `/admin/nastrigo/activate/${sellerId}`;

			await axios.put(endpoint);
			fetchSellers();
		} catch (error) {
			console.error(
				"Error activating seller status:",
				error
			);
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">
				Sellers Management
			</h1>
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
					onClick={fetchSellers}
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
				<select
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					className="px-4 py-2 rounded-lg border"
				>
					<option value="">Rank</option>
					<option value="reportCount">Report</option>
				</select>
				<select
					value={order}
					onChange={(e) => setOrder(e.target.value)}
					className="px-4 py-2 rounded-lg border"
				>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</div>

			{/* Sellers List */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full">
					<thead>
						<tr className="bg-gray-50">
							{[
								"rank",
								"Name",
								"Shop",
								"City",
								"Rating",
								"Revenue",
								"Actions",
								"products (click to view)",
								"sales (click to view)",
								"report count",
							].map((heading) => (
								<th
									key={heading}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									{heading}
								</th>
							))}
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-200">
						{sellers.map((seller) => (
							<tr
								key={seller._id}
								className="hover:bg-gray-100 transition cursor-pointer"
								// use navigate instead of wrapping <Link> around <tr>
							>
								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{seller.rank}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<img
											src={seller.avatar}
											alt={seller.fullName}
											className="h-10 w-10 rounded-full mr-3 object-cover"
										/>
										<div>
											<div className="font-medium text-gray-900">
												{seller.fullName}
											</div>
											<div className="text-sm text-gray-500">
												{seller.brand || "No Brand"}
											</div>
										</div>
									</div>
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{seller.shopName}
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{seller.city}
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									{seller.ProductRating?.toFixed(2)}
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-gray-700">
									₹{seller.totalRevenue.toLocaleString()}
								</td>

								<td className="px-6 py-4 whitespace-nowrap">
									<button
										onClick={(e) => {
											e.stopPropagation(); // prevent row click
											toggleSellerStatus(seller._id);
										}}
										className={`px-3 py-1 rounded-full text-sm font-semibold ${
											seller.isActive
												? "bg-green-100 text-green-800 hover:bg-green-200"
												: "bg-red-100 text-red-800 hover:bg-red-200"
										} transition`}
									>
										{seller.isActive ? "Active" : "Disable"}
									</button>
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-blue-700"
									onClick={() =>
										navigate(`/products/${seller._id}`)
									}
								>
									{seller.totalListedProducts}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-blue-700"
									onClick={() =>
										navigate(`/seller/${seller._id}`)
									}
								>
									{seller.totalProductSales}
								</td>
								<td
									className="px-6 py-4 whitespace-nowrap text-blue-700"
									onClick={() =>
										navigate(`/report/${seller._id}`)
									}
								>
									{seller.reportCount}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Disabled Seller List */}
			<h1>Disabled Sellers List</h1>
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Name
							</th>

							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{disabledsellers.map((seller) => (
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
										</div>
									</div>
								</td>

								<td className="px-6 py-4 whitespace-nowrap">
									<button
										onClick={() =>
											toggleActiveSellerStatus(seller._id)
										}
										className={`px-3 py-1 rounded-full text-sm
										text-green-800 hover:bg-green-200"
										`}
									>
										Activate
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
