import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SellerDetail() {
	const [seller, setseller] = useState(null);
	const { id } = useParams();
	const fetchuserDetails = async () => {
		try {
			const response = await axios.get(
				`/admin/nastrigo/seller/sales/${id}`
			);
			console.log("seller list=", response.data.data);
			setseller(response.data.data.salesData);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchuserDetails();
	}, []);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
			{seller?.map((s, index) => (
				<div
					key={index}
					className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center"
				>
					<img
						src={s.productImage[0]}
						alt={s.productName}
						className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-gray-200"
					/>
					<h2 className="text-xl font-semibold text-gray-800">
						{s.customerName}
					</h2>
					<p className="text-sm text-gray-500 mb-2">
						{s.customerEmail}
					</p>
					<div className="text-center mb-4">
						<p className="text-gray-700 font-medium">
							Product: {s.productName}
						</p>
						<p className="text-gray-600 text-sm">
							Quantity Sold: {s.totalQuantitySold}
						</p>
						<p className="text-gray-600 text-sm">
							Revenue: ₹{s.totalRevenue}
						</p>
					</div>
					<p className="text-xs text-gray-400">
						Picked Up:{" "}
						{new Date(s.pickedUpDate).toLocaleDateString()}{" "}
						at{" "}
						{new Date(s.pickedUpDate).toLocaleTimeString()}
					</p>
				</div>
			))}
		</div>
	);
}

export default SellerDetail;
