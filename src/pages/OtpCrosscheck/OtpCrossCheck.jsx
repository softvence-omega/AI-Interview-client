import React, { useState, useEffect } from 'react';
import img1 from '../../assets/mobileDroied.png';
import { useAuth } from '../../context/AuthProvider';
import useApi from '../../hook/apiHook';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const OtpCrossCheck = ({ adminOTPToken, navigateTo }) => {
  console.log(".......>>>>>>>>>>>>>>>>>>>>>>>>======>>>>>>>>>>>", adminOTPToken);

  const { setOtpToken, otpToken, logout } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const { request } = useApi();
  const navigate = useNavigate();

  const tokenToUse = adminOTPToken || otpToken;

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
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      toast.error('Please enter the full 6-digit OTP.');
      return;
    }
    if (!tokenToUse) {
      toast.error('No OTP token available.');
      return;
    }

    try {
      setVerifyLoading(true);
      const res = await request({
        endpoint: '/auth/otpcrossCheck',
        method: 'POST',
        body: {
          token: tokenToUse,
          recivedOTP: enteredOtp,
        },
      });

      if (res?.ok) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          setOtp(['', '', '', '', '', '']);
          if (navigateTo === '/userDashBoard/mockInterview') {
            logout();
            navigate('/login');
          } else {
            navigate(navigateTo || '/login');
          }
        }, 1500);
      } else {
        toast.error(res?.message || '❌ OTP verification failed.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('❌ Something went wrong during OTP verification.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    if (!tokenToUse) {
      toast.error('No OTP token available for resend.');
      return;
    }

    try {
      setResendLoading(true);
      const res = await request({
        endpoint: '/auth/reSend_OTP',
        method: 'POST',
        body: {
          resendOTPtoken: tokenToUse,
        },
      });

      if (res?.ok) {
        toast.success(res.data.message || '✅ OTP has been resent to your email.');
        if (res.data.body) {
          setOtpToken(res.data.body);
        }
        setTimeLeft(120);
        setResendDisabled(true);
      } else {
        toast.error(res?.message || '❌ Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('❌ Error while resending OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendDisabled && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="shadow-lg rounded-2xl p-8 w-full max-w-md bg-white">
        <div className="flex flex-col items-center">
          <img src={img1} alt="mobile" className="w-24 h-24 mb-6" />
          <h2 className="text-2xl font-semibold text-[#37B874] mb-2">Verify OTP</h2>
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
                  className="w-10 h-12 text-center border border-gray-400 rounded-md text-lg focus:outline-none focus:border-[#37B874] transition duration-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifyLoading}
              className={`w-full py-3 px-4 bg-[#37B874] text-white rounded-md hover:bg-[#2ea664] transition duration-200 hover:shadow-md flex items-center justify-center ${
                verifyLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {verifyLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : null}
              {verifyLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || resendDisabled}
                className="text-sm text-[#37B874] hover:underline"
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
              {resendDisabled && timeLeft > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  (Time left: {formatTime(timeLeft)})
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpCrossCheck;
