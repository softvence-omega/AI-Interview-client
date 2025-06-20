// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../../context/AuthProvider";
// import useApi from "../../../hook/apiHook";
// import LoadingCircle from "../../../reuseable/LoadingCircle";
// import ErrorBoundary from "../../../reuseable/ErrorBoundary";
// import ViewHistory from "./ViewHistory";
// import ContentSection from "./ContentSection";
// import ButtonControls from "./ButtonControl";
// import HistoryButtonControls from "./HistoryControllButton";

// // LoadingErrorDisplay Component
// const LoadingErrorDisplay = ({ loading, error }) => (
//   <>
//     {loading && (
//       <div className="flex justify-center items-center">
//         <p className="text-white text-lg">Loading generated questions...</p>
//         <LoadingCircle />
//       </div>
//     )}
//     {error && <p className="text-red-500 text-center">Error: {error}</p>}
//   </>
// );

// // QuestionSection Component
// const QuestionSection = ({
//   currentQuestionIndex,
//   totalQuestions,
//   question,
// }) => (
//   <>
//     <h1 className="mb-4 text-left text-sm text-[#676768]">
//       Question {currentQuestionIndex + 1} of {totalQuestions} Questions
//     </h1>
//     <div className="w-full flex justify-center items-center mb-10">
//       <p className="text-[17px] md:text-[24px] lg:text-[24px] font-normal text-[#278352]">
//         Q. {question?.question || "No question text available"}
//       </p>
//     </div>
//   </>
// );

// // Main StartInterviewPage Component
// const StartInterviewPage = () => {
//   const [searchParams] = useSearchParams();
//   const questionBankId = searchParams.get("questionBank_id");
//   const interviewId = searchParams.get("interview_id");
//   const { user } = useAuth();
//   const AuthorizationToken = user?.approvalToken;
//   const { request } = useApi();

//   const generatedQuestions = useRef(null);
//   const history = useRef([]);
//   const [historyState, setHistoryState] = useState(false);
//   const [ongoingQuestion, setOngoingQuestion] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retakeLoading, setRetakeLoading] = useState(false);
//   const [isVideoState, setIsVideoState] = useState(true);
//   const [summeryState, setSumarryState] = useState(false);
//   const [returnOrFullRetakeState, setReturnOrFullRetakeState] = useState(false);
//   const [aiResponse, setAiResponse] = useState(null);
//   const [isSummaryLoading, setIsSummaryLoading] = useState(false); // New state for summary loading
//   const videoControllerRef = useRef(null);
//   const navigate = useNavigate();
//   const isProcessingRef = useRef(false);

//   // Fetch AI-generated questions
//   useEffect(() => {
//     const fetchGeneratedQuestions = async () => {
//       if (isProcessingRef.current) return;
//       isProcessingRef.current = true;

//       try {
//         setLoading(true);
//         setError(null);

//         if (!AuthorizationToken || !questionBankId) {
//           throw new Error(
//             AuthorizationToken
//               ? "questionBank_id is required"
//               : "No authorization token available"
//           );
//         }

//         const queryParams = [];
//         if (questionBankId)
//           queryParams.push(`questionBank_id=${questionBankId}`);
//         if (interviewId) queryParams.push(`interview_id=${interviewId}`);
//         const queryString =
//           queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

//         const endpoint = `/interview/genarateQuestionSet_ByAi${queryString}`;
//         const res = await request({
//           endpoint,
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `${AuthorizationToken}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(res.message || "Failed to generate question set");
//         }

//         const data = res.data.body;
//         if (data?.remainingQuestions || data?.question_Set) {
//           generatedQuestions.current =
//             data?.remainingQuestions || data?.question_Set || [];
//           history.current = data?.history || [];
//           setHistoryState(false);
//           if (
//             Array.isArray(generatedQuestions.current) &&
//             generatedQuestions.current.length > 0
//           ) {
//             React.startTransition(() => {
//               setOngoingQuestion(generatedQuestions.current[0]);
//               setCurrentQuestionIndex(0);
//             });
//           } else {
//             throw new Error("No questions generated from the API response");
//           }
//         } else if (data?.history) {
//           history.current = data.history || [];
//           setHistoryState(true);
//         } else {
//           throw new Error("No questions or history in API response");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to generate question set");
//         console.error("Error generating questions:", err);
//       } finally {
//         setLoading(false);
//         isProcessingRef.current = false;
//       }
//     };
//     fetchGeneratedQuestions();
//   }, [questionBankId, interviewId, AuthorizationToken]);

//   // Save AI response
//   const saveAiResponse = async (response) => {
//     if (!response) return;

//     try {
//       const dataToSave = {
//         ...response,
//         islast:
//           Array.isArray(generatedQuestions.current) &&
//           currentQuestionIndex === generatedQuestions.current.length - 1,
//         question_id: response.qid || null,
//         assessment: response.assessment,
//       };

//       if ("qid" in dataToSave) {
//         delete dataToSave.qid;
//       }

//       console.log("data to save", dataToSave);

//       const endpoint = `/video/submit_Video_Analysis_and_Summary`;
//       const res = await request({
//         endpoint,
//         method: "POST",
//         body: dataToSave,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${AuthorizationToken}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(res.message || "Failed to save video analysis");
//       }
//     } catch (err) {
//       console.error("Error saving AI response:", err);
//     }
//   };

//   // Handle retake
//   const handleRetake = async () => {
//     if (!ongoingQuestion || isProcessingRef.current) return;
//     isProcessingRef.current = true;

//     React.startTransition(() => {
//       setIsVideoState(true);
//       setAiResponse(null);
//       setError(null);
//     });
//     setRetakeLoading(true);

//     try {
//       const endpoint = `/interview/genarateSingleQuestion_ByAi_for_Retake`;
//       const res = await request({
//         endpoint,
//         method: "POST",
//         body: {
//           questionBank_id: ongoingQuestion.questionBank_id,
//           user_id: ongoingQuestion.user_id,
//           interview_id: ongoingQuestion.interview_id,
//           question_id: ongoingQuestion._id,
//         },
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${AuthorizationToken}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(
//           res.message || "Failed to generate new question for retake"
//         );
//       }

//       const newQuestion = res.data.body;
//       React.startTransition(() => {
//         setOngoingQuestion(newQuestion);
//       });

//       if (Array.isArray(generatedQuestions.current)) {
//         const updatedQuestions = [...generatedQuestions.current];
//         updatedQuestions[currentQuestionIndex] = newQuestion;
//         generatedQuestions.current = updatedQuestions;
//       }
//     } catch (err) {
//       setError(err.message || "Failed to generate new question for retake");
//       console.error("Error generating retake question:", err);
//     } finally {
//       setRetakeLoading(false);
//       isProcessingRef.current = false;
//     }
//   };

//   // Handle continue
//   const handleContinue = async () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;

//     try {
//       if (aiResponse) {
//         await saveAiResponse(aiResponse);
//       }

//       React.startTransition(() => {
//         if (
//           Array.isArray(generatedQuestions.current) &&
//           currentQuestionIndex < generatedQuestions.current.length - 1
//         ) {
//           const nextIndex = currentQuestionIndex + 1;
//           setCurrentQuestionIndex(nextIndex);
//           setOngoingQuestion(generatedQuestions.current[nextIndex]);
//           setIsVideoState(true);
//           setAiResponse(null);
//           setError(null);
//         } else {
//           setSumarryState(true);
//           setAiResponse(null);
//         }
//       });
//     } catch (err) {
//       setError(err.message || "Failed to save video analysis");
//       console.error("Error saving video analysis:", err);
//     } finally {
//       isProcessingRef.current = false;
//     }
//   };

//   // Handle next question
//   const handleNextQuestion = () => {
//     if (isProcessingRef.current) return;

//     React.startTransition(() => {
//       setIsVideoState(false);
//       setError(null);
//     });

//     if (
//       videoControllerRef.current &&
//       videoControllerRef.current.stopRecording
//     ) {
//       isProcessingRef.current = true; // Set processing state before stopping
//       videoControllerRef.current.stopRecording();
//     }

//     if (
//       Array.isArray(generatedQuestions.current) &&
//       currentQuestionIndex >= generatedQuestions.current.length - 1
//     ) {
//       React.startTransition(() => {
//         setAiResponse(null);
//         setSumarryState(true);
//       });
//     }
//   };

//   // Handle summary generation
//   const handleSummaryGenaration = async () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;
//     setIsSummaryLoading(true); // Set loading state for summary

//     try {
//       if (aiResponse) {
//         await saveAiResponse(aiResponse);
//       }

//       const questionBankId =
//         ongoingQuestion?.questionBank_id || aiResponse?.questionBank_id;

//       if (!questionBankId) {
//         throw new Error("questionBank_id not found in the response");
//       }

//       const endpoint = `/video/getSummary?questionBank_id=${questionBankId}`;
//       const res = await request({
//         endpoint,
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${AuthorizationToken}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(res.message || "Failed to generate summary");
//       }

//       React.startTransition(() => {
//         setAiResponse(res.data.data);
//         setReturnOrFullRetakeState(true);
//       });
//     } catch (err) {
//       setError(err.message || "Failed to generate summary");
//       console.error("Error generating summary:", err);
//     } finally {
//       setIsSummaryLoading(false); // Reset loading state
//       isProcessingRef.current = false;
//     }
//   };

//   // Handle full retake
//   const handleFullRetaake = async () => {
//     if (
//       (!ongoingQuestion || !ongoingQuestion.questionBank_id) &&
//       !history.current.length
//     ) {
//       setError(
//         "No ongoing question, questionBank_id, or history available for full retake"
//       );
//       isProcessingRef.current = false;
//       return;
//     }
//     isProcessingRef.current = true;
//     setRetakeLoading(true);

//     try {
//       const questionBankIdToUse =
//         ongoingQuestion?.questionBank_id ||
//         history.current[history.current.length - 1]?.questionBank_id ||
//         questionBankId;
//       if (!questionBankIdToUse) {
//         throw new Error("No questionBank_id available for retake");
//       }

//       const queryParams = [
//         `questionBank_id=${questionBankIdToUse}`,
//         "isRetake=true",
//       ];
//       if (interviewId) queryParams.push(`interview_id=${interviewId}`);
//       const queryString = `?${queryParams.join("&")}`;
//       const endpoint = `/interview/genarateQuestionSet_ByAi${queryString}`;

//       const res = await request({
//         endpoint,
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${AuthorizationToken}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(
//           res.message || "Failed to generate full question set for retake"
//         );
//       }

//       const data = res.data.body;
//       generatedQuestions.current = data.question_Set || [];

//       if (
//         Array.isArray(generatedQuestions.current) &&
//         generatedQuestions.current.length > 0
//       ) {
//         React.startTransition(() => {
//           setCurrentQuestionIndex(0);
//           setOngoingQuestion(generatedQuestions.current[0]);
//           setIsVideoState(true);
//           setSumarryState(false);
//           setReturnOrFullRetakeState(false);
//           setHistoryState(false);
//           setAiResponse(null);
//           setError(null);
//         });
//       } else {
//         throw new Error("No questions generated in full retake response");
//       }
//     } catch (err) {
//       setError(
//         err.message || "Failed to generate full question set for retake"
//       );
//       console.error("Error generating full retake question set:", err);
//     } finally {
//       setRetakeLoading(false);
//       isProcessingRef.current = false;
//     }
//   };

//   // Handle return to interview
//   const handleReturnInterview = () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;

//     navigate(`/userDashboard/mockInterview`);
//     isProcessingRef.current = false;
//   };

//   // Handle go back
//   const handleGoBack = () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;

//     navigate("/userDashboard/mockInterview");
//     isProcessingRef.current = false;
//   };

//   // Handle stop recording
//   const handleStopRecording = () => {
//     React.startTransition(() => {
//       setIsVideoState(false);
//       setError(null);
//     });
//   };

//   // Define click handlers
//   const handleContinueClick = () => {
//     if (summeryState && returnOrFullRetakeState) {
//       handleReturnInterview();
//     } else if (summeryState) {
//       handleSummaryGenaration();
//     } else {
//       handleContinue();
//     }
//   };

//   const handleRetakeClick = () => {
//     if (summeryState && returnOrFullRetakeState) {
//       handleFullRetaake();
//     } else {
//       handleRetake();
//     }
//   };

//   // Ref callback for VideoController
//   const videoControllerRefCallback = (node) => {
//     videoControllerRef.current = node
//       ? { stopRecording: node.stopRecording }
//       : null;
//   };

//   return (
//     <ErrorBoundary>
//       <div className="text-black w-full px-4 md:px-6 lg:px-6 py-8 h-auto">
//         <LoadingErrorDisplay loading={loading} error={error} />
//         {historyState ? (
//           <div className="w-full bg-white p-6 rounded-lg shadow h-full">
//             <ViewHistory history={history.current} />
//             <HistoryButtonControls
//               isProcessing={isProcessingRef.current}
//               loading={loading}
//               retakeLoading={retakeLoading}
//               handleFullRetaake={handleFullRetaake}
//               handleGoBack={handleGoBack}
//             />
//           </div>
//         ) : ongoingQuestion ? (
//           <div className="w-full bg-white p-6 rounded-lg shadow h-full">
//             {!returnOrFullRetakeState && (
//               <QuestionSection
//                 currentQuestionIndex={currentQuestionIndex}
//                 totalQuestions={generatedQuestions.current?.length || 0}
//                 question={ongoingQuestion}
//               />
//             )}

//             {summeryState && isSummaryLoading ? (
//               <div className="flex gap-2 justify-center items-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid" />
//                 <p>Generating summary...</p>
//                 <LoadingCircle />
//               </div>
//             ) : (
//               <ContentSection
//                 isVideoState={isVideoState}
//                 retakeLoading={retakeLoading}
//                 ongoingQuestion={ongoingQuestion}
//                 summeryState={summeryState}
//                 currentQuestionIndex={currentQuestionIndex}
//                 totalQuestions={generatedQuestions.current?.length || 0}
//                 aiResponse={aiResponse}
//                 error={error}
//                 videoControllerRefCallback={videoControllerRefCallback}
//                 isProcessingRef={isProcessingRef}
//                 setAiResponse={setAiResponse}
//                 handleNextQuestion={handleNextQuestion}
//                 onStopRecording={handleStopRecording}
//                 setIsVideoState={setIsVideoState}
//               />
//             )}
//             <ButtonControls
//               isVideoState={isVideoState}
//               summeryState={summeryState}
//               returnOrFullRetakeState={returnOrFullRetakeState}
//               currentQuestionIndex={currentQuestionIndex}
//               totalQuestions={generatedQuestions.current?.length || 0}
//               isProcessing={isProcessingRef.current}
//               loading={loading || isSummaryLoading} // Disable buttons during summary loading
//               retakeLoading={retakeLoading}
//               handleNextQuestion={handleNextQuestion}
//               handleContinueClick={handleContinueClick}
//               handleRetakeClick={handleRetakeClick}
//             />
//           </div>
//         ) : (
//           !loading &&
//           !error && (
//             <p className="text-white text-center">
//               No questions or history available to display.
//             </p>
//           )
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default StartInterviewPage;





import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import LoadingCircle from "../../../reuseable/LoadingCircle";
import ErrorBoundary from "../../../reuseable/ErrorBoundary";
import ViewHistory from "./ViewHistory";
import ContentSection from "./ContentSection";
import ButtonControls from "./ButtonControl";
import HistoryButtonControls from "./HistoryControllButton";
import ErrorPage from "../../../reuseable/ErrorPage";

// LoadingErrorDisplay Component
const LoadingErrorDisplay = ({ loading, error }) => (
  <>
    {loading && (
      <div className="flex justify-center items-center text-[#278352]">
        <p className="text-[#278352] text-lg">Loading generated questions...</p>
        <LoadingCircle className="" />
      </div>
    )}
    {error && <div><p className="text-red-500 text-center"></p> <ErrorPage message={error} /> </div>}
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
      <p className="text-[17px] md:text-[24px] lg:text-[24px] font-normal text-[#278352]">
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
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const videoControllerRef = useRef(null);
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);

  // Fetch AI-generated questions
  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      if (isProcessingRef.current) return;
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

  // Save AI response
  const saveAiResponse = async (response) => {
    if (!response) return;

    try {
      const dataToSave = {
        ...response,
        islast:
          Array.isArray(generatedQuestions.current) &&
          currentQuestionIndex === generatedQuestions.current.length - 1,
        question_id: response.qid || null,
        assessment: response.assessment,
      };

      if ("qid" in dataToSave) {
        delete dataToSave.qid;
      }

      console.log("data to save", dataToSave);

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
    } catch (err) {
      console.error("Error saving AI response:", err);
    }
  };

  // Handle retake
  const handleRetake = async () => {
    if (!ongoingQuestion || isProcessingRef.current) return;
    isProcessingRef.current = true;

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
      React.startTransition(() => {
        setOngoingQuestion(newQuestion);
      });

      if (Array.isArray(generatedQuestions.current)) {
        const updatedQuestions = [...generatedQuestions.current];
        updatedQuestions[currentQuestionIndex] = newQuestion;
        generatedQuestions.current = updatedQuestions;
      }
    } catch (err) {
      setError(err.message || "Failed to generate new question for retake");
      console.error("Error generating retake question:", err);
    } finally {
      setRetakeLoading(false);
      isProcessingRef.current = false;
    }
  };

  // Handle continue
  const handleContinue = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      if (aiResponse) {
        await saveAiResponse(aiResponse);
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
        } else {
          setSumarryState(true);
          setAiResponse(null);
        }
      });
    } catch (err) {
      setError(err.message || "Failed to save video analysis");
      console.error("Error saving video analysis:", err);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (isProcessingRef.current) return;

    React.startTransition(() => {
      setIsVideoState(false);
      setError(null);
    });

    if (
      videoControllerRef.current &&
      videoControllerRef.current.stopRecording
    ) {
      isProcessingRef.current = true;
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
  };

  // Handle summary generation
  const handleSummaryGenaration = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsSummaryLoading(true);

    try {
      if (aiResponse) {
        await saveAiResponse(aiResponse);
      }

      const questionBankId =
        ongoingQuestion?.questionBank_id || aiResponse?.questionBank_id;

      if (!questionBankId) {
        throw new Error("questionBank_id not found in the response");
      }

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

      React.startTransition(() => {
        setAiResponse(res.data.data);
        setReturnOrFullRetakeState(true);
      });
    } catch (err) {
      setError(err.message || "Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      setIsSummaryLoading(false);
      isProcessingRef.current = false;
    }
  };

  // Handle full retake
  const handleFullRetaake = async () => {
    if (
      (!ongoingQuestion || !ongoingQuestion.questionBank_id) &&
      !history.current.length
    ) {
      setError(
        "No ongoing question, questionBank_id, or history available for full retake"
      );
      isProcessingRef.current = false;
      return;
    }
    isProcessingRef.current = true;
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
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    navigate(`/userDashboard/mockInterview`);
    isProcessingRef.current = false;
  };

  // Handle go back
  const handleGoBack = () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    navigate("/userDashboard/mockInterview");
    isProcessingRef.current = false;
  };

  // Handle stop recording
  const handleStopRecording = () => {
    React.startTransition(() => {
      setIsVideoState(false);
      setError(null);
    });
  };

  // Define click handlers
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
    videoControllerRef.current = node
      ? { stopRecording: node.stopRecording }
      : null;
  };

  return (
    <ErrorBoundary>
      <div className="text-black w-full px-0 md:px-6 lg:px-6 md:py-8 lg:py-8 h-auto">
        <LoadingErrorDisplay loading={loading} error={error} />
        {historyState ? (
          <div className="w-full bg-white p-0 md:p-6 lg:p-6 rounded-lg shadow h-full">
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
            {!returnOrFullRetakeState && (
              <QuestionSection
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={generatedQuestions.current?.length || 0}
                question={ongoingQuestion}
              />
            )}

            {summeryState && isSummaryLoading ? (
              <div className="flex gap-2 justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid" />
                <p>Generating summary...</p>
                <LoadingCircle />
              </div>
            ) : (
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
                isProcessingRef={isProcessingRef}
                setAiResponse={setAiResponse}
                handleNextQuestion={handleNextQuestion}
                onStopRecording={handleStopRecording}
                setIsVideoState={setIsVideoState}
              />
            )}
            <ButtonControls
              isVideoState={isVideoState}
              summeryState={summeryState}
              returnOrFullRetakeState={returnOrFullRetakeState}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={generatedQuestions.current?.length || 0}
              isProcessing={isProcessingRef.current}
              loading={loading || isSummaryLoading}
              retakeLoading={retakeLoading}
              error={error} // Pass error prop
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
