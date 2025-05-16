import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";

const StartInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id");
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const generatedQuestions = useRef(null); // Store the full list of questions
  const [ongoingQuestion, setOngoingQuestion] = useState(null); // Current question to display
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retakeLoading, setRetakeLoading] = useState(false); // New state for retake loading
  const [isVideoState, setIsVideoState] = useState(true);

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = [];
        if (questionBankId)
          queryParams.push(`questionBank_id=${questionBankId}`);
        if (interviewId) queryParams.push(`interview_id=${interviewId}`);
        const queryString =
          queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const endpoint = `/interview/genarateQuestionSet_ByAi${queryString}`;
        const res = await request({
          endpoint,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`, // No "Bearer" as requested
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to generate question set");
        }

        const data = res.data.body;
        console.log("Generated Questions:", data.remainingQuestions);
        generatedQuestions.current = data.remainingQuestions; // Store the array of questions

        // Set the first question as the ongoing question if available
        if (
          Array.isArray(generatedQuestions.current) &&
          generatedQuestions.current.length > 0
        ) {
          setOngoingQuestion(generatedQuestions.current[0]);
          setCurrentQuestionIndex(0);
        }
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
      setError(
        AuthorizationToken
          ? "questionBank_id is required"
          : "No authorization token available"
      );
    }
  }, [questionBankId, interviewId, AuthorizationToken]); // No request in dependencies

  // Define the lastQuestionModification function
  const lastQuestionModification = () => {
    console.log(
      "Reached the last question. Performing last question modification..."
    );
    // Add your logic here if needed
  };

  // Call lastQuestionModification when reaching the last question
  useEffect(() => {
    if (
      Array.isArray(generatedQuestions.current) &&
      generatedQuestions.current.length > 0 &&
      currentQuestionIndex === generatedQuestions.current.length - 1
    ) {
      lastQuestionModification();
    }
  }, [currentQuestionIndex]);

  // Define the handleRetake function
  const handleRetake = async () => {
    if (!ongoingQuestion) return;
    setIsVideoState(true);

    setRetakeLoading(true); // Start loading for retake
    try {
      const endpoint = `/interview/genarateSingleQuestion_ByAi_for_Retake`;
      const res = await request({
        endpoint,
        method: "POST",
        body: {
          questionBank_id: ongoingQuestion.questionBank_id,
          user_id: ongoingQuestion.user_id,
          interview_id: ongoingQuestion.interview_id,
          question_id: ongoingQuestion._id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`, // No "Bearer" as requested
        },
      });

      if (!res.ok) {
        throw new Error(
          res.message || "Failed to generate new question for retake"
        );
      }

      const newQuestion = res.data.body; // Assuming the API returns the new question in res.data.body
      console.log("New Retake Question:", newQuestion);

      // Update the ongoingQuestion state with the new question
      setOngoingQuestion(newQuestion);

      // Update the corresponding question in generatedQuestions.current
      if (Array.isArray(generatedQuestions.current)) {
        const updatedQuestions = [...generatedQuestions.current];
        updatedQuestions[currentQuestionIndex] = newQuestion;
        generatedQuestions.current = updatedQuestions;
        console.log("Updated Questions List:", generatedQuestions.current);
      }
    } catch (err) {
      setError(err.message || "Failed to generate new question for retake");
      console.error("Error generating retake question:", err);
    } finally {
      setRetakeLoading(false); // Stop loading after the operation
    }
  };

  const handleNextQuestion = () => {
    setIsVideoState(false);
  };

  const handleContinue = () => {
    setIsVideoState(true);
    if (
      Array.isArray(generatedQuestions.current) &&
      currentQuestionIndex < generatedQuestions.current.length - 1
    ) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setOngoingQuestion(generatedQuestions.current[nextIndex]);
    }
  };

  return (
    <div className="text-black w-full px-6 py-8 h-full bg-green-500">
      {loading && <p>Loading generated questions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {ongoingQuestion && (
        <div className="w-full bg-white p-6 rounded-lg shadow h-full">
          <h1 className="mb-4 text-left text-sm text-[#676768]">
            Question {currentQuestionIndex + 1} out of{" "}
            {generatedQuestions.current.length}
          </h1>

          <div className="w-full bg-green-500 flex justify-center items-center mb-10">
            <p className="text-lg">
              Q. {ongoingQuestion.question || "No question text available"}
            </p>
          </div>

          {/* View point */}
          <div className="h-[80%] w-[60%] mx-auto">
            {isVideoState ? (
              !retakeLoading ? (
                <div className="w-full h-[80%] border-[1px] rounded-sm ">
                  <p className="text-lg mb-4">
                    {ongoingQuestion.time_to_answer
                      ? `${Math.floor(
                          Number(ongoingQuestion.time_to_answer) / 60
                        )} minute(s)`
                      : "No time available"}
                  </p>
                  here ill mount the camera
                </div>
              ) : (
                <h2>Generating new question for retake...</h2>
              )
            ) : (
              <div>here ill mount the outcome of submitted video component</div>
            )}
          </div>

          <div className="w-full justify-center bg-yellow">
            {isVideoState &&
              currentQuestionIndex < generatedQuestions.current.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Next Question
                </button>
              )}
          </div>

          <div className="w-full justify-center bg-yellow">
            {!isVideoState && (
            <div className="flex justify-around">
              <button
                onClick={handleContinue}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Continue
              </button>
              <button
                onClick={handleRetake}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={retakeLoading}
              >
                {retakeLoading ? "Generating..." : "Retake"}
              </button>
            </div>
          )}
          </div>

          {currentQuestionIndex === generatedQuestions.current.length - 1 && (
            <p className="text-gray-600 mt-4">This is the last question.</p>
          )}
        </div>
      )}
      {!loading && !error && !ongoingQuestion && (
        <p>No generated questions available.</p>
      )}
    </div>
  );
};

export default StartInterviewPage;
