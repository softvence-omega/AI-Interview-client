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
// import ErrorPage from "../../../reuseable/ErrorPage";

// // LoadingErrorDisplay Component
// const LoadingErrorDisplay = ({ loading, error }) => (
//   <>
//     {loading && (
//       <div className="flex justify-center items-center text-[#278352]">
//         <p className="text-[#278352] text-lg">Loading generated questions...</p>
//         <LoadingCircle className="" />
//       </div>
//     )}
//     {error && <div><p className="text-red-500 text-center"></p> <ErrorPage message={error} /> </div>}
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
//   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
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
//       isProcessingRef.current = true;
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
//     setIsSummaryLoading(true);

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
//       setIsSummaryLoading(false);
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
//       <div className="text-black w-full px-0 md:px-6 lg:px-6 md:py-8 lg:py-8 h-auto">
//         <LoadingErrorDisplay loading={loading} error={error} />
//         {historyState ? (
//           <div className="w-full bg-white p-0 md:p-6 lg:p-6 rounded-lg shadow h-full">
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
//               loading={loading || isSummaryLoading}
//               retakeLoading={retakeLoading}
//               error={error} // Pass error prop
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

// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../../context/AuthProvider";
// import useApi from "../../../hook/apiHook";
// import LoadingCircle from "../../../reuseable/LoadingCircle";
// import ErrorBoundary from "../../../reuseable/ErrorBoundary";
// import ViewHistory from "./ViewHistory";
// import ContentSection from "./ContentSection";
// import ButtonControls from "./ButtonControl";
// import HistoryButtonControls from "./HistoryControllButton";
// import ErrorPage from "../../../reuseable/ErrorPage";

// // LoadingErrorDisplay Component
// const LoadingErrorDisplay = ({ loading, error }) => (
//   <>
//     {loading && (
//       <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow transition-opacity duration-300">
//         <div className="h-6 bg-gray-200 rounded animate-pulse" />
//         <div className="h-12 bg-gray-200 rounded animate-pulse" />
//         <div className="flex justify-center items-center text-[#278352]">
//           <p className="text-[#278352] text-lg">Loading generated questions...</p>
//           <LoadingCircle className="" />
//         </div>
//       </div>
//     )}
//     {error && (
//       <div className="transition-opacity duration-300">
//         <p className="text-red-500 text-center"></p>
//         <ErrorPage message={error} />
//       </div>
//     )}
//   </>
// );

// // QuestionSection Component
// const QuestionSection = ({ currentQuestionIndex, totalQuestions, question }) => (
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
//   const { expectation, dependency, questionType } = useMemo(() => {
//     let parsedExpectation;
//     try {
//       parsedExpectation = JSON.parse(decodeURIComponent(searchParams.get("expectation") || "[]"));
//     } catch (err) {
//       parsedExpectation = [];
//       console.error("Error parsing expectation:", err);
//     }
//     return {
//       expectation: parsedExpectation,
//       dependency: searchParams.get("dependency"),
//       questionType: searchParams.get("questionType"),
//     };
//   }, [searchParams]);
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
//   const [summaryState, setSummaryState] = useState(false);
//   const [returnOrFullRetakeState, setReturnOrFullRetakeState] = useState(false);
//   const [aiResponse, setAiResponse] = useState(null);
//   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
//   const videoControllerRef = useRef(null);
//   const navigate = useNavigate();
//   const isProcessingRef = useRef(false);

//   // Debug re-renders (comment out in production)
//   /*
//   useEffect(() => {
//     console.log("Component re-rendered", {
//       historyState,
//       ongoingQuestion,
//       currentQuestionIndex,
//       loading,
//       isVideoState,
//       summaryState,
//       returnOrFullRetakeState,
//       aiResponse,
//       isSummaryLoading,
//     });
//   });
//   */

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
//         const body = {
//           question_Type: questionType || "MCQ Question",
//           difficulty_level: dependency || "Beginner",
//           what_to_expect: expectation || ["HTML", "css", "js"],
//         };

//         const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));
//         const res = await request({
//           endpoint,
//           method: "POST",
//           body,
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `${AuthorizationToken}`,
//           },
//         });

//         await minLoadingTime;

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
//             setOngoingQuestion(generatedQuestions.current[0]);
//             setCurrentQuestionIndex(0);
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
//   }, [questionBankId, interviewId, expectation, dependency, questionType, AuthorizationToken]);

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

