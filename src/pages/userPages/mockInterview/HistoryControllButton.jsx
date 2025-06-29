import React from "react";

const HistoryButtonControls = ({
  isProcessing,
  loading,
  retakeLoading,
  handleFullRetaake,
  handleGoBack,
}) => (
  <div className="w-full flex justify-center mt-4 pb-4">
    <div className="flex justify-center gap-6 w-full">
      <button
        onClick={handleFullRetaake}
        className="bg-green-500 w-[30%] h-[50px] rounded-[12px] text-white disabled:opacity-50 cursor-pointer"
        disabled={isProcessing || loading || retakeLoading}
      >
        {retakeLoading ? "Generating..." : "Restart Interview"}
      </button>
      <button
        onClick={handleGoBack}
        className="bg-[#3A4C67] w-[30%] h-[50px] rounded-[12px] text-white disabled:opacity-50 cursor-pointer"
        disabled={isProcessing || loading || retakeLoading}
      >
        Go Back 
      </button>
    </div>
  </div>
);

export default HistoryButtonControls;