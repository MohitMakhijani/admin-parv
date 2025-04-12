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

function Dashboard() {
	const [analytics, setAnalytics] = useState(null);
	const [salesData, setSalesData] = useState([]);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [months, setMonths] = useState(1);
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
	const [year, setYear] = useState(2000);

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
					`/admin/nastrigo/get-customer-registration-analysis?year=${year}`
				),
				axios.get(
					`admin/nastrigo/get-seller-registration-analysis?month=${months}`
				),
				axios.get(
					`/admin/nastrigo/get-seller-registration-analysis?year=${year}`
				),
			]);
			console.log(
				"seller monthy=",
				sellerRegistrationsmonthly.data.data
			);
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

			setTotalStats({
				products: totalProductRes.data.data.count,
				salesStatus: salesStatusRes.data.data,
			});
			console.log(
				"yearly customer regestration",
				yearlycustomerRes.data.data
			);
			setsevendayssales(sevendayssales.data.data);
		} catch (error) {
			console.error(
				"Error fetching dashboard data:",
				error
			);
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
					<p className="text-3xl font-bold">
						${totalRevenue.toLocaleString()}
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
					<YAxis dataKey={salesData} />
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
			<h1>Choose your month</h1>
			<input
				type="range"
				min={1}
				max={12}
				value={months}
				onChange={(e) => setMonths(e.target.value)}
				className="w-[45%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-blue-700"
			/>
			<span className="mx-5">{months}</span>

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
					Yearly Customer Regestration
				</h2>
				<BarChart
					width={800}
					height={300}
					data={monthlyStats.customeryear}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="count" fill="#8884d8" />
				</BarChart>
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
					Last Monthly Sales
				</h2>
				<BarChart
					width={800}
					height={300}
					data={monthlyStats.salesyearlyRes}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
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
				</BarChart>
			</div>
			{/* <SellerRegistrationAnalysis
				monthlyStats={
					monthlyStats.sellerRegistrationsmonthly
				}
			/> */}
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
			<LineChart
				width={800}
				height={300}
				data={formattedData1}
				className="mt-8"
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
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

			{/* seller analytics */}
			<table class="table-auto border-collapse border border-gray-300 w-full text-sm text-left">
				<thead>
					<tr class="bg-gray-100">
						<th class="border border-gray-300 p-2">
							Email
						</th>
						<th class="border border-gray-300 p-2">
							Full Name
						</th>
						<th class="border border-gray-300 p-2">
							Avatar
						</th>
						<th class="border border-gray-300 p-2">
							Phone Number
						</th>
					</tr>
				</thead>
				<tbody>
					{analytics?.activeSellers?.map((seller) => (
						<tr key={seller.email} class="hover:bg-gray-50">
							<td class="border border-gray-300 p-2">
								{seller.email}
							</td>
							<td class="border border-gray-300 p-2">
								{seller.fullName}
							</td>
							<td class="border border-gray-300 p-2">
								<img
									class="h-10 w-10 rounded-full"
									src={seller.avatar}
									alt="Seller Avatar"
								/>
							</td>
							<td class="border border-gray-300 p-2">
								{seller.phoneNo}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Dashboard;
