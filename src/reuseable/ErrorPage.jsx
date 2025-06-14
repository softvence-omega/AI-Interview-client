import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = ({ message: propMessage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get query param ?message=
  const queryParams = new URLSearchParams(location.search);
  const queryMessage = queryParams.get("message");

  // Use prop message first, then query param, fallback default
  const message = propMessage || queryMessage || "Sorry, something went wrong.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">
          Oops! Page not found
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-orange-400 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
