import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FileText, GraduationCap } from "lucide-react";
import { useAuth } from "../../../context/AuthProvider";
import { IoIosPause } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";

const UserDetailsManagement = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const menuRefs = useRef({});
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  const approvalToken = user?.approvalToken ? `${user.approvalToken}` : null;

  console.log(openMenuUserId)

  // Price mapping for planIds
  const priceMapping = {
    price_1RQh51AeQO2CXKLXBTbmxa3M: 19.99,
    price_1RQh5lAeQO2CXKLX0brJrWGJ: 4.99,
  };

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/payment/getAllPayments`,
        {
          headers: {
            Authorization: `${user?.approvalToken}`,
          },
        }
      );
      console.log("Payments API response:", res.data);
      const paymentData = res.data?.data || res.data;
      return Array.isArray(paymentData) ? paymentData : [];
    } catch (err) {
      console.error(
        "Error fetching payments:",
        err.response?.status,
        err.message
      );
      return [];
    }
  };

  // Calculate revenue based on paymentId array
  const calculateUserRevenue = (payments, paymentIds) => {
    if (!paymentIds || !Array.isArray(paymentIds)) {
      console.log("Invalid paymentIds:", paymentIds);
      return "0.00";
    }
    if (!Array.isArray(payments)) {
      console.error("Payments is not an array:", payments);
      return "0.00";
    }
    const matchingPayments = payments.filter(
      (payment) =>
        paymentIds.includes(payment._id) && payment.status === "active"
    );
    console.log("Matching payments:", matchingPayments);
    const total = matchingPayments.reduce((sum, payment) => {
      const price = priceMapping[payment.planId] || 0;
      console.log(
        `Payment _id: ${payment._id}, planId: ${payment.planId}, Price: ${price}`
      );
      return sum + price;
    }, 0);
    return total.toFixed(2);
  };

  const handleUserAction = async (userId, field, value) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/users/update-user/${userId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `${user?.approvalToken}`,
          },
        }
      );
      alert(
        `${
          field === "isDeleted"
            ? "User deleted"
            : value
            ? "User suspended"
            : "User activated"
        } successfully`
      );
      // Refresh user data after action
      fetchUserDetails();
      setOpenMenuUserId(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;
      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setOpenMenuUserId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserDetails = async () => {
    if (!approvalToken) {
      setError("Authentication token is missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/v1/users/userDetails/${userId}`,
        {
          headers: { Authorization: approvalToken },
        }
      );

      const payments = await fetchPayments();
      const apiData = response.data.data;

      console.log("User paymentIds:", apiData.profile.paymentId);
      const userRevenue = calculateUserRevenue(
        payments,
        apiData.profile.paymentId
      );

      const mappedData = {
        fullName: apiData.profile.name || apiData.user.name || "Not specified",
        email:
          apiData.resume.email ||
          apiData.profile.email ||
          apiData.user.email ||
          "Not specified",
        phone: apiData.profile.phone || apiData.user.phone || "Not specified",
        experience: apiData.profile.experienceLevel || "Not specified",
        city: apiData.resume.address?.city || "Not specified",
        country: apiData.resume.address?.country || "Not specified",
        resumeDate: apiData.profile.createdAt
          ? new Date(apiData.profile.createdAt).toLocaleDateString()
          : "Unknown",
        resumeUrl: apiData.profile.isResumeUploaded
          ? apiData.resume._id
            ? `/resumes/${apiData.resume._id}`
            : "#"
          : "#",
        skills: [
          ...(apiData.resume.technicalSkills || []),
          ...(apiData.resume.softSkills || []),
        ].filter(Boolean),
        description:
          apiData.profile.generatedAboutMe || "No description available",
        institute:
          apiData.resume.education?.[0]?.institution || "Not specified",
        degree: apiData.resume.education?.[0]?.degree || "Not specified",
        certificateDate: apiData.resume.education?.[0]?.completion_date
          ? new Date(
              apiData.resume.education[0].completion_date
            ).toLocaleDateString()
          : "Unknown",
        avatar: apiData.profile.img || "https://i.pravatar.cc/150?img=3",
        languages: apiData.resume.languages || [],
        experienceHistory: apiData.resume.experience || [],
        linkedIn: apiData.resume.linkedIn || "Not specified",
        isBlocked: apiData.user.isBlocked || false, // Add isBlocked to mappedData
        stats: {
          plan: apiData.profile.currentPlan || "Free",
          mockInterviews: apiData.profile.interviewTaken || 0,
          jobsTracked: apiData.profile.seenJobs?.length || 0,
          jobsApplied: apiData.profile.appliedJobs?.length || 0,
          inprepScore: apiData.interviews?.assessment?.Inprep_Score?.total_score
            ? `${Math.round(
                apiData.interviews.assessment.Inprep_Score.total_score
              )}%`
            : "N/A",
          contentScore: apiData.interviews?.assessment?.Content_Score
            ? `${apiData.interviews.assessment.Content_Score}%`
            : "N/A",
          revenue: apiData.profile.paymentId?.length ? `$${userRevenue}` : "$0",
          interviewsAvailable: apiData.profile.interviewsAvailable || 0,
          jobsAvailable: apiData.profile.jobsAvailable || "0",
        },
      };

      setUserData(mappedData);
    } catch (err) {
      console.error(
        "Error fetching user details:",
        err.response?.status,
        err.message
      );
      setError(
        err.response?.status === 404
          ? "User data not found."
          : err.response?.status === 401
          ? "Unauthorized access. Please check your credentials."
          : "Failed to load user details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId, approvalToken]);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 text-sm">
        {error}
        <button
          onClick={() => fetchUserDetails()}
          className="ml-4 text-blue-600 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userData) {
    return <div className="p-4 text-sm">No user data available.</div>;
  }

  return (
    <div className="text-black p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={userData.avatar}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              handleUserAction(userId, "isBlocked", !userData.isBlocked)
            }
            className={`flex items-center gap-1 border-none px-4 py-2 rounded-lg ${
                userData.isBlocked ? "bg-[#37B874]" : "bg-[#3A4C67]"
              } text-sm text-white`}
          >
            {userData.isBlocked ? "Activate" : "Suspend"}
            <IoIosPause
              size={18}
              className={`bg-white ${
                userData.isBlocked ? "text-[#37B874]" : "text-[#3A4C67]"
              } rounded-full p-[1px]`}
            />
          </button>
          <button
            onClick={() => handleUserAction(userId, "isDeleted", true)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-[#EF4444] text-sm border border-[#EF4444]"
          >
            Delete
            <RiDeleteBin5Fill
              size={20}
              className="text-[#EF4444] rounded-full p-[1px]"
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="w-full sm:w-3/4 lg:w-2/3">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="flex justify-between gap-4 text-sm bg-white p-4 rounded-lg shadow">
              <div className="space-y-5">
                <p className="text-gray-500">Full Name</p>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-500">Experience Level</p>
                <p className="text-gray-500">City</p>
                <p className="text-gray-500">Country</p>
              </div>
              <div className="space-y-5 text-right">
                <p>{userData.fullName}</p>
                <p>{userData.email}</p>
                <p>{userData.experience}</p>
                <p>{userData.city}</p>
                <p>{userData.country}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>
            <div className="bg-white flex items-center justify-between border border-[#E0E0E1] p-4 rounded-lg shadow w-full sm:w-1/2">
              <div className="flex items-center gap-3">
                <FileText size={24} />
                <div>
                  <p className="text-sm font-medium">Resume</p>
                  <p className="text-sm text-gray-500">{userData.resumeDate}</p>
                </div>
              </div>
              <a
                href={userData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#37B874] font-semibold text-sm"
              >
                View
              </a>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Skills</p>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#EBF8F1] text-[#37B874] text-sm px-4 py-2 rounded-full inline-flex items-center gap-1"
                  >
                    {skill}
                    <TiTick
                      size={14}
                      className="bg-[#37B874] text-white rounded-full p-[1px]"
                    />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Languages</p>
              <div className="flex flex-wrap gap-2">
                {userData.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="bg-[#EBF8F1] text-[#37B874] text-sm px-3 py-1 rounded-full"
                  >
                    {lang.name} ({lang.proficiency})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-gray-600 text-justify md:pe-12 lg:pe-12">
                {userData.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Education & Certificate</h3>
            <div className="w-[60%] bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm p-4 rounded-lg">
              <div>
                <p className="text-gray-500">Institute</p>
                <p>{userData.institute}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Degree</p>
                <p>{userData.degree}</p>
              </div>
            </div>
            <div className="flex gap-12 items-center justify-between p-4 rounded-lg bg-white w-full sm:w-1/2">
              <div className="flex items-center gap-3">
                <GraduationCap size={24} />
                <div>
                  <p className="text-sm font-medium">Certificate</p>
                  <p className="text-sm text-gray-500">
                    {userData.certificateDate}
                  </p>
                </div>
              </div>
              <a
                href={userData.resumeUrl}
                className="text-[#37B874] font-semibold text-sm"
              >
                View
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white py-2 px-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#878788]">Current Plan</p>
              <select
                className="border-none bg-[#EBF8F1] text-[#174D31] focus:border-none focus:ring-[#174D31] rounded-md shadow px-2 py-1 text-sm w-[50%]"
                value={userData.stats.plan}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    stats: { ...userData.stats, plan: e.target.value },
                  })
                }
              >
                <option>Free</option>
                <option>Premium</option>
                <option>Pay-per-Interview</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow space-y-3 border border-[#E0E0E1]">
              <p className="text-sm text-gray-500">Mock Interviews</p>
              <p className="text-xl font-semibold">
                {userData.stats.mockInterviews}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow space-y-3 border border-[#E0E0E1]">
              <p className="text-sm text-gray-500">Jobs Tracked</p>
              <p className="text-xl font-semibold">
                {userData.stats.jobsTracked}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow space-y-3 border border-[#E0E0E1]">
              <p className="text-sm text-gray-500">Inprep Score</p>
              <p className="text-xl font-semibold">
                {userData.stats.inprepScore}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow space-y-3 border border-[#E0E0E1]">
              <p className="text-sm text-gray-500">Revenue from this user</p>
              <p className="text-xl font-semibold">{userData.stats.revenue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsManagement;
