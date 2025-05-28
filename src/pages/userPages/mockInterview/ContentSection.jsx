// import LoadingCircle from "../../../reuseable/LoadingCircle";
// import AiResponseDisplay from "./AiResponseDisplay";
// import VideoController from "./VideoController";
// import ViewHistory from "./ViewHistory";

// // ContentSection Component
// const ContentSection = ({
//     isVideoState,
//     retakeLoading,
//     ongoingQuestion,
//     summeryState,
//     currentQuestionIndex,
//     totalQuestions,
//     aiResponse,
//     error,
//     videoControllerRefCallback,
//     handleVideoAnalysisComplete,
//     isProcessingRef,
//     setAiResponse,
//   }) => (
//     <div className="h-full w-full mx-auto ">
//       {isVideoState ? (
//         retakeLoading ? (
//           <div className="flex justify-center items-center">
//             <h2>Generating new question for retake...</h2>
//             <LoadingCircle />
//           </div>
//         ) 
//         :
//         (
//           <div className="w-full h-[80%] border-[1px] rounded-sm">
//             <p className="text-lg mb-4">
//               {ongoingQuestion.time_to_answer &&
//                 `${Math.floor(
//                   Number(ongoingQuestion.time_to_answer) / 60
//                 )} minute(s)`}
//             </p>
//             <VideoController
//               question={ongoingQuestion}
//               isVideoState={isVideoState}
//               isSummary={summeryState}
//               islast={currentQuestionIndex === totalQuestions - 1}
//               onVideoAnalysisComplete={handleVideoAnalysisComplete}
//               ref={videoControllerRefCallback}
//               isProcessingRef={isProcessingRef}
//               setAiResponse={setAiResponse}
//               aiResponse={aiResponse}
//             />
//           </div>
//         )
//       )  
//       : 
//       (
//         <div>
//           {aiResponse || error ? (
//             <AiResponseDisplay
//               response={aiResponse}
//               currentQuestionIndex={currentQuestionIndex}
//             />
//           ) 
//           :
//           (
//             <div className="flex justify-center items-center">
//               <p>Processing video analysis...</p>
//               <LoadingCircle />
//             </div>
//           )}
//         </div>
//       )}
//       {summeryState && aiResponse && (
//         <AiResponseDisplay
//           response={aiResponse}
//           currentQuestionIndex={currentQuestionIndex}
//         />
//       )}
//     </div>
//   );


//   export default ContentSection





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
}) => (
  <div className="h-full w-full mx-auto">
    {isVideoState ? (
      retakeLoading ? (
        <div className="flex justify-center items-center">
          <h2>Generating new question for retake...</h2>
          <LoadingCircle />
        </div>
      ) : (
        <div className="w-full h-[80%] border-[1px] rounded-sm">
          <p className="text-lg mb-4">
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
          <div className="flex justify-center items-center">
            <p>Processing video analysis...</p>
            <LoadingCircle />
          </div>
        )}
      </div>
    )}
  </div>
);

export default ContentSection;