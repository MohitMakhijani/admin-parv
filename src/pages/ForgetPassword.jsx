import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ForgetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const sendOtpHandler = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      await axios.post(`/admin/nastrigo/send-forgot-password-otp`);
      toast.success("OTP sent successfully");
      setOtpSent(true); // move to OTP screen
    } catch (e) {
      console.log("SEND OTP ERROR: ", e);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const resetPasswordHandler = async () => {
    const data = getValues();
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await axios.post(
        `/admin/nastrigo/reset-password`,
        {
          ...data,
          otp,
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (e) {
      console.log("RESET PASSWORD ERROR: ", e);
      toast.error(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <section>
        <h1 className="text-center pb-5 text-4xl font-mono underline">My Trands</h1>
        {!otpSent ? (
          <form
            onSubmit={handleSubmit(sendOtpHandler)}
            className="flex flex-col gap-y-3 max-w-[480px] shadow-lg shadow-blue-300 border p-10 rounded-lg"
          >
            <h3 className="text-3xl pb-5 text-center leading-[1.125]">Reset Password</h3>

            <span className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="Email"
                className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors?.email && <div>{errors.email.message}</div>}
            </span>

            <span className="flex flex-col gap-1">
              <label htmlFor="DOB">Date of Birth (dd-mm-yyyy)</label>
              <input
                id="DOB"
                placeholder="25-06-2001"
                className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300"
                type="text"
                {...register("DOB", { required: "DOB is required" })}
              />
              {errors?.DOB && <div>{errors.DOB.message}</div>}
            </span>

            <span className="flex flex-col gap-1">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                id="oldPassword"
                placeholder="Old Password"
                className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300"
                type="password"
                {...register("oldPassword", { required: "Old password is required" })}
              />
              {errors?.oldPassword && <div>{errors.oldPassword.message}</div>}
            </span>

            <span className="flex flex-col gap-1">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                placeholder="New Password"
                className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300"
                type="password"
                {...register("newPassword", { required: "New password is required" })}
              />
              {errors?.newPassword && <div>{errors.newPassword.message}</div>}
            </span>

            <button
              disabled={loading}
              type="submit"
              className="text-white mt-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-y-3 max-w-[480px] shadow-lg shadow-blue-300 border p-10 rounded-lg">
            <h3 className="text-3xl pb-5 text-center leading-[1.125]">Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="py-1 text-base placeholder:text-black text-slate-950 rounded-lg px-3 outline-none bg-slate-300"
            />
            <button
              disabled={loading}
              onClick={resetPasswordHandler}
              className="text-white mt-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {loading ? "Submitting..." : "Continue"}
            </button>
          </div>
        )}
      </section>
          </div>
  );
};

export default ForgetPass;
