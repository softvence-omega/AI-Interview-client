// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   Component,
// } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../../../context/AuthProvider";
// import useApi from "../../../hook/apiHook";
// import VideoController from "./VideoController";
// import talking from "../../../assets/logos/fi_8392916.png";
// import behaviorIcon from "../../../assets/logos/Frame 5.png";
// import problemSolvingIcon from "../../../assets/logos/problemSolving.png";

// // ErrorBoundary component
// class ErrorBoundary extends Component {
//   state = { hasError: false, error: null };
//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }
//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="text-red-500 p-4">
//           <h3>Something went wrong:</h3>
//           <p>{this.state.error?.message || "Unknown error"}</p>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const AssessmentDisplay = ({ assessment, currentQuestionIndex }) => {
//   if (!assessment) {
//     return <p>No assessment data available</p>;
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg border border-gray-200">
//       <h4 className="text-2xl font-medium mb-4">
//         Question {currentQuestionIndex + 1} Feedback
//       </h4>

//       {/* Articulation Section */}
//       {assessment.Articulation && (
//         <div className="mb-6">
//           <div className="flex items-center gap-4 mb-2">
//             <img
//               src={talking}
//               alt="Articulation"
//               className="w-[50px] h-[50px]"
//             />
//             <p className="font-medium text-2xl text-[#293649]">Articulation</p>
//           </div>
//           <p className="text-[16px] font-normal text-[#293649] mb-2">
//             {assessment.Articulation.feedback || "No feedback"}
//           </p>
//           <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
//             <strong>Score:</strong>{" "}
//             {assessment.Articulation.score?.toFixed(2) ?? "N/A"}
//           </p>
//         </div>
//       )}

//       {/* Behavioural Cue Section */}
//       {assessment.Behavioural_Cue && (
//         <div className="mb-6">
//           <div className="flex items-center gap-4 mb-2">
//             <img
//               src={behaviorIcon}
//               alt="Behavioural Cue"
//               className="w-[50px] h-[50px]"
//             />
//             <p className="font-medium text-2xl text-[#293649]">
//               Behavioural Cue
//             </p>
//           </div>
//           <p className="text-[16px] font-normal text-[#293649] mb-2">
//             {assessment.Behavioural_Cue.feedback || "No feedback"}
//           </p>
//           <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
//             <strong>Score:</strong>{" "}
//             {assessment.Behavioural_Cue.score?.toFixed(2) ?? "N/A"}
//           </p>
//         </div>
//       )}

//       {/* Problem Solving Section */}
//       {assessment.Problem_Solving && (
//         <div className="mb-6">
//           <div className="flex items-center gap-4 mb-2">
//             <img
//               src={problemSolvingIcon}
//               alt="Problem Solving"
//               className="w-[50px] h-[50px]"
//             />
//             <p className="font-medium text-2xl text-[#293649]">
//               Problem Solving
//             </p>
//           </div>
//           <p className="text-[16px] font-normal text-[#293649] mb-2">
//             {assessment.Problem_Solving.feedback || "No feedback"}
//           </p>
//           <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
//             <strong>Score:</strong>{" "}
//             {assessment.Problem_Solving.score?.toFixed(2) ?? "N/A"}
//           </p>
//         </div>
//       )}

//       {/* Inprep Score Section */}
//       {assessment.Inprep_Score && (
//         <div className="mb-6">
//           <p className="font-medium text-2xl text-[#293649] mb-2">
//             <strong>Inprep Score:</strong>{" "}
//             {assessment.Inprep_Score.total_score?.toFixed(2) ?? "N/A"}
//           </p>
//           <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
//             80/100
//           </p>
//         </div>
//       )}

