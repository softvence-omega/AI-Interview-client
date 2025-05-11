import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import botImg from "../../assets/logos/Hi_bot.png";
import Buttons from "../../reuseable/AllButtons";

const LoginOrSignup = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Login handler
  const triggerFunctionForLogIN = (e) => {
    e.preventDefault();
    console.log("Logging in with:", {
      email: formData.email,
      password: formData.password,
    });
  };

  // SignUp handler
  const triggerFunctionForSignUp = (e) => {
    e.preventDefault();
    console.log("Signing up with:", formData);
  };

  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden">
      {/* Left: Bot Image Section */}
      <div
        style={{ background: "var(--btn-primary-color)" }}
        className="w-1/2 flex justify-center items-center"
      >
        <div className="relative left-[25%]">
          <img
            src={botImg}
            alt="bot img not found"
            className="h-3/4 w-auto object-contain"
          />
        </div>
      </div>

      {/* Right: Form Section */}
      <div className="w-1/2 p-10 flex items-center justify-center">
        {currentPath === "/login" ? (
          // Login Form
          <form
            onSubmit={triggerFunctionForLogIN}
            className="space-y-4 w-full max-w-sm relative right-[20%]"
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

            <Link
              to="/forgot-password"
              className="text-sm text-black"
            >
              Forgot password?
            </Link>
          </form>
        ) : (
          // Sign Up Form
          <form
            onSubmit={triggerFunctionForSignUp}
            className="space-y-4 w-full max-w-sm relative right-[20%]"
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
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
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
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginOrSignup;
