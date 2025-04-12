import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
	Calendar,
	Tag,
	Edit,
	Trash2,
	Plus,
	X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = "seasons";

function Seasons() {
	const [seasons, setSeasons] = useState([]);
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [newSeason, setNewSeason] = useState({
		seasonsname: "",
		startDate: "",
		endDate: "",
		tags: [],
	});
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [newTag, setNewTag] = useState("");
	const [startdate, setstartdate] = useState(Date.now());
	const [enddate, setenddate] = useState(Date.now());

	useEffect(() => {
		fetchSeasons();
	}, []);

	const fetchSeasons = async () => {
		try {
			const response = await axios.get(
				`${API_BASE_URL}/getSeasons`
			);
			setSeasons(response.data.data);
		} catch (error) {
			toast.error("Failed to fetch seasons");
		}
	};

	const handleAddSeason = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${API_BASE_URL}/add`, newSeason);
			toast.success("Season added successfully");
			setIsAddingNew(false);
			setNewSeason({
				seasonsname: "",
				startDate: "",
				endDate: "",
				tags: [],
			});
			fetchSeasons();
		} catch (error) {
			toast.error("Failed to add season");
		}
	};

	const handleDeleteSeason = async (id) => {
		try {
			await axios.delete(
				`${API_BASE_URL}/delete-season/${id}`
			);
			toast.success("Season deleted successfully");
			fetchSeasons();
		} catch (error) {
			toast.error("Failed to delete season");
		}
	};
	const handleEditDates = async ({ seasonId }) => {
		try {
			const response = await axios.patch(
				`/seasons/edit-dates/${seasonId}`,
				{
					startDate: startdate,
					endDate: enddate,
				}
			);

			console.log("Season dates updated:", response.data);
			alert("Season dates updated successfully!");
			fetchSeasons();
		} catch (error) {
			console.error("Error updating season dates:", error);
			alert("Failed to update season dates.");
		}
	};

	const handleAddTag = () => {
		if (newTag.trim()) {
			setNewSeason((prev) => ({
				...prev,
				tags: [...prev.tags, newTag.trim()],
			}));
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setNewSeason((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};
	const handleAddnewTag = async ({ seasonId }) => {
		try {
			const response = await axios.post(
				`/seasons/add-tags/${seasonId}`,
				{
					tags: newTag,
				}
			);

			console.log("tags added:", response.data);
			alert("Season tags added successfully!");
			setNewTag("");
			fetchSeasons();
		} catch (error) {
			console.error("Error updating season dates:", error);
			alert("Failed to update season dates.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">
						Seasons Management
					</h1>
					<button
						onClick={() => setIsAddingNew(!isAddingNew)}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
					>
						<Plus size={20} />
						Add New Season
					</button>
				</div>

				{isAddingNew && (
					<div className="bg-white p-6 rounded-lg shadow-md mb-8">
						<h2 className="text-xl font-semibold mb-4">
							Add New Season
						</h2>
						<form
							onSubmit={handleAddSeason}
							className="space-y-4"
						>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Season Name
								</label>
								<input
									type="text"
									value={newSeason.seasonsname}
									onChange={(e) =>
										setNewSeason((prev) => ({
											...prev,
											seasonsname: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Start Date
									</label>
									<input
										type="datetime-local"
										value={newSeason.startDate}
										onChange={(e) =>
											setNewSeason((prev) => ({
												...prev,
												startDate: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										End Date
									</label>
									<input
										type="datetime-local"
										value={newSeason.endDate}
										onChange={(e) =>
											setNewSeason((prev) => ({
												...prev,
												endDate: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Tags
								</label>
								<div className="flex gap-2 mb-2">
									<input
										type="text"
										value={newTag}
										onChange={(e) =>
											setNewTag(e.target.value)
										}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
										placeholder="Add a tag"
									/>
									<button
										type="button"
										onClick={handleAddTag}
										className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
									>
										Add Tag
									</button>
								</div>
								<div className="flex flex-wrap gap-2">
									{newSeason.tags.map((tag, index) => (
										<span
											key={index}
											className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
										>
											{tag}
											<button
												type="button"
												onClick={() => handleRemoveTag(tag)}
												className="text-blue-800 hover:text-blue-900"
											>
												<X size={16} />
											</button>
										</span>
									))}
								</div>
							</div>

							<div className="flex justify-end gap-4">
								<button
									type="button"
									onClick={() => setIsAddingNew(false)}
									className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
								>
									Add Season
								</button>
							</div>
						</form>
					</div>
				)}

				<div className="grid gap-6">
					{seasons.map((season) => (
						<div
							key={season._id}
							className="bg-white p-6 rounded-lg shadow-md"
						>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-semibold text-gray-800">
									{season.name}
								</h3>
								<div className="flex gap-2">
									<button
										onClick={() =>
											handleDeleteSeason(season._id)
										}
										className="text-red-600 hover:text-red-700 p-1"
									>
										<Trash2 size={20} />
									</button>
								</div>
							</div>

							<div className="flex items-center gap-2 text-gray-600 mb-4">
								<Calendar size={18} />
								<span>
									{format(
										new Date(season.startDate),
										"MMM d, yyyy"
									)}{" "}
									-{" "}
									{format(
										new Date(season.endDate),
										"MMM d, yyyy"
									)}
								</span>
							</div>

							<div className="flex items-start gap-2">
								<Tag
									size={18}
									className="text-gray-600 mt-1"
								/>
								<div className="flex flex-wrap gap-2">
									{season.applicableTags.map(
										(tag, index) => (
											<span
												key={index}
												className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
											>
												{tag}
											</span>
										)
									)}
								</div>
							</div>
							<div className="flex gap-4 mt-4">
								<button
									onClick={() => setModal(!modal)}
									className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition-all duration-300"
								>
									Edit Season Dates
								</button>

								<button
									onClick={() => setModal2(!modal2)}
									className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-md transition-all duration-300"
								>
									Add Tag
								</button>
							</div>

							{/* Add Tag Modal */}
							{modal2 && (
								<div className="mt-4 p-4 border rounded-xl shadow-lg bg-white w-full max-w-md">
									<h3 className="text-lg font-semibold mb-2 text-gray-700">
										Add New Tag
									</h3>
									<input
										type="text"
										value={newTag}
										onChange={(e) =>
											setNewTag(e.target.value)
										}
										placeholder="Enter tag name"
										className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 mb-3"
									/>
									<button
										onClick={() =>
											handleAddnewTag({
												seasonId: season._id,
											})
										}
										className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md w-full"
									>
										Submit Tag
									</button>
								</div>
							)}

							{/* Edit Dates Modal */}
							{modal && (
								<div className="mt-4 p-4 border rounded-xl shadow-lg bg-white w-full max-w-md">
									<h3 className="text-lg font-semibold mb-2 text-gray-700">
										Edit Season Dates
									</h3>
									<div className="flex flex-col gap-3">
										<input
											type="date"
											value={startdate}
											onChange={(e) =>
												setstartdate(e.target.value)
											}
											className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
										/>
										<input
											type="date"
											value={enddate}
											onChange={(e) =>
												setenddate(e.target.value)
											}
											className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
										/>
										<button
											onClick={() =>
												handleEditDates({
													seasonId: season._id,
												})
											}
											className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md w-full mt-3"
										>
											Update Dates
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<Toaster position="top-right" />
		</div>
	);
}

export default Seasons;