//       {/* Improvement Tips Section */}
//       {assessment.what_can_i_do_better && (
//         <div className="bg-[#e6ffe6] text-[#293649] p-4 rounded-lg mt-4">
//           <p className="font-bold text-xl mb-2">What can I do better?</p>
//           <p className="text-[16px] font-normal">
//             {assessment.what_can_i_do_better.overall_feedback || "No feedback"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Component to render AI response
// const AiResponseDisplay = ({ response, currentQuestionIndex }) => {
//   if (!response) {
//     return <p>No response data available</p>;
//   }
//   if (response.error) {
//     return <p className="text-red-500">Error: {response.error}</p>;
//   }
//   return (
//     <div className="text-left bg-gray-100 p-4 rounded">
//       {/* <h3 className="text-lg font-bold mb-2">AI Response:</h3>
//       <p><strong>Question ID:</strong> {response.qid}</p>
//       <p><strong>Interview ID:</strong> {response.interview_id}</p>
//       <p><strong>Question Bank ID:</strong> {response.questionBank_id}</p>
//       <p><strong>User ID:</strong> {response.user_id}</p>
//       <p><strong>Is Summary:</strong> {response.isSummary ? "Yes" : "No"}</p>
//       <p><strong>Is Last:</strong> {response.islast ? "Yes" : "No"}</p>
//       <p><strong>Video URL:</strong> <a href={response.video_url} target="_blank" rel="noopener noreferrer">{response.video_url}</a></p> */}
//       <AssessmentDisplay
//         assessment={response.assessment}
//         currentQuestionIndex={currentQuestionIndex}
//       />
//     </div>
//   );
// };

// const StartInterviewPage = () => {
//   const [searchParams] = useSearchParams();
//   const questionBankId = searchParams.get("questionBank_id");
//   const interviewId = searchParams.get("interview_id");
//   const { user } = useAuth();
//   const AuthorizationToken = user?.approvalToken;
//   const { request } = useApi();

//   const generatedQuestions = useRef(null);
//   const [ongoingQuestion, setOngoingQuestion] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retakeLoading, setRetakeLoading] = useState(false);
//   const [isVideoState, setIsVideoState] = useState(true);
//   const [summeryState, setSumarryState] = useState(false);
//   const [returnOrFullRetakeState, setReturnOrFullRetakeState] = useState(false);
//   const [aiResponse, setAiResponse] = useState(null);
//   const videoControllerRef = useRef(null);
//   const navigate = useNavigate();
//   const isProcessingRef = useRef(false);

//   // Fetch AI-generated questions
//   useEffect(() => {
//     const fetchGeneratedQuestions = async () => {
//       if (isProcessingRef.current) {
//         console.log("Skipping fetchGeneratedQuestions: already processing");
//         return;
//       }
//       isProcessingRef.current = true;

//       try {
//         setLoading(true);
//         setError(null);

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
//         console.log("Generated Questions:", data.remainingQuestions);
//         generatedQuestions.current = data.remainingQuestions;

//         if (
//           Array.isArray(generatedQuestions.current) &&
//           generatedQuestions.current.length > 0
//         ) {
//           React.startTransition(() => {
//             setOngoingQuestion(generatedQuestions.current[0]);
//             setCurrentQuestionIndex(0);
//           });
//         } else {
//           setError("No questions generated from the API response");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to generate question set");
//         console.error("Error generating questions:", err);
//       } finally {
//         setLoading(false);
//         isProcessingRef.current = false;
//       }
//     };

//     if (AuthorizationToken && questionBankId) {
//       fetchGeneratedQuestions();
//     } else {
//       setLoading(false);
//       setError(
//         AuthorizationToken
//           ? "questionBank_id is required"
//           : "No authorization token available"
//       );
//       isProcessingRef.current = false;
//     }
//   }, [questionBankId, interviewId, AuthorizationToken]);

//   // Handle AI response or error
//   const handleVideoAnalysisComplete = useCallback((data) => {
//     if (isProcessingRef.current) {
//       console.log("Skipping handleVideoAnalysisComplete: already processing");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleVideoAnalysisComplete called with:", data);
//     React.startTransition(() => {
//       if (data.error) {
//         setError(data.error);
//         setAiResponse(null);
//       } else {
//         setAiResponse(data);
//         setError(null);
//       }
//     });
//     isProcessingRef.current = false;
//   }, []);

//   // Handle retake
//   const handleRetake = useCallback(async () => {
//     if (!ongoingQuestion || isProcessingRef.current) {
//       console.log("Skipping handleRetake: no question or processing");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleRetake called");
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
//       console.log("New Retake Question:", newQuestion);

//       React.startTransition(() => {
//         setOngoingQuestion(newQuestion);
//       });

//       if (Array.isArray(generatedQuestions.current)) {
//         const updatedQuestions = [...generatedQuestions.current];
//         updatedQuestions[currentQuestionIndex] = newQuestion;
//         generatedQuestions.current = updatedQuestions;
//         console.log("Updated Questions List:", generatedQuestions.current);
//       }
//     } catch (err) {
//       setError(err.message || "Failed to generate new question for retake");
//       console.error("Error generating retake question:", err);
//     } finally {
//       setRetakeLoading(false);
//       isProcessingRef.current = false;
//     }
//   }, [ongoingQuestion, AuthorizationToken]);

