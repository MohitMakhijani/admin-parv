import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SellerDetail() {
	const [products, setproducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const limit = 9;
	const { id } = useParams();

	const fetchuserDetails = async (page = 1) => {
		try {
			setLoading(true);
			const response = await axios.get(
				`/admin/nastrigo/seller/products/${id}?page=${page}&limit=${limit}`
			);
			console.log("product list=", response.data.data);

			setproducts(response.data.data.products);
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
						{products?.length > 0 ? (
							products.map((s, index) => (
								<div
									key={index}
									className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col"
								>
									<img
										src={s.images[0]}
										alt={s.title}
										className="w-full h-48 object-cover rounded-xl mb-4"
									/>
									<h2 className="text-lg font-bold text-gray-800 mb-2">
										{s.title}
									</h2>

									<div className="flex items-center mb-2">
										<span className="text-yellow-500 text-sm mr-1">
											⭐ {s.avgRating}
										</span>
										<span className="text-gray-500 text-xs">
											({s.totalRatings} ratings)
										</span>
									</div>

									<p className="text-gray-600 text-sm mb-4 line-clamp-2">
										{s.description}
									</p>

									<div className="flex items-center justify-between mt-auto">
										<div>
											<span className="text-xl font-bold text-green-600">
												₹{s.discounted_Price}
											</span>
											<span className="text-sm line-through text-gray-400 ml-2">
												₹{s.price}
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="text-center text-gray-500">
								No products found.
							</div>
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
