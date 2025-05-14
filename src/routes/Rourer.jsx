import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Features from "../pages/features/Features";
import Planpage from "../pages/planpage/Planpage";
import AboutUs from "../pages/AboutUs/AboutUs";
import ContuctUs from "../pages/contuctus/ContuctUs";
import LoginOrSignup from "../pages/loginOrSignUp/LoginOrSignup";
import CommonLayout from "../container/commonLayout";
import OtpCrossCheck from "../pages/OtpCrosscheck/OtpCrossCheck";
import ResumeUpload from "../pages/resumeUpload/ResumeUplod";
import AboutMe from "../pages/Aboutme/Aboutme";
import Experience from "../pages/expreance/Exprence";
import EducationCertificate from "../pages/certificates/Certificates";
import UserOrAdminDBLayout from "../container/UserOrAdminDBLayout";


const Router = () => {
  return (
    <Routes>
      {/* Root layout with common navbar */}
      <Route path="/" element={<CommonLayout />}>
        {/* Nested routes */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Planpage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContuctUs />} />
        <Route path="/login" element={<LoginOrSignup />} />
        <Route path="/signup" element={<LoginOrSignup />} />
        <Route path="/otp-crosscheck" element={<OtpCrossCheck />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/aboutMe" element={<AboutMe/>} />
        <Route path="/exprience" element={<Experience/>} />
        <Route path="/certificates" element={<EducationCertificate/>} />
      </Route>
      <Route path="/userDashboard" element={<UserOrAdminDBLayout/>} />


    </Routes>
  );
};

export default Router;
