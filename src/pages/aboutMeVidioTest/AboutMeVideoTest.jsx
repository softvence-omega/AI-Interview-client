// import React, { useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthProvider';
// import useApi from '../../hook/apiHook';
// import { toast } from 'sonner';
// import VideoController from '../userPages/mockInterview/VideoController';
// import Container from '../../container/container';
// import AssessmentDisplay from '../userPages/mockInterview/AssesmrntDisplay';
// import LoadingCircle from '../../reuseable/LoadingCircle';


// const AboutMeVideoTest = () => {
//   const videoControllerRef = useRef(null);
//   const [aboutMeResult, setAboutMeResult] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { request } = useApi();

//   const submitAboutMeVideoTest = async () => {
//     if (!user?.approvalToken) {
//       toast.error('You must be logged in to complete this action.');
//       setTimeout(() => navigate('/login'), 1500);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       const data = { isAboutMeVideoChecked: true };
//       formData.append('data', JSON.stringify(data));

//       const res = await request({
//         endpoint: '/users/updateProfile',
//         method: 'PATCH',
//         headers: {
//           Authorization: user.approvalToken,
//         },
//         body: formData,
//       });

//       if (res?.ok) {
//         toast.success('Profile updated successfully!');
//         navigate('/userdashboard/mockInterview');
//       } else {
//         toast.error(res?.message || 'Failed to update profile.');
//       }
//     } catch (error) {
//       console.error('Profile update error:', error);
//       toast.error('Error updating profile.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Container>
//       <div className="min-h-screen flex items-center justify-center w-full max-w-[1444px] mx-auto mt-20 mb-20">
//         <div className="w-[80%] p-6 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold mb-4 text-center text-[#37B874]">
//             {aboutMeResult ? "About Me Video Assessment" : "Record Your About Me Video"}
//           </h1>

//           {!aboutMeResult ? (
//             <>
//               <VideoController
//                 ref={videoControllerRef}
//                 question={{ time_to_answer: 120 }}
//                 isVideoState={true}
//                 onVideoAnalysisComplete={() => {}}
//                 isProcessingRef={false}
//                 setAiResponse={() => {}}
//                 aiResponse={null}
//                 aboutMeTry={true}
//                 onAboutMeResponse={(data) => setAboutMeResult(data)}
//               />
//               <div className="mt-6 text-center">
//                 <button
//                   onClick={() => videoControllerRef.current?.stopRecording()}
//                   className="px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors"
//                 >
//                   Stop and Submit Video
//                 </button>
//               </div>
//             </>
//           ) 
//           : 
//           (
//             <div>
//               <AssessmentDisplay
//                 response={aboutMeResult}
//                 currentQuestionIndex={"About Me"}
//               />
//               <div className="mt-4 text-center">
//                 <button
//                   onClick={submitAboutMeVideoTest}
//                   className="px-6 py-2 flex items-center justify-center gap-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <LoadingCircle className="w-5 h-5 text-white" />
//                       Submitting...
//                     </>
//                   ) : (
//                     'Continue'
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default AboutMeVideoTest;


import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import useApi from '../../hook/apiHook';
import { toast } from 'sonner';
import VideoController from '../userPages/mockInterview/VideoController';
import Container from '../../container/container';
import AssessmentDisplay from '../userPages/mockInterview/AssesmrntDisplay';
import LoadingCircle from '../../reuseable/LoadingCircle';

const AboutMeVideoTest = () => {
  const videoControllerRef = useRef(null);
  const [aboutMeResult, setAboutMeResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Track processing state
  const navigate = useNavigate();
  const { user } = useAuth();
  const { request } = useApi();
  const [isVideoState, setIsVideoState] = useState(true); // Control video recording state

  // Handle stop recording event from VideoController
  const handleStopRecording = () => {
    setIsVideoState(false); // Stop video stream
  };

  // Handle AI response from VideoController
  const handleAboutMeResponse = (data) => {
    setAboutMeResult(data);
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success('Video analysis completed!');
    }
  };

  const submitAboutMeVideoTest = async () => {
    if (!user?.approvalToken) {
      toast.error('You must be logged in to complete this action.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const data = { isAboutMeVideoChecked: true };
      formData.append('data', JSON.stringify(data));

      const res = await request({
        endpoint: '/users/updateProfile',
        method: 'PATCH',
        headers: {
          Authorization: user.approvalToken,
        },
        body: formData,
      });

      if (res?.ok) {
        toast.success('Profile updated successfully!');
        navigate('/userdashboard/mockInterview');
      } else {
        toast.error(res?.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Error updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(
    'videoControllerRef:', videoControllerRef,
    'aboutMeResult:', aboutMeResult,
    'isSubmitting:', isSubmitting,
    'isProcessing:', isProcessing,
    'isVideoState:', isVideoState
  );

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center w-full max-w-[1444px] mx-auto mt-20 mb-20">
        <div className="w-[80%] p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#37B874]">
            {aboutMeResult ? 'About Me Video Assessment' : 'Record Your About Me Video'}
          </h1>

          <VideoController
            ref={videoControllerRef}
            question={{ time_to_answer: 120 }}
            isVideoState={isVideoState}
            onVideoAnalysisComplete={() => {}}
            isProcessingRef={{ current: false }}
            setAiResponse={() => {}}
            aiResponse={null}
            aboutMeTry={true}
            onAboutMeResponse={handleAboutMeResponse}
            handleNextQuestion={() => {}}
            onStopRecording={handleStopRecording}
            setIsProcessing={setIsProcessing}
          />

          {isVideoState && !aboutMeResult && !isProcessing && (
            <div className="mt-6 text-center">
              <button
                onClick={() => videoControllerRef.current?.stopRecording()}
                className="px-6 py-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors"
              >
                Stop and Submit Video
              </button>
            </div>
          )}

          {isProcessing && !isVideoState && !aboutMeResult && (
            <div className="mt-6 text-center">
              <div className="flex gap-2 justify-center items-center">
                <LoadingCircle className="w-8 h-8 text-[#37B874]" />
                <h3 className="text-lg text-[#37B874]">Your About Me video is being processed...</h3>
              </div>
            </div>
          )}

          {aboutMeResult && (
            <div>
              <AssessmentDisplay
                response={aboutMeResult}
                currentQuestionIndex={'About Me'}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={submitAboutMeVideoTest}
                  className="px-6 py-2 flex items-center justify-center gap-2 text-white bg-[#37B874] rounded-lg hover:bg-[#2e9b64] transition-colors disabled:opacity-50"
                  disabled={isSubmitting || aboutMeResult.error}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingCircle className="w-5 h-5 text-white" />
                      Submitting...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default AboutMeVideoTest;