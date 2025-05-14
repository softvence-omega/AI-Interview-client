import React from "react";
import { useNavigate } from "react-router-dom";

const UserOrAdminDBLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth token)
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#37B874] text-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 text-2xl font-bold border-b border-gray-300">
          Dashboard
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="w-full text-left py-2 px-4 rounded hover:bg-[#2f9b63] transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation("/add-user")}
            className="w-full text-left py-2 px-4 rounded hover:bg-[#2f9b63] transition"
          >
            Add User
          </button>
          <button
            onClick={() => handleNavigation("/add-admin")}
            className="w-full text-left py-2 px-4 rounded hover:bg-[#2f9b63] transition"
          >
            Add Admin
          </button>
          <button
            onClick={() => handleNavigation("/manage-user")}
            className="w-full text-left py-2 px-4 rounded hover:bg-[#2f9b63] transition"
          >
            Manage User
          </button>
          <button
            onClick={() => handleNavigation("/manage-admin")}
            className="w-full text-left py-2 px-4 rounded hover:bg-[#2f9b63] transition"
          >
            Manage Admin
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 rounded bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 shadow flex justify-between items-center">
          <h1 className="text-xl font-semibold">User/Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Logged in as: Admin</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div> {/* Placeholder for user avatar */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children || <p className="text-gray-600">Select an option from the sidebar to view content.</p>}
        </div>
      </div>
    </div>
  );
};

export default UserOrAdminDBLayout;