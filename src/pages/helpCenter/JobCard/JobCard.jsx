import React from "react";
import { FaSearch } from "react-icons/fa";
import "./JobCard.css";

const JobCard = () => {
  return (
    <div className="mx-4">
      <div className="max-w-7xl mx-auto pt-12 md:pt-20 lg:pt-24">
        <div className="relative w-[70%] mx-auto">
          <input
            type="text"
            className="w-full bg-white px-4 py-3 rounded-lg text-black text-justify pl-6 pr-12 border-none focus:border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874] transition duration-200 my-2 shadow-lg"
            placeholder="Search"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-[#676768] opacity-50" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 justify-items-center">
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Account & Profile Management</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Mock Interview Features</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Job Tracking & Chrome Extension</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Features & Functionality</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Technical Issues</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Privacy & Data Protection</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>General Platform Information</h2>
          </div>
          <div
            id="bgImage"
            className="bg-[#3A4C67] h-36 w-60 px-6 text-[20px] font-medium text-[#EBF8F1]  flex justify-center text-center items-center rounded-lg"
          >
            <h2>Customer Support</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
