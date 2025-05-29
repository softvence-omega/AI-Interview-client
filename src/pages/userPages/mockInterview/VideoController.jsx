// import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
// import RecordRTC from "recordrtc";
// import { useAuth } from "../../../context/AuthProvider";

// const VideoController = forwardRef(({ question, isVideoState,  onVideoAnalysisComplete,isProcessingRef,setAiResponse,aiResponse }, ref) => {

//   const { user } = useAuth();
//   const AuthorizationToken = user?.approvalToken;
//   const [countdown, setCountdown] = useState(3);
//   const [recordingTimeLeft, setRecordingTimeLeft] = useState(question.time_to_answer);
//   const [isRecording, setIsRecording] = useState(false);
//   const [hasRecorded, setHasRecorded] = useState(false);
//   const [videoBlob, setVideoBlob] = useState(null);
//   const [processing, setProcessing] = useState(false);


//   const videoRef = useRef(null);
//   const previewVideoRef = useRef(null);
//   const recorderRef = useRef(null);
//   const isStoppingRef = useRef(false);

//   useImperativeHandle(ref, () => ({
//     stopRecording,
//   }));

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
//   };



//   // Countdown before recording starts
//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else if (countdown === 0 && !isRecording && !hasRecorded && videoRef.current) {
//       startRecording();
//       setHasRecorded(true);
//     }
//   }, [countdown, isRecording, hasRecorded]);




//   // Recording timer
//   useEffect(() => {
//     if (isRecording && recordingTimeLeft > 0) {
//       const timer = setInterval(() => {
//         setRecordingTimeLeft((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else if (isRecording && recordingTimeLeft === 0 && !isStoppingRef.current) {
//       stopRecording();
//     }
//   }, [isRecording, recordingTimeLeft]);

//   // Stop recording if video state changes
//   useEffect(() => {
//     if (isRecording && !isVideoState && !isStoppingRef.current) {
//       stopRecording();
//     }
//   }, [isVideoState, isRecording]);


//   // Reset state on new question
//   useEffect(() => {
//     setCountdown(3);
//     setRecordingTimeLeft(question.time_to_answer);
//     setIsRecording(false);
//     setHasRecorded(false);
//     setVideoBlob(null);
//     setAiResponse(null);
//     setProcessing(false);
//     isStoppingRef.current = false;
//     if (recorderRef.current) {
//       recorderRef.current = null;
//     }
//   }, [question]);



//   const startRecording = async () => {
//     try {

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         // Attempt to record in MP4 if supported, fallback to WebM
//         const mimeType = MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm";
//         console.log("Recording with MIME type:", mimeType);
//         recorderRef.current = new RecordRTC(stream, {
//           type: "video",
//           mimeType: mimeType,
//           timeSlice: 1000,
//         });
//         recorderRef.current.startRecording();
//         setIsRecording(true);
//       } 
//       else 
//       {
//         console.error("Video element is not available");
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     } 
//     catch (error)
//     {
//       console.error("Error starting recording:", error);
//     }
//   };



//   const stopRecording = () => {
//     if (recorderRef.current && isRecording && !isStoppingRef.current) {
//       isStoppingRef.current = true;
//       recorderRef.current.stopRecording(async () => {
//         let blob = recorderRef.current.getBlob();
//         setVideoBlob(blob);
//         if (videoRef.current && videoRef.current.srcObject) {
//           videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//         }
//         setIsRecording(false);
//         setProcessing(true);

//         // Download video for debugging
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = blob.type.includes("mp4") ? "test.mp4" : "test.webm";
//         link.click();

//         callAIApiforVideoAnalysis(blob);
//         isStoppingRef.current = false;
//       });
//     }
//   };



//   const callAIApiforVideoAnalysis = async (videoBlob) => {
//     setAiResponse(null)
//     const API_URL = "https://freepik.softvenceomega.com/in-prep/api/v1/video_process/process-video/";
//     try {
//       // Validate video blob
//       if (!videoBlob || videoBlob.size === 0) {
//         console.error("Video blob is empty or not ready:", videoBlob);
//         setAiResponse({ error: "Invalid video data" });
//         setProcessing(false);
//         return;
//       }

//       // Validate question props
//       if (
//         !question._id ||
//         !question.interview_id ||
//         !question.questionBank_id ||
//         !question.user_id ||
//         !question.question
//       ) {
//         console.error("Missing required question properties:", question);
//         setAiResponse({ error: "Invalid question data" });
//         setProcessing(false);
//         return;
//       }

//       const formData = new FormData();
//       const fileExtension = videoBlob.type.includes("mp4") ? "mp4" : "webm";
//       const file = new File([videoBlob], `recording.${fileExtension}`, { type: videoBlob.type });


//       formData.append("file", file);
//       formData.append("qid", question._id); // String, as per backend update
//       formData.append("interview_id", question.interview_id); // String
//       formData.append("questionBank_id", question.questionBank_id); // String
//       formData.append("user_id", question.user_id); // String
//       formData.append("isSummary", question.isSummary ? "true" : "false"); // Stringified boolean
//       formData.append("islast", question.islast ? "true" : "false"); // Stringified boolean
//       formData.append("question", question.question);
//       formData.append("expected_answer", question.expected_answer || "");

//       // Log FormData for debugging
//       console.log("FormData contents:", [...formData.entries()]);
//       console.log("Video Blob:", {
//         size: videoBlob.size,
//         type: videoBlob.type,
//         name: file.name,
//       });

//       console.log("Sending request to:", API_URL);

//       // console.log("data is being sent ****************:", formData);
      
//       isProcessingRef.current=true
//       fetch(API_URL, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//         },
//         body: formData,
//       })
//         .then((response) => {
//           console.log("Fetch Response:", {
//             status: response.status,
//             statusText: response.statusText,
//           });
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("API Response Data:************************set AI", data);
//           setAiResponse(data);
//           setProcessing(false);
//           isProcessingRef.current=false
//           if (onVideoAnalysisComplete) {
//             onVideoAnalysisComplete(data);
//           }
//         })
//         .catch((error) => {
//           isProcessingRef.current=false
//           console.error("Error calling AI API:", error);
//           let errorMessage = `Failed to process video: ${error.message}`;
//           setAiResponse({ error: errorMessage });
//           setProcessing(false);
//           if (onVideoAnalysisComplete) {
//             onVideoAnalysisComplete({ error: errorMessage });
//           }
//         });
//     } 
//     catch (error) {
//       console.error("Error setting up request:", error);
//       let errorMessage = `Failed to process video: ${error.message}`;
//       setAiResponse({ error: errorMessage });
//       setProcessing(false);
//       if (onVideoAnalysisComplete) {
//         onVideoAnalysisComplete({ error: errorMessage });
//       }
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       {countdown > 0 ? (
//         <h1>Starting in {countdown}...</h1>
//       ) : (
//         <div>
//           {isRecording && (
//             <div>
//               <h3>Recording...</h3>
//               <p>Time remaining: {formatTime(recordingTimeLeft)}</p>
//             </div>
//           )}
//           <div className="w-full flex justify-center items-center">
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               style={{
//                 width: "80%",
//                 height: "80%",
//                 border: "1px solid black",
//               }}
//             />
//           </div>
//           {processing && !aiResponse && (
//             <div>
//               <h3>Your video is being processed...</h3>
//             </div>
//           )}
//           {!isRecording && videoBlob && aiResponse && (
//             <div>
//               <h3>Recording Complete - Preview</h3>
//               <video
//                 ref={previewVideoRef}
//                 controls
//                 style={{
//                   width: "640px",
//                   height: "480px",
//                   marginTop: "20px",
//                   border: "1px solid black",
//                 }}
//               />
//               <div style={{ marginTop: "20px" }}>
//                 <h3>AI Response:</h3>
//                 {/* <pre>{JSON.stringify(aiResponse, null, 2)}</pre> */}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// });

// export default VideoController;




import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import RecordRTC from "recordrtc";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const VideoController = forwardRef(({ question, isVideoState, onVideoAnalysisComplete, setAiResponse, aiResponse, aboutMeTry, onAboutMeResponse }, ref) => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const [countdown, setCountdown] = useState(3);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(question.time_to_answer);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { request } = useApi();
  const navigate = useNavigate();
  const [aboutMeData, setAboutMeData] = useState(""); // Added for aboutMeData state
  const [error, setError] = useState(null); // Added for error state
  const [loading, setLoading] = useState(false); // Added for loading state

  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const recorderRef = useRef(null);
  const isStoppingRef = useRef(false);

  console.log(error,loading)//not in use but just to remove red lines

  // Handle aboutMeTry logic in useEffect to support async/await
  useEffect(() => {
    if (aboutMeTry) {
      if (!user?.approvalToken) {
        toast.error('You must be logged in to view this page.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      const findAboutMeData = async () => {
        setLoading(true);
        try {
          const findAboutMe = await request({
            endpoint: '/users/getProfile',
            method: 'GET',
            headers: {
              Authorization: AuthorizationToken, // Send approvalToken without "Bearer"
            },
          });

          if (!findAboutMe?.ok) {
            const errorMessage = findAboutMe?.message || 'Failed to fetch user profile.';
            setError(errorMessage);
            toast.error(errorMessage);
            return;
          }

          const profile = findAboutMe.data?.data;

          if (!profile) {
            const errorMessage = 'Profile data is missing.';
            setError(errorMessage);
            toast.error(errorMessage);
            return;
          }

          console.log('find about me', profile.isAboutMeGenerated);

          if (profile.isAboutMeGenerated && profile.generatedAboutMe) {
            setAboutMeData(profile.generatedAboutMe); // Update state
            toast.success('About Me loaded from profile!');
          } else {
            const errorMessage = 'No About Me data available.';
            setError(errorMessage);
            toast.info(errorMessage);
          }
        } catch (error) {
          const errorMessage = error.message || 'Failed to fetch About Me data.';
          setError(errorMessage);
          toast.error(errorMessage);
          console.error('Error fetching About Me:', error);
        } finally {
          setLoading(false);
        }
      };

      findAboutMeData();
    }
  }, [aboutMeTry]); // Dependencies for useEffect

  const aboutMeQuestion = {
    _id: "no_question_Id",
    interview_id: "no_interview_id",
    questionBank_id: "no_questionBank_id",
    user_id: "no_user_id",
    question: "tell me about yourself",
    expected_answer: aboutMeData, // Use state-managed aboutMeData
    time_to_answer: 120, // 2 minutes
    isSummary: false,
    islast: false,
  };

  useImperativeHandle(ref, () => ({
    stopRecording,
  }));

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Countdown before recording starts
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && !isRecording && !hasRecorded && videoRef.current) {
      startRecording();
      setHasRecorded(true);
    }
  }, [countdown, isRecording, hasRecorded]);

  // Recording timer
  useEffect(() => {
    if (isRecording && recordingTimeLeft > 0) {
      const timer = setInterval(() => {
        setRecordingTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isRecording && recordingTimeLeft === 0 && !isStoppingRef.current) {
      stopRecording();
    }
  }, [isRecording, recordingTimeLeft]);

  // Stop recording if video state changes
  useEffect(() => {
    if (isRecording && !isVideoState && !isStoppingRef.current) {
      stopRecording();
    }
  }, [isVideoState, isRecording]);

  // Reset state on new question
  useEffect(() => {
    setCountdown(3);
    setRecordingTimeLeft(question.time_to_answer);
    setIsRecording(false);
    setHasRecorded(false);
    setVideoBlob(null);
    setAiResponse(null);
    setProcessing(false);
    isStoppingRef.current = false;
    if (recorderRef.current) {
      recorderRef.current = null;
    }
  }, [question]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Attempt to record in MP4 if supported, fallback to WebM
        const mimeType = MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm";
        console.log("Recording with MIME type:", mimeType);
        recorderRef.current = new RecordRTC(stream, {
          type: "video",
          mimeType: mimeType,
          timeSlice: 1000,
        });
        recorderRef.current.startRecording();
        setIsRecording(true);
      } else {
        console.error("Video element is not available");
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording && !isStoppingRef.current) {
      isStoppingRef.current = true;
      recorderRef.current.stopRecording(async () => {
        let blob = recorderRef.current.getBlob();
        setVideoBlob(blob);
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        setIsRecording(false);
        setProcessing(true);

        // Download video for debugging
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = blob.type.includes("mp4") ? "test.mp4" : "test.webm";
        link.click();

        callAIApiforVideoAnalysis(blob);
        isStoppingRef.current = false;
      });
    }
  };

  const callAIApiforVideoAnalysis = async (videoBlob) => {
    const API_URL = "https://freepik.softvenceomega.com/in-prep/api/v1/video_process/process-video/";
    try {
      // Validate video blob
      if (!videoBlob || videoBlob.size === 0) {
        console.error("Video blob is empty or not ready:", videoBlob);
        if (aboutMeTry && onAboutMeResponse) {
          onAboutMeResponse({ error: "Invalid video data" });
        } else {
          setAiResponse({ error: "Invalid video data" });
        }
        setProcessing(false);
        return;
      }

      // Use aboutMeQuestion for aboutMeTry, otherwise use question
      const activeQuestion = aboutMeTry ? aboutMeQuestion : question;

      // Validate question props
      if (
        !activeQuestion._id ||
        !activeQuestion.interview_id ||
        !activeQuestion.questionBank_id ||
        !activeQuestion.user_id ||
        !activeQuestion.question
      ) {
        console.error("Missing required question properties:", activeQuestion);
        if (aboutMeTry && onAboutMeResponse) {
          onAboutMeResponse({ error: "Invalid question data" });
        } 
        else {
          setAiResponse({ error: "Invalid question data" });
        }
        setProcessing(false);
        return;
      }

      const formData = new FormData();
      const fileExtension = videoBlob.type.includes("mp4") ? "mp4" : "webm";
      const file = new File([videoBlob], `recording.${fileExtension}`, { type: videoBlob.type });

      formData.append("file", file);
      formData.append("qid", activeQuestion._id);
      formData.append("interview_id", activeQuestion.interview_id);
      formData.append("questionBank_id", activeQuestion.questionBank_id);
      formData.append("user_id", activeQuestion.user_id);
      formData.append("isSummary", activeQuestion.isSummary ? "true" : "false");
      formData.append("islast", activeQuestion.islast ? "true" : "false");
      formData.append("question", activeQuestion.question);
      formData.append("expected_answer", activeQuestion.expected_answer || "");

      // Log FormData for debugging
      console.log("FormData contents:", [...formData.entries()]);
      console.log("Video Blob:", {
        size: videoBlob.size,
        type: videoBlob.type,
        name: file.name,
      });

      console.log("Sending request to:", API_URL);

      fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
        .then((response) => {
          console.log("Fetch Response:", {
            status: response.status,
            statusText: response.statusText,
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("API Response Data:************************set AI", data);
          if (aboutMeTry && onAboutMeResponse) {
            onAboutMeResponse(data);
          } else {
            setAiResponse(data);
          }
          setProcessing(false);
          if (!aboutMeTry && onVideoAnalysisComplete) {
            onVideoAnalysisComplete(data);
          }
        })
        .catch((error) => {
          console.error("Error calling AI API:", error);
          let errorMessage = `Failed to process video: ${error.message}`;
          if (aboutMeTry && onAboutMeResponse) {
            onAboutMeResponse({ error: errorMessage });
          } else {
            setAiResponse({ error: errorMessage });
          }
          setProcessing(false);
          if (!aboutMeTry && onVideoAnalysisComplete) {
            onVideoAnalysisComplete({ error: errorMessage });
          }
        });
    } catch (error) {
      console.error("Error setting up request:", error);
      let errorMessage = `Failed to process video: ${error.message}`;
      if (aboutMeTry && onAboutMeResponse) {
        onAboutMeResponse({ error: errorMessage });
      } else {
        setAiResponse({ error: errorMessage });
      }
      setProcessing(false);
      if (!aboutMeTry && onVideoAnalysisComplete) {
        onVideoAnalysisComplete({ error: errorMessage });
      }
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {countdown > 0 ? (
        <h1>Starting in {countdown}...</h1>
      ) : (
        <div>
          {isRecording && (
            <div>
              <h3>Recording...</h3>
              <p>Time remaining: {formatTime(recordingTimeLeft)}</p>
            </div>
          )}
          <div className="w-full flex justify-center items-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{
                width: "80%",
                height: "80%",
                border: "1px solid black",
              }}
            />
          </div>
          {processing && !aiResponse && (
            <div>
              <h3>Your video is being processed...</h3>
            </div>
          )}
          {!isRecording && videoBlob && aiResponse && (
            <div>
              <h3>Recording Complete - Preview</h3>
              <video
                ref={previewVideoRef}
                controls
                style={{
                  width: "640px",
                  height: "480px",
                  marginTop: "20px",
                  border: "1px solid black",
                }}
              />
              <div style={{ marginTop: "20px" }}>
                <h3>AI Response:</h3>
                {/* <pre>{JSON.stringify(aiResponse, null, 2)}</pre> */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default VideoController;