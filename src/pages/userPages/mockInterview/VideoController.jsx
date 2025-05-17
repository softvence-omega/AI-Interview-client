import React, { useState, useEffect, useRef } from 'react';
import RecordRTC from 'recordrtc';

const VideoController = ({ question, isVideoState }) => {
  const [countdown, setCountdown] = useState(3);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(question.time_to_answer);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const recorderRef = useRef(null);
  const timeLeft = question.time_to_answer;

  // Format seconds to minutes:seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Initial countdown effect (3 seconds before recording)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && !isRecording) {
      startRecording();
    }
  }, [countdown]);

  // Recording countdown effect
  useEffect(() => {
    if (isRecording && recordingTimeLeft > 0) {
      const timer = setInterval(() => {
        setRecordingTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording, recordingTimeLeft]);

  // Monitor isVideoState to stop recording
  useEffect(() => {
    if (isRecording && !isVideoState) {
      stopRecording();
    }
  }, [isVideoState, isRecording]);

  // Update preview video source when videoBlob changes
  useEffect(() => {
    if (videoBlob && previewVideoRef.current) {
      previewVideoRef.current.src = URL.createObjectURL(videoBlob);
    }
  }, [videoBlob]);

  // Start video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      videoRef.current.srcObject = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
        timeSlice: 1000,
      });
      recorderRef.current.startRecording();
      setIsRecording(true);

      // Stop recording after time_to_answer
      setTimeout(() => {
        stopRecording();
      }, timeLeft * 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording and store video
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setVideoBlob(blob);
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        callAIApi(blob);
      });
    }
  };

  // Call AI API
  const callAIApi = async (videoBlob) => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'recording.webm');
      formData.append('question', question.question);
      formData.append('interview_id', question.interview_id);
      formData.append('questionBank_id', question.questionBank_id);
      formData.append('user_id', question.user_id);

      const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setAiResponse(data);
    } catch (error) {
      console.error('Error calling AI API:', error);
      setAiResponse({ error: 'Failed to process video' });
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {countdown > 0 ? (
        <h1>Starting in {countdown}...</h1>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            style={{ 
              width: '640px', 
              height: '480px', 
              border: '1px solid black' 
            }} 
          />
          {isRecording && (
            <div>
              <h3>Recording...</h3>
              <p>Time remaining: {formatTime(recordingTimeLeft)}</p>
            </div>
          )}
          {videoBlob && !isRecording && (
            <div>
              <h3>Recording Complete - Preview</h3>
              <video 
                ref={previewVideoRef}
                controls 
                style={{ 
                  width: '640px', 
                  height: '480px', 
                  marginTop: '20px',
                  border: '1px solid black' 
                }} 
              />
            </div>
          )}
          {aiResponse && (
            <div style={{ marginTop: '20px' }}>
              <h3>AI Response:</h3>
              <pre>{JSON.stringify(aiResponse, null, 2)}</pre>
            </div>
          )}
          <p>Question: {question.question}</p>
        </>
      )}
    </div>
  );
};

export default VideoController;