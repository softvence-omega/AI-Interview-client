import React, { useState, useEffect, useRef, useCallback, Component } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import VideoController from "./VideoController";

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

// Component to render assessment details
const AssessmentDisplay = ({ assessment }) => {
  if (!assessment) {
    return <p>No assessment data available</p>;
  }
  return (
    <div className="bg-white p-4 rounded">
      <h4 className="text-md font-bold mb-2">Assessment Details:</h4>
      {assessment.Articulation && (
        <div className="mb-2">
          <p><strong>Articulation:</strong> {assessment.Articulation.feedback || "No feedback"}</p>
          <p><strong>Score:</strong> {assessment.Articulation.score ?? "N/A"}</p>
        </div>
      )}
      {assessment.Behavioural_Cue && (
        <div className="mb-2">
          <p><strong>Behavioural Cue:</strong> {assessment.Behavioural_Cue.feedback || "No feedback"}</p>
          <p><strong>Score:</strong> {assessment.Behavioural_Cue.score ?? "N/A"}</p>
        </div>
      )}
      <div className="mb-2">
        <p><strong>Content Score:</strong> {assessment.Content_Score ?? "N/A"}</p>
      </div>
      {assessment.Inprep_Score && (
        <div className="mb-2">
          <p><strong>Inprep Score:</strong> {assessment.Inprep_Score.total_score ?? "N/A"}</p>
        </div>
      )}
      {assessment.Problem_Solving && (
        <div className="mb-2">
          <p><strong>Problem Solving:</strong> {assessment.Problem_Solving.feedback || "No feedback"}</p>
          <p><strong>Score:</strong> {assessment.Problem_Solving.score ?? "N/A"}</p>
        </div>
      )}
      {assessment.what_can_i_do_better && (
        <div className="mb-2">
          <p><strong>Improvement Tips:</strong> {assessment.what_can_i_do_better.overall_feedback || "No feedback"}</p>
        </div>
      )}
    </div>
  );
};

