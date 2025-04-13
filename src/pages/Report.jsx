import React from "react";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
} from "recharts";

const COLORS = [
	"#0088FE",
	"#45868A",
	"#FF8042",
	"#00C49F",
	"#FFBB28",
	"#FF6384",
	"#36A2EB",
	"#FFCE56",
	"#FF6384",
	"#36A2EB",
	"#FFCE56",
];
function Report() {
	const { id } = useParams();
	const [chartData, setChartData] = useState([]);
	const [report, setReport] = useState([]);
	const fetchreportDetails = async () => {
		try {
			const response = await axios.get(
				`admin/nastrigo/get-report-stats/${id}`
			);
			const stats = response.data.data.reasonStats;
			const formattedData = Object.keys(stats).map(
				(key) => ({
					name: key,
					value: parseFloat(stats[key]), // Remove "%" and convert to number
				})
			);
			setReport(response.data.data);
			setChartData(formattedData);
			console.log("report list=", response.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchreportDetails();
	}, []);

	return (
		<div className="flex flex-col items-center p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">
				Report Reason Stats
			</h2>
			<PieChart width={400} height={400}>
				<Pie
					data={chartData}
					dataKey="value"
					nameKey="name"
					cx="50%"
					cy="50%"
					outerRadius={120}
					fill="#8884d8"
					label
				>
					{chartData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>

			<div className="mt-8 w-full bg-white p-6 rounded-2xl shadow-md">
				<h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
					Reports Details
				</h3>
				<ul className="space-y-4">
					{report?.reports?.map((item, idx) => (
						<li
							key={idx}
							className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
						>
							<div className="flex items-center gap-4">
								{/* User Avatar */}
								{item.userId.avatar && (
									<img
										src={item.userId.avatar}
										alt="User Avatar"
										className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
									/>
								)}
								<div>
									{/* Reason */}
									<div className="text-lg font-semibold text-indigo-600">
										{item.reason}
									</div>
									{/* User Info */}
									<div className="text-sm text-gray-600 mt-1">
										<p>
											<span className="font-medium">
												Name:
											</span>{" "}
											{item.userId.fullName}
										</p>
										<p>
											<span className="font-medium">
												Email:
											</span>{" "}
											{item.userId.email}
										</p>
										<p>
											<span className="font-medium">
												Phone:
											</span>{" "}
											{item.userId.phoneNo}
										</p>
										<p>
											<span className="font-medium">
												Description:
											</span>{" "}
											{item.description}
										</p>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Report;