//     setIsVideoState(true);
//     setAiResponse(null);
//     setError(null);
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
//       setOngoingQuestion(newQuestion);

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

//       if (
//         Array.isArray(generatedQuestions.current) &&
//         currentQuestionIndex < generatedQuestions.current.length - 1
//       ) {
//         const nextIndex = currentQuestionIndex + 1;
//         setCurrentQuestionIndex(nextIndex);
//         setOngoingQuestion(generatedQuestions.current[nextIndex]);
//         setIsVideoState(true);
//         setAiResponse(null);
//         setError(null);
//       } else {
//         setSummaryState(true);
//         setAiResponse(null);
//       }
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

//     setIsVideoState(false);
//     setError(null);

//     if (
//       videoControllerRef.current &&
//       videoControllerRef.current.stopRecording
//     ) {
//       isProcessingRef.current = true;
//       videoControllerRef.current.stopRecording();
//     }

//     if (
//       Array.isArray(generatedQuestions.current) &&
//       currentQuestionIndex >= generatedQuestions.current.length - 1
//     ) {
//       setAiResponse(null);
//       setSummaryState(true);
//     }
//   };

//   // Handle summary generation
//   const handleSummaryGenaration = async () => {
//     if (isProcessingRef.current) return;
//     isProcessingRef.current = true;
//     setIsSummaryLoading(true);

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

//       setAiResponse(res.data.data);
//       setReturnOrFullRetakeState(true);
//     } catch (err) {
//       setError(err.message || "Failed to generate summary");
//       console.error("Error generating summary:", err);
//     } finally {
//       setIsSummaryLoading(false);
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
//       const body = {
//         question_Type: questionType || "MCQ Question",
//         difficulty_level: dependency || "Beginner",
//         what_to_expect: expectation || ["HTML", "css", "js"],
//         isRetake: true,
//       };

//       const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));
//       const res = await request({
//         endpoint,
//         method: "POST",
//         body,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${AuthorizationToken}`,
//         },
//       });

//       await minLoadingTime;

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
//         setCurrentQuestionIndex(0);
//         setOngoingQuestion(generatedQuestions.current[0]);
//         setIsVideoState(true);
//         setSummaryState(false);
//         setReturnOrFullRetakeState(false);
//         setHistoryState(false);
//         setAiResponse(null);
//         setError(null);
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
//     setIsVideoState(false);
//     setError(null);
//   };

//   // Define click handlers
//   const handleContinueClick = () => {
//     if (summaryState && returnOrFullRetakeState) {
//       handleReturnInterview();
//     } else if (summaryState) {
//       handleSummaryGenaration();
//     } else {
//       handleContinue();
//     }
//   };

//   const handleRetakeClick = () => {
//     if (summaryState && returnOrFullRetakeState) {
//       handleFullRetaake();
//     } else {
//       handleRetake();
//     }
//   };

//   // Ref callback for VideoController
//   const videoControllerRefCallback = (node) => {
//     // console.log("Video controller ref updated:", node);
//     videoControllerRef.current = node
//       ? { stopRecording: node.stopRecording }
//       : null;
//   };

//   return (
//     <ErrorBoundary>
//       <div className="text-black w-full px-0 md:px-6 lg:px-6 md:py-8 lg:py-8 h-auto transition-opacity duration-300">
//         <LoadingErrorDisplay loading={loading} error={error} />
//         {historyState ? (
//           <div className="w-full bg-white p-0 md:p-6 lg:p-6 rounded-lg shadow h-full transition-opacity duration-300">
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
//           <div className="w-full bg-white p-6 rounded-lg shadow h-full transition-opacity duration-300">
//             {!returnOrFullRetakeState && (
//               <QuestionSection
//                 currentQuestionIndex={currentQuestionIndex}
//                 totalQuestions={generatedQuestions.current?.length || 0}
//                 question={ongoingQuestion}
//               />
//             )}

