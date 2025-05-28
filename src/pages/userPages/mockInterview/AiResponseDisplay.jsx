import AssessmentDisplay from "./AssesmrntDisplay";

const AiResponseDisplay = ({ response, currentQuestionIndex }) => {
    console.log("im from ai reaspons djisplay", response);
  
    if (!response) {
      return (
        <p className="text-center text-red-500">ERR: server failed to process</p>
      );
    }
    if (response.error) {
      return <p className="text-red-500">Error: {response.error}</p>;
    }
    return (
      <div className="text-left bg-gray-100 p-4 rounded">
        <AssessmentDisplay
          response={response}
          currentQuestionIndex={currentQuestionIndex}
        />
      </div>
    );
  };

export default AiResponseDisplay;