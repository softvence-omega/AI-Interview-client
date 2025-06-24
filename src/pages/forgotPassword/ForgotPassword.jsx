import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const authPath = "/auth";

  // Step 1: Submit email for password reset
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${authPath}/forgetPassword`,
        {
          email,
        }
      );

      if (response.data.success) {
        setToken(response.data.body.token);
        setSuccess(response.data.message);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${authPath}/otpcrossCheck`,
        {
          token,
          recivedOTP: parseInt(otp),
          passwordChange: true,
        }
      );

      if (response.data.success) {
        setSuccess("OTP verified successfully");
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${authPath}/resetPassword`,
        {
          token,
          newPassword,
        }
      );

      if (response.data.success) {
        setSuccess(
          "Password reset successfully! Please login with your new password."
        );
        setTimeout(() => {
          // Redirect to login page or handle as needed
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#212121]">
          Forgot Password
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-1 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874] text-gray-800 placeholder:text-gray-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#37B874] text-white py-2 rounded-lg hover:bg-[#195234] disabled:bg-green-300 cursor-pointer transition-colors duration-400"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border-1 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874] text-gray-800 placeholder:text-gray-300"
                placeholder="Enter OTP received"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#37B874] text-white py-2 rounded-lg hover:bg-[#195234] disabled:bg-green-300 cursor-pointer transition-colors duration-400"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Step 3: New Password Input */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border-1 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874] text-gray-800 placeholder:text-gray-300"
                placeholder="Enter new password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#37B874] text-white py-2 rounded-lg hover:bg-[#195234] disabled:bg-green-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
