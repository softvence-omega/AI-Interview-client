import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import VideoController from "./VideoController";

const StartInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id");
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const generatedQuestions = useRef(null); // Store the full list of questions
  const [ongoingQuestion, setOngoingQuestion] = useState(null); // Current question to display
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retakeLoading, setRetakeLoading] = useState(false); // New state for retake loading
  const [isVideoState, setIsVideoState] = useState(true);
  const [summeryState, setSumarryState] = useState(false);
  const [returnOrFullRetakeState, setReturnOrFullRetakeState] = useState(false);
  const navigate = useNavigate();

  // Generate AI questions
  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = [];
        if (questionBankId) queryParams.push(`questionBank_id=${questionBankId}`);
        if (interviewId) queryParams.push(`interview_id=${interviewId}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const endpoint = `/interview/genarateQuestionSet_ByAi${queryString}`;
        const res = await request({
          endpoint,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`, // No "Bearer" as requested
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to generate question set");
        }

        const data = res.data.body;
        console.log("Generated Questions:", data.remainingQuestions);
        generatedQuestions.current = data.remainingQuestions; // Store the array of questions

        // Set the first question as the ongoing question if available
        if (
          Array.isArray(generatedQuestions.current) &&
          generatedQuestions.current.length > 0
        ) {
          setOngoingQuestion(generatedQuestions.current[0]);
          setCurrentQuestionIndex(0);
        } else {
          setError("No questions generated from the API response");
        }
      } catch (err) {
        setError(err.message || "Failed to generate question set");
        console.error("Error generating questions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (AuthorizationToken && questionBankId) {
      fetchGeneratedQuestions();
    } else {
      setLoading(false);
      setError(
        AuthorizationToken
          ? "questionBank_id is required"
          : "No authorization token available"
      );
    }
  }, [questionBankId, interviewId, AuthorizationToken]); // No request in dependencies



  // Define the lastQuestionModification function
  const lastQuestionModification = () => {
    // update the data before sending to the backend 
    // update the video data.........
    setSumarryState(true);
    console.log(
      "Reached the last question. Performing last question modification..."
    );
    // Add your logic here if needed
  };



  // Call lastQuestionModification when reaching the last question===>Done
  useEffect(() => {
    if (
      Array.isArray(generatedQuestions.current) &&
      generatedQuestions.current.length > 0 &&
      currentQuestionIndex === generatedQuestions.current.length - 1
    ) {
      lastQuestionModification();
    }
  }, [currentQuestionIndex]);




  // Define the handleRetake function
  const handleRetake = async () => {
    if (!ongoingQuestion) return;
    setIsVideoState(true);

    setRetakeLoading(true); // Start loading for retake
    try {
      const endpoint = `/interview/genarateSingleQuestion_ByAi_for_Retake`;
      const res = await request({
        endpoint,
        method: "POST",
        body: {
          questionBank_id: ongoingQuestion.questionBank_id,
          user_id: ongoingQuestion.user_id,
          interview_id: ongoingQuestion.interview_id,
          question_id: ongoingQuestion._id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`, // No "Bearer" as requested
        },
      });

      if (!res.ok) {
        throw new Error(
          res.message || "Failed to generate new question for retake"
        );
      }

      const newQuestion = res.data.body; // Assuming the API returns the new question in res.data.body
      console.log("New Retake Question:", newQuestion);

      // Update the ongoingQuestion state with the new question
      setOngoingQuestion(newQuestion);

      // Update the corresponding question in generatedQuestions.current
      if (Array.isArray(generatedQuestions.current)) {
        const updatedQuestions = [...generatedQuestions.current];
        updatedQuestions[currentQuestionIndex] = newQuestion;
        generatedQuestions.current = updatedQuestions;
        console.log("Updated Questions List:", generatedQuestions.current);
      }
    } catch (err) {
      setError(err.message || "Failed to generate new question for retake");
      console.error("Error generating retake question:", err);
    } finally {
      setRetakeLoading(false); // Stop loading after the operation
    }
  };



  // Handle next question click
  const handleNextQuestion = () => {
    setIsVideoState(false);
    // add fetch for video annalysis.........
  };



  // Handle continue for next question
  const handleContinue = () => {

    // get the data from the video annalysis
    // save the data in the database
    // then prform the change below


    setIsVideoState(true);
    if (
      Array.isArray(generatedQuestions.current) &&
      currentQuestionIndex < generatedQuestions.current.length - 1
    ) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setOngoingQuestion(generatedQuestions.current[nextIndex]);
    } else {
      // On the last question, do not increment the index
      console.log("Already on the last question, index not incremented.");
    }
  };



  // Last question done and continue clicked
  const handleSummaryGenaration = () => {


    // heat api for summary genaration
    // show grenarated summary


    setReturnOrFullRetakeState(true);
    console.log("generating summary");
    // fetch api for summary
  };



  // Summary state true and returnOrFullRetakeState true====>Done
  const handleFullRetaake = async () => {
    console.log("I am being called full retake");
    if (!ongoingQuestion || !ongoingQuestion.questionBank_id) {
      setError("No ongoing question or questionBank_id available for full retake");
      setRetakeLoading(false);
      return;
    }

    try {
      setRetakeLoading(true); // Indicate loading for full retake
      const queryParams = [
        `questionBank_id=${ongoingQuestion.questionBank_id}`,
        "isRetake=true",
      ];
      if (interviewId) queryParams.push(`interview_id=${interviewId}`);
      const queryString = `?${queryParams.join("&")}`;
      const endpoint = `/interview/genarateQuestionSet_ByAi${queryString}`;

      const res = await request({
        endpoint,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`, // No "Bearer" as requested
        },
      });

      if (!res.ok) {
        throw new Error(res.message || "Failed to generate full question set for retake");
      }

      const data = res.data.body;
      console.log("Generated Questions for Full Retake:", data.question_Set);
      generatedQuestions.current = data.question_Set; // Update with new question set

      // Reset to the first question
      if (Array.isArray(generatedQuestions.current) && generatedQuestions.current.length > 0) {
        setCurrentQuestionIndex(0);
        setOngoingQuestion(generatedQuestions.current[0]);
        setIsVideoState(true); // Reset to camera view
        setSumarryState(false); // Reset summary state
        setReturnOrFullRetakeState(false); // Reset retake state
      } 
      else {
        setError("No questions generated in full retake response");
      }
    } 
    catch (err) {
      setError(err.message || "Failed to generate full question set for retake");
      console.error("Error generating full retake question set:", err);
    } 
    finally {
      setRetakeLoading(false); // Stop loading after the operation
    }
  };


  // returnOrFullRetakeState true and clicks continue====>Done
  const handleReturnInterview = () => {
    navigate(`/userDashboard/mockInterview/${ongoingQuestion.interview_id}`);
    console.log("interview done Returning to interview state");
  };



  // Define onClick handlers with conditional logic handleContinueClick====>Done
  const handleContinueClick = () => {
    if (summeryState && returnOrFullRetakeState) {
      handleReturnInterview();
    } else if (summeryState) {
      handleSummaryGenaration();
    } else {
      handleContinue();
    }
  };