//   // Handle next question
//   const handleNextQuestion = useCallback(() => {
//     if (isProcessingRef.current) {
//       console.log("Skipping handleNextQuestion: already processing");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleNextQuestion called");
//     React.startTransition(() => {
//       setIsVideoState(false);
//       setAiResponse(null);
//       setError(null);
//     });
//     if (
//       videoControllerRef.current &&
//       videoControllerRef.current.stopRecording
//     ) {
//       videoControllerRef.current.stopRecording();
//     }
//     isProcessingRef.current = false;
//   }, []);

//   // Handle continue
//   // Handle continue
//   const handleContinue = async () => {
//     if (isProcessingRef.current) {
//       console.log("Skipping handleContinue: already processing");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleContinue called");
//     try {
//       // Save the current aiResponse to the API
//       if (aiResponse) {
//         const dataToSave = {
//           ...aiResponse,
//           isLast:
//             Array.isArray(generatedQuestions.current) &&
//             currentQuestionIndex === generatedQuestions.current.length - 1,
//           question_id: aiResponse.qid || null, // Safely handle missing qid
//           assessment: aiResponse.assessment, // Ensure assessment is included
//         };

//         // Remove qid from dataToSave
//         if ("qid" in dataToSave) {
//           delete dataToSave.qid;
//         }

