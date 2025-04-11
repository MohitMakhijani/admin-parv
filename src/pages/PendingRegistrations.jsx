import React, { useState, useEffect } from "react";
import axios from "axios";

function PendingRegistrations() {
	const [pendingRegistrations, setPendingRegistrations] =
		useState([]);

	useEffect(() => {
		fetchPendingRegistrations();
	}, []);

	const fetchPendingRegistrations = async () => {
		try {
			const response = await axios.get(
				"/admin/nastrigo/pending-registrations"
			);
			console.log("pending regestrations", response.data);
			setPendingRegistrations(
				response.data.sellersWithShopName
			);
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
					isBrandAssured: false,
					isRegistrationDone: true,
				}
			);
			fetchPendingRegistrations();
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
				{
					rejectionReason: reason,
				}
			);
			fetchPendingRegistrations();
		} catch (error) {
			console.error("Error rejecting registration:", error);
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">
				Pending Registrations
			</h1>
			<div className="bg-white rounded-lg shadow">
				<table className="min-w-full">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Full Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Shop Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{pendingRegistrations?.map((seller) => (
							<tr key={seller._id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{seller._id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{seller.fullName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{seller.shopName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<button
										onClick={() =>
											handleApprove(seller._id)
										}
										className="text-green-600 hover:text-green-900 mr-4"
									>
										Approve
									</button>
									<button
										onClick={() => handleReject(seller._id)}
										className="text-red-600 hover:text-red-900"
									>
										Reject
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default PendingRegistrations;
