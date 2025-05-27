import React, { useState, useEffect, useRef, Component } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import LoadingCircle from "../../../reuseable/LoadingCircle";
import ErrorBoundary from "../../../reuseable/ErrorBoundary";
import AssessmentDisplay from "./AssesmrntDisplay";
import ViewHistory from "./ViewHistory";
import ContentSection from "./ContentSection";
import ButtonControls from "./ButtonControl";
import HistoryButtonControls from "./HistoryControllButton";

// LoadingErrorDisplay Component
const LoadingErrorDisplay = ({ loading, error }) => (
  <>
    {loading && (
      <div className="flex justify-center items-center">
        <p className="text-white text-lg">Loading generated questions...</p>
        <LoadingCircle />
      </div>
    )}
    {error && <p className="text-red-500 text-center">Error: {error}</p>}
  </>
);

// QuestionSection Component
const QuestionSection = ({
  currentQuestionIndex,
  totalQuestions,
  question,
}) => (
  <>
    <h1 className="mb-4 text-left text-sm text-[#676768]">
      Question {currentQuestionIndex + 1} of {totalQuestions} Questions
    </h1>
    <div className="w-full flex justify-center items-center mb-10">
      <p className="text-[24px] font-normal text-[#278352]">
        Q. {question?.question || "No question text available"}
      </p>
    </div>
  </>
);

// Main StartInterviewPage Component
const StartInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id");
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const generatedQuestions = useRef(null);
  const history = useRef([]);
  const [historyState, setHistoryState] = useState(false);
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

        if (data?.remainingQuestions || data?.question_Set) {
          generatedQuestions.current =
            data?.remainingQuestions || data?.question_Set || [];
          history.current = data?.history || [];
          setHistoryState(false);
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
        } else if (data?.history) {
          history.current = data.history || [];
          setHistoryState(true);
        } else {
          throw new Error("No questions or history in API response");
        }
      } catch (err) {
        setError(err.message || "Failed to generate question set");
        console.error("Error generating questions:", err);
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
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

    console.log("handleVideoAnalysisComplete called with:==============>>>>>>>=======>>>>>>>======>>>>", data);

    React.startTransition(() => {
      if (data.error) {
        setError(data.error);
        setAiResponse(null);
      }
      else {
        setAiResponse(data);
        setError(null);
      }
    });

    isProcessingRef.current = false;
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
      isProcessingRef.current = false;
    }
  };



  // Handle continue save Ai Response data in the database ...................
  const handleContinue = async () => {
    setAiResponse(null);

    if (isProcessingRef.current) {
      console.log("Skipping handleContinue: already processing");
      return;
    }

    isProcessingRef.current = true;

    console.log("handleContinue called");
    try {
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

        console.log("this is data to be saved", dataToSave);

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
        ) 
        {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setOngoingQuestion(generatedQuestions.current[nextIndex]);
          setIsVideoState(true);
          setAiResponse(null);
          setError(null);
        }
        else {
          console.log("Reached last question, keeping summeryState");
        }
      });
    } 
    catch (err)
    {
      setError(err.message || "Failed to save video analysis");
      console.error("Error saving video analysis:", err);
    }
    finally {
      isProcessingRef.current = false;
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

    if (
      Array.isArray(generatedQuestions.current) &&
      currentQuestionIndex >= generatedQuestions.current.length - 1
    ) {
      React.startTransition(() => {
        setAiResponse(null);
        setSumarryState(true);
      });
    }

    isProcessingRef.current = false;
  };




  // Handle summary generation
  const handleSummaryGenaration = async () => {

    setAiResponse(null);

    await handleContinue();
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

      console.log(
        "Summary generated successfully****************************:",
        res.data.data
      );

      React.startTransition(() => {
        setAiResponse(null);
        setAiResponse(res.data.data);
        setReturnOrFullRetakeState(true);
      });
    } 
    catch (err) {
      setError(err.message || "Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      isProcessingRef.current = false;
    }
  };




  // Handle full retake
  const handleFullRetaake = async () => {
    if (
      (!ongoingQuestion || !ongoingQuestion.questionBank_id) &&
      !history.current.length
    ) 
    {
      setError(
        "No ongoing question, questionBank_id, or history available for full retake"
      );
      console.log("Skipping handleFullRetaake: invalid state");
      isProcessingRef.current = false;
      return;
    }
    isProcessingRef.current = true;

    console.log("handleFullRetaake called");
    setRetakeLoading(true);

    try {
      const questionBankIdToUse =
        ongoingQuestion?.questionBank_id ||
        history.current[history.current.length - 1]?.questionBank_id ||
        questionBankId;
      if (!questionBankIdToUse) {
        throw new Error("No questionBank_id available for retake");
      }

      const queryParams = [
        `questionBank_id=${questionBankIdToUse}`,
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
          setHistoryState(false);
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
      isProcessingRef.current = false;
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
    navigate(`/userDashboard/mockInterview/${interviewId}`);
    isProcessingRef.current = false;
  };




  // Handle go back to dashboard
  const handleGoBack = () => {
    if (isProcessingRef.current) {
      console.log("Skipping handleGoBack: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleGoBack called");
    navigate("/userDashboard");
    isProcessingRef.current = false;
  };




  // Define onClick handlers with conditional logic
  const handleContinueClick = () => {


    if (summeryState && returnOrFullRetakeState) {
      setAiResponse(null);
      handleReturnInterview();
    } 
    else if (summeryState)
    {
      setAiResponse(null);
      handleSummaryGenaration();
    }
    else {
      setAiResponse(null);
      handleContinue();
    }


  };



  const handleRetakeClick = () => {

    if (summeryState && returnOrFullRetakeState) {
      setAiResponse(null);
      handleFullRetaake();
    } else {
      setAiResponse(null);
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
  console.log("Render with states: here=============>>>>>>>>>>>>>>>", {
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
        <LoadingErrorDisplay loading={loading} error={error} />
        {historyState ? (
          <div className="w-full bg-white p-6 rounded-lg shadow h-full">
            <ViewHistory history={history.current} />
            <HistoryButtonControls
              isProcessing={isProcessingRef.current}
              loading={loading}
              retakeLoading={retakeLoading}
              handleFullRetaake={handleFullRetaake}
              handleGoBack={handleGoBack}
            />
          </div>
        ) : ongoingQuestion ? (
          <div className="w-full bg-white p-6 rounded-lg shadow h-full">
            <QuestionSection
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={generatedQuestions.current?.length || 0}
              question={ongoingQuestion}
            />
            <ContentSection
              isVideoState={isVideoState}
              retakeLoading={retakeLoading}
              ongoingQuestion={ongoingQuestion}
              summeryState={summeryState}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={generatedQuestions.current?.length || 0}
              aiResponse={aiResponse}
              error={error}
              videoControllerRefCallback={videoControllerRefCallback}
              handleVideoAnalysisComplete={handleVideoAnalysisComplete}
              isProcessingRef={isProcessingRef}
              setAiResponse={setAiResponse}
            />
            <ButtonControls
              isVideoState={isVideoState}
              summeryState={summeryState}
              returnOrFullRetakeState={returnOrFullRetakeState}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={generatedQuestions.current?.length || 0}
              isProcessing={isProcessingRef.current}
              loading={loading}
              retakeLoading={retakeLoading}
              handleNextQuestion={handleNextQuestion}
              handleContinueClick={handleContinueClick}
              handleRetakeClick={handleRetakeClick}
            />
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-white text-center">
              No questions or history available to display.
            </p>
          )
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StartInterviewPage;