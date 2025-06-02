const ButtonControls = ({
    isVideoState,
    summeryState,
    returnOrFullRetakeState,
    currentQuestionIndex,
    totalQuestions,
    isProcessing,
    loading,
    retakeLoading,
    handleNextQuestion,
    handleContinueClick,
    handleRetakeClick,
  }) => (
    <>
      <div className="w-full flex justify-center mt-6">
        {isVideoState && (
          <button
            onClick={handleNextQuestion}
            className="bg-[#3A4C67] w-[50%] h-[40px] rounded-[12px] text-white disabled:opacity-50"
            disabled={isProcessing || loading || retakeLoading}
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
              className="bg-[#3A4C67] w-[30%] h-[40px] rounded-[12px] text-white disabled:opacity-50"
              disabled={isProcessing || loading || retakeLoading}
            >
              {summeryState && returnOrFullRetakeState
                ? "Return to Interview"
                : summeryState
                ? "Generate Summary"
                : "Continue"}
            </button>
            <button
              onClick={handleRetakeClick}
              className="bg-green-500 w-[30%] h-[40px] rounded-[12px] text-white disabled:opacity-50"
              disabled={isProcessing || loading || retakeLoading}
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