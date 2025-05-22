import React, { useState, useEffect, useRef, Component } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import VideoController from "./VideoController";
import talking from "../../../assets/logos/fi_8392916.png";
import behaviorIcon from "../../../assets/logos/Frame 5.png";
import problemSolvingIcon from "../../../assets/logos/problemSolving.png";

// ErrorBoundary component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          <h3>Something went wrong:</h3>
          <p>{this.state.error?.message || "Unknown error"}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AssessmentDisplay = ({ assessment, currentQuestionIndex }) => {
  if (!assessment) {
    return <p>No assessment data available</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="text-2xl font-medium mb-4">
        Question {currentQuestionIndex + 1} Feedback
      </h4>

      {/* Articulation Section */}
      {assessment.Articulation && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <img src={talking} alt="Articulation" className="w-[50px] h-[50px]" />
            <p className="font-medium text-2xl text-[#293649]">Articulation</p>
          </div>
          <p className="text-[16px] font-normal text-[#293649] mb-2">
            {assessment.Articulation.feedback || "No feedback"}
          </p>
          <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
            <strong>Score:</strong>{" "}
            {assessment.Articulation.score?.toFixed(2) ?? "N/A"}
          </p>
        </div>
      )}

      {/* Behavioural Cue Section */}
      {assessment.Behavioural_Cue && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={behaviorIcon}
              alt="Behavioural Cue"
              className="w-[50px] h-[50px]"
            />
            <p className="font-medium text-2xl text-[#293649]">
              Behavioural Cue
            </p>
          </div>
          <p className="text-[16px] font-normal text-[#293649] mb-2">
            {assessment.Behavioural_Cue.feedback || "No feedback"}
          </p>
          <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
            <strong>Score:</strong>{" "}
            {assessment.Behavioural_Cue.score?.toFixed(2) ?? "N/A"}
          </p>
        </div>
      )}

      {/* Problem Solving Section */}
      {assessment.Problem_Solving && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={problemSolvingIcon}
              alt="Problem Solving"
              className="w-[50px] h-[50px]"
            />
            <p className="font-medium text-2xl text-[#293649]">
              Problem Solving
            </p>
          </div>
          <p className="text-[16px] font-normal text-[#293649] mb-2">
            {assessment.Problem_Solving.feedback || "No feedback"}
          </p>
          <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
            <strong>Score:</strong>{" "}
            {assessment.Problem_Solving.score?.toFixed(2) ?? "N/A"}
          </p>
        </div>
      )}

      {/* Inprep Score Section */}
      {assessment.Inprep_Score && (
        <div className="mb-6">
          <p className="font-medium text-2xl text-[#293649] mb-2">
            <strong>Inprep Score:</strong>{" "}
            {assessment.Inprep_Score.total_score?.toFixed(2) ?? "N/A"}
          </p>
          <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
            80/100
          </p>
        </div>
      )}

      {/* Improvement Tips Section */}
      {assessment.what_can_i_do_better && (
        <div className="bg-[#e6ffe6] text-[#293649] p-4 rounded-lg mt-4">
          <p className="font-bold text-xl mb-2">What can I do better?</p>
          <p className="text-[16px] font-normal">
            {assessment.what_can_i_do_better.overall_feedback || "No feedback"}
          </p>
        </div>
      )}
    </div>
  );
};

