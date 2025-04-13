import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Trash2,
	Edit,
	Plus,
	Image as ImageIcon,
	FolderTree,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const API_BASE_URL = "/category";

const CategoryItem = ({
	category,
	handleUpdateName,
	handleUpdateImage,
	handleDeleteCategory,
	setEditingId,
	editingId,
	editName,
	setEditName,
	parentcatid,
	childcatid,
	parentname,
	childname,
	level = 0,
	addingChildTo,
	setAddingChildTo,
	newCategory,
	setNewCategory,
	handleAddCategory,
}) => {
	const isAddingChild = addingChildTo === category._id;

	return (
		<li className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					{category.image && (
						<img
							src={category.image}
							alt={category.name}
							className="w-12 h-12 rounded-lg object-cover"
						/>
					)}
					{editingId === category._id ? (
						<div className="flex items-center gap-2">
							<input
								type="text"
								value={editName}
								onChange={(e) =>
									setEditName(e.target.value)
								}
								className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							<button
								onClick={() =>
									handleUpdateName(category._id)
								}
								className="text-green-600 hover:text-green-700"
							>
								Save
							</button>
							<button
								onClick={() => {
									setEditingId(null);
									setEditName("");
								}}
								className="text-gray-600 hover:text-gray-700"
							>
								Cancel
							</button>
						</div>
					) : (
						<span className="text-lg font-medium text-gray-900">
							{category.name}
						</span>
					)}
				</div>

				<div className="flex items-center space-x-4">
					<button
						onClick={() => {
							setAddingChildTo(
								isAddingChild ? null : category._id
							);
							setNewCategory({
								...newCategory,
								parentcatid: parentcatid,
								childcatid: category._id,
								parent: parentname,
								subParent: childname,
							});
						}}
						className="inline-flex items-center px-3 py-1 text-sm border border-indigo-600 rounded-md text-indigo-600 hover:bg-indigo-50"
					>
						<Plus className="w-4 h-4 mr-1" />
						Add Child
					</button>
					<label className="cursor-pointer text-indigo-600 hover:text-indigo-700">
						<ImageIcon className="w-5 h-5" />
						<input
							type="file"
							className="hidden"
							onChange={(e) =>
								handleUpdateImage(
									category._id,
									e.target.files[0]
								)
							}
							accept="image/*"
						/>
					</label>
					<button
						onClick={() => {
							setEditingId(category._id);
							setEditName(category.name);
						}}
						className="text-blue-600 hover:text-blue-700"
					>
						<Edit className="w-5 h-5" />
					</button>
					<button
						onClick={() =>
							handleDeleteCategory(category._id)
						}
						className="text-red-600 hover:text-red-700"
					>
						<Trash2 className="w-5 h-5" />
					</button>
				</div>
			</div>

			{isAddingChild && (
				<div className="mt-4 ml-6 p-4 bg-gray-50 rounded-lg">
					<h3 className="text-sm font-medium text-gray-700 mb-3">
						Add Child Category to "{category.name}"
					</h3>
					<form
						onSubmit={handleAddCategory}
						className="space-y-4"
					>
						<div>
							<input
								type="text"
								value={newCategory.name}
								onChange={(e) =>
									setNewCategory({
										...newCategory,
										name: e.target.value,
									})
								}
								placeholder="Enter category name"
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>
						<div>
							<input
								type="file"
								onChange={(e) =>
									setNewCategory({
										...newCategory,
										image: e.target.files[0],
									})
								}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								accept="image/*"
							/>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
							>
								Add Category
							</button>
							<button
								type="button"
								onClick={() => setAddingChildTo(null)}
								className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{category.children &&
				category.children.length > 0 && (
					<ul className="ml-6 mt-4 border-l-2 border-gray-200">
						{category.children.map((child) => (
							<CategoryItem
								key={child._id}
								category={child}
								handleUpdateName={handleUpdateName}
								handleUpdateImage={handleUpdateImage}
								handleDeleteCategory={handleDeleteCategory}
								setEditingId={setEditingId}
								editingId={editingId}
								editName={editName}
								setEditName={setEditName}
								childcatid={category._id}
								parentcatid={parentcatid}
								level={level + 1}
								addingChildTo={addingChildTo}
								setAddingChildTo={setAddingChildTo}
								newCategory={newCategory}
								setNewCategory={setNewCategory}
								handleAddCategory={handleAddCategory}
							/>
						))}
					</ul>
				)}
		</li>
	);
};

function Category() {
	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState({
		name: "",
		parent: "",
		subparent: "",
		image: null,
		parentcatid: "",
		childcatid: "",
	});
	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState("");
	const [addingChildTo, setAddingChildTo] = useState(null);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await axios.get(
				`${API_BASE_URL}/list-with-img`
			);
			console.log("category list=", response.data.data);
			setCategories(response.data.data);
		} catch (error) {
			toast.error("Failed to fetch categories");
		}
	};

	const handleAddCategory = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("name", newCategory.name);

			if (newCategory.childcatid) {
				formData.append("parent", newCategory.childcatid);
			} else if (newCategory.parentcatid) {
				formData.append("parent", newCategory.parentcatid);
			}

			if (newCategory.image) {
				formData.append("CategoryImage", newCategory.image);
			}

			await axios.post(`${API_BASE_URL}/add`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			toast.success("Category added successfully");
			setNewCategory({
				name: "",
				parent: "",
				subParent: "",
				image: null,
				parentcatid: "",
				childcatid: "",
			});
			setAddingChildTo(null);
			fetchCategories();
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to add category"
			);
		}
	};

	const handleUpdateImage = async (categoryId, image) => {
		try {
			const formData = new FormData();
			formData.append("image", image);

			await axios.post(
				`${API_BASE_URL}/update/catagory-image/${categoryId}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			toast.success("Image updated successfully");
			fetchCategories();
		} catch (error) {
			toast.error("Failed to update image");
		}
	};

	const handleDeleteCategory = async (categoryId) => {
		try {
			await axios.delete(
				`${API_BASE_URL}/delete/${categoryId}`
			);
			toast.success("Category deleted successfully");
			fetchCategories();
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to delete category"
			);
		}
	};

	const handleUpdateName = async (categoryId) => {
		try {
			await axios.put(
				`${API_BASE_URL}/edit-name/${categoryId}`,
				{
					name: editName,
				}
			);
			toast.success("Category name updated successfully");
			setEditingId(null);
			setEditName("");
			fetchCategories();
		} catch (error) {
			toast.error("Failed to update category name");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
			<Toaster position="top-right" />

			{/* Add Root Category Form */}
			<div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
				<h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
					<FolderTree className="w-6 h-6" />
					Add New Root Category
				</h2>

				<form
					onSubmit={handleAddCategory}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							value={newCategory.name}
							onChange={(e) =>
								setNewCategory({
									...newCategory,
									name: e.target.value,
								})
							}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Image
						</label>
						<input
							type="file"
							onChange={(e) =>
								setNewCategory({
									...newCategory,
									image: e.target.files[0],
								})
							}
							className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
							accept="image/*"
						/>
					</div>

					<button
						type="submit"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Category
					</button>
				</form>
			</div>

			{/* Categories List */}
			<div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
				<ul className="divide-y divide-gray-200">
					{categories?.map((category) => (
						<CategoryItem
							key={category._id}
							category={category}
							handleUpdateName={handleUpdateName}
							handleUpdateImage={handleUpdateImage}
							handleDeleteCategory={handleDeleteCategory}
							setEditingId={setEditingId}
							editingId={editingId}
							editName={editName}
							setEditName={setEditName}
							parentcatid={category.id}
							parentname={category.name}
							addingChildTo={addingChildTo}
							setAddingChildTo={setAddingChildTo}
							newCategory={newCategory}
							setNewCategory={setNewCategory}
							handleAddCategory={handleAddCategory}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Category;
