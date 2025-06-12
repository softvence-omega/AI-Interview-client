import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import Container from "./container";
import dbLogo from "../assets/logos/dbLogo.png";
import { useAuth } from "../context/AuthProvider";
import { IoHome } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { MdOutlineInsights } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import Notification from "../pages/userPages/notifications/Notification";
import { toast } from "sonner";

const UserOrAdminDBLayout = () => {
  const { user, logout } = useAuth();
  const userData = user?.userData;
  const userMeta = user?.userMeta;
  const userType = user?.userData?.role;
  console.log("user********************", user, "meta*********", userMeta);

  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userRoutes = [
    { name: "Mock Interviews", logo: <IoHome />, to: "mockInterview" },
    { name: "My Jobs", logo: <MdOutlineBusinessCenter />, to: "myJobs" },
    { name: "Insights", logo: <MdOutlineInsights />, to: "incites" },
    { name: "Settings", logo: <IoSettings />, to: "settings" },
  ];

  const adminRoutes = [
    { name: "Dashboard", logo: null, to: "dashboard" },
    { name: "Content Management", logo: null, to: "content_management" },
    { name: "User Management", logo: null, to: "user-management" },
    { name: "Payment Management", logo: null, to: "payment-management" },
    { name: "Notification", logo: null, to: "notifications" },
    { name: "Settings", logo: null, to: "settings-manage" },
  ];

  // Extract the base route segment after /userDashboard/
  const baseRoute = location.pathname
    .split("/userDashboard/")[1]
    ?.split("/")[0] || "";
  console.log("baseRoute:", baseRoute, "pathname:", location.pathname);

  const handleNavigation = (path) => {
    navigate(`/userDashboard/${path}`);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("hasRedirected");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!userType) {
      console.log("Waiting for userType to be available");
      return;
    }

    // Handle one-time redirect after login
    const hasRedirected = localStorage.getItem("hasRedirected");
    if (!hasRedirected) {
      const routes = userType === "admin" ? adminRoutes : userRoutes;
      const firstRoute = routes[0].to;
      console.log(`Performing one-time redirect to: /userDashboard/${firstRoute}`);
      localStorage.setItem("hasRedirected", "true");
      navigate(`/userDashboard/${firstRoute}`);
      return;
    }

    // Show notifications for incomplete steps (non-admins only)
    if (userType !== "admin" && userMeta) {
      const completedSteps = userMeta;
      const currentPath = location.pathname;

      if (!userData.OTPverified) {
        console.log("User is not OTP verified");
        toast.error("Please get OTP verified in Settings", {
          description: "Complete OTP verification to access all features.",
          action: {
            label: "Go to Settings",
            onClick: () => handleNavigation("settings"),
          },
        });
      } else if (
        !completedSteps.isResumeUploaded &&
        currentPath !== "/resume-upload"
      ) {
        console.log("Resume not uploaded");
        toast.warning("Please upload your resume", {
          description: "Upload your resume to unlock more features.",
          action: {
            label: "Upload Resume",
            onClick: () => navigate("/resume-upload"),
          },
        });
      } else if (
        !completedSteps.isAboutMeGenerated &&
        currentPath !== "/generateAboutMe"
      ) {
        console.log("About Me not generated");
        toast.warning("Please generate your About Me section", {
          description: "Complete your About Me to enhance your profile.",
          action: {
            label: "Generate About Me",
            onClick: () => navigate("/generateAboutMe"),
          },
        });
      } else if (
        !completedSteps.isAboutMeVideoChecked &&
        currentPath !== "/generateAboutMe"
      ) {
        console.log("About Me video not checked");
        toast.warning("Please complete your About Me video", {
          description: "Finish your About Me video to proceed.",
          action: {
            label: "Complete Video",
            onClick: () => navigate("/generateAboutMe"),
          },
        });
      }
    }
  }, [userType, userMeta, userData, navigate, location.pathname]);

  return (
    <div className="h-screen mx-auto flex bg-gray-100 max-w-9xl">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static h-full bg-transparent text-white flex flex-col transition-all duration-300 z-30 ${
          isSidebarOpen ? "w-64" : "w-0 lg:w-64 overflow-hidden"
        }`}
        style={{ boxShadow: "2px 0 2px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 right-4 text-white z-40"
        >
          ✕
        </button>

        {/* Sidebar Header */}
        <Link to="/" className="bg-white">
          <div className="p-4 text-2xl font-bold border-b">
            <img src={dbLogo} alt="logo not available" />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 bg-white">
          {(userType === "admin" ? adminRoutes : userRoutes).map(
            (route, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(route.to)}
                className={`w-full text-left py-2 px-4 rounded transition ${
                  baseRoute === route.to
                    ? "bg-[#3A4C67] text-white"
                    : "hover:bg-[#3A4C67] hover:text-white text-[#676768]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {route.logo || null}
                  <h2>{route.name}</h2>
                </div>
              </button>
            )
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 rounded transition"
          >
            <div className="flex gap-4 items-center cursor-pointer">
              <span className="text-red-600">
                <RiLogoutBoxLine />
              </span>
              <span className="text-black">Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto flex-1 flex flex-col">
        {/* Header with Toggle Button */}
        <div className="bg-white p-4 shadow flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-[#37B874] focus:outline-none text-4xl"
          >
            ☰
          </button>

          <div className="flex items-center justify-center space-x-2 w-full">
            <div className="w-full">
              <div className="w-16 h-16 rounded-[8px]">
                <img
                  src={
                    userData?.profilePicture ||
                    "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
                  }
                  alt="User Profile"
                  className="w-full h-full rounded-[8px]"
                />
              </div>
              <div className="text-gray-600">
                <h2 className="text-[#676768]">Welcome!</h2>
                <h2 className="text-[20px] font-medium">
                  {userData?.name?.toUpperCase() || "Guest"}
                </h2>
              </div>
            </div>

            {userType === "user" && <Link to="notificationList"><Notification /></Link>}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserOrAdminDBLayout;