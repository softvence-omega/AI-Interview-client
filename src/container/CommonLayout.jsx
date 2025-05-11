import React from "react";
import Navbar from "../reuseable/Navbar";
import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <div className="">
      <div className="absolute top-0 w-full">
        <Navbar />
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default CommonLayout;
