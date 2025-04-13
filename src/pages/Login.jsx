import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { TbEyeClosed, TbEyeCheck } from "react-icons/tb";

import toast from "react-hot-toast";
import { setToken, setUser } from "../slices/AuthSlice";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
const LogIn = () => {
	const [hidePassword, setHidePassword] = useState(true);
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const submitHandler = async (data) => {
		setLoading(true);
		const toastId = toast.loading("Loading...");

		try {
			const response = await axios.post(
				`/admin/nastrigo/login`,
				data
			);

			if (!response?.data?.success) {
				throw new Error(response?.data?.error);
			}

			console.log(
				"LOGIN token : ",
				response?.data?.data?.accessToken
			);

			localStorage.setItem(
				"token",
				response?.data?.data?.accessToken
			);

			localStorage.setItem(
				"refreshtoken",
				response?.data?.data?.refreshToken
			);
			localStorage.setItem(
				"user",
				JSON.stringify(response?.data?.data?.user)
			);
			dispatch(setToken(response?.data?.data?.accessToken));
			dispatch(setUser(response?.data?.data?.user));

			toast.success("Logged In Successfully");
			if (response) {
				navigate("/");
			}
		} catch (e) {
			console.log("ERROR WHILE LOGGING IN : ", e);
			toast.error(e.message);
		} finally {
			setLoading(false);
			toast.dismiss(toastId);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center ">
			<section>
				<h1 className="text-center pb-5 text-4xl font-mono underline">
					My Trands
				</h1>
				<form
					onSubmit={handleSubmit(submitHandler)}
					className="flex flex-col gap-y-3 max-w-[480px] shadow-lg shadow-blue-300  border p-10 rounded-lg"
				>
					<div>
						<h3 className="text-4xl pb-5 text-center leading-[1.125]">
							Log in to Your Account
						</h3>
					</div>

					{loading && (
						<span className="text-center text-red-500 text-sm">
							<FaSpinner className="animate-spin" />
						</span>
					)}

					<span className="flex flex-col gap-1">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							placeholder="Email"
							className="py-1 text-base  placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300 xl:text-xl"
							type="email"
							{...register("email", {
								required: "Email is required",
							})}
						/>
						{errors?.email && (
							<div>{errors.email.message}</div>
						)}
					</span>

					<span className="flex flex-col gap-1">
						<label htmlFor="password">Password</label>
						<span className="flex items-center w-full">
							<input
								id="password"
								placeholder="Password"
								className="py-1 text-base  placeholder:text-black text-slate-950 w-full rounded-lg px-3 outline-none bg-slate-300 xl:text-xl"
								type={hidePassword ? "password" : "text"}
								{...register("password", {
									required: "Password is required",
								})}
							/>
							<span
								className="p-3 cursor-pointer"
								onClick={() =>
									setHidePassword(!hidePassword)
								}
							>
								{hidePassword ? (
									<TbEyeClosed />
								) : (
									<TbEyeCheck />
								)}
							</span>
						</span>
						{errors?.password && (
							<div>{errors.password.message}</div>
						)}
					</span>

					<span className="mt-5">
						<button
							disabled={loading}
							// varient={"primary"}
							type={"submit"}
							className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
						>
							Submit
						</button>
					</span>
				</form>
			</section>
		</div>
	);
};

export default LogIn;
