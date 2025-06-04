import React from "react";

const ViewHistory = ({ history }) => {
  console.log("from history", history);

  if (!history || !Array.isArray(history) || history.length === 0) {
    return (
      <div className="w-full px-6 py-8 bg-black">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-[#293649]">
            Interview History
          </h2>
          <p className="text-[#293649] text-center">
            No history data available to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-center text-2xl font-bold mb-4 text-[#293649]">
          You Have Completed this Interview
        </h1>
        <h2 className="text-2xl font-bold mb-4 text-[#293649]">
          Interview History
        </h2>
        <div className="flex flex-col gap-4">
          {history.map((item, index) => (
            <div
              key={item._id || index + 1}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg text-[#293649]"
            >
              <p className="text-lg font-medium">
                {item.isSummary ? "Overall Interview Feedback" : `Question: ${index + 1}`}
              </p>
              <p className="text-lg">
                <strong>Score:</strong>{" "}
                {item.assessment?.Inprep_Score?.total_score
                  ? item.assessment.Inprep_Score.total_score.toFixed(2)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;