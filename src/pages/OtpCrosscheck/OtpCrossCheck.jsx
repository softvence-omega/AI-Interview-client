import React, { useState } from "react";
import img1 from "../../assets/mobileDroied.png";
import Buttons from "../../reuseable/AllButtons";
import { useAuth } from "../../context/AuthProvider";
import useApi from "../../hook/apiHook";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OtpCrossCheck = () => {
  const { otpToken } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { request } = useApi();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await request({
        endpoint: "/auth/otpcrossCheck",
        method: "POST",
        body: {
          token: otpToken,
          recivedOTP: enteredOtp,
        },
      });

      if (res?.ok) {
        toast.success(`${res.data.message}`);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(res?.message || "❌ OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("❌ Something went wrong during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);

      const res = await request({
        endpoint: "/auth/resendOtp",
        method: "POST",
        body: {
          token: otpToken,
        },
      });

      if (res?.success) {
        toast.success("✅ OTP has been resent to your email.");
      } else {
        toast.error(res?.message || "❌ Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("❌ Error while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img src={img1} alt="mobile" className="w-24 h-24 mb-6" />
          <h2 className="text-2xl font-semibold text-[#37B874] mb-2">
            Verify OTP
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please provide the OTP sent to your email
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-between mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  className="w-10 h-12 text-center border border-gray-400 rounded-md text-lg focus:outline-none focus:border-[#37B874]"
                />
              ))}
            </div>

            <Buttons.SubmitButton
              text={loading ? "Verifying..." : "Verify OTP"}
              height="h-[50px]"
              rounded="rounded-[8px]"
              disabled={loading}
            />

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-[#37B874] hover:underline"
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpCrossCheck;
