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
import MockInterview from "../pages/userPages/mockInterview/MockInterview";
import MockInterviewDetail from "../pages/userPages/mockInterview/MockInterviewDetail";
import QuestionBankDetail from "../pages/userPages/mockInterview/QuestionBankDetail";
import StartInterviewPage from "../pages/userPages/mockInterview/StartInterviewPage";
import HelpCenter from "../pages/helpCenter/HelpCenter";
import PaymentStatus from "../pages/planpage/payment/PaymentStatus";
import Insights from "../pages/userPages/insights/Insights";
import MyJobs from "../pages/userPages/myJobs/MyJobs";
import JobDetails from "../pages/userPages/myJobs/JobDetails";
import Dashboard from "../pages/adminPages/dashboard/Dashboard";
import GenerateAboutMe from "../pages/genarateAboutMe/genarateAboutMe";
import AboutMeVideoTest from "../pages/aboutMeVidioTest/AboutMeVideoTest";
import Settings from "../pages/userPages/settings/Settings";
import PaymentManagement from "../pages/adminPages/paymentManagement/PaymentManagement";
import UserManagement from "../pages/adminPages/userManagement/UserManagement";
import NotificationList from "../pages/userPages/notifications/NotificationList"; 
import ContentManagement from "../pages/adminPages/ContentManajment/ContentManagement";

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
        <Route path="/generateAboutMe" element={<GenerateAboutMe />} />
        <Route path="/takeAboutMeVideoTest" element={<AboutMeVideoTest />} />
        <Route path="/aboutMe" element={<AboutMe />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/certificates" element={<EducationCertificate />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
      </Route>

      <Route path="/userDashboard" element={<UserOrAdminDBLayout />}>
        <Route path="mockInterview" element={<MockInterview />} />
        <Route path="mockInterview/:id" element={<MockInterviewDetail />} />
        <Route
          path="mockInterview/questionBank"
          element={<QuestionBankDetail />}
        />
        <Route
          path="mockInterview/startInterview"
          element={<StartInterviewPage />}
        />
        <Route path="incites" element={<Insights />} />
        <Route path="notificationList" element={<NotificationList />} />
        <Route path="myJobs" element={<MyJobs />} />
        <Route path="job-details/:jobId" element={<JobDetails />} />


        //admin routes
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="payment-management" element={<PaymentManagement />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="content_management" element={<ContentManagement />} />
      </Route>
    </Routes>
  );
};

export default Router;
