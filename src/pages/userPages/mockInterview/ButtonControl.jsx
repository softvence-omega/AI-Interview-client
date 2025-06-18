// const ButtonControls = ({
//   isVideoState,
//   summeryState,
//   returnOrFullRetakeState,
//   currentQuestionIndex,
//   totalQuestions,
//   isProcessing,
//   loading,
//   retakeLoading,
//   handleNextQuestion,
//   handleContinueClick,
//   handleRetakeClick,
// }) => (
//   <>
//     <div className="w-full flex justify-center mt-6">
//       {isVideoState && (
//         <button
//           onClick={handleNextQuestion}
//           className="bg-[#3A4C67] w-[50%] h-[40px] rounded-[12px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={isProcessing || loading || retakeLoading}
//         >
//           {currentQuestionIndex < totalQuestions - 1 ? (
//             <div>Next Question</div>
//           ) : (
//             <div>Finish</div>
//           )}
//         </button>
//       )}
//     </div>
//     <div className="w-full flex justify-center mt-4">
//       {!isVideoState && (
//         <div className="flex justify-center gap-6 w-full">
//           <button
//             onClick={handleContinueClick}
//             className="bg-[#3A4C67] w-[30%] h-[40px] rounded-[12px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isProcessing || loading || retakeLoading}
//           >
//             {summeryState && returnOrFullRetakeState
//               ? "Return to Interview"
//               : summeryState
//               ? "Generate Summary"
//               : "Continue"}
//           </button>
//           <button
//             onClick={handleRetakeClick}
//             className="bg-green-500 w-[30%] h-[40px] rounded-[12px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isProcessing || loading || retakeLoading}
//           >
//             {retakeLoading
//               ? "Generating..."
//               : summeryState && returnOrFullRetakeState
//               ? "Full Retake"
//               : "Retake"}
//           </button>
//         </div>
//       )}
//     </div>
//   </>
// );

// export default ButtonControls;


const ButtonControls = ({
  isVideoState,
  summeryState,
  returnOrFullRetakeState,
  currentQuestionIndex,
  totalQuestions,
  isProcessing,
  loading,
  retakeLoading,
  error, // New prop
  handleNextQuestion,
  handleContinueClick,
  handleRetakeClick,
}) => (
  <>
    <div className="w-full flex justify-center mt-6">
      {isVideoState && (
        <button
          onClick={handleNextQuestion}
          className="bg-[#3A4C67] w-[50%] h-[40px] rounded-[12px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing || loading || retakeLoading || !!error} // Disable on error
          title={error ? "Resolve error to proceed" : ""} // Optional tooltip
        >
          {currentQuestionIndex < totalQuestions - 1 ? (
            <div>Next Question</div>
          ) : (
            <div>Finish</div>
          )}
        </button>
      )}
    </div>
    <div className="w-full flex justify-center mt-4">
      {!isVideoState && (
        <div className="flex justify-center gap-6 w-full">
          <button
            onClick={handleContinueClick}
            className="bg-[#3A4C67] w-[40%] h-[50px] md:w-[30%] md:h-[40px] lg:w-[30%] lg:h-[40px] rounded-[12px] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={isProcessing || loading || retakeLoading || !!error} // Disable on error
            title={error ? "Resolve error to proceed" : ""} // Optional tooltip
          >
            {summeryState && returnOrFullRetakeState
              ? "Return to Interview"
              : summeryState
              ? "Generate Summary"
              : "Continue"}
          </button>
          <button
            onClick={handleRetakeClick}
            className="bg-green-500 w-[40%] h-[50px] md:w-[30%] md:h-[40px] lg:w-[30%] lg:h-[40px] rounded-[12px] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={isProcessing || loading || retakeLoading} // No error condition
          >
            {retakeLoading
              ? "Generating..."
              : summeryState && returnOrFullRetakeState
              ? "Full Retake"
              : "Retake"}
          </button>
        </div>
      )}
    </div>
  </>
);

export default ButtonControls;