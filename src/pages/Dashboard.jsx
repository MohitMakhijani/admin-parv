import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	BarChart,
	Bar,
} from "recharts";
import { FaRupeeSign } from "react-icons/fa";

import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

function Dashboard() {
	const [analytics, setAnalytics] = useState(null);
	const [salesData, setSalesData] = useState([]);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [months, setMonths] = useState(4);
	const [todayStats, setTodayStats] = useState({
		demands: 0,
		products: 0,
		sales: 0,
		customerRegistrations: 0,
	});
	const [monthlyStats, setMonthlyStats] = useState({
		products: [],
		customerRegistrations: [],
		sellerRegistrations: [],
		salesComplete: [],
		salesmonthlyRes: [],
		salesyearlyRes: [],
		sellerRegistrationsmonthly: [],
		sellerRegistrationsyearly: [],
	});
	const [totalStats, setTotalStats] = useState({
		products: 0,
		salesStatus: [],
	});
	const [sevendayssales, setsevendayssales] = useState([]);
	const [year, setYear] = useState(2025);
	const [gender, setGender] = useState();

	useEffect(() => {
		fetchDashboardData();
	}, [months, year]);

	const fetchDashboardData = async () => {
		try {
			// Fetch all required data
			const [
				analyticsRes,
				salesRes,
				revenueRes,
				todayDemandRes,
				todayProductRes,
				todaySalesRes,
				todayCustomerRes,
				monthlyProductRes,
				totalProductRes,
				salesStatusRes,
				sevendayssales,
				monthlycustomerRes,
				yearlycustomerRes,
				salesmonthlyRes,
				salesyearlyRes,
				sellerRegistrationsmonthly,
				sellerRegistrationsyearly,
				genderRes,
			] = await Promise.all([
				axios.get("/admin/nastrigo/sellers-analytics"),
				axios.get(
					"/admin/nastrigo/get-last-7-days-demand-analysis"
				),
				axios.get("/admin/nastrigo/get-total-revenue"),
				axios.get(
					"/admin/nastrigo/get-todays-demand-count"
				),
				axios.get(
					"/admin/nastrigo/get-todays-product-count"
				),
				axios.get("/admin/nastrigo/get-todays-sales-count"),
				axios.get(
					"/admin/nastrigo/get-todays-customer-registrations"
				),
				axios.get(
					`/admin/nastrigo/get-monthly-product-analysis?month=${months}`
				),
				axios.get(
					"/admin/nastrigo/get-total-product-count"
				),
				axios.get("/admin/nastrigo/get-total-sales-status"),
				axios.get(
					"/admin/nastrigo/get-last-7-days-sales-analysis"
				),
				axios.get(
					`/admin/nastrigo/get-customer-registration-analysis?month=${months}`
				),
				axios.get(
					`/admin/nastrigo/get-customer-registration-analysis?year=${year}`
				),
				axios.get(
					`admin/nastrigo/get-sales-complete-analysis?month=${months}`
				),
				axios.get(
					`/admin/nastrigo/get-sales-complete-analysis?year=${year}`
				),
				axios.get(
					`admin/nastrigo/get-seller-registration-analysis?month=${months}`
				),
				axios.get(
					`/admin/nastrigo/get-seller-registration-analysis?year=${year}`
				),
				axios.get(`admin/nastrigo/get-gender-distribution`),
			]);

			setAnalytics(analyticsRes.data.data);
			setSalesData(salesRes.data.data);
			setTotalRevenue(revenueRes.data.data.total);

			setTodayStats({
				demands: todayDemandRes.data.data.count,
				products: todayProductRes.data.data.count,
				sales: todaySalesRes.data.data.count,
				customerRegistrations:
					todayCustomerRes.data.data.count,
			});
			setGender(genderRes.data.data);

			setMonthlyStats({
				products: monthlyProductRes.data.data,
				customer: monthlycustomerRes.data.data,
				customeryear: yearlycustomerRes.data.data,
				salesmonthlyRes: salesmonthlyRes.data.data,
				salesyearlyRes: salesyearlyRes.data.data,
				sellerRegistrationsmonthly:
					sellerRegistrationsmonthly.data.data,
				sellerRegistrationsyearly:
					sellerRegistrationsyearly.data.data,
			});
			console.log(
				"sales yearly=",
				monthlyStats.salesyearlyRes
			);

			setTotalStats({
				products: totalProductRes.data.data.count,
				salesStatus: salesStatusRes.data.data,
			});

			setsevendayssales(sevendayssales.data.data);
		} catch (error) {

		}
	};
	const formattedData =
		monthlyStats.sellerRegistrationsmonthly.map((item) => {
			let approved = 0;
			let pending = 0;

			item.statuses.forEach((statusObj) => {
				if (statusObj.status === "Approved") {
					approved = statusObj.count;
				}
				if (statusObj.status === "Pending") {
					pending = statusObj.count;
				}
			});

			return {
				day: item.day,
				approved,
				pending,
			};
		});
	const formattedData1 =
		monthlyStats.sellerRegistrationsyearly.map((item) => {
			let approved = 0;
			let pending = 0;
			let month = 1 ;

			item.statuses.forEach((statusObj) => {
				if (statusObj.status === "Approved") {
					approved = statusObj.count;
				}
				if (statusObj.status === "Pending") {
					pending = statusObj.count;
				}
			   
				month = item.month;
			});

			return {
				day: item.day,
				monthNumber: month,
				approved,
				pending,
			
				
			};
		});


	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
			{/* Today's Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Today's Demands
					</h3>
					<p className="text-3xl font-bold">
						{todayStats.demands}
					</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Today's Products
					</h3>
					<p className="text-3xl font-bold">
						{todayStats.products}
					</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Today's Sales
					</h3>
					<p className="text-3xl font-bold">
						{todayStats.sales}
					</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Today's Registrations
					</h3>
					<p className="text-3xl font-bold">
						{todayStats.customerRegistrations}
					</p>
				</div>
			</div>
			{/* Seller Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Total Sellers
					</h3>
					<p className="text-3xl font-bold">
						{analytics?.totalSellers || 0}
					</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Active Sellers
					</h3>
					<p className="text-3xl font-bold">
						{analytics?.activeSellersCount || 0}
					</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Total Revenue
					</h3>
					<p className="text-3xl font-bold flex justify-center items-center">
						<FaRupeeSign className="text-2xl font-bold" />
						{totalRevenue.toLocaleString()}
					</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">
						Total Products
					</h3>
					<p className="text-3xl font-bold">
						{totalStats.products}
					</p>
				</div>
			</div>

			{/* Sales Chart */}
			<div className="bg-white p-6 rounded-lg shadow mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Last 7 Days Demand
				</h2>
				<LineChart
					width={800}
					height={300}
					data={salesData}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="revenue"
						stroke="#8884d8"
					/>
					<Line
						type="monotone"
						dataKey="count"
						stroke="#82ca9d"
					/>
				</LineChart>
			</div>
			<div>
				<div className="flex flex-col items-center justify-center gap-6 p-6">
					<h1 className="text-2xl font-bold text-gray-800">
						Choose Your Month
					</h1>

					<div className="w-full flex flex-col items-center">
						<input
							type="range"
							min={1}
							max={12}
							value={months}
							onChange={(e) => setMonths(e.target.value)}
							className="w-1/2 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full appearance-none cursor-pointer"
						/>
						<div className="mt-4 text-lg font-semibold text-blue-700">
							Month: {months}
						</div>
					</div>
				</div>
			</div>
			{/* Monthly Product Analysis */}
			<div className="bg-white p-6 rounded-lg shadow mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Monthly Product Analysis
				</h2>
				<BarChart
					width={800}
					height={300}
					data={monthlyStats.products}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="day" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="count" fill="#8884d8" />
				</BarChart>
			</div>
			<div className="bg-white p-6 rounded-lg shadow mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Monthly Customer Regestration
				</h2>
				<BarChart
					width={800}
					height={300}
					data={monthlyStats.customer}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="day" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="count" fill="#8884d8" />
				</BarChart>
			</div>
			<h1>Set Years</h1>
			<input
				type="number"
				value={year}
				onChange={(e) => setYear(e.target.value)}
				className="p-4 "
			/>
			<div className="bg-white p-6 rounded-lg shadow mb-8">
				<h2 className="text-xl font-semibold mb-4">
					Yearly Customer Registration
				</h2>
				<LineChart
					width={500}
					height={300}
					data={monthlyStats.customeryear}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="count"
						stroke="#8884d8"
						activeDot={{ r: 8 }}
					/>
				</LineChart>
			</div>
			{/* Sales Status */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold mb-4">
					Total Sales Status
				</h2>
				<div className="grid grid-cols-2 gap-4">
					{totalStats.salesStatus.map((status) => (
						<div
							key={status.status}
							className="p-4 bg-gray-50 rounded-lg"
						>
							<h3 className="text-lg font-medium capitalize">
								{status.status}
							</h3>
							<p className="text-2xl font-bold">
								{status.count}
							</p>
						</div>
					))}
				</div>
			</div>
			<div className="bg-white p-6 rounded-lg shadow mb-8 flex justify-center">
				<h2 className="text-xl font-semibold mb-4">
					Last 7 Days Sales
				</h2>
				<LineChart
					width={800}
					height={300}
					data={sevendayssales}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis dataKey="count" />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="revenue"
						stroke="#8884d8"
					/>
					<Line
						type="monotone"
						dataKey="count"
						stroke="#82ca9d"
					/>
				</LineChart>
			</div>
			{/* sales monthly */}
			<div className="bg-white p-6 rounded-lg shadow mb-8 flex justify-center">
				<h2 className="text-xl font-semibold mb-4">
					Last Monthly Sales
				</h2>
				<LineChart
					width={800}
					height={300}
					data={monthlyStats.salesmonthlyRes}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="day" />
					<YAxis dataKey="bookings" />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="revenue"
						stroke="#8884d8"
					/>
					<Line
						type="monotone"
						dataKey="bookings"
						stroke="#82ca9d"
					/>
				</LineChart>
			</div>
			{/* sales yearly */}
			<div className="bg-white p-6 rounded-lg shadow mb-8 flex justify-center">
				<h2 className="text-xl font-semibold mb-4">
					Last Yearly Sales
				</h2>
				<LineChart
					width={800}
					height={300}
					data={monthlyStats.salesyearlyRes}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis dataKey='bookings' />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="revenue"
						name="Revenue"
						stroke="#8884d8"
					/>
					<Line
						type="monotone"
						dataKey="bookings"
						name="Bookings"
						stroke="#82ca9d"
					/>
				</LineChart>

			</div>

			<h1>monthly seller regestration</h1>
			<LineChart
				width={800}
				height={300}
				data={formattedData}
				className="mt-8"
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="day" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="approved"
					stroke="#4CAF50" // Green for approved
					name="Approved"
				/>
				<Line
					type="monotone"
					dataKey="pending"
					stroke="red" // Orange for pending
					name="Pending"
				/>
			</LineChart>
			<h1>Yearly Seller Registration</h1>
			<LineChart
				width={800}
				height={300}
				data={formattedData1}
				className="mt-8"
			>
				<CartesianGrid strokeDasharray="3 3" />

				{/* X-axis showing month numbers */}
				<XAxis
					dataKey="monthNumber" 
					label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
				/>

				{/* Y-axis showing counts */}
				<YAxis
					// dataKey="day" 
					label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
				/>

				<Tooltip />
				<Legend />

				{/* Approved registrations */}
				<Line
					type="monotone"
					dataKey="approved"
					stroke="#4CAF50"
					name="Approved"
				/>

				{/* Pending registrations */}
				<Line
					type="monotone"
					dataKey="pending"
					stroke="red"
					name="Pending"
				/>
			</LineChart>

			<GenderDistribution gender={gender} />
		</div>
	);
}

export default Dashboard;

function GenderDistribution({ gender }) {
	const customerData = gender?.customers?.distribution?.map(
		(item) => ({
			name: item.gender,
			value: item.count,
		})
	);

	const sellerData = gender?.sellers?.distribution?.map(
		(item) => ({
			name: item.gender,
			value: item.count,
		})
	);

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold text-gray-800 mb-8">
				Gender Distribution
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
				{/* Customers Pie Chart */}
				<div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
					<h3 className="text-xl font-semibold text-gray-700 mb-6">
						Customers
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={customerData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={100}
								fill="#8884d8"
								label
							>
								{customerData?.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend verticalAlign="bottom" height={36} />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Sellers Pie Chart */}
				<div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center">
					<h3 className="text-xl font-semibold text-gray-700 mb-6">
						Sellers
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={sellerData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={100}
								fill="#82ca9d"
								label
							>
								{sellerData?.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend verticalAlign="bottom" height={36} />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
