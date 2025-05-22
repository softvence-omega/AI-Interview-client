import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import botImg from "../../assets/logos/Hi_bot.png";
import Buttons from "../../reuseable/AllButtons";
import useApi from "../../hook/apiHook";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "sonner";

const LoginOrSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { request } = useApi();
  const { setUser, setOtpToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    aggriedToTerms: true,
  });

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      aggriedToTerms: true,
    });
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerFunctionForLogIN = async (e) => {
    e.preventDefault();

    try {
      const res = await request({
        endpoint: "/auth/login",
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (res.ok && res.data) {
        const userData = {
          userMeta:res.data.meta,
          userData: res.data.user,
          approvalToken: res.data.approvalToken,
          refreshToken: res.data.refreshToken,
        };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success("✅ Log in successful!");
        
        setTimeout(() =>navigate("/userDashBoard"), 1500);
      } 
      else {
        toast.error(res.message || "Login failed");
        console.error("Login failed", res);
      }
    } catch (err) {
      console.error("Login error", err);
      toast.error("An error occurred during login.");
    }
  };

  const triggerFunctionForSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await request({
        endpoint: "/users/createUser",
        method: "POST",
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          aggriedToTerms: formData.aggriedToTerms,
        },
      });

      if (res.ok && res.data?.data?.token) {
        console.log("i am here")
        setOtpToken(res.data.data.token);
        toast.success("✅ Check your email for OTP!");
        setTimeout(() => navigate("/otp-crosscheck"), 1500);
      } 
      else {
        toast.error(res.data.message || "Signup failed");
        console.error("Signup failed", res);
      }
    } catch (err) {
      console.error("Signup error", err);
      toast.error("An error occurred during sign-up.");
    }
  };

  return (
    <div className="md:flex lg:flex w-screen min-h-screen bg-white overflow-hidden">
      {/* Left: Bot Image Section */}
      <div
        style={{ background: "var(--btn-primary-color)" }}
        className="w-full md:w-1/2 lg:w-1/2 flex justify-center items-center"
      >
        <div className="relative md:left-[5%] lg:left-[15%] pb-6 md:pb-0 lg:pb-0">
          <img
            src={botImg}
            alt="bot img not found"
            className="h-3/4 w-auto object-contain"
          />
        </div>
      </div>

      {/* Right: Form Section */}
      <div className="w-full md:w-1/2 lg:w-1/2 p-10 flex items-center justify-center">
        {currentPath === "/login" ? (
          <form
            onSubmit={triggerFunctionForLogIN}
            className="space-y-4 w-full max-w-sm relative md:right-[10%] lg:right-[10%]"
          >
            <h2 className="mb-4 text-center text-black font-semibold text-5xl">
              Log In
            </h2>
            <div>
              <label className="text-[20px] font-normal text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="Enter your password"
                required
              />
            </div>
            <Buttons.SubmitButton
              text="Log In"
              height="h-[60px]"
              rounded="rounded-[10px]"
              onClick={triggerFunctionForLogIN}
            />
            <div className="w-full flex flex-col items-center mt-10 space-y-4 text-sm text-[#3A4C67]">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
              <div className="text-center flex mt-14">
                <p>Don&apos;t have an account?</p>
                <Link
                  to="/signup"
                  className="hover:underline ml-2"
                  style={{ color: "var(--btn-primary-color)" }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        ) 
        : 
        (
          <form
            onSubmit={triggerFunctionForSignUp}
            className="space-y-4 w-full max-w-sm relative md:right-[5%] lg:right-[10%]"
          >
            <h2 className="mb-4 text-center text-black font-semibold text-5xl">
              Sign Up
            </h2>
            <div>
              <label className="text-[20px] font-normal text-black">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="Your phone number"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
                style={{ borderColor: "var(--btn-primary-color)" }}
                placeholder="Confirm your password"
                required
              />
            </div>
            <Buttons.SubmitButton
              text="Sign Up"
              height="h-[60px]"
              rounded="rounded-[10px]"
              onClick={triggerFunctionForSignUp}
            />
            <div className="w-full flex flex-col items-center mt-10 space-y-4 text-sm text-[#3A4C67]">
              <div className="text-center flex mt-14">
                <p>Already have an account?</p>
                <Link
                  to="/login"
                  className="hover:underline ml-2"
                  style={{ color: "var(--btn-primary-color)" }}
                >
                  Log In
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginOrSignup;
