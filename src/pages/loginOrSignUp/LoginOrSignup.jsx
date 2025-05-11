import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import botImg from "../../assets/logos/Hi_bot.png";
import Buttons from "../../reuseable/AllButtons";

const LoginOrSignup = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Login handler
  const triggerFunctionForLogIN = (e) => {
    e.preventDefault();

    // TODO: Add login API call here
    console.log("Logging in with:", {
      email: formData.email,
      password: formData.password
    });
  };

  // SignUp handler
  const triggerFunctionForSignUp = (e) => {
    e.preventDefault();

    // TODO: Add signup API call here
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
      <div className="w-1/2 p-10 flex items-center justify-center  ">
        {currentPath === "/login" ? (
          // Login Form
          <form onSubmit={triggerFunctionForLogIN} className="space-y-4 w-full max-w-sm relative right-[20%]">
            <h2 className=" mb-4 text-center text-black font-semibold text-5xl">Log In</h2>
            <div>
              <label className="text-[20px] font-normal text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded text-black "
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
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
          </form>
        ) : (
          // Sign Up Form
          <form onSubmit={triggerFunctionForSignUp} className="space-y-4 w-full max-w-sm relative right-[20%]">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <div>
              <label className="text-[20px] font-normal text-black">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">Phone Number</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-black">confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded text-black"
                placeholder="Confirm a password"
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