//         const endpoint = `/video/submit_Video_Analysis_and_Summary`;
//         const res = await request({
//           endpoint,
//           method: "POST",
//           body: dataToSave,
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `${AuthorizationToken}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(res.message || "Failed to save video analysis");
//         }
//         console.log("Video analysis saved successfully:", res.data);
//       }

//       React.startTransition(() => {
//         setIsVideoState(true);
//         setAiResponse(null);
//         setError(null);
//         if (
//           Array.isArray(generatedQuestions.current) &&
//           currentQuestionIndex < generatedQuestions.current.length - 1
//         ) {
//           const nextIndex = currentQuestionIndex + 1;
//           setCurrentQuestionIndex(nextIndex);
//           setOngoingQuestion(generatedQuestions.current[nextIndex]);
//         } else {
//           console.log("Reached last question, setting summeryState");
//           setSumarryState(true);
//         }
//       });
//     } catch (err) {
//       setError(err.message || "Failed to save video analysis");
//       console.error("Error saving video analysis:", err);
//     } finally {
//       isProcessingRef.current = false;
//     }
//   };

//   const handleSummaryGenaration = async () => {
//     if (isProcessingRef.current) {
//       console.log("Skipping handleSummaryGenaration: already processing");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleSummaryGenaration called");
//     try {
//       // Extract questionBank_id from ongoingQuestion or aiResponse
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

//       console.log("Summary generated successfully:", res.data);
//       React.startTransition(() => {
//         setReturnOrFullRetakeState(true);
//       });
//     } catch (err) {
//       setError(err.message || "Failed to generate summary");
//       console.error("Error generating summary:", err);
//     } finally {
//       isProcessingRef.current = false;
//     }
//   };

//   // Handle full retake
//   const handleFullRetaake = useCallback(async () => {
//     if (
//       !ongoingQuestion ||
//       !ongoingQuestion.questionBank_id ||
//       isProcessingRef.current
//     ) {
//       setError(
//         "No ongoing question or questionBank_id available for full retake"
//       );
//       isProcessingRef.current = false;
//       console.log("Skipping handleFullRetaake: invalid state");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleFullRetaake called");
//     setRetakeLoading(true);

//     try {
//       const queryParams = [
//         `questionBank_id=${ongoingQuestion.questionBank_id}`,
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
//       console.log("Generated Questions for Full Retake:", data.question_Set);
//       generatedQuestions.current = data.question_Set;

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
//           setAiResponse(null);
//           setError(null);
//         });
//       } else {
//         setError("No questions generated in full retake response");
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
//   }, [ongoingQuestion, interviewId, AuthorizationToken]);

//   // Handle return to interview
//   const handleReturnInterview = useCallback(() => {
//     if (isProcessingRef.current) {
//       console.log("Skipping handleReturnInterview: already processing");
//       return;
//     }
//     isProcessingRef.current = true;

//     console.log("handleReturnInterview called");
//     navigate(`/userDashboard/mockInterview/${ongoingQuestion.interview_id}`);
//     isProcessingRef.current = false;
//   }, [ongoingQuestion, navigate]);

//   // Define onClick handlers with conditional logic handleContinueClick====>Done
//   const handleContinueClick = () => {
//     if (summeryState && returnOrFullRetakeState) {
//       handleReturnInterview();
//     } else if (summeryState) {
//       handleSummaryGenaration();
//     } else {
//       handleContinue();
//     }
//   };

//   // Define onClick handlers with conditional logic handleRetakeClick====>Done
//   const handleRetakeClick = () => {
//     if (summeryState && returnOrFullRetakeState) {
//       handleFullRetaake();
//     } else {
//       handleRetake();
//     }
//   };

//   // Ref callback for VideoController
//   const videoControllerRefCallback = useCallback((node) => {
//     if (node) {
//       videoControllerRef.current = {
//         stopRecording: node.stopRecording,
//       };
//     }
//   }, []);

//   // Debug render
//   console.log("Render with states:", {
//     isVideoState,
//     summeryState,
//     currentQuestionIndex,
//     aiResponse,
//   });

//   return (
//     <ErrorBoundary>
//       <div className="text-black w-full px-6 py-8 h-auto bg-black">
//         {loading && <p>Loading generated questions...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}

//         {ongoingQuestion && (
//           <div className="w-full bg-white p-6 rounded-lg shadow h-full">
//             <h1 className="mb-4 text-left text-sm text-[#676768]">
//               Question {currentQuestionIndex + 1} of{" "}
//               {generatedQuestions.current?.length || 0} Questions
//             </h1>

//             <div className="w-full flex justify-center items-center mb-10">
//               <p className="text-[24px] font-normal text-[#278352]">
//                 Q. {ongoingQuestion.question || "No question text available"}
//               </p>
//             </div>

//             <div className="h-full w-full mx-auto">
//               {isVideoState ? (
//                 retakeLoading ? (
//                   <h2>Generating new question for retake... put loader</h2>
//                 ) : (
//                   <div className="w-full h-[80%] border-[1px] rounded-sm">
//                     <p className="text-lg mb-4">
//                       {ongoingQuestion.time_to_answer &&
//                         !isVideoState &&
//                         `${Math.floor(
//                           Number(ongoingQuestion.time_to_answer) / 60
//                         )} minute(s)`}
//                     </p>
//                     <VideoController
//                       question={ongoingQuestion}
//                       isVideoState={isVideoState}
//                       isSummary={summeryState}
//                       islast={
//                         currentQuestionIndex ===
//                         (generatedQuestions.current?.length || 0) - 1
//                       }
//                       onVideoAnalysisComplete={handleVideoAnalysisComplete}
//                       ref={videoControllerRefCallback}
//                     />
//                   </div>
//                 )
//               ) : (
//                 <div>
//                   {aiResponse || error ? (
//                     <AiResponseDisplay
//                       response={aiResponse}
//                       currentQuestionIndex={currentQuestionIndex}
//                     />
//                   ) : (
//                     <p>Processing video analysis...</p>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="w-full flex justify-center">
//               {isVideoState && (
//                 <button
//                   onClick={handleNextQuestion}
//                   className="bg-blue-500 w-[50%] h-[50px] rounded-[12px] text-white"
//                   disabled={isProcessingRef.current || loading || retakeLoading}
//                 >
//                   {currentQuestionIndex <
//                   (generatedQuestions.current?.length || 0) - 1 ? (
//                     <div>Next Question</div>
//                   ) : (
//                     <div>Finish</div>
//                   )}
//                 </button>
//               )}
//             </div>

//             <div className="w-full flex justify-center">
//               {!isVideoState && (
//                 <div className="flex justify-center gap-6 w-full">
//                   <button
//                     onClick={handleContinueClick}
//                     className="bg-blue-500 w-[30%] h-[50px] rounded-[12px] text-white"
//                     disabled={
//                       isProcessingRef.current || loading || retakeLoading
//                     }
//                   >
//                     Continue
//                   </button>
//                   <button
//                     onClick={handleRetakeClick}
//                     className="bg-green-500 w-[30%] h-[50px] rounded-[12px] text-white"
//                     disabled={
//                       isProcessingRef.current || loading || retakeLoading
//                     }
//                   >
//                     {retakeLoading ? "Generating..." : "Retake"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default StartInterviewPage;

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Component,
} from "react";
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
            <img
              src={talking}
              alt="Articulation"
              className="w-[50px] h-[50px]"
            />
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

// Component to render AI response
const AiResponseDisplay = ({ response, currentQuestionIndex }) => {
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
      setError(
        AuthorizationToken
          ? "questionBank_id is required"
          : "No authorization token available"
      );
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
  }, [ongoingQuestion, AuthorizationToken]);

  // Handle next question
  const handleNextQuestion = () => {
    if (isProcessingRef.current) {
      console.log("Skipping handleNextQuestion: already processing");
      return;
    }
    isProcessingRef.current = true;

    // Check if it's the last question
    if (
      Array.isArray(generatedQuestions.current) &&
      currentQuestionIndex === generatedQuestions.current.length - 1
    ) {
      console.log("Last question reached, skipping next question");
      isProcessingRef.current = false;
      return;
    }

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
    isProcessingRef.current = false;
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
      // Save the current aiResponse to the API
      if (aiResponse) {
        const dataToSave = {
          ...aiResponse,
          isLast:
            Array.isArray(generatedQuestions.current) &&
            currentQuestionIndex === generatedQuestions.current.length - 1,
          question_id: aiResponse.qid || null,
          assessment: aiResponse.assessment,
        };

        // Remove qid from dataToSave
        if ("qid" in dataToSave) {
          delete dataToSave.qid;
        }

        console.log("this data to be saved", dataToSave);
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
    } catch (err) {
      setError(err.message || "Failed to save video analysis");
      console.error("Error saving video analysis:", err);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleSummaryGenaration = async () => {
    if (isProcessingRef.current) {
      console.log("Skipping handleSummaryGenaration: already processing");
      return;
    }
    isProcessingRef.current = true;

    console.log("handleSummaryGenaration called");
    try {
      // Extract questionBank_id from ongoingQuestion or aiResponse
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

      console.log("Summary generated successfully:", res.data);
      React.startTransition(() => {
        setReturnOrFullRetakeState(true);
        setAiResponse(res.data); // Store the summary response
      });
    } catch (err) {
      setError(err.message || "Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Handle full retake
  const handleFullRetaake = useCallback(async () => {
    if (
      !ongoingQuestion ||
      !ongoingQuestion.questionBank_id ||
      isProcessingRef.current
    ) {
      setError(
        "No ongoing question or questionBank_id available for full retake"
      );
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
      setError(
        err.message || "Failed to generate full question set for retake"
      );
      console.error("Error generating full retake question set:", err);
    } finally {
      setRetakeLoading(false);
      isProcessingRef.current = false;
    }
  }, [ongoingQuestion, interviewId, AuthorizationToken]);

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
  console.log("Render with states:", {
    isVideoState,
    summeryState,
    currentQuestionIndex,
    aiResponse,
  });

  return (
    <ErrorBoundary>
      <div className="text-black w-full px-6 py-8 h-auto bg-black">
        {loading && <p>Loading generated questions...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {ongoingQuestion && (
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
                  <h2>Generating new question for retake... put loader</h2>
                ) : (
                  <div className="w-full h-[80%] border-[1px] rounded-sm">
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
                      isSummary={summeryState}
                      islast={
                        currentQuestionIndex ===
                        (generatedQuestions.current?.length || 0) - 1
                      }
                      onVideoAnalysisComplete={handleVideoAnalysisComplete}
                      ref={videoControllerRefCallback}
                    />
                  </div>
                )
              ) : (
                <div>
                  {(aiResponse || error) && (
                    <AiResponseDisplay
                      response={aiResponse}
                      currentQuestionIndex={currentQuestionIndex}
                    />
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

            <div className="w-full flex justify-center">
              {isVideoState && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 w-[50%] h-[50px] rounded-[12px] text-white"
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

            <div className="w-full flex justify-center">
              {!isVideoState && (
                <div className="flex justify-center gap-6 w-full">
                  <button
                    onClick={handleContinueClick}
                    className="bg-blue-500 w-[30%] h-[50px] rounded-[12px] text-white"
                    disabled={
                      isProcessingRef.current || loading || retakeLoading
                    }
                  >
                    Continue
                  </button>
                  <button
                    onClick={handleRetakeClick}
                    className="bg-green-500 w-[30%] h-[50px] rounded-[12px] text-white"
                    disabled={
                      isProcessingRef.current || loading || retakeLoading
                    }
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
