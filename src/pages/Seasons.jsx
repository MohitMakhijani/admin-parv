import { useState, useEffect } from "react";
import axios from "axios";

const SeasonsComponent = () => {
	const [seasons, setSeasons] = useState([]);
	const [seasonProducts, setSeasonProducts] = useState([]);
	const [newSeason, setNewSeason] = useState({
		name: "",
		startDate: "",
		endDate: "",
		tags: [],
	});

	useEffect(() => {
		fetchSeasons();
	}, []);

	const fetchSeasons = async () => {
		try {
			const response = await axios.get("/seasons/name");
			setSeasons(response.data.data.seasons);
		} catch (error) {
			console.error("Error fetching seasons:", error);
		}
	};

	const fetchSeasonalProducts = async (seasonName) => {
		try {
			const response = await axios.get(
				`/seasons/products?season=${seasonName}`
			);
			console.log("seasons product=", response.data.data);
			setSeasonProducts(response.data.data.data);
		} catch (error) {
			console.error(
				"Error fetching seasonal products:",
				error
			);
		}
	};

	const addSeason = async () => {
		try {
			await axios.post("/seasons/add", newSeason);
			fetchSeasons();
		} catch (error) {
			console.error("Error adding season:", error);
		}
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-2xl font-bold mb-4">
				Seasons and Festivals
			</h1>

			<div className="bg-white p-4 rounded shadow mb-4">
				<h2 className="text-lg font-bold mb-2">
					Add Season
				</h2>
				<input
					type="text"
					placeholder="Season Name"
					className="border p-2 rounded w-full mb-2"
					onChange={(e) =>
						setNewSeason({
							...newSeason,
							name: e.target.value,
						})
					}
				/>
				<input
					type="date"
					placeholder="Start Date"
					className="border p-2 rounded w-full mb-2"
					onChange={(e) =>
						setNewSeason({
							...newSeason,
							startDate: e.target.value,
						})
					}
				/>
				<input
					type="date"
					placeholder="End Date"
					className="border p-2 rounded w-full mb-2"
					onChange={(e) =>
						setNewSeason({
							...newSeason,
							endDate: e.target.value,
						})
					}
				/>
				<button
					onClick={addSeason}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Add Season
				</button>
			</div>

			<div className="bg-white p-4 rounded shadow">
				<h2 className="text-lg font-bold mb-2">
					Seasons List
				</h2>
				<ul>
					{seasons.map((season) => (
						<li
							key={season._id}
							className="p-2 border-b cursor-pointer"
							onClick={() =>
								fetchSeasonalProducts(season.name)
							}
						>
							{season.name}
						</li>
					))}
				</ul>
			</div>

			{seasonProducts.length > 0 && (
				<div className="bg-white p-4 rounded shadow mt-4">
					<h2 className="text-lg font-bold mb-2">
						Seasonal Products
					</h2>
					<ul>
						{seasonProducts.map((product) => (
							<li
								key={product._id}
								className="p-2 border-b"
							>
								{product.title} - ${product.price}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default SeasonsComponent;
