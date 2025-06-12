import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import IncompleateInterviews from "./IncompleateInterviews";


const MockInterview = () => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const [mockInterviewData, setMockInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMockInterview = async () => {
      try {
        setLoading(true);
        const res = await request({
          endpoint: "/interview/get_mock_interview",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });
        if (res.ok) {
          setMockInterviewData(res.data);
          setError(null);
        } else {
          throw new Error(res.message || "Failed to fetch mock interview data");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch mock interview data");
        console.error("Error fetching mock interview:", err);
      } finally {
        setLoading(false);
      }
    };

    if (AuthorizationToken) {
      fetchMockInterview();
    } else {
      setError("No authorization token available");
      setLoading(false);
    }
  }, [AuthorizationToken]);

  const suggestedInterviews = mockInterviewData?.body?.suggested || [];
  const allInterviews = mockInterviewData?.body?.all_InterView || [];

  // Filter interviews based on search term
  const filteredSuggested = suggestedInterviews.filter((interview) =>
    interview.interview_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAll = allInterviews.filter((interview) =>
    interview.interview_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const InterviewCard = ({ interview }) => (
    <div className="bg-white shadow hover:shadow-md rounded-lg">
      <div className="p-4 rounded-lg shadow hover:bg-[#37B874] hover:text-white transition flex items-center justify-between mt-4 group/items">
        <div className="flex items-center gap-6">
          <img
            src={interview.img}
            alt={interview.interview_name}
            className="h-[68px] w-[64px] object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {interview.interview_name || "No name available"}
            </h2>
            <h2>Interview</h2>
            <p className="text-sm text-[#AFAFAF] group-hover/items:text-white">
              {interview.total_Positions || "N/A"} Job Positions
            </p>
          </div>
        </div>
        <Link to={`/userDashboard/mockInterview/${interview._id}`}>
          <div className="w-[40px] h-[40px] rounded-full bg-[#37B874] flex justify-center items-center text-white group-hover/items:bg-white">
            <FaArrowRight className="group-hover/items:text-[#37B874]"/>
          </div>
        </Link>
      </div>
    </div>
  );

  const InterviewSection = ({ title, interviews }) =>
    interviews.length > 0 && (
      <div className="w-full mb-16">
        <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold mb-4 text-[#37B874] text-center tracking-wide">
          {title}
        </h1>
        {interviews.length === 0 ? (
          <p>No interviews available.</p>
        ) : (
          <div className="w-full h-auto">
            {interviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        )}
      </div>
    );

  return (
    <div className="text-black w-full md:px-6 lg:px-6">
      {loading && <p>Loading mock interview data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="w-full">

        <IncompleateInterviews/>


          {/* Search Input */}
          <div className="mb-8 w-[60%] mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search interview..."
              className="w-full px-4 py-2 pr-10 border-none bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-[#37B874]"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>
          </div>

        

          <InterviewSection
            title="Suggested Interviews"
            interviews={filteredSuggested}
          />
          <InterviewSection title="All Interviews" interviews={filteredAll} />
        </div>
      )}
    </div>
  );
};

export default MockInterview;
