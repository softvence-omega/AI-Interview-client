// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import botImg from "../../assets/logos/Hi_bot.png";
// import Buttons from "../../reuseable/AllButtons";
// import useApi from "../../hook/apiHook";
// import { useAuth } from "../../context/AuthProvider";
// import { toast } from "sonner";

// const LoginOrSignup = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const currentPath = location.pathname;
//   const { request } = useApi();
//   const { setUser, setOtpToken } = useAuth();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     aggriedToTerms: true,
//   });

//   useEffect(() => {
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       phone: "",
//       aggriedToTerms: true,
//     });
//   }, [location.pathname]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const triggerFunctionForLogIN = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await request({
//         endpoint: "/auth/login",
//         method: "POST",
//         body: {
//           email: formData.email,
//           password: formData.password,
//         },
//       });

//       if (res.ok && res.data) {
//         const userData = {
//           userMeta:res.data.meta,
//           userData: res.data.user,
//           approvalToken: res.data.approvalToken,
//           refreshToken: res.data.refreshToken,
//         };
//         setUser(userData);
//         localStorage.setItem("userData", JSON.stringify(userData));
//         toast.success("✅ Log in successful!");

//         setTimeout(() =>navigate("/userDashBoard"), 1500);
//       }
//       else {
//         toast.error(res.message || "Login failed");
//         console.error("Login failed", res);
//       }
//     } catch (err) {
//       console.error("Login error", err);
//       toast.error("An error occurred during login.");
//     }
//   };

//   const triggerFunctionForSignUp = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await request({
//         endpoint: "/users/createUser",
//         method: "POST",
//         body: {
//           name: formData.name,
//           phone: formData.phone,
//           email: formData.email,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//           aggriedToTerms: formData.aggriedToTerms,
//         },
//       });

//       if (res.ok && res.data?.data?.token) {
//         console.log("i am here")
//         setOtpToken(res.data.data.token);
//         toast.success("✅ Check your email for OTP!");
//         setTimeout(() => navigate("/otp-crosscheck"), 1500);
//       }
//       else {
//         toast.error(res.data.message || "Signup failed");
//         console.error("Signup failed", res);
//       }
//     } catch (err) {
//       console.error("Signup error", err);
//       toast.error("An error occurred during sign-up.");
//     }
//   };

//   return (
//     <div className="md:flex lg:flex w-screen min-h-screen bg-white overflow-hidden">
//       {/* Left: Bot Image Section */}
//       <div
//         style={{ background: "var(--btn-primary-color)" }}
//         className="w-full md:w-1/2 lg:w-1/2 flex justify-center items-center"
//       >
//         <div className="relative md:left-[5%] lg:left-[15%] pb-6 md:pb-0 lg:pb-0">
//           <img
//             src={botImg}
//             alt="bot img not found"
//             className="h-3/4 w-auto object-contain"
//           />
//         </div>
//       </div>

