import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SellerDetail() {
	const [seller, setseller] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const limit = 9;
	const { id } = useParams();

	const fetchuserDetails = async (page = 1) => {
		try {
			setLoading(true);
			const response = await axios.get(
				`/admin/nastrigo/seller/sales/${id}?page=${page}&limit=${limit}`
			);
			console.log("seller list=", response.data.data);
			setseller(response.data.data.salesData);
			setTotalPages(response.data.data.totalPages || 1);
			setCurrentPage(response.data.data.currentPage || 1);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchuserDetails(currentPage);
	}, [currentPage]);

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	return (
		<div className="min-h-screen p-4 bg-gray-50">
			<h1 className="text-2xl font-bold mb-6 text-center">
				Seller Sales (Last 30 Days)
			</h1>

			{loading ? (
				<div className="text-center text-gray-600">
					Loading...
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{seller?.length > 0 ? (
							seller.map((s, index) => (
								<div
									key={index}
									className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center"
								>
									<img
										src={s.productImage[0]}
										alt={s.productName}
										className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-gray-200"
									/>
									<h2 className="text-lg font-semibold mb-2">
										{s.productName}
									</h2>
									<p className="text-gray-600 mb-1">
										Customer: {s.customerName}
									</p>
									<p className="text-gray-600 mb-1">
										Email: {s.customerEmail}
									</p>
									<p className="text-green-600 font-bold mb-1">
										Revenue: ₹{s.totalRevenue}
									</p>
									<p className="text-blue-500 font-semibold mb-1">
										Quantity Sold: {s.totalQuantitySold}
									</p>
									<p className="text-gray-500 text-sm">
										Picked Up On:{" "}
										{new Date(
											s.pickedUpDate
										).toLocaleDateString()}
									</p>
								</div>
							))
						) : (
							<p className="col-span-full text-center text-gray-500">
								No sales found.
							</p>
						)}
					</div>

					{/* Pagination Buttons */}
					<div className="flex justify-center mt-8 space-x-4">
						<button
							onClick={handlePrevious}
							disabled={currentPage === 1}
							className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
						>
							Previous
						</button>
						<span className="self-center font-medium">
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={handleNext}
							disabled={currentPage === totalPages}
							className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</>
			)}
		</div>
	);
}

export default SellerDetail;
