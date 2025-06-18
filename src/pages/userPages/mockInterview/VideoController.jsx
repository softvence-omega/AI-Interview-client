import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import RecordRTC from "recordrtc";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const VideoController = forwardRef(
  (
    {
      question,
      isVideoState,
      onVideoAnalysisComplete,
      setAiResponse,
      aiResponse,
      aboutMeTry,
      onAboutMeResponse,
      isProcessingRef,
      handleNextQuestion,
      setIsProcessing, // Added prop
      setIsAboutMeVideoProcessing,
      setIsVideoState,
      onStopRecording,
    },
    ref
  ) => {
    const { user } = useAuth();
    const AuthorizationToken = user?.approvalToken;
    const [countdown, setCountdown] = useState(3);
    const [recordingTimeLeft, setRecordingTimeLeft] = useState(
      question.time_to_answer
    );
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [processing, setProcessing] = useState(false);
    const { request } = useApi();
    const navigate = useNavigate();
    const [aboutMeData, setAboutMeData] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const videoRef = useRef(null);
    const recorderRef = useRef(null);
    const isStoppingRef = useRef(false);

    const aiBaseUrl = import.meta.env.VITE_AI_INTERVIEW_URL;

    // Handle aboutMeTry logic
    useEffect(() => {
      if (aboutMeTry) {
        if (!AuthorizationToken) {
          toast.error("You must be logged in to view this page.");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const findAboutMeData = async () => {
          setLoading(true);
          try {
            const findAboutMe = await request({
              endpoint: "/users/getProfile",
              method: "GET",
              headers: {
                Authorization: AuthorizationToken,
              },
            });

            if (!findAboutMe?.ok) {
              const errorMessage =
                findAboutMe?.message || "Failed to fetch user profile.";
              setError(errorMessage);
              toast.error(errorMessage);
              return;
            }

            const profile = findAboutMe.data?.data;

            if (!profile) {
              const errorMessage = "Profile data is missing.";
              setError(errorMessage);
              toast.error(errorMessage);
              return;
            }

            if (profile.isAboutMeGenerated && profile.generatedAboutMe) {
              setAboutMeData(profile.generatedAboutMe);
            } else {
              const errorMessage = "No About Me data available.";
              setError(errorMessage);
              toast.info(errorMessage);
            }
          } catch (error) {
            const errorMessage =
              error.message || "Failed to fetch About Me data.";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("Error fetching About Me:", error);
          } finally {
            setLoading(false);
          }
        };

        findAboutMeData();
      }
    }, [aboutMeTry, AuthorizationToken, request, navigate]);

    const aboutMeQuestion = {
      _id: "no_question_Id",
      interview_id: "no_interview_id",
      questionBank_id: "no_questionBank_id",
      user_id: "no_user_id",
      question: "tell me about yourself",
      expected_answer: aboutMeData,
      time_to_answer: 120,
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
      if (!isVideoState) return;
      if (countdown > 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (
        countdown === 0 &&
        !isRecording &&
        !hasRecorded &&
        videoRef.current
      ) {
        startRecording();
        setHasRecorded(true);
      }
    }, [countdown, isRecording, hasRecorded, isVideoState]);

    // Recording timer
    useEffect(() => {
      if (!isVideoState || !isRecording) return;
      if (recordingTimeLeft > 0) {
        const timer = setInterval(() => {
          setRecordingTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (isRecording && recordingTimeLeft === 0 && !isStoppingRef.current) {
        stopRecording();
        isProcessingRef.current = true;
        setIsVideoState(false);
      }
    }, [isRecording, recordingTimeLeft, isVideoState]);

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
      setError(null);
      isStoppingRef.current = false;
      if (recorderRef.current) {
        recorderRef.current = null;
      }
    }, [question, setAiResponse]);

    const startRecording = async () => {
      if (!isVideoState) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const mimeType = MediaRecorder.isTypeSupported("video/mp4")
            ? "video/mp4"
            : "video/webm";
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
        setError(error.message || "Failed to start recording");
        toast.error("Failed to start recording");
      }
    };

    const stopRecording = () => {
      if (recorderRef.current && isRecording && !isStoppingRef.current) {
        isStoppingRef.current = true;
        if(!aboutMeTry)
        {
          setIsProcessing(true);
        }
        
        recorderRef.current.stopRecording(async () => {
          let blob = recorderRef.current.getBlob();
          setVideoBlob(blob);
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject
              .getTracks()
              .forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }
          setIsRecording(false);
          setProcessing(true);

          // Download video for debugging
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = blob.type.includes("mp4") ? "test.mp4" : "test.webm";
          link.click();

          // Call onStopRecording to update parent state
          if (onStopRecording) {
            onStopRecording();
          }
          if (aboutMeTry) {
            setIsAboutMeVideoProcessing(true);
          }

          await callAIApiforVideoAnalysis(blob);
          isStoppingRef.current = false;
        });
      }
    };

    const callAIApiforVideoAnalysis = async (videoBlob) => {
      console.log("<<<=======calling api for analysis ======>>>>>");
      const API_URL = `${aiBaseUrl}/video_process/process-video/`;
      const activeQuestion = aboutMeTry ? aboutMeQuestion : question;

      try {
        if (!videoBlob || videoBlob.size === 0) {
          console.error("Video blob is empty or not ready:", videoBlob);
          const errorMessage = "Invalid video data";
          if (aboutMeTry && onAboutMeResponse) {
            setIsAboutMeVideoProcessing(false);
            onAboutMeResponse({ error: errorMessage });
          } else {
            setAiResponse({ error: errorMessage });
          }
          setProcessing(false);
          if(!aboutMeTry)
          {
            setIsProcessing(false);
          }
          
          return;
        }

        if (
          !activeQuestion._id ||
          !activeQuestion.interview_id ||
          !activeQuestion.questionBank_id ||
          !activeQuestion.user_id ||
          !activeQuestion.question
        ) {
          console.error("Missing required question properties:", activeQuestion);
          const errorMessage = "Invalid question data";
          if (aboutMeTry && onAboutMeResponse) {
            onAboutMeResponse({ error: errorMessage });
          } else {
            setAiResponse({ error: errorMessage });
          }
          setProcessing(false);
          if(!aboutMeTry)
            {
              setIsProcessing(false);
            }
          return;
        }

        const formData = new FormData();
        const fileExtension = videoBlob.type.includes("mp4") ? "mp4" : "webm";
        const file = new File([videoBlob], `recording.${fileExtension}`, {
          type: videoBlob.type,
        });

        formData.append("file", file);
        formData.append("qid", activeQuestion._id);
        formData.append("interview_id", activeQuestion.interview_id);
        formData.append("questionBank_id", activeQuestion.questionBank_id);
        formData.append("user_id", activeQuestion.user_id);
        formData.append("isSummary", activeQuestion.isSummary ? "true" : "false");
        formData.append("islast", activeQuestion.islast ? "true" : "false");
        formData.append("question", activeQuestion.question);
        formData.append("expected_answer", activeQuestion.expected_answer || "");

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log("ai response ==========>>>>>>", data);

        if (aboutMeTry && onAboutMeResponse) {
          setIsAboutMeVideoProcessing(false);
          onAboutMeResponse(data);
        } else {
          setAiResponse(data);
        }
        setProcessing(false);
        if(!aboutMeTry)
          {
            setIsProcessing(false);
          }
        if (!aboutMeTry && onVideoAnalysisComplete) {
          onVideoAnalysisComplete(data);
        }
      } catch (error) {
        console.error("Error calling AI API:", error);
        const errorMessage = `Failed to process video: ${error.message}`;
        if (aboutMeTry && onAboutMeResponse) {
          setIsAboutMeVideoProcessing(false);
          onAboutMeResponse({ error: errorMessage });
        } else {
          setAiResponse({ error: errorMessage });
        }
        setProcessing(false);
        if(!aboutMeTry)
          {
            setIsProcessing(false);
          }
        if (!aboutMeTry && onVideoAnalysisComplete) {
          onVideoAnalysisComplete({ error: errorMessage });
        }
      }
    };

    if (!isVideoState) {
      return null;
    }

    return (
      <div className="" style={{ textAlign: "center", padding: "20px" }}>
        {countdown > 0 ? (
          <h1>Starting in {countdown}...</h1>
        ) : (
          <div>
            {isRecording && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#37B874]">Recording...</h3>
                <p>Time remaining: {formatTime(recordingTimeLeft)}</p>
              </div>
            )}
            {!isProcessingRef.current && (
              <div className="w-full flex justify-center items-center rotate-y-180">
                <video
                  className="video-bg"
                  ref={videoRef}
                  autoPlay
                  muted
                  style={{
                    width: "80%",
                    height: "auto",
                    maxHeight: "580px", 
                    border: "0px solid black",
                    transform: "rotate(360deg)",
                    objectFit: "cover",aspectRatio: "16/9",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default VideoController;