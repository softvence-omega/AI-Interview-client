import React from "react";
import Navbar from "../reuseable/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../reuseable/Footer";

const CommonLayout = () => {
  return (
    <div className="">
      <div className="absolute top-0 w-full">
        <Navbar />
      </div>
      <div className="">
        <Outlet />
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
};

export default CommonLayout;