// Component to render AI response
const AiResponseDisplay = ({ response }) => {
  if (!response) {
    return <p>No response data available</p>;
  }
  if (response.error) {
    return <p className="text-red-500">Error: {response.error}</p>;
  }
  return (
    <div className="text-left bg-gray-100 p-4 rounded">
      {/* <h3 className="text-lg font-bold mb-2">AI Response:</h3>
      <p><strong>Question ID:</strong> {response.qid}</p>
      <p><strong>Interview ID:</strong> {response.interview_id}</p>
      <p><strong>Question Bank ID:</strong> {response.questionBank_id}</p>
      <p><strong>User ID:</strong> {response.user_id}</p>
      <p><strong>Is Summary:</strong> {response.isSummary ? "Yes" : "No"}</p>
      <p><strong>Is Last:</strong> {response.islast ? "Yes" : "No"}</p>
      <p><strong>Video URL:</strong> <a href={response.video_url} target="_blank" rel="noopener noreferrer">{response.video_url}</a></p> */}
      <AssessmentDisplay assessment={response.assessment} />
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
        console.log("Generated Questions:", data.remainingQuestions);
        generatedQuestions.current = data.remainingQuestions;

        if (Array.isArray(generatedQuestions.current) && generatedQuestions.current.length > 0) {
          React.startTransition(() => {
            setOngoingQuestion(generatedQuestions.current[0]);
            setCurrentQuestionIndex(0);
          });
        } else {
          setError("No questions generated from the API response");
        }
      } catch (err) {
        setError(err.message || "Failed to generate question set");
        console.error("Error generating questions:", err);
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    };

    if (AuthorizationToken && questionBankId) {
      fetchGeneratedQuestions();
    } else {
      setLoading(false);
      setError(AuthorizationToken ? "questionBank_id is required" : "No authorization token available");
      isProcessingRef.current = false;
    }
  }, [questionBankId, interviewId, AuthorizationToken]);

  // Handle AI response or error
  const handleVideoAnalysisComplete = useCallback((data) => {
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
    isProcessingRef.current = false;
  }, []);

  // Handle retake
  const handleRetake = useCallback(async () => {
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
        throw new Error(res.message || "Failed to generate new question for retake");
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
      isProcessingRef.current = false;
    }
  }, [ongoingQuestion, AuthorizationToken]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
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
    if (videoControllerRef.current && videoControllerRef.current.stopRecording) {
      videoControllerRef.current.stopRecording();
    }
    isProcessingRef.current = false;
  }, []);

  // Handle continue
  const handleContinue = useCallback(() => {
    if (isProcessingRef.current) {
      console.log("Skipping handleContinue: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleContinue called");
    React.startTransition(() => {
      setIsVideoState(true);
      setAiResponse(null);
      setError(null);
      if (
        Array.isArray(generatedQuestions.current) &&
        currentQuestionIndex < generatedQuestions.current.length - 1
      ) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setOngoingQuestion(generatedQuestions.current[nextIndex]);
      } else {
        console.log("Reached last question, setting summeryState");
        setSumarryState(true);
      }
    });
    isProcessingRef.current = false;
  }, [currentQuestionIndex]);

  // Handle summary generation
  const handleSummaryGenaration = useCallback(() => {
    if (isProcessingRef.current) {
      console.log("Skipping handleSummaryGenaration: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleSummaryGenaration called");
    React.startTransition(() => {
      setReturnOrFullRetakeState(true);
    });
    isProcessingRef.current = false;
  }, []);

  // Handle full retake
  const handleFullRetaake = useCallback(async () => {
    if (!ongoingQuestion || !ongoingQuestion.questionBank_id || isProcessingRef.current) {
      setError("No ongoing question or questionBank_id available for full retake");
      isProcessingRef.current = false;
      console.log("Skipping handleFullRetaake: invalid state");
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
        throw new Error(res.message || "Failed to generate full question set for retake");
      }

      const data = res.data.body;
      console.log("Generated Questions for Full Retake:", data.question_Set);
      generatedQuestions.current = data.question_Set;

      if (Array.isArray(generatedQuestions.current) && generatedQuestions.current.length > 0) {
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
        setError("No questions generated in full retake response");
      }
    } catch (err) {
      setError(err.message || "Failed to generate full question set for retake");
      console.error("Error generating full retake question set:", err);
    } finally {
      setRetakeLoading(false);
      isProcessingRef.current = false;
    }
  }, [ongoingQuestion, interviewId, AuthorizationToken, request]);

  // Handle return to interview
  const handleReturnInterview = useCallback(() => {
    if (isProcessingRef.current) {
      console.log("Skipping handleReturnInterview: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleReturnInterview called");
    navigate(`/userDashboard/mockInterview/${ongoingQuestion.interview_id}`);
    isProcessingRef.current = false;
  }, [ongoingQuestion, navigate]);

  // Handle continue click
  // Define onClick handlers with conditional logic handleContinueClick====>Done
  const handleContinueClick = () => {
    if (summeryState && returnOrFullRetakeState) {
      handleReturnInterview();
    } else if (summeryState) {
      handleSummaryGenaration();
    } else {
      handleContinue();
    }
  };





// Define onClick handlers with conditional logic handleRetakeClick====>Done
const handleRetakeClick = () => {
  if (summeryState && returnOrFullRetakeState) {
    handleFullRetaake();
  } else {
    handleRetake();
  }
};




  // Ref callback for VideoController
  const videoControllerRefCallback = useCallback((node) => {
    if (node) {
      videoControllerRef.current = {
        stopRecording: node.stopRecording,
      };
    }
  }, []);

  // Debug render
  console.log("Render with states:", { isVideoState, summeryState, currentQuestionIndex, aiResponse });

  return (
    <ErrorBoundary>
      <div className="text-black w-full px-6 py-8 h-auto bg-black">
        {loading && <p>Loading generated questions...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {ongoingQuestion && (
          <div className="w-full bg-white p-6 rounded-lg shadow h-full">
            <h1 className="mb-4 text-left text-sm text-[#676768]">
              Question {currentQuestionIndex + 1} of {generatedQuestions.current?.length || 0} Questions
            </h1>

            <div className="w-full flex justify-center items-center mb-10">
              <p className="text-lg">
                Q. {ongoingQuestion.question || "No question text available"}
              </p>
            </div>

            <div className="h-[80%] w-[60%] mx-auto">
              {isVideoState ? (
                retakeLoading ? (
                  <h2>Generating new question for retake...</h2>
                ) : (
                  <div className="w-full h-[80%] border-[1px] rounded-sm">
                    <p className="text-lg mb-4">
                      {ongoingQuestion.time_to_answer &&
                        !isVideoState &&
                        `${Math.floor(Number(ongoingQuestion.time_to_answer) / 60)} minute(s)`}
                    </p>
                    <VideoController
                      question={ongoingQuestion}
                      isVideoState={isVideoState}
                      isSummary={summeryState}
                      islast={currentQuestionIndex === (generatedQuestions.current?.length || 0) - 1}
                      onVideoAnalysisComplete={handleVideoAnalysisComplete}
                      ref={videoControllerRefCallback}
                    />
                  </div>
                )
              ) : (
                <div>
                  {aiResponse || error ? (
                    <AiResponseDisplay response={aiResponse} />
                  ) : (
                    <p>Processing video analysis...</p>
                  )}
                </div>
              )}
            </div>

            <div className="w-full flex justify-center">
              {isVideoState && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 w-[50%] h-[50px] rounded-[12px] text-white"
                  disabled={isProcessingRef.current || loading || retakeLoading}
                >
                  {currentQuestionIndex < (generatedQuestions.current?.length || 0) - 1 ? (
                    <div>Next Question</div>
                  ) : (
                    <div>Finish</div>
                  )}
                </button>
              )}
            </div>

            <div className="w-full flex justify-center">
              {!isVideoState && (
                <div className="flex justify-center gap-6 w-full">
                  <button
                    onClick={handleContinueClick}
                    className="bg-blue-500 w-[30%] h-[50px] rounded-[12px] text-white"
                    disabled={isProcessingRef.current || loading || retakeLoading}
                  >
                    Continue
                  </button>
                  <button
                    onClick={handleRetakeClick}
                    className="bg-green-500 w-[30%] h-[50px] rounded-[12px] text-white"
                    disabled={isProcessingRef.current || loading || retakeLoading}
                  >
                    {retakeLoading ? "Generating..." : "Retake"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StartInterviewPage;