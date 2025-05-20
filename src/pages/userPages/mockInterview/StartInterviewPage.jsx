import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import VideoController from "./VideoController";

const StartInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id");
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const generatedQuestions = useRef(null);
  const [ongoingQuestion, setOngoingQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retakeLoading, setRetakeLoading] = useState(false);
  const [isVideoState, setIsVideoState] = useState(true);
  const [summeryState, setSumarryState] = useState(false);
  const [returnOrFullRetakeState, setReturnOrFullRetakeState] = useState(false);
  const [aiResponse, setAiResponse] = useState(null); // New state for AI response
  const videoControllerRef = useRef(null); // Ref to access VideoController
  const navigate = useNavigate();

  // Generate AI questions
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
            Authorization: `${AuthorizationToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to generate question set");
        }

        const data = res.data.body;
        console.log("Generated Questions:", data.remainingQuestions);
        generatedQuestions.current = data.remainingQuestions;

        if (
          Array.isArray(generatedQuestions.current) &&
          generatedQuestions.current.length > 0
        ) {
          setOngoingQuestion(generatedQuestions.current[0]);
          setCurrentQuestionIndex(0);
        } else {
          setError("No questions generated from the API response");
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
  }, [questionBankId, interviewId, AuthorizationToken]);

  // Define the lastQuestionModification function
  const lastQuestionModification = () => {
    setSumarryState(true);
    console.log(
      "Reached the last question. Performing last question modification..."
    );
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

  // Handle AI response from VideoController
  const handleVideoAnalysisComplete = (data) => {
    setAiResponse(data);
  };

  // Handle retake
  const handleRetake = async () => {
    if (!ongoingQuestion) return;
    setIsVideoState(true);
    setAiResponse(null); // Reset AI response for retake

    setRetakeLoading(true);
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
          Authorization: `${AuthorizationToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(
          res.message || "Failed to generate new question for retake"
        );
      }

      const newQuestion = res.data.body;
      console.log("New Retake Question:", newQuestion);

      setOngoingQuestion(newQuestion);

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
      setRetakeLoading(false);
    }
  };

  // Handle next question click
  const handleNextQuestion = () => {
    setIsVideoState(false);
    setAiResponse(null); // Reset AI response
    if (videoControllerRef.current && videoControllerRef.current.stopRecording) {
      videoControllerRef.current.stopRecording(); // Trigger stopRecording to call AI API
    }
  };

  // Handle continue for next question
  const handleContinue = () => {
    setIsVideoState(true);
    setAiResponse(null); // Reset AI response for next question
    if (
      Array.isArray(generatedQuestions.current) &&
      currentQuestionIndex < generatedQuestions.current.length - 1
    ) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setOngoingQuestion(generatedQuestions.current[nextIndex]);
    } else {
      console.log("Already on the last question, index not incremented.");
    }
  };

  // Last question done and continue clicked
  const handleSummaryGenaration = () => {
    setReturnOrFullRetakeState(true);
    console.log("generating summary");
  };

  // Handle full retake
  const handleFullRetaake = async () => {
    console.log("I am being called full retake");
    if (!ongoingQuestion || !ongoingQuestion.questionBank_id) {
      setError(
        "No ongoing question or questionBank_id available for full retake"
      );
      setRetakeLoading(false);
      return;
    }

    try {
      setRetakeLoading(true);
      const queryParams = [
        `questionBank_id=${ongoingQuestion.questionBank_id}`,
        "isRetake=true",
      ];
      if (interviewId) queryParams.push(`interview_id=${interviewId}`);
      const queryString = `?${queryParams.join("&")}`;
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
        throw new Error(
          res.message || "Failed to generate full question set for retake"
        );
      }

      const data = res.data.body;
      console.log("Generated Questions for Full Retake:", data.question_Set);
      generatedQuestions.current = data.question_Set;

      if (
        Array.isArray(generatedQuestions.current) &&
        generatedQuestions.current.length > 0
      ) {
        setCurrentQuestionIndex(0);
        setOngoingQuestion(generatedQuestions.current[0]);
        setIsVideoState(true);
        setSumarryState(false);
        setReturnOrFullRetakeState(false);
        setAiResponse(null); // Reset AI response
      } else {
        setError("No questions generated in full retake response");
      }
    } catch (err) {
      setError(
        err.message || "Failed to generate full question set for retake"
      );
      console.error("Error generating full retake question set:", err);
    } finally {
      setRetakeLoading(false);
    }
  };

  // Handle return to interview
  const handleReturnInterview = () => {
    navigate(`/userDashboard/mockInterview/${ongoingQuestion.interview_id}`);
    console.log("interview done Returning to interview state");
  };

  // Define onClick handlers with conditional logic
  const handleContinueClick = () => {
    if (summeryState && returnOrFullRetakeState) {
      handleReturnInterview();
    } else if (summeryState) {
      handleSummaryGenaration();
    } else {
      handleContinue();
    }
  };

  // Define onClick handlers with conditional logic
  const handleRetakeClick = () => {
    if (summeryState && returnOrFullRetakeState) {
      handleFullRetaake();
    } else {
      handleRetake();
    }
  };

  // Expose stopRecording via ref
  const videoControllerRefCallback = (node) => {
    if (node) {
      videoControllerRef.current = {
        stopRecording: node.stopRecording, // Expose stopRecording method
      };
    }
  };

  return (
    <div className="text-black w-full px-6 py-8 h-full ">
      {loading && <p>Loading generated questions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {ongoingQuestion && (
        <div className="w-full bg-white p-6 rounded-lg shadow h-full">
          <h1 className="mb-4 text-left text-sm text-[#676768]">
            Question {currentQuestionIndex + 1} out of{" "}
            {generatedQuestions.current.length} Questions
          </h1>

          <div className="w-full flex justify-center items-center mb-10">
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
                    {ongoingQuestion.time_to_answer &&
                      !isVideoState &&
                      `${Math.floor(
                        Number(ongoingQuestion.time_to_answer) / 60
                      )} minute(s)`}
                  </p>

                  <VideoController
                    question={ongoingQuestion}
                    isVideoState={isVideoState}
                    onVideoAnalysisComplete={handleVideoAnalysisComplete}
                    ref={videoControllerRefCallback}
                  />
                </div>
              ) : (
                <h2>Generating new question for retake...</h2>
              )
            ) : (
              <div>{aiResponse}</div>
            )}
          </div>

          <div className="w-full flex justify-center">
            {isVideoState && (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-500 w-[50%] h-[50px] rounded-[12px]"
              >
                {currentQuestionIndex <
                generatedQuestions.current.length - 1 ? (
                  <div>Next Question</div>
                ) : (
                  <div>Finish</div>
                )}
              </button>
            )}
          </div>

          <div className="w-full flex justify-center bg-yellow">
            {!isVideoState && (
              <div className="flex justify-center gap-6 w-full">
                <button
                  onClick={handleContinueClick}
                  className="bg-blue-500 w-[30%] h-[50px] rounded-[12px]"
                >
                  Continue
                </button>

                <button
                  onClick={handleRetakeClick}
                  className="bg-green-500 w-[30%] h-[50px] rounded-[12px]"
                  disabled={retakeLoading}
                >
                  {retakeLoading ? "Generating..." : "Retake"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartInterviewPage;