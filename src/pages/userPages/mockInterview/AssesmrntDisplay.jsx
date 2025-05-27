import talking from "../../../assets/logos/fi_8392916.png";
import behaviorIcon from "../../../assets/logos/Frame 5.png";
import problemSolvingIcon from "../../../assets/logos/problemSolving.png";


const AssessmentDisplay = ({ assessment, currentQuestionIndex,question,isSummary }) => {
    if (!assessment) {
      return <p>No assessment data available</p>;
    }

    console.log("AI RESPONSE :::::: ",assessment, currentQuestionIndex, question);
  
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {isSummary ? (
          <div className="w-full">
            <h1 className="text-center text-2xl">Overall Interview Feedback</h1>
            <h1>
              {currentQuestionIndex} of {currentQuestionIndex} is conpleated
            </h1>
          </div>
        )
        :
        (
          <div>
            <h4 className="text-2xl font-medium mb-4">
            <h2>Question: {question}</h2>
              Question {currentQuestionIndex + 1} Feedback
            </h4>
          </div>
        )}
  
        {/* Articulation Section */}
        {assessment.Articulation && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={talking}
                alt="Articulation"
                className="w-[50px] h-[50px]"
              />
              <p className="font-medium text-2xl text-[#293649]">Articulation</p>
            </div>
            <p className="text-[16px] font-normal text-[#293649] mb-2">
              {assessment.Articulation.feedback}
            </p>
            <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
              <strong>Score:</strong> {assessment.Articulation.score.toFixed(2)}
            </p>
          </div>
        )}
  
        {/* Behavioural Cue Section */}
        {assessment.Behavioural_Cue && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={behaviorIcon}
                alt="Behavioural Cue"
                className="w-[50px] h-[50px]"
              />
              <p className="font-medium text-2xl text-[#293649]">
                Behavioural Cue
              </p>
            </div>
            <p className="text-[16px] font-normal text-[#293649] mb-2">
              {assessment.Behavioural_Cue.feedback}
            </p>
            <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
              <strong>Score:</strong>{" "}
              {assessment.Behavioural_Cue.score.toFixed(2)}
            </p>
          </div>
        )}
  
        {/* Problem Solving Section */}
        {assessment.Problem_Solving && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={problemSolvingIcon}
                alt="Problem Solving"
                className="w-[50px] h-[50px]"
              />
              <p className="font-medium text-2xl text-[#293649]">
                Problem Solving
              </p>
            </div>
            <p className="text-[16px] font-normal text-[#293649] mb-2">
              {assessment.Problem_Solving.feedback}
            </p>
            <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
              <strong>Score:</strong>{" "}
              {assessment.Problem_Solving.score.toFixed(2)}
            </p>
          </div>
        )}
  
        {/* Content Score Section */}
        {assessment.Content_Score && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={problemSolvingIcon} // Reuse icon or replace with a specific one
                alt="Content Score"
                className="w-[50px] h-[50px]"
              />
              <p className="font-medium text-2xl text-[#293649]">Content Score</p>
            </div>
            <p className="text-[16px] font-normal text-[#293649] mb-2">
              Content evaluation
            </p>
            <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
              <strong>Score:</strong> {assessment.Content_Score.toFixed(2)}
            </p>
          </div>
        )}
  
        {/* Inprep Score Section */}
        {assessment.Inprep_Score && (
          <div className="mb-6">
            <p className="font-medium text-2xl text-[#293649] mb-2">
              <strong>Inprep Score:</strong>{" "}
              {assessment.Inprep_Score.total_score.toFixed(2)}
            </p>
            <p className="bg-[#ffe6f0] text-[#293649] font-bold py-1 px-2 rounded inline-block">
              80/100
            </p>
          </div>
        )}
  
        {/* Improvement Tips Section */}
        {assessment.what_can_i_do_better && (
          <div className="bg-[#e6ffe6] text-[#293649] p-4 rounded-lg mt-4">
            <p className="font-bold text-xl mb-2">What can I do better?</p>
            <p className="text-[16px] font-normal">
              {assessment.what_can_i_do_better.overall_feedback}
            </p>
          </div>
        )}
      </div>
    );
  };


  export default AssessmentDisplay