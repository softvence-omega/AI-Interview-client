import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = ({ code = 500, message: propMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const queryMessage = queryParams.get("message");

  const message =
    propMessage || queryMessage ||
    (code === 404
      ? "The page you're looking for does not exist."
      : "Sorry, something went wrong.");

  // Dynamic redirect based on error code
  const handleRedirect = () => {
    if (code === 404) {
      navigate("/");
    } else {
      navigate("/pricing#planChoose");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-500">{code}</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">
          {code === 404 ? "Oops! Page not found" : "Internal Server Error"}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
        <button
          onClick={handleRedirect}
          className="mt-6 px-6 py-2 bg-orange-400 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200 cursor-pointer"
        >
          {code === 404 ? "Go to Homepage" : "Choose a Plan"}
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
