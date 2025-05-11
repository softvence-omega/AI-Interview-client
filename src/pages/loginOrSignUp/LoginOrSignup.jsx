import React from "react";
import { useLocation } from "react-router-dom";
import botImg from "../../assets/logos/Hi_bot.png";
import Buttons from "../../reuseable/AllButtons";

const LoginOrSignup = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
          // log in form
          <form className="space-y-4 w-full max-w-sm relative right-[20%]">
            <h2 className="text-2xl font-bold mb-4">Log In</h2>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="w-full p-2 rounded text-black"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                className="w-full p-2 rounded text-black"
                placeholder="Enter your password"
              />
            </div>
            <Buttons.SubmitButton text="Log In" height="h-[60px]" rounded="rounded-[10px]" />
          </form>
        ) : (
          // sign up from
          <form className="space-y-4 w-full max-w-sm relative right-[20%]">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                className="w-full p-2 rounded text-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                className="w-full p-2 rounded text-black"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                className="w-full p-2 rounded text-black"
                placeholder="Create a password"
              />
            </div>
            <Buttons.SubmitButton text="Sign Up" height="h-[60px]" />
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginOrSignup;
