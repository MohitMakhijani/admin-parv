import React, { useState, useEffect } from "react";
import axios from "axios";
import { set } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Customer() {
	const [customer, setcustomer] = useState([]);
	const [disabledcustomer, setDisabledcustomer] = useState(
		[]
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const navigate = useNavigate();
	useEffect(() => {
		fetchcustomer();
		fetchDisabledcustomer();
	}, [currentPage]);

	const fetchcustomer = async () => {
		try {
			const params = {
				page: currentPage,
				limit: 10,
			};

			const response = await axios.get(
				`admin/nastrigo/get-customer-list?search=${searchTerm}`,
				{ params }
			);
			console.log("customer list=", response.data.data);
			setcustomer(response.data.data.customers);
			setTotalPages(response.data.data.totalPages);
		} catch (error) {
			console.error("Error fetching customer:", error);
		}
	};
	const fetchDisabledcustomer = async () => {
		try {
			const response = await axios.get(
				"/admin/nastrigo/get-ban-customers"
			);
			console.log(
				" disabled seller list=",
				response.data.data
			);
			setDisabledcustomer(response.data.data);
		} catch (error) {
			console.error("Error fetching customer:", error);
		}
	};

	const togglecustomertatus = async (sellerId) => {
		try {
			const endpoint = `/admin/nastrigo/ban-customer/${sellerId}`;

			await axios.put(endpoint);
			fetchcustomer();
		} catch (error) {
			console.error(
				"Error Disabling seller status:",
				error
			);
		}
	};
	const toggleActivecustomertatus = async (sellerId) => {
		try {
			const endpoint = `/admin/nastrigo/activate-customer/${sellerId}`;

			await axios.put(endpoint);
			fetchcustomer();
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
				customer Management
			</h1>
			{/* Search and Filter */}
			<div className="mb-6 flex gap-4">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Search customer..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 rounded-lg border"
					/>
				</div>
				<button
					onClick={fetchcustomer}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					Search
				</button>
			</div>

			{/* customer List */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<table className="min-w-full">
					<thead>
						<tr className="bg-gray-50">
							{[
								"Avatar",
								"Name",
								"Email",
								"Total Exchanged Items",
								"Total pending Booking",
								"Total Purchased Items",
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
						{customer.map((seller) => (
							<tr
								key={seller._id}
								className="hover:bg-gray-100 transition cursor-pointer"
								// use navigate instead of wrapping <Link> around <tr>
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<img
											src={seller.avatar}
											alt={seller.fullName}
											className="h-10 w-10 rounded-full mr-3 object-cover"
										/>
										<div></div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="font-medium text-gray-900">
											{seller.fullName}
										</div>
										<div></div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="font-medium text-gray-900">
											{seller.email}
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="font-medium text-gray-900">
											{seller.totalExchangedBookings}
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="font-medium text-gray-900">
											{seller.totalPendingBookings}
										</div>
									</div>
								</td>

								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="font-medium text-gray-900">
											{seller.totalPurchasedItems}
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<button
										onClick={(e) => {
											e.stopPropagation(); // prevent row click
											togglecustomertatus(seller._id);
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
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Disabled Seller List */}
			<h1>Disabled customer List</h1>
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
						{disabledcustomer.map((seller) => (
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
											toggleActivecustomertatus(seller._id)
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

export default Customer;
