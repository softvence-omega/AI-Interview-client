import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";

const StartInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id"); // Optional, if needed
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = [];
        if (questionBankId) queryParams.push(`questionBank_id=${questionBankId}`);
        if (interviewId) queryParams.push(`interview_id=${interviewId}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const endpoint = `/interview/genarateQuestionSet_ByAi${queryString}`;
        const res = await request({
          endpoint,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to generate question set");
        }

        const data = res.data.body;
        console.log("Generated Questions:", data); // Print the data to the console
        setGeneratedQuestions(data);
      } catch (err) {
        setError(err.message || "Failed to generate question set");
        console.error("Error generating questions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (AuthorizationToken && questionBankId) {
      fetchGeneratedQuestions();
    } else {
      setLoading(false);
      setError(AuthorizationToken ? "questionBank_id is required" : "No authorization token available");
    }
  }, [questionBankId, interviewId, AuthorizationToken]);

  return (
    <div className="text-black w-full px-6 py-8">
      {loading && <p>Loading generated questions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {generatedQuestions && (
        <div className="w-full bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Generated Questions</h1>
          {/* Display questions - assuming generatedQuestions is an array */}
          {Array.isArray(generatedQuestions) && generatedQuestions.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {generatedQuestions.map((question, index) => (
                <li key={index} className="mb-2">
                  {question.text || question.question || `Question ${index + 1}`} {/* Adjust based on API response structure */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions generated.</p>
          )}
        </div>
      )}
      {!loading && !error && !generatedQuestions && (
        <p>No generated questions available.</p>
      )}
    </div>
  );
};

export default StartInterviewPage;