//             {summaryState && isSummaryLoading ? (
//               <div className="flex gap-2 justify-center items-center transition-opacity duration-300">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid" />
//                 <p>Generating summary...</p>
//                 <LoadingCircle />
//               </div>
//             ) : (
//               <ContentSection
//                 key={ongoingQuestion?._id}
//                 isVideoState={isVideoState}
//                 retakeLoading={retakeLoading}
//                 ongoingQuestion={ongoingQuestion}
//                 summaryState={summaryState}
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
//               summaryState={summaryState}
//               returnOrFullRetakeState={returnOrFullRetakeState}
//               currentQuestionIndex={currentQuestionIndex}
//               totalQuestions={generatedQuestions.current?.length || 0}
//               isProcessing={isProcessingRef.current}
//               loading={loading || isSummaryLoading}
//               retakeLoading={retakeLoading}
//               error={error}
//               handleNextQuestion={handleNextQuestion}
//               handleContinueClick={handleContinueClick}
//               handleRetakeClick={handleRetakeClick}
//             />
//           </div>
//         ) : (
//           !loading &&
//           !error && (
//             <p className="text-white text-center transition-opacity duration-300">
//               No questions or history available to display.
//             </p>
//           )
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default StartInterviewPage;

import React, { useState, useEffect, useRef, useMemo } from "react";
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