//       {/* Right: Form Section */}
//       <div className="w-full md:w-1/2 lg:w-1/2 p-10 flex items-center justify-center">
//         {currentPath === "/login" ? (
//           <form
//             onSubmit={triggerFunctionForLogIN}
//             className="space-y-4 w-full max-w-sm relative md:right-[10%] lg:right-[10%]"
//           >
//             <h2 className="mb-4 text-center text-black font-semibold text-5xl">
//               Log In
//             </h2>
//             <div>
//               <label className="text-[20px] font-normal text-black">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-[20px] font-normal text-black">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//             <Buttons.SubmitButton
//               text="Log In"
//               height="h-[60px]"
//               rounded="rounded-[10px]"
//               onClick={triggerFunctionForLogIN}
//             />
//             <div className="w-full flex flex-col items-center mt-10 space-y-4 text-sm text-[#3A4C67]">
//               <Link to="/forgot-password" className="hover:underline">
//                 Forgot password?
//               </Link>
//               <div className="text-center flex mt-14">
//                 <p>Don&apos;t have an account?</p>
//                 <Link
//                   to="/signup"
//                   className="hover:underline ml-2"
//                   style={{ color: "var(--btn-primary-color)" }}
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             </div>
//           </form>
//         )
//         :
//         (
//           <form
//             onSubmit={triggerFunctionForSignUp}
//             className="space-y-4 w-full max-w-sm relative md:right-[5%] lg:right-[10%]"
//           >
//             <h2 className="mb-4 text-center text-black font-semibold text-5xl">
//               Sign Up
//             </h2>
//             <div>
//               <label className="text-[20px] font-normal text-black">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="Your name"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-[20px] font-normal text-black">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-[20px] font-normal text-black">
//                 Phone
//               </label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="Your phone number"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-[20px] font-normal text-black">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="Create a password"
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-[20px] font-normal text-black">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full p-2 rounded text-black border-[1px] focus:outline-none mb-1"
//                 style={{ borderColor: "var(--btn-primary-color)" }}
//                 placeholder="Confirm your password"
//                 required
//               />
//             </div>
//             <Buttons.SubmitButton
//               text="Sign Up"
//               height="h-[60px]"
//               rounded="rounded-[10px]"
//               onClick={triggerFunctionForSignUp}
//             />
//             <div className="w-full flex flex-col items-center mt-10 space-y-4 text-sm text-[#3A4C67]">
//               <div className="text-center flex mt-14">
//                 <p>Already have an account?</p>
//                 <Link
//                   to="/login"
//                   className="hover:underline ml-2"
//                   style={{ color: "var(--btn-primary-color)" }}
//                 >
//                   Log In
//                 </Link>
//               </div>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginOrSignup;

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import botImg from "../../assets/features/hello 1.png";
import Buttons from "../../reuseable/AllButtons";
import useApi from "../../hook/apiHook";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "sonner";
import { TiTick } from "react-icons/ti";

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
    aggriedToTerms: false,
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Loader state
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      aggriedToTerms: false,
    });
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "aggriedToTerms") {
        console.log("aggriedToTerms changed to:", checked); // Debug log
      }
      return newData;
    });
  };

  const triggerFunctionForLogIN = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Start loader

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
          userMeta: res.data.meta,
          userData: res.data.user,
          approvalToken: res.data.approvalToken,
          refreshToken: res.data.refreshToken,
        };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success("✅ Log in successful!");

        setTimeout(() => navigate("/userDashBoard"), 1500);
      } else {
        toast.error(res.message || "Login failed");
        console.error("Login failed", res);
      }
    } catch (err) {
      console.error("Login error", err);
      toast.error("An error occurred during login.");
    } finally {
      setIsLoggingIn(false); // Stop loader
    }
  };

  const triggerFunctionForSignUp = async (e) => {
    e.preventDefault();
    setIsSigningUp(true); // Start loader

    if (!formData.aggriedToTerms) {
      toast.error("You must agree to the terms and conditions to sign up.");
      return;
    }

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
        console.log("i am here");
        setOtpToken(res.data.data.token);
        toast.success("✅ Check your email for OTP!");
        setTimeout(() => navigate("/otp-crosscheck"), 1500);
      } else {
        toast.error(res.data.message || "Signup failed");
        console.error("Signup failed", res);
      }
    } catch (err) {
      console.error("Signup error", err);
      toast.error("An error occurred during sign-up.");
    } finally {
      setIsSigningUp(false); // Stop loader
    }
  };

  return (
    <div className="md:flex lg:flex w-screen min-h-screen bg-white overflow-hidden pt-14 md:pt-0 lg:pt-0">
      {/* Left: Bot Image Section */}
      <div
        style={{ background: "#ffffff" }}
        className="w-full md:w-1/2 lg:w-1/2 flex justify-center items-center"
      >
        <div className="relative md:left-[5%] lg:left-[15%] pb-6 md:pb-0 lg:pb-0">
          <img
            src={botImg}
            alt="bot img not found"
            className="h-3/4 w-auto object-contain"
            style={{ color: "var(--btn-primary-color)" }}
          />
          <p className="text-center font-semibold text-3xl text-[#3A4C67]">
            Your first step <br /> towards a perfect interview
          </p>
        </div>
      </div>

      {/* Right: Form Section */}
      <div
        style={{ background: "var(--btn-primary-color)" }}
        className="w-full md:w-1/2 lg:w-1/2 p-10 flex items-center justify-center"
      >
        {currentPath === "/login" ? (
          <form
            onSubmit={triggerFunctionForLogIN}
            className="space-y-4 w-full max-w-sm relative md:right-[10%] lg:right-[10%]"
          >
            <h2 className="mb-4 text-center text-white font-semibold text-5xl">
              Log In
            </h2>
            <div>
              <label className="text-[20px] font-normal text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white"
                style={{ borderColor: "#ffffff" }}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5]"
                style={{ borderColor: "#ffffff" }}
                placeholder="Enter your password"
                required
              />
            </div>
            <Buttons.SubmitButton
              text={
                isLoggingIn ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-[#37B874]"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Log In"
                )
              }
              height="h-[60px]"
              rounded="rounded-[10px]"
              bgColor="bg-white"
              textColor="text-[#37B874]"
              onClick={triggerFunctionForLogIN}
            />
            <div className="w-full flex flex-col items-center mt-10 space-y-4 text-sm text-white">
              <Link
                to="/forgot-password"
                className="hover:underline text-white"
              >
                Forgot password?
              </Link>
              <div className="text-center flex mt-14">
                <p className="text-white">Don't have an account?</p>
                <Link to="/signup" className="hover:underline text-white ml-2">
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <form
            onSubmit={triggerFunctionForSignUp}
            className="space-y-4 w-full max-w-sm relative md:right-[5%] lg:right-[10%]"
          >
            <h2 className="mb-4 text-center text-white font-semibold text-5xl">
              Sign Up
            </h2>
            <div>
              <label className="text-[20px] font-normal text-white">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5]"
                style={{ borderColor: "#ffffff" }}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white"
                style={{ borderColor: "#ffffff" }}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-white">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5]"
                style={{ borderColor: "#ffffff" }}
                placeholder="Your phone number"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5]"
                style={{ borderColor: "#ffffff" }}
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label className="text-[20px] font-normal text-white">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded text-white bg-transparent border-[1px] focus:outline-none mb-1 placeholder-[#f5f5f5]"
                style={{ borderColor: "#ffffff" }}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="aggriedToTerms"
                    checked={formData.aggriedToTerms}
                    onChange={handleChange}
                    className="sr-only"
                    required
                  />
                  <span
                    className="block w-5 h-5 rounded border-[1px] border-white flex items-center justify-center"
                    style={{
                      backgroundColor: formData.aggriedToTerms
                        ? "#37B874"
                        : "#ffffff",
                      transition: "background-color 0.2s",
                    }}
                  >
                    {formData.aggriedToTerms && (
                      <TiTick className="w-4 h-4 text-white" />
                    )}
                  </span>
                </div>
                <span className="text-sm text-white">
                  I agree to the{" "}
                  <Link
                    to="/terms-and-conditions"
                    className="underline text-white hover:text-[#f5f5f5]"
                  >
                    Terms and Conditions
                  </Link>
                </span>
              </label>
            </div>
            <Buttons.SubmitButton
              text={
                isSigningUp ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-[#37B874]"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Sign Up"
                )
              }
              height="h-[60px]"
              rounded="rounded-[10px]"
              bgColor="bg-white"
              textColor="text-[#37B874]"
              onClick={triggerFunctionForSignUp}
            />
            <div className="w-full flex flex-col items-center mt-10 space-y-4 text-sm text-white">
              <div className="text-center flex mt-14">
                <p className="text-white">Already have an account?</p>
                <Link to="/login" className="hover:underline text-white ml-2">
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