const AiResponseDisplay = ({ response, currentQuestionIndex }) => {
  if (!response) {
    return <p className="text-center text-red-500">ERR: server failed to process</p>;
  }
  if (response.error) {
    return <p className="text-red-500">Error: {response.error}</p>;
  }
  return (
    <div className="text-left bg-gray-100 p-4 rounded">
      <AssessmentDisplay
        assessment={response.assessment}
        currentQuestionIndex={currentQuestionIndex}
      />
    </div>
  );
};

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
  const [aiResponse, setAiResponse] = useState(null);
  const videoControllerRef = useRef(null);
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);

  // Fetch AI-generated questions
  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      if (isProcessingRef.current) {
        console.log("Skipping fetchGeneratedQuestions: already processing");
        return;
      }
      isProcessingRef.current = true;

      try {
        setLoading(true);
        setError(null);

        if (!AuthorizationToken || !questionBankId) {
          throw new Error(
            AuthorizationToken
              ? "questionBank_id is required"
              : "No authorization token available"
          );
        }

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
        console.log("dataaaaaaaaaaaaaa", data);
        generatedQuestions.current = data?.remainingQuestions || data?.question_Set || [];

        if (
          Array.isArray(generatedQuestions.current) &&
          generatedQuestions.current.length > 0
        ) {
          React.startTransition(() => {
            setOngoingQuestion(generatedQuestions.current[0]);
            setCurrentQuestionIndex(0);
          });
        } else {
          throw new Error("No questions generated from the API response");
        }
      } catch (err) {
        setError(err.message || "Failed to generate question set");
        console.error("Error generating questions:", err);
      } finally {
        setLoading(false);
        isProcessingRef.current = false; // Ensure buttons are enabled after fetch
      }
    };
    fetchGeneratedQuestions();
  }, [questionBankId, interviewId, AuthorizationToken]);

  // Handle AI response or error
  const handleVideoAnalysisComplete = (data) => {
    if (isProcessingRef.current) {
      console.log("Skipping handleVideoAnalysisComplete: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleVideoAnalysisComplete called with:", data);
    React.startTransition(() => {
      if (data.error) {
        setError(data.error);
        setAiResponse(null);
      } else {
        setAiResponse(data);
        setError(null);
      }
    });
    isProcessingRef.current = false; // Enable buttons after processing response
  };

  // Handle retake
  const handleRetake = async () => {
    if (!ongoingQuestion || isProcessingRef.current) {
      console.log("Skipping handleRetake: no question or processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleRetake called");
    React.startTransition(() => {
      setIsVideoState(true);
      setAiResponse(null);
      setError(null);
    });
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

      React.startTransition(() => {
        setOngoingQuestion(newQuestion);
      });

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
      isProcessingRef.current = false; // Enable buttons after retake
    }
  };

  // Handle continue
  const handleContinue = async () => {
    if (isProcessingRef.current) {
      console.log("Skipping handleContinue: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleContinue called");
    try {
      // Save the current aiResponse to the API if it exists
      if (aiResponse) {
        const dataToSave = {
          ...aiResponse,
          islast:
            Array.isArray(generatedQuestions.current) &&
            currentQuestionIndex === generatedQuestions.current.length - 1,
          question_id: aiResponse.qid || null,
          assessment: aiResponse.assessment,
        };

        if ("qid" in dataToSave) {
          delete dataToSave.qid;
        }


        console.log("this is data to be saved", dataToSave)

        const endpoint = `/video/submit_Video_Analysis_and_Summary`;
        const res = await request({
          endpoint,
          method: "POST",
          body: dataToSave,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to save video analysis");
        }
        console.log("Video analysis saved successfully:", res.data);
      }

      React.startTransition(() => {
        if (
          Array.isArray(generatedQuestions.current) &&
          currentQuestionIndex < generatedQuestions.current.length - 1
        ) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setOngoingQuestion(generatedQuestions.current[nextIndex]);
          setIsVideoState(true);
          setAiResponse(null);
          setError(null);
        } 
        else {
          console.log("Reached last question, keeping summeryState");
          // No state change needed here as summeryState is already set
        }
      });
    } 
    catch (err) {
      setError(err.message || "Failed to save video analysis");
      console.error("Error saving video analysis:", err);
    } 
    finally {
      isProcessingRef.current = false; // Enable buttons after continue
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (isProcessingRef.current) {
      console.log("Skipping handleNextQuestion: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleNextQuestion called");
    React.startTransition(() => {
      setIsVideoState(false);
      setAiResponse(null);
      setError(null);
    });

    if (
      videoControllerRef.current &&
      videoControllerRef.current.stopRecording
    ) {
      videoControllerRef.current.stopRecording();
    }

    // If it's the last question, trigger summary state
    if (
      Array.isArray(generatedQuestions.current) &&
      currentQuestionIndex >= generatedQuestions.current.length - 1
    ) {
      React.startTransition(() => {
        setSumarryState(true);
      });
    }

    isProcessingRef.current = false; // Enable buttons after processing
  };

  // Handle summary generation
  const handleSummaryGenaration = async () => {
    await handleContinue()
    if (isProcessingRef.current) {
      console.log("Skipping handleSummaryGenaration: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleSummaryGenaration called");
    try {
      const questionBankId =
        ongoingQuestion?.questionBank_id || aiResponse?.questionBank_id;
      if (!questionBankId) {
        throw new Error("questionBank_id not found in the response");
      }

      console.log("handleSummaryGenaration called", questionBankId);

      const endpoint = `/video/getSummary?questionBank_id=${questionBankId}`;

      
      const res = await request({
        endpoint,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(res.message || "Failed to generate summary");
      }

      console.log("Summary generated successfully****************************:", res.data);

      React.startTransition(() => {
        setAiResponse(res.data);
        setReturnOrFullRetakeState(true);
      });
    } catch (err) {
      setError(err.message || "Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      isProcessingRef.current = false; // Enable buttons after summary generation
    }
  };





  // Handle full retake
  const handleFullRetaake = async () => {
    if (
      !ongoingQuestion ||
      !ongoingQuestion.questionBank_id ||
      isProcessingRef.current
    ) {
      setError(
        "No ongoing question or questionBank_id available for full retake"
      );
      console.log("Skipping handleFullRetaake: invalid state");
      isProcessingRef.current = false; // Ensure buttons are enabled even on error
      return;
    }
    isProcessingRef.current = true;

    console.log("handleFullRetaake called");
    setRetakeLoading(true);

    try {
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
      generatedQuestions.current = data.question_Set || [];

      if (
        Array.isArray(generatedQuestions.current) &&
        generatedQuestions.current.length > 0
      ) {
        React.startTransition(() => {
          setCurrentQuestionIndex(0);
          setOngoingQuestion(generatedQuestions.current[0]);
          setIsVideoState(true);
          setSumarryState(false);
          setReturnOrFullRetakeState(false);
          setAiResponse(null);
          setError(null);
        });
      } else {
        throw new Error("No questions generated in full retake response");
      }
    } catch (err) {
      setError(
        err.message || "Failed to generate full question set for retake"
      );
      console.error("Error generating full retake question set:", err);
    } finally {
      setRetakeLoading(false);
      isProcessingRef.current = false; // Enable buttons after full retake
    }
  };




  
  // Handle return to interview
  const handleReturnInterview = () => {
    if (isProcessingRef.current) {
      console.log("Skipping handleReturnInterview: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleReturnInterview called");
    navigate(`/userDashboard/mockInterview/${ongoingQuestion.interview_id}`);
    isProcessingRef.current = false; // Enable buttons after navigation
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

  const handleRetakeClick = () => {
    if (summeryState && returnOrFullRetakeState) {
      handleFullRetaake();
    } else {
      handleRetake();
    }
  };

  // Ref callback for VideoController
  const videoControllerRefCallback = (node) => {
    if (node) {
      videoControllerRef.current = {
        stopRecording: node.stopRecording,
      };
    }
  };

  // Debug render
  console.log("Render with states:", {
    isVideoState,
    summeryState,
    currentQuestionIndex,
    aiResponse,
    loading,
    error,
    isProcessing: isProcessingRef.current,
  });

  return (
    <ErrorBoundary>
      <div className="text-black w-full px-6 py-8 h-auto bg-black">
        {loading && (
          <div className="flex justify-center items-center">
            <p className="text-white text-lg">Loading generated questions...</p>
            <svg
              className="animate-spin h-5 w-5 ml-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </div>
        )}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        {ongoingQuestion ? (
          <div className="w-full bg-white p-6 rounded-lg shadow h-full">
            <h1 className="mb-4 text-left text-sm text-[#676768]">
              Question {currentQuestionIndex + 1} of{" "}
              {generatedQuestions.current?.length || 0} Questions
            </h1>

            <div className="w-full flex justify-center items-center mb-10">
              <p className="text-[24px] font-normal text-[#278352]">
                Q. {ongoingQuestion.question || "No question text available"}
              </p>
            </div>

            <div className="h-full w-full mx-auto">
              {isVideoState ? (
                retakeLoading ? (
                  <div className="flex justify-center items-center">
                    <h2>Generating new question for retake...</h2>
                    <svg
                      className="animate-spin h-5 w-5 ml-2 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-[80%] border-[1px] rounded-sm">
                    <p className="text-lg mb-4">
                      {ongoingQuestion.time_to_answer &&
                        `${Math.floor(
                          Number(ongoingQuestion.time_to_answer) / 60
                        )} minute(s)`}
                    </p>
                    <VideoController
                      question={ongoingQuestion}
                      isVideoState={isVideoState}
                      isSummary={summeryState}
                      islast={
                        currentQuestionIndex ===
                        (generatedQuestions.current?.length || 0) - 1
                      }
                      onVideoAnalysisComplete={handleVideoAnalysisComplete}
                      ref={videoControllerRefCallback}
                      isProcessingRef={isProcessingRef}
                    />
                  </div>
                )
              ) : (
                <div>
                  {aiResponse || error ? (
                    <AiResponseDisplay
                      response={aiResponse}
                      currentQuestionIndex={currentQuestionIndex}
                    />
                  ) : (
                    <div className="flex justify-center items-center">
                      <p>Processing video analysis...</p>
                      <svg
                        className="animate-spin h-5 w-5 ml-2 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              )}
              {summeryState && aiResponse && (
                <AiResponseDisplay
                  response={aiResponse}
                  currentQuestionIndex={currentQuestionIndex}
                />
              )}
            </div>

            <div className="w-full flex justify-center mt-6">
              {isVideoState && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 w-[50%] h-[50px] rounded-[12px] text-white disabled:opacity-50"
                  disabled={isProcessingRef.current || loading || retakeLoading}
                >
                  {currentQuestionIndex <
                  (generatedQuestions.current?.length || 0) - 1 ? (
                    <div>Next Question</div>
                  ) : (
                    <div>Finish</div>
                  )}
                </button>
              )}
            </div>

            <div className="w-full flex justify-center mt-4">
              {!isVideoState && (
                <div className="flex justify-center gap-6 w-full">
                  <button
                    onClick={handleContinueClick}
                    className="bg-blue-500 w-[30%] h-[50px] rounded-[12px] text-white disabled:opacity-50"
                    disabled={isProcessingRef.current || loading || retakeLoading}
                  >
                    {summeryState && returnOrFullRetakeState
                      ? "Return to Interview"
                      : summeryState
                      ? "Generate Summary"
                      : "Continue"}
                  </button>
                  <button
                    onClick={handleRetakeClick}
                    className="bg-green-500 w-[30%] h-[50px] rounded-[12px] text-white disabled:opacity-50"
                    disabled={isProcessingRef.current || loading || retakeLoading}
                  >
                    {retakeLoading
                      ? "Generating..."
                      : summeryState && returnOrFullRetakeState
                      ? "Full Retake"
                      : "Retake"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          !loading && !error && (
            <p className="text-white text-center">
              No questions available to display.
            </p>
          )
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StartInterviewPage;