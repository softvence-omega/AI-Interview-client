import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useApi from "../../hook/apiHook";
import { toast } from "sonner";
import VideoController from "../userPages/mockInterview/VideoController";
import Container from "../../container/container";
import AssessmentDisplay from "../userPages/mockInterview/AssesmrntDisplay";
import LoadingCircle from "../../reuseable/LoadingCircle";

const AboutMeVideoTest = () => {
  const videoControllerRef = useRef(null);
  const [aboutMeResult, setAboutMeResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { request } = useApi();
  const [isAboutMeVideoProssing, setIsAboutMeVideoProcessing] = useState(false);

  const submitAboutMeVideoTest = async () => {
    if (!user?.approvalToken) {
      toast.error("You must be logged in to complete this action.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const data = { isAboutMeVideoChecked: true };
      formData.append("data", JSON.stringify(data));

      const res = await request({
        endpoint: "/users/updateProfile",
        method: "PATCH",
        headers: {
          Authorization: user.approvalToken,
        },
        body: formData,
      });

      if (res?.ok) {
        toast.success("Profile updated successfully!");

        // // Get current auth data from localStorage
        // const localUser = JSON.parse(localStorage.getItem("userData"));

        // // Update userMeta
        // const updatedUser = {
        //   ...localUser,
        //   userData: {
        //     ...localUser.userData,
        //     userMeta: {
        //       ...localUser.userData.userMeta,
        //       isAboutMeVideoChecked: true,
        //     },
        //   },
        // };

        // // Save updated data back to localStorage
        // localStorage.setItem("userData", JSON.stringify(updatedUser));

        // Safely parse localStorage with fallback
        let localUser;
        try {
          const storedData = localStorage.getItem("userData");
          localUser = storedData ? JSON.parse(storedData) : { userMeta: {}, userData: {} };
        } catch (error) {
          console.error("Error parsing localStorage:", error);
          localUser = { userMeta: {}, userData: {} };
          toast.warning("Local storage data was reset due to an error.");
        }

        console.log("Local USER ::: ", localUser);

        // Update top-level userMeta in localStorage
        const updatedUser = {
          ...localUser,
          userMeta: {
            ...localUser.userMeta,
            isAboutMeVideoChecked: true,
          },
          userData: {
            ...localUser.userData,
            userMeta: {
              ...(localUser.userData.userMeta || {}),
              isAboutMeVideoChecked: true, // CHANGED: Sync nested userMeta
            },
          },
        };

        // Save to localStorage with error handling
        try {
          localStorage.setItem("userData", JSON.stringify(updatedUser));
          console.log("localStorage updated successfully:", updatedUser);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          toast.error("Failed to update local storage. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Update Auth context to align with localStorage
        setUser((prev) => ({
          ...prev,
          userMeta: updatedUser.userMeta, // CHANGED: Update top-level userMeta
          userData: {
            ...prev.userData,
            userMeta: updatedUser.userData.userMeta, // CHANGED: Update nested userMeta
          },
        }));

        console.log("updatedUser ::: ", updatedUser);

        setTimeout(() => navigate("/userDashboard/mockInterview"), 1500);
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center w-full max-w-[1444px] mx-auto mt-20 mb-20">
        <div className="w-[80%] p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#37B874]">
            {aboutMeResult
              ? "About Me Video Assessment"
              : "Record Your About Me Video"}
          </h1>

          {!isAboutMeVideoProssing ? (
            <div>
              {!aboutMeResult ? (
                <>
                  <VideoController
                    ref={videoControllerRef}
                    question={{ time_to_answer: 120 }}
                    isVideoState={true}
                    onVideoAnalysisComplete={() => {}}
                    isProcessingRef={false}
                    setAiResponse={() => {}}
                    aiResponse={null}
                    aboutMeTry={true}
                    setIsAboutMeVideoProcessing={setIsAboutMeVideoProcessing}
                    onAboutMeResponse={(data) => setAboutMeResult(data)}
                  />
                  <div className="mt-6 text-center">
                    <button
                      onClick={() =>
                        videoControllerRef.current?.stopRecording()
                      }
                      className="px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors"
                    >
                      Stop and Submit Video
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  {/* <AssessmentDisplay
                    response={aboutMeResult}
                    currentQuestionIndex={"About Me"}
                  /> */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={submitAboutMeVideoTest}
                      className="px-6 py-2 flex items-center justify-center gap-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingCircle className="w-5 h-5 text-white" />
                          Submitting...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {" "}
              your video is being processed <LoadingCircle />{" "}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default AboutMeVideoTest;
