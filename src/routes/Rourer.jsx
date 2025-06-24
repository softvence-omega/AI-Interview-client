import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Features from "../pages/features/Features";
import Planpage from "../pages/planpage/Planpage";
import AboutUs from "../pages/AboutUs/AboutUs";
import ContuctUs from "../pages/contuctus/ContuctUs";
import LoginOrSignup from "../pages/loginOrSignUp/LoginOrSignup";
import CommonLayout from "../container/CommonLayout";
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
import GenerateAboutMe from "../pages/genarateAboutMe/GenarateAboutMe";
import AboutMeVideoTest from "../pages/aboutMeVidioTest/AboutMeVideoTest";
import Settings from "../pages/userPages/settings/Settings";
import PaymentManagement from "../pages/adminPages/paymentManagement/PaymentManagement";
import UserManagement from "../pages/adminPages/userManagement/UserManagement";
import NotificationList from "../pages/userPages/notifications/NotificationList";
import ContentManagement from "../pages/adminPages/ContentManajment/ContentManagement";
import UserDetailsManagement from "../pages/adminPages/userManagement/UserDetailsManagement";
import ViewInterviewForEdit from "../pages/adminPages/ContentManajment/ViewInterviewForEdit";
import EditQuestionBank from "../pages/adminPages/ContentManajment/EditQuestionBank";
import EditInterview from "../pages/adminPages/ContentManajment/EditInterview";
import CreateInterviewAndPosition from "../pages/adminPages/ContentManajment/CreateInterviewAndPosition";
import SettingsManage from "../pages/adminPages/settings/SettingsManage";
import GeneralSettings from "../pages/adminPages/settings/GeneralSettings";
import Subscription from "../pages/adminPages/settings/Subscription";
import PrivacyOptions from "../pages/adminPages/settings/PrivacyOptions";
import NotificationPage from "../pages/adminPages/notifications/NotificationPage";
import PrivateRoute from "../privateRoutes/PrivateRoute";
import Unauthorized from "../privateRoutes/Unauthorized";
import CreateAdminPage from "../pages/adminPages/userManagement/CreateAdminPage";
import TermsAndConditions from "../pages/termsAndConditions/TermsAndConditions";
import ErrorPage from "../reuseable/ErrorPage";
import LandingPageManage from "../pages/adminPages/settings/LandingPageManage";
import PrivacyPolicy from "../pages/privacyPolicy/PrivacyPolicy";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";

const Router = () => {
  return (
    <Routes>
      {/* Public routes with common layout */}
      <Route path="/" element={<CommonLayout />}>
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
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes for both users and admins */}
      <Route
        path="/userDashboard"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <UserOrAdminDBLayout />
          </PrivateRoute>
        }
      >
        {/* User-accessible routes */}
        <Route path="mockInterview" element={<MockInterview />} />
        <Route path="mockInterview/:id" element={<MockInterviewDetail />} />
        <Route path="mockInterview/questionBank" element={<QuestionBankDetail />} />
        <Route path="mockInterview/startInterview" element={<StartInterviewPage />} />
        <Route path="incites" element={<Insights />} />
        <Route path="notificationList" element={<NotificationList />} />
        <Route path="myJobs" element={<MyJobs />} />
        <Route path="job-details/:jobId" element={<JobDetails />} />
        <Route path="settings" element={<Settings />} />

        {/* Admin-only routes */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="payment-management"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <PaymentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="user-management"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="user-management/create-admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <CreateAdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <NotificationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="content_management"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ContentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="user-details/:userId"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <UserDetailsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="content_management/addInterviewAndQuestionBank"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <CreateInterviewAndPosition />
            </PrivateRoute>
          }
        />
        <Route
          path="content_management/view_Interview_To_Edit/:interview_id"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ViewInterviewForEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="content_management/view_Interview_To_Edit/:interview_id/editPosition/:questionBank_id"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <EditQuestionBank />
            </PrivateRoute>
          }
        />
        <Route
          path="content_management/view_Interview_To_Edit/:interview_id/editInterview/:interview_id"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <EditInterview />
            </PrivateRoute>
          }
        />
        <Route
          path="settings-manage"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <SettingsManage />
            </PrivateRoute>
          }
        />
        <Route
          path="settings-manage/general-settings"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <GeneralSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="settings-manage/subscription"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Subscription />
            </PrivateRoute>
          }
        />
        <Route
          path="settings-manage/landing-page-manage"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <LandingPageManage />
            </PrivateRoute>
          }
        />
        <Route
          path="settings-manage/privacy"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <PrivacyOptions />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Error page route */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