// Define onClick handlers with conditional logic handleRetakeClick====>Done
  const handleRetakeClick = () => {
    if (summeryState && returnOrFullRetakeState) {
      handleFullRetaake();
    } else {
      handleRetake();
    }
  };

  return (
    <div className="text-black w-full px-6 py-8 h-full ">
      {loading && <p>Loading generated questions...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {ongoingQuestion && (
        <div className="w-full bg-white p-6 rounded-lg shadow h-full">
          <h1 className="mb-4 text-left text-sm text-[#676768]">
            Question {currentQuestionIndex + 1} out of{" "}
            {generatedQuestions.current.length} Questions
          </h1>

          <div className="w-full flex justify-center items-center mb-10">
            <p className="text-lg">
              Q. {ongoingQuestion.question || "No question text available"}
            </p>
          </div>

          {/* View point */}
          <div className="h-[80%] w-[60%] mx-auto">
            {isVideoState ? (
              !retakeLoading ? (
                <div className="w-full h-[80%] border-[1px] rounded-sm ">


                  <p className="text-lg mb-4">
                    {ongoingQuestion.time_to_answer
                      ? `${Math.floor(
                          Number(ongoingQuestion.time_to_answer) / 60
                        )} minute(s)`
                      : "No time available"}
                  </p>
                  here ill mount the camera


                        <VideoController
                        question={ongoingQuestion}
                        isVideoState={isVideoState}
                        />

                </div>
              ) : (
                <h2>Generating new question for retake...</h2>
              )
            ) : (
              <div>here ill mount the outcome of submitted video component</div>
            )}
          </div>

          <div className="w-full flex justify-center">
            {isVideoState && (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-500 w-[50%] h-[50px] rounded-[12px]"
              >
                {currentQuestionIndex < generatedQuestions.current.length - 1 ? (
                  <div>Next Question</div>
                ) : (
                  <div>Finish</div>
                )}
              </button>
            )}
          </div>

          <div className="w-full flex justify-center bg-yellow">
            {!isVideoState && (
              <div className="flex justify-center gap-6 w-full">
                <button
                  onClick={handleContinueClick}
                  className="bg-blue-500 w-[30%] h-[50px] rounded-[12px]"
                >
                  Continue
                </button>

                <button
                  onClick={handleRetakeClick}
                  className="bg-green-500 w-[30%] h-[50px] rounded-[12px]"
                  disabled={retakeLoading}
                >
                  {retakeLoading ? "Generating..." : "Retake"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartInterviewPage;