import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import RecordRTC from "recordrtc";
import { useAuth } from "../../../context/AuthProvider";

const VideoController = forwardRef(({ question, isVideoState, isSummary, islast, onVideoAnalysisComplete }, ref) => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const [countdown, setCountdown] = useState(3);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(question.time_to_answer);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [processing, setProcessing] = useState(false);

  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const recorderRef = useRef(null);
  const isStoppingRef = useRef(false);

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

  // Show preview video when blob is ready
  useEffect(() => {
    if (videoBlob && previewVideoRef.current) {
      previewVideoRef.current.src = URL.createObjectURL(videoBlob);
    }
  }, [videoBlob]);

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
        setAiResponse({ error: "Invalid video data" });
        setProcessing(false);
        return;
      }

      // Validate question props
      if (
        !question._id ||
        !question.interview_id ||
        !question.questionBank_id ||
        !question.user_id ||
        !question.question
      ) {
        console.error("Missing required question properties:", question);
        setAiResponse({ error: "Invalid question data" });
        setProcessing(false);
        return;
      }

      const formData = new FormData();
      const fileExtension = videoBlob.type.includes("mp4") ? "mp4" : "webm";
      const file = new File([videoBlob], `recording.${fileExtension}`, { type: videoBlob.type });
      formData.append("file", file);
      formData.append("qid", question._id);
      formData.append("interview_id", question.interview_id);
      formData.append("questionBank_id", question.questionBank_id);
      formData.append("user_id", question.user_id);
      formData.append("isSummary", isSummary ? "true" : "false");
      formData.append("islast", islast ? "true" : "false");
      formData.append("question", question.question);
      formData.append("expected_answer", question.expected_answer || "");

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
          Authorization: `Bearer ${AuthorizationToken}`,
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
          console.log("API Response Data:", data);
          setAiResponse(data);
          setProcessing(false);
          if (onVideoAnalysisComplete) {
            onVideoAnalysisComplete(data);
          }
        })
        .catch((error) => {
          console.error("Error calling AI API:", error);
          let errorMessage = `Failed to process video: ${error.message}`;
          setAiResponse({ error: errorMessage });
          setProcessing(false);
          if (onVideoAnalysisComplete) {
            onVideoAnalysisComplete({ error: errorMessage });
          }
        });
    } catch (error) {
      console.error("Error setting up request:", error);
      let errorMessage = `Failed to process video: ${error.message}`;
      setAiResponse({ error: errorMessage });
      setProcessing(false);
      if (onVideoAnalysisComplete) {
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
                <pre>{JSON.stringify(aiResponse, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default VideoController;