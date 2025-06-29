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
import axios from "axios";

const UserOrAdminDBLayout = () => {
  const { user, logout } = useAuth();
  const userData = user?.userData;
  const userMeta = user?.userMeta;
  const userType = user?.userData?.role;

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  console.log("user********************", user, "meta*********", userMeta);

  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const baseRoute =
    location.pathname.split("/userDashboard/")[1]?.split("/")[0] || "";
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
    if (!userType || !userData) return;

    const currentPath = location.pathname;
    const isAdmin = userType === "admin";
    const hasRedirected = localStorage.getItem("hasRedirected");

    const routes = isAdmin ? adminRoutes : userRoutes;
    const firstRoute = routes[0].to;

    // Handle non-admin conditions first
    if (!isAdmin && userMeta) {
      const completedSteps = userMeta;

      console.log("console log from redirect", userMeta);

      if (!userData.OTPverified) {
        toast.error("Please get OTP verified in Settings", {
          description: "Complete OTP verification to access all features.",
          action: {
            label: "Go to Settings",
            onClick: () => handleNavigation("settings"),
          },
        });
        navigate("/userDashboard/settings");
        return;
      }

      if (
        !completedSteps.isResumeUploaded &&
        currentPath !== "/resume-upload"
      ) {
        toast.warning("Please upload your resume", {
          description: "Upload your resume to unlock more features.",
          action: {
            label: "Upload Resume",
            onClick: () => navigate("/resume-upload"),
          },
        });
        navigate("/resume-upload");
        return;
      }

      if (
        !completedSteps.isAboutMeGenerated &&
        currentPath !== "/generateAboutMe"
      ) {
        toast.warning("Please generate your About Me section", {
          description: "Complete your About Me to enhance your profile.",
          action: {
            label: "Generate About Me",
            onClick: () => navigate("/generateAboutMe"),
          },
        });
        navigate("/generateAboutMe");
        return;
      }

      if (
        !completedSteps.isAboutMeVideoChecked &&
        currentPath !== "/generateAboutMe"
      ) {
        toast.warning("Please complete your About Me video", {
          description: "Finish your About Me video to proceed.",
          action: {
            label: "Complete Video",
            onClick: () => navigate("/generateAboutMe"),
          },
        });
        navigate("/generateAboutMe");
        return;
      }
    }

    // After checks pass, perform one-time redirect if not already done
    if (!hasRedirected && baseRoute === "") {
      localStorage.setItem("hasRedirected", "true");
      navigate(`/userDashboard/${firstRoute}`);
    }
  }, [userType, userMeta, userData, navigate, location.pathname]);

  useEffect(() => {
    if (!user?.approvalToken) {
      setLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/getProfile`,
          {
            headers: {
              Authorization: `${user.approvalToken}`,
            },
          }
        );

        setProfile(response.data);
        console.log(
          "profileeeeeeeee :::::::::",
          response.data.data.interviewsAvailable
        );
      } catch (error) {
        setErrorProfile(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // useEffect(() => {
  //   if (!userType) {
  //     console.log("Waiting for userType to be available");
  //     return;
  //   }

  //   // Handle one-time redirect after login
  //   const hasRedirected = localStorage.getItem("hasRedirected");
  //   if (!hasRedirected) {
  //     const routes = userType === "admin" ? adminRoutes : userRoutes;
  //     const firstRoute = routes[0].to;
  //     console.log(`Performing one-time redirect to: /userDashboard/${firstRoute}`);
  //     localStorage.setItem("hasRedirected", "true");
  //     navigate(`/userDashboard/${firstRoute}`);
  //     return;
  //   }

  //   // Show notifications for incomplete steps (non-admins only)
  //   if (userType !== "admin" && userMeta) {
  //     const completedSteps = userMeta;
  //     const currentPath = location.pathname;

  //     if (!userData.OTPverified) {
  //       console.log("User is not OTP verified");
  //       toast.error("Please get OTP verified in Settings", {
  //         description: "Complete OTP verification to access all features.",
  //         action: {
  //           label: "Go to Settings",
  //           onClick: () => handleNavigation("settings"),
  //         },
  //       });
  //     } else if (
  //       !completedSteps.isResumeUploaded &&
  //       currentPath !== "/resume-upload"
  //     ) {
  //       console.log("Resume not uploaded");
  //       toast.warning("Please upload your resume", {
  //         description: "Upload your resume to unlock more features.",
  //         action: {
  //           label: "Upload Resume",
  //           onClick: () => navigate("/resume-upload"),
  //         },
  //       });
  //     } else if (
  //       !completedSteps.isAboutMeGenerated &&
  //       currentPath !== "/generateAboutMe"
  //     ) {
  //       console.log("About Me not generated");
  //       toast.warning("Please generate your About Me section", {
  //         description: "Complete your About Me to enhance your profile.",
  //         action: {
  //           label: "Generate About Me",
  //           onClick: () => navigate("/generateAboutMe"),
  //         },
  //       });
  //     } else if (
  //       !completedSteps.isAboutMeVideoChecked &&
  //       currentPath !== "/generateAboutMe"
  //     ) {
  //       console.log("About Me video not checked");
  //       toast.warning("Please complete your About Me video", {
  //         description: "Finish your About Me video to proceed.",
  //         action: {
  //           label: "Complete Video",
  //           onClick: () => navigate("/generateAboutMe"),
  //         },
  //       });
  //     }
  //   }
  // }, [userType, userMeta, userData, navigate, location.pathname]);

  if (loadingProfile)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-green-500 opacity-20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-600 animate-spin border-t-transparent"></div>
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shadow-md">
              <svg
                className="w-6 h-6 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A12.073 12.073 0 0112 15c2.21 0 4.284.636 6.02 1.727M4 4h16M4 4a3 3 0 013-3h10a3 3 0 013 3M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-700 text-lg font-semibold tracking-wide">
            Loading your profile...
          </p>
          <p className="text-sm text-gray-400">This won't take long.</p>
        </div>
      </div>
    );
  if (errorProfile) return <div>Error: {errorProfile}</div>;

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
            <div className="w-full flex gap-2 justify-items-center items-center">
              <div className="w-18 h-18 rounded-[8px]">
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
                <div className="flex justify-items-center items-center gap-2">
                  <h2 className="text-[20px] font-medium">
                    {userData?.name?.toUpperCase() || "Guest"}
                  </h2>
                  <h4 className="text-sm font-light text-gray-400">
                    {userData?.role === "user" && (
                      <p>
                        ( Available Interview :{" "}
                        {profile?.data?.interviewsAvailable} )
                      </p>
                    )}
                  </h4>
                </div>
              </div>
            </div>

            {userType === "user" && (
              <Link to="notificationList">
                <Notification />
              </Link>
            )}
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