// RetakePreferenceModal Component
const RetakePreferenceModal = ({
  isOpen,
  onClose,
  onStartInterview,
  questionBankId,
}) => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const [preferences, setPreferences] = useState({
    selectedExpectation: [],
    selectedDifficulty: "Beginner",
    selectedQuestionType: "MCQ Question",
  });

  const [expandedSections, setExpandedSections] = useState({
    whatToExpect: false,
    difficultyLevel: false,
    questionType: false,
  });

  const [questionBankTopicsModal, setQuestionBankTopicsModal] = useState([]);
  const [loadingTopicsModal, setLoadingTopicsModal] = useState(false);
  const [errorTopicsModal, setErrorTopicsModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setQuestionBankTopicsModal([]);
      setLoadingTopicsModal(false);
      setErrorTopicsModal(null);
      return;
    }

    let isCancelled = false;

    const fetchQuestionBankTopics = async () => {
      setLoadingTopicsModal(true);

      if (!AuthorizationToken || !questionBankId) {
        if (!isCancelled) {
          setErrorTopicsModal(
            AuthorizationToken
              ? "questionBank_id is required"
              : "No authorization token available"
          );
          setLoadingTopicsModal(false);
        }
        return;
      }

      try {
        const endpoint = `/interview/get_question_bank?questionBank_id=${questionBankId}`;

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
        const questionBank = Array.isArray(data)
          ? data.find((item) => item._id === questionBankId)
          : null;

        if (!isCancelled) {
          if (questionBank && Array.isArray(questionBank.what_to_expect)) {
            setQuestionBankTopicsModal(questionBank.what_to_expect);
          } else {
            setQuestionBankTopicsModal([]);
          }
          setErrorTopicsModal(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorTopicsModal(
            err.message || "Failed to fetch question bank topics"
          );
          console.error("Error fetching question bank topics:", err);
        }
      } finally {
        if (!isCancelled) {
          setLoadingTopicsModal(false);
        }
      }
    };

    fetchQuestionBankTopics();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, AuthorizationToken, questionBankId]);

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => {
      if (field === "selectedExpectation") {
        const updatedExpectations = prev.selectedExpectation.includes(value)
          ? prev.selectedExpectation.filter((exp) => exp !== value)
          : [...prev.selectedExpectation, value];
        return { ...prev, selectedExpectation: updatedExpectations };
      }
      return { ...prev, [field]: value };
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-50 p-2 lg:p-0 md:p-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <style>
          {`
            .custom-select-wrapper {
              position: relative;
              width: 100%;
            }
            .custom-select {
              appearance: none;
              background: white;
              border: 1px solid #d1d5db;
              border-radius: 0.5rem;
              padding: 0.5rem 2.5rem 0.5rem 0.75rem;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
              width: 100%;
              font-size: 0.875rem;
            }
            .custom-select:hover {
              border-color: #10b981;
              box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }
            .custom-select:focus {
              outline: none;
              border-color: #10b981;
              box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
            }
            .custom-select-arrow {
              position: absolute;
              right: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
              pointer-events: none;
              color: #374151;
              font-size: 0.875rem;
            }
            .slide-down {
              transition: all 0.3s ease-in-out;
              overflow: hidden;
            }
            .slide-down.collapsed {
              max-height: 0;
              opacity: 0;
            }
            .slide-down.expanded {
              max-height: 500px;
              opacity: 1;
            }
          `}
        </style>

        <h2 className="text-xl font-semibold mb-4">
          Customize Interview Preferences
        </h2>

        {/* What to Expect */}
        {/* <div className="mb-4">
          <button
            type="button"
            className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
            onClick={() => toggleSection("whatToExpect")}
          >
            What to Expect
            <span className={`ml-2 transform transition-transform ${expandedSections.whatToExpect ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          <div className={`slide-down ${expandedSections.whatToExpect ? "expanded" : "expanded"}`}>
            {loadingTopicsModal ? (
              <p className="text-gray-600 mt-2">Loading topics...</p>
            ) : errorTopicsModal ? (
              <p className="text-red-500 mt-2">Error: {errorTopicsModal}</p>
            ) : questionBankTopicsModal.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-2">
                {questionBankTopicsModal.map((expectation, idx) => (
                  <label key={idx} className="flex items-center space-x-2 w-[calc(50%-0.5rem)]">
                    <input
                      type="checkbox"
                      className="h-5 w-5 border-gray-300 rounded focus:ring-green-500"
                      checked={preferences.selectedExpectation.includes(expectation)}
                      onChange={() => handlePreferenceChange("selectedExpectation", expectation)}
                    />
                    <span className="text-gray-700">{expectation}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 mt-2">No expectations listed</p>
            )}
          </div>
        </div> */}
        <div className="mb-4">
          <button
            type="button"
            className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
            onClick={() => toggleSection("whatToExpect")}
          >
            What to Expect
            <span
              className={`ml-2 transform transition-transform ${
                expandedSections.whatToExpect ? "rotate-180" : ""
              }`}
            >
              {/* ▼ */}
            </span>
          </button>
          <div
            className={`slide-down ${
              expandedSections.whatToExpect ? "expanded" : "expanded"
            }`}
          >
            {loadingTopicsModal ? (
              <p className="text-gray-600 mt-2">Loading topics...</p>
            ) : errorTopicsModal ? (
              <p className="text-red-500 mt-2">Error: {errorTopicsModal}</p>
            ) : questionBankTopicsModal.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-2">
                {questionBankTopicsModal.map((expectation, idx) => (
                  <label
                    key={idx}
                    className="flex items-center space-x-2 w-[calc(50%-0.5rem)]"
                  >
                    <input
                      type="checkbox"
                      className={`h-5 w-5 rounded border-2 border-gray-400 bg-white checked:bg-green-500 checked:border-green-500 focus:ring-green-500 transition-colors duration-200 appearance-none
  `}
                      checked={preferences.selectedExpectation.includes(
                        expectation
                      )}
                      onChange={() =>
                        handlePreferenceChange(
                          "selectedExpectation",
                          expectation
                        )
                      }
                    />
                    <span className="text-gray-700">{expectation}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 mt-2">No expectations listed</p>
            )}
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="mb-4">
          <button
            type="button"
            className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
            onClick={() => toggleSection("difficultyLevel")}
          >
            Difficulty Level: {preferences.selectedDifficulty}
            <span
              className={`ml-2 transform transition-transform ${
                expandedSections.difficultyLevel ? "rotate-180" : ""
              }`}
            >
              {/* ▼ */}
            </span>
          </button>
          <div
            className={`slide-down ${
              expandedSections.difficultyLevel ? "expanded" : "expanded"
            }`}
          >
            <div className="custom-select-wrapper mt-2">
              <select
                className="custom-select"
                value={preferences.selectedDifficulty}
                onChange={(e) => {
                  handlePreferenceChange("selectedDifficulty", e.target.value);
                  toggleSection("difficultyLevel");
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
              <span className="custom-select-arrow">▼</span>
            </div>
          </div>
        </div>

        {/* Question Type */}
        <div className="mb-4">
          <button
            type="button"
            className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
            onClick={() => toggleSection("questionType")}
          >
            Question Type: {preferences.selectedQuestionType}
            <span
              className={`ml-2 transform transition-transform ${
                expandedSections.questionType ? "rotate-180" : ""
              }`}
            >
              {/* ▼ */}
            </span>
          </button>
          <div
            className={`slide-down ${
              expandedSections.questionType ? "expanded" : "expanded"
            }`}
          >
            <div className="custom-select-wrapper mt-2">
              <select
                className="custom-select"
                value={preferences.selectedQuestionType}
                onChange={(e) => {
                  handlePreferenceChange(
                    "selectedQuestionType",
                    e.target.value
                  );
                  toggleSection("questionType");
                }}
              >
                <option value="MCQ Question">MCQ Question</option>
                <option value="Open Ended">Open Ended</option>
              </select>
              <span className="custom-select-arrow">▼</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            className={`px-4 py-2 flex items-center justify-center gap-2 rounded text-white transition-colors duration-200 cursor-pointer ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={async () => {
              // ✅ Check if required fields are filled
              if (
                preferences.selectedExpectation.length === 0 ||
                !preferences.selectedDifficulty ||
                !preferences.selectedQuestionType
              ) {
                setFormError(
                  "Please select all preferences before starting."
                );
                return;
              }

              setFormError(""); // Clear error if valid
              setIsLoading(true);
              try {
                await onStartInterview(
                  preferences.selectedExpectation,
                  preferences.selectedDifficulty,
                  preferences.selectedQuestionType
                );
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {isLoading && (
              <svg
                className="w-4 h-4 animate-spin text-white"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            <span>{isLoading ? "Starting..." : "Start Interview"}</span>
          </button>
        </div>
        {formError && (
          <p className="text-red-500 text-sm font-medium my-2">
            ⚠️ {formError}
          </p>
        )}
      </div>
    </div>
  );
};

// LoadingErrorDisplay Component
const LoadingErrorDisplay = ({ loading, error }) => (
  <>
    {loading && (
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow transition-opacity duration-300">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="flex justify-center items-center text-[#278352]">
          <p className="text-[#278352] text-lg">Loading questions...</p>
          <LoadingCircle className="" />
        </div>
      </div>
    )}
    {error && (
      <div className="transition-opacity duration-300">
        <p className="text-red-500 text-center"></p>
        <ErrorPage message={error} />
      </div>
    )}
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
  const { expectation, dependency, questionType } = useMemo(() => {
    let parsedExpectation;
    try {
      parsedExpectation = JSON.parse(
        decodeURIComponent(searchParams.get("expectation") || "[]")
      );
    } catch (err) {
      parsedExpectation = [];
      console.error("Error parsing expectation:", err);
    }
    return {
      expectation: parsedExpectation,
      dependency: searchParams.get("dependency"),
      questionType: searchParams.get("questionType"),
    };
  }, [searchParams]);
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
  const [summaryState, setSummaryState] = useState(false);
  const [returnOrFullRetakeState, setReturnOrFullRetakeState] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoControllerRef = useRef(null);
  const navigate = useNavigate();
  const isProcessingRef = useRef(false);

  // Debug re-renders (commented out for production)
  /*
  useEffect(() => {
    console.log("Component re-rendered", {
      historyState,
      ongoingQuestion,
      currentQuestionIndex,
      loading,
      isVideoState,
      summaryState,
      returnOrFullRetakeState,
      aiResponse,
      isSummaryLoading,
    });
  });
  */

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
        const body = {
          question_Type: questionType || "MCQ Question",
          difficulty_level: dependency || "Beginner",
          what_to_expect: expectation || ["HTML", "css", "js"],
        };

        const minLoadingTime = new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
        const res = await request({
          endpoint,
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });

        await minLoadingTime;

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
            setOngoingQuestion(generatedQuestions.current[0]);
            setCurrentQuestionIndex(0);
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
  }, [
    questionBankId,
    interviewId,
    expectation,
    dependency,
    questionType,
    AuthorizationToken,
  ]);

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

    setIsVideoState(true);
    setAiResponse(null);
    setError(null);
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
      setOngoingQuestion(newQuestion);

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
        setSummaryState(true);
        setAiResponse(null);
      }
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

    setIsVideoState(false);
    setError(null);

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
      setAiResponse(null);
      setSummaryState(true);
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

      setAiResponse(res.data.data);
      setReturnOrFullRetakeState(true);
    } catch (err) {
      setError(err.message || "Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      setIsSummaryLoading(false);
      isProcessingRef.current = false;
    }
  };

  // Handle full retake
  const handleFullRetaake = async (
    selectedExpectation,
    selectedDifficulty,
    selectedQuestionType
  ) => {
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

    // Validate modal preferences
    if (
      !Array.isArray(selectedExpectation) ||
      selectedExpectation.length === 0
    ) {
      setError("Please select at least one topic in 'What to Expect'");
      isProcessingRef.current = false;
      return;
    }
    if (!selectedDifficulty || typeof selectedDifficulty !== "string") {
      setError("Please select a valid difficulty level");
      isProcessingRef.current = false;
      return;
    }
    if (!selectedQuestionType || typeof selectedQuestionType !== "string") {
      setError("Please select a valid question type");
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
      const body = {
        question_Type: selectedQuestionType,
        difficulty_level: selectedDifficulty,
        what_to_expect: selectedExpectation, // Sends entire array to replace backend what_to_expect
        isRetake: true,
      };

      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));
      const res = await request({
        endpoint,
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`,
        },
      });

      await minLoadingTime;

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
        setCurrentQuestionIndex(0);
        setOngoingQuestion(generatedQuestions.current[0]);
        setIsVideoState(true);
        setSummaryState(false);
        setReturnOrFullRetakeState(false);
        setHistoryState(false);
        setAiResponse(null);
        setError(null);
        setIsModalOpen(false);
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
    setIsVideoState(false);
    setError(null);
  };

  // Define click handlers
  const handleContinueClick = () => {
    if (summaryState && returnOrFullRetakeState) {
      handleReturnInterview();
    } else if (summaryState) {
      handleSummaryGenaration();
    } else {
      handleContinue();
    }
  };

  const handleRetakeClick = () => {
    if (summaryState && returnOrFullRetakeState) {
      setIsModalOpen(true);
    } else {
      handleRetake();
    }
  };

  // Handle modal open for history state
  const handleHistoryRetakeClick = () => {
    setIsModalOpen(true);
  };

  // Ref callback for VideoController
  const videoControllerRefCallback = (node) => {
    // console.log("Video controller ref updated:", node);
    videoControllerRef.current = node
      ? { stopRecording: node.stopRecording }
      : null;
  };

  return (
    <ErrorBoundary>
      <div className="text-black w-full px-0 md:px-6 lg:px-6 md:py-8 lg:py-8 h-auto transition-opacity duration-300">
        <RetakePreferenceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStartInterview={handleFullRetaake}
          history={history.current}
          questionBankId={questionBankId}
        />
        <LoadingErrorDisplay loading={loading} error={error} />
        {historyState ? (
          <div className="w-full bg-white p-0 md:p-6 lg:p-6 rounded-lg shadow h-full transition-opacity duration-300">
            <ViewHistory history={history.current} />
            <HistoryButtonControls
              isProcessing={isProcessingRef.current}
              loading={loading}
              retakeLoading={retakeLoading}
              handleFullRetaake={handleHistoryRetakeClick}
              handleGoBack={handleGoBack}
            />
          </div>
        ) : ongoingQuestion ? (
          <div className="w-full bg-white p-6 rounded-lg shadow h-full transition-opacity duration-300">
            {!returnOrFullRetakeState && (
              <QuestionSection
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={generatedQuestions.current?.length || 0}
                question={ongoingQuestion}
              />
            )}

            {summaryState && isSummaryLoading ? (
              <div className="flex gap-2 justify-center items-center transition-opacity duration-300">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid" />
                <p>Generating summary...</p>
                <LoadingCircle />
              </div>
            ) : (
              <ContentSection
                key={ongoingQuestion?._id}
                isVideoState={isVideoState}
                retakeLoading={retakeLoading}
                ongoingQuestion={ongoingQuestion}
                summaryState={summaryState}
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
              summaryState={summaryState}
              returnOrFullRetakeState={returnOrFullRetakeState}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={generatedQuestions.current?.length || 0}
              isProcessing={isProcessingRef.current}
              loading={loading || isSummaryLoading}
              retakeLoading={retakeLoading}
              error={error}
              handleNextQuestion={handleNextQuestion}
              handleContinueClick={handleContinueClick}
              handleRetakeClick={handleRetakeClick}
            />
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-white text-center transition-opacity duration-300">
              No questions or history available to display.
            </p>
          )
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StartInterviewPage;
