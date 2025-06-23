import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../reuseable/Navbar";
import Footer from "../reuseable/Footer";

const CommonLayout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/resume-upload" || location.pathname === "/aboutMe" || location.pathname === "/certificates" || location.pathname === "/experience" || location.pathname === "/generateAboutMe" || location.pathname === "/takeAboutMeVideoTest";

  return (
    <div className="">
      {!hideLayout && (
        <div className="absolute top-0 w-full">
          <Navbar />
        </div>
      )}

      <div className="">
        <Outlet />
      </div>

      {!hideLayout && (
        <div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default CommonLayout;
