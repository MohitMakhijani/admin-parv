import React, { useState, useEffect } from "react";
import axios from "axios";

function PendingRegistrations() {
	const [pendingRegistrations, setPendingRegistrations] =
		useState([]);
	const [brand, setBrand] = useState(null);

	useEffect(() => {
		fetchPendingRegistrations();
	}, []);

	const fetchPendingRegistrations = async () => {
		try {
			const response = await axios.get(
				"/admin/nastrigo/pending-registrations"
			);
			console.log("Pending Registrations:", response.data);
			setPendingRegistrations(response.data.sellers);
		} catch (error) {
			console.error(
				"Error fetching pending registrations:",
				error
			);
		}
	};

	const handleApprove = async (sellerId) => {
		try {
			await axios.post(
				`/admin/nastrigo/approve-registration/${sellerId}`,
				{
					isBrandAssured: brand,
					isRegistrationDone: true,
				}
			);
			fetchPendingRegistrations(); // Refresh list after approval
		} catch (error) {
			console.error("Error approving registration:", error);
		}
	};

	const handleReject = async (sellerId) => {
		const reason = prompt("Please enter rejection reason:");
		if (!reason) return;

		try {
			await axios.post(
				`/admin/nastrigo/reject-registration/${sellerId}`,
				{ reason }
			);
			fetchPendingRegistrations(); // Refresh list after rejection
		} catch (error) {
			console.error("Error rejecting registration:", error);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Pending Registrations
			</h2>

			{/* Brand Assured Toggle */}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{pendingRegistrations?.map((seller) => (
					<div
						key={seller._id}
						className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
					>
						<img
							src={seller.banner}
							alt="Seller Banner"
							className="h-32 w-full object-cover"
						/>
						<div className="flex flex-col items-center p-4">
							<img
								src={seller.avatar}
								alt="Seller Avatar"
								className="w-24 h-24 rounded-full object-cover -mt-12 border-4 border-white shadow-md"
							/>
							<h3 className="mt-2 text-lg font-semibold text-gray-800">
								{seller.fullName}
							</h3>
							<p className="text-gray-500 text-sm">
								{seller.email}
							</p>

							<p className="text-gray-500 text-sm">
								{seller.phoneNo}
							</p>
							<p className="text-gray-500 text-sm">
								{seller.sex}
							</p>

							<div className="mt-4 text-center text-sm text-gray-600">
								<p>
									<span className="font-semibold">
										Shop:
									</span>{" "}
									{seller.shopDetails?.shopName || "N/A"}
								</p>
								<p>
									<span className="font-semibold">
										City:
									</span>{" "}
									{seller.address?.city || "N/A"}
								</p>
								<p>
									<span className="font-semibold">
										State:
									</span>{" "}
									{seller.address?.state || "N/A"}
								</p>
								<p>
									<span className="font-semibold">
										Working Days:
									</span>{" "}
									{seller.shopDetails?.workingDays || "N/A"}
								</p>
								<p>
									<span className="font-semibold">
										Opening:
									</span>{" "}
									{seller.shopDetails?.opening || "N/A"}
								</p>
								<p>
									<span className="font-semibold">
										Closing:
									</span>{" "}
									{seller.shopDetails?.closing || "N/A"}
								</p>
								<p>
									<span className="font-semibold ">
										Gst:
									</span>{" "}
									{seller.gst}
								</p>
							</div>
							{seller.brandName === null ? (
								<div>Not branded</div>
							) : (
								<div>
									<div className="flex items-center mb-6">
										<input
											id="brand-assured"
											type="checkbox"
											checked={brand === seller._id}
											onChange={() => setBrand(seller._id)}
											className="mr-2"
										/>
										<label
											htmlFor="brand-assured"
											className="text-gray-700"
										>
											Brand Assured
										</label>
									</div>
								</div>
							)}

							{/* Approve and Reject Buttons */}
							<div className="flex space-x-4 mt-6">
								<button
									onClick={() => handleApprove(seller._id)}
									className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm"
								>
									Approve
								</button>
								<button
									onClick={() => handleReject(seller._id)}
									className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
								>
									Reject
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default PendingRegistrations;
