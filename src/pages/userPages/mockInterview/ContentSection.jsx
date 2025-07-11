import React from "react";
import LoadingCircle from "../../../reuseable/LoadingCircle";
import AiResponseDisplay from "./AiResponseDisplay";
import VideoController from "./VideoController";

// ContentSection Component
const ContentSection = ({
  isVideoState,
  retakeLoading,
  ongoingQuestion,
  summeryState,
  currentQuestionIndex,
  totalQuestions,
  aiResponse,
  error,
  videoControllerRefCallback,
  isProcessingRef,
  setAiResponse,
  handleNextQuestion,
  setIsVideoState,
  onStopRecording,
}) => (
  <div className="h-full w-full mx-auto">
    {isVideoState ? (
      retakeLoading ? (
        <div className="flex justify-center items-center">
          <h2>Generating new question for retake...</h2>
          <LoadingCircle />
        </div>
      ) : (
        <div className="w-full h-[80%] rounded-sm p-2">
          <p className="text-lg mb-4 text-green-500"><span className="text-black me-2">Total Time:</span> 
            {ongoingQuestion.time_to_answer &&
              `${Math.floor(Number(ongoingQuestion.time_to_answer) / 60)} minute(s)`}
          </p>
          <VideoController
            question={ongoingQuestion}
            isVideoState={isVideoState}
            isSummary={summeryState}
            islast={currentQuestionIndex === totalQuestions - 1}
            ref={videoControllerRefCallback}
            isProcessingRef={isProcessingRef}
            setAiResponse={setAiResponse}
            aiResponse={aiResponse}
            handleNextQuestion={handleNextQuestion}
            onStopRecording={onStopRecording}
            setIsVideoState={setIsVideoState}
            setIsProcessing={(value) => (isProcessingRef.current = value)}
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
          <div className="flex gap-2 justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-solid" />
            <p>Processing video analysis...</p>
            <LoadingCircle />
          </div>
        )}
      </div>
    )}
  </div>
);

export default ContentSection;