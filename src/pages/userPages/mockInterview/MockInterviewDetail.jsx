import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { FaArrowRight } from "react-icons/fa"; // Import FaArrowRight for consistency

const MockInterviewDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        setLoading(true);
        const res = await request({
          endpoint: `/interview/get_mock_interview?_id=${id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });
        if (res.ok) {
          setInterviewData(res.data.body[0]);
          setError(null);
        } else {
          throw new Error(res.message || "Failed to fetch interview details");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch interview details");
        console.error("Error fetching interview details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (AuthorizationToken) {
      fetchInterviewDetails();
    } else {
      setError("No authorization token available");
      setLoading(false);
    }
  }, []);

  // Reusable Interview Card Component (adapted for question banks)
  const QuestionBankCard = ({ qb }) => (
    <div className="bg-white">
      <div className="p-4 rounded-lg shadow hover:bg-gray-100 transition flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Use a placeholder image since question_bank_ids doesn't have img */}
          <div className="h-[68px] w-[64px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            No Image
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {qb.questionBank_name || "No name available"}
            </h2>
          </div>
        </div>
        <Link
          to={`/userDashboard/mockInterview/questionBank?questionBank_id=${qb._id}`}
        >
          <div className="w-[40px] h-[40px] rounded-full bg-[#37B874] flex justify-center items-center text-white">
            <FaArrowRight />
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="text-black w-full px-6">
      {loading && <p>Loading interview details...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {interviewData && (
        <div className="w-full">
          <img
            src={interviewData.img}
            alt={interviewData.interview_name}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold mb-4">
            {interviewData.interview_name}
          </h1>

          <p className="text-lg mb-2">
            <strong>Total Positions:</strong>{" "}
            {interviewData.total_Positions || "N/A"}
          </p>
          <p className="text-lg mb-2">
            <strong>Description:</strong> {interviewData.description}
          </p>

          {/* Display Question Banks as Links */}
          {interviewData.question_bank_ids &&
            interviewData.question_bank_ids.length > 0 && (
              <div className="list-disc pl-5 space-y-4">
                {interviewData.question_bank_ids.map((qb) => (
                  <div key={qb._id}>
                    <QuestionBankCard qb={qb} interviewId={interviewData._id} />
                  </div>
                ))}
              </div>
            )}
        </div>
      )}
      {!loading && !error && !interviewData && (
        <p>No interview details available.</p>
      )}
    </div>
  );
};

export default MockInterviewDetail;
