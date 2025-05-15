import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import Buttons from "../../../reuseable/AllButtons";

const QuestionBankDetail = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id");
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const [questionBankData, setQuestionBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionBank = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = [];
        if (questionBankId) queryParams.push(`questionBank_id=${questionBankId}`);
        if (interviewId) queryParams.push(`interview_id=${interviewId}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const endpoint = `/interview/get_question_bank${queryString}`;
        const res = await request({
          endpoint,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthorizationToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to fetch question bank data");
        }

        const data = res.data.body;
        console.log("Fetched Question Bank Data:", data); // Print the data to the console
        setQuestionBankData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch question bank data");
        console.error("Error fetching question bank:", err);
      } finally {
        setLoading(false);
      }
    };

    if (AuthorizationToken && questionBankId) {
      fetchQuestionBank();
    } else {
      setLoading(false);
      setError(AuthorizationToken ? "questionBank_id is required" : "No authorization token available");
    }
  }, [questionBankId, interviewId, AuthorizationToken]);

  return (
    <div className="text-black w-full px-6 py-8">
      {loading && <p>Loading question bank data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {Array.isArray(questionBankData) && questionBankData.length > 0 ? (
        <div>
          {questionBankData.map((item, index) => (
            <div key={item._id || index} className="w-full bg-white p-6 rounded-lg shadow mb-6">
                <Buttons.LinkButton
                text="Start mick interview"
                width="w-full"
                height="h-[50px]"
                to={`/userDashboard/mockInterview/startInterview?questionBank_id=${item._id}`}/>

              {/* Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
                <div className="bg-green-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold">{item.duration || "N/A"} min</p>
                </div>
                <div className="bg-green-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Difficulty Level</p>
                  <p className="text-lg font-semibold">{item.difficulty_level || "N/A"}</p>
                </div>
                <div className="bg-green-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-semibold">{item.question_Type || "N/A"}</p>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{item.description || "No description available"}</p>
              </div>

              {/* What to Expect Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">What to Expect</h2>
                <ul className="list-disc pl-5 text-gray-700">
                  {Array.isArray(item.what_to_expect) &&
                    item.what_to_expect.map((expectation, idx) => (
                      <li key={idx} className="mb-2">
                        {expectation}
                      </li>
                    ))}
                  {!Array.isArray(item.what_to_expect) && <li>No expectations listed</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No question bank details available.</p>
      )}
    </div>
  );
};

export default QuestionBankDetail;