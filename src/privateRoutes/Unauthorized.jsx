import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-orange-400 text-white rounded-md hover:bg-orange-600 transition"
        >
          Return Home
        </Link>
        <Link
          to="/login"
          className="inline-block px-6 py-3 ml-4 bg-green-400 text-white rounded-md hover:bg-green-600 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;