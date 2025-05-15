import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const MockInterview = () => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const [mockInterviewData, setMockInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  // Extract arrays from the response
  const suggestedInterviews = mockInterviewData?.body?.suggested || [];
  const allInterviews = mockInterviewData?.body?.all_InterView || [];

  // Reusable Interview Card Component
  const InterviewCard = ({ interview }) => (
    <div className="bg-white">
      <div className="p-4 rounded-lg shadow hover:bg-gray-100 transition flex items-center justify-between">
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
            <p className="text-sm text-[#AFAFAF]">
              {interview.total_Positions || "N/A"} Job Positions
            </p>
          </div>
        </div>
        <Link to={`/userDashboard/mockInterview/${interview._id}`}>
          <div className="w-[40px] h-[40px] rounded-full bg-[#37B874] flex justify-center items-center text-white">
            <FaArrowRight />
          </div>
        </Link>
      </div>
    </div>
  );

  // Reusable Section Component
  const InterviewSection = ({ title, interviews }) => (
    interviews.length > 0 && (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {interviews.length === 0 ? (
          <p>No interviews available.</p>
        ) : (
          <div className="w-full bg-white h-[88px]">
            {interviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        )}
      </div>
    )
  );

  return (
    <div className="text-black w-full px-6"> {/* Changed p-6 to px-6 for left/right padding only */}
      {loading && <p>Loading mock interview data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="w-full"> {/* Explicitly set w-full to ensure full width */}
          <InterviewSection title="Suggested Interviews" interviews={suggestedInterviews} />
          <InterviewSection title="All Interviews" interviews={allInterviews} />
        </div>
      )}
    </div>
  );
};

export default MockInterview;