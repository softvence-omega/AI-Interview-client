// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import Select from "react-select";
// import botImg from "../../assets/logos/Hi_bot.png";
// import Container from "../../container/container";
// import Buttons from "../../reuseable/AllButtons";
// import axios from "axios"; // Import Axios
// import { useAuth } from "../../context/AuthProvider";

// const customSelectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     backgroundColor: "white",
//     borderColor: "#37B874",
//     boxShadow: state.isFocused ? `0 0 0 1px #37B874` : "none",
//     "&:hover": {
//       borderColor: "#37B874",
//     },
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#37B874"
//       : state.isFocused
//       ? "#37B874"
//       : "white",
//     color: state.isSelected || state.isFocused ? "white" : "black",
//     cursor: "pointer",
//     transition: "background-color 0.2s ease",
//   }),
//   menu: (provided) => ({
//     ...provided,
//     backgroundColor: "white",
//     borderRadius: "0.375rem",
//     boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
//   }),
// };

// const degreeOptions = [
//   "Bachelor's Degree",
//   "Master's Degree",
//   "PhD",
//   "Diploma",
//   "Certificate",
//   "Other",
// ].map((degree) => ({ value: degree, label: degree }));

// const EducationCertificate = () => {
//   const user = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [educations, setEducations] = useState([
//     {
//       institution: "",
//       degree: degreeOptions[0],
//       majorField: "",
//       startDate: "",
//       completionDate: "",
//       isOngoing: false, // Add ongoing field
//     },
//   ]);

//   const handleChange = (index, e) => {
//     const { name, value } = e.target;
//     const updated = [...educations];
//     updated[index][name] = value;
//     setEducations(updated);
//   };

//   const handleDegreeChange = (index, selectedOption) => {
//     const updated = [...educations];
//     updated[index].degree = selectedOption;
//     setEducations(updated);
//   };

//   const handleOngoingChange = (index) => {
//     const updated = [...educations];
//     updated[index].isOngoing = !updated[index].isOngoing;
//     if (updated[index].isOngoing) {
//       updated[index].completionDate = ""; // Clear completion date if ongoing
//     }
//     setEducations(updated);
//   };

//   const handleAddMore = () => {
//     setEducations((prev) => [
//       ...prev,
//       {
//         institution: "",
//         degree: degreeOptions[0],
//         majorField: "",
//         startDate: "",
//         completionDate: "",
//         isOngoing: false,
//       },
//     ]);
//   };

//   const handleContinue = async () => {
//     const isValid = educations.every(
//       (edu) =>
//         edu.institution.trim() !== "" &&
//         edu.majorField.trim() !== "" &&
//         edu.startDate.trim() !== "" &&
//         (edu.isOngoing || edu.completionDate.trim() !== "") // Ensure completionDate is only required if not ongoing
//     );

//     if (!isValid) {
//       toast.error("Please fill in all fields for each education entry!");
//       return;
//     }

//     const dataToSubmit = educations.map((edu) => ({
//       institution: edu.institution,
//       degree: edu.degree.value,
//       majorField: edu.majorField,
//       startDate: edu.startDate,
//       completionDate: edu.isOngoing ? "Ongoing" : edu.completionDate,
//     }));

//     const token = user.user.approvalToken;
//     setLoading(true); // Start loader

//     try {
//       console.log("Data to Submit:", dataToSubmit); // Debug log data before sending

//       const response = await axios.put(
//         `${import.meta.env.VITE_BASE_URL}/resume/update-resume`,
//         { education: dataToSubmit },
//         {
//           headers: {
//             Authorization: `${token}`,
//           },
//         }
//       );

//       console.log("API Response:", response); // Log the complete response

//       if (response.status === 200) {
//         toast.success("Education details saved successfully!");

//         // Get current auth data from localStorage
//         const localUser = JSON.parse(localStorage.getItem("userData"));

//         console.log("LOCAL USER :: ",localUser)

//         // Update userMeta
//         const updatedUser = {
//           ...localUser,
//             userMeta: {
//               ...localUser.userMeta,
//               isResumeUploaded: true, // ✅ Set the desired flag to true
//               isAboutMeGenerated: true,
//             },
//         };

//         // Save updated data back to localStorage
//         localStorage.setItem("userData", JSON.stringify(updatedUser));

//         console.log("LOCAL USER Updated :: ",updatedUser)

//         setTimeout(() => navigate("/userDashboard/mockInterview"), 500); // Redirect after success
//       } else {
//         toast.error("Failed to save education details!");
//       }
//     } catch (error) {
//       console.error("Error during API call:", error);
//       toast.error(
//         "An error occurred while saving education details. Please try again."
//       );
//     } finally {
//       setLoading(false); // Stop loader
//     }
//   };

//   return (
//     <Container>
//       <div className="flex flex-col lg:flex-row w-screen min-h-screen items-center justify-center px-4 pt-24 gap-12 max-w-[1440px]">
//         {/* Left Section */}
//         <div className="flex flex-col items-center text-center space-y-6 flex-1">
//           <h1 className="text-4xl font-bold">Hello Russell!</h1>
//           <h2 className="text-3xl font-semibold">Welcome</h2>
//           <img
//             src={botImg}
//             alt="Bot"
//             className="w-64 h-auto object-contain mt-6"
//           />
//         </div>

//         {/* Right Section */}
//         <div className="flex-1 flex justify-center">
//           <div className="w-full max-w-md">
//             <h3 className="text-2xl font-semibold mb-6 text-center">
//               Education & Certificate
//             </h3>
//             <form className="space-y-6">
//               {educations.map((edu, index) => (
//                 <div key={index} className="space-y-4 border-b pb-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Institute Name
//                     </label>
//                     <input
//                       type="text"
//                       name="institution"
//                       value={edu.institution}
//                       onChange={(e) => handleChange(index, e)}
//                       className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
//                       placeholder="Enter institution name"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Degree
//                     </label>
//                     <Select
//                       options={degreeOptions}
//                       value={edu.degree}
//                       onChange={(option) => handleDegreeChange(index, option)}
//                       isSearchable
//                       styles={customSelectStyles}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Major Field of Study
//                     </label>
//                     <input
//                       type="text"
//                       name="majorField"
//                       value={edu.majorField}
//                       onChange={(e) => handleChange(index, e)}
//                       className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
//                       placeholder="Enter major field of study"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={edu.startDate}
//                       onChange={(e) => handleChange(index, e)}
//                       className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Completion Date
//                     </label>
//                     <input
//                       type="date"
//                       name="completionDate"
//                       value={edu.isOngoing ? "" : edu.completionDate}
//                       onChange={(e) => handleChange(index, e)}
//                       className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
//                       required={!edu.isOngoing} // Make it required only if not ongoing
//                       disabled={edu.isOngoing} // Disable if ongoing
//                     />
//                   </div>

//                   <div className="flex items-center mt-2">
//                     <input
//                       type="checkbox"
//                       id={`ongoing-checkbox-${index}`}
//                       checked={edu.isOngoing}
//                       onChange={() => handleOngoingChange(index)}
//                       className="mr-2"
//                     />
//                     <label
//                       htmlFor={`ongoing-checkbox-${index}`}
//                       className="text-sm"
//                     >
//                       Ongoing Education
//                     </label>
//                   </div>

//                   {index === educations.length - 1 && (
//                     <button
//                       type="button"
//                       onClick={handleAddMore}
//                       className="text-[#37B874] font-semibold underline mt-2"
//                     >
//                       + Add More
//                     </button>
//                   )}
//                 </div>
//               ))}

//               <Buttons.SubmitButton
//                 text={
//                   loading ? (
//                     <svg
//                       className="animate-spin h-5 w-5 mx-auto text-[#FFF]"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                   ) : (
//                     "Continue"
//                   )
//                 }
//                 onClick={handleContinue}
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default EducationCertificate;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";
import botImg from "../../assets/logos/Hi_bot.png";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { DateInputWithIcon } from "../../reuseable/DateInputWithIcon";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: "#37B874",
    boxShadow: state.isFocused ? `0 0 0 1px #37B874` : "none",
    "&:hover": {
      borderColor: "#37B874",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#37B874"
      : state.isFocused
      ? "#37B874"
      : "white",
    color: state.isSelected || state.isFocused ? "white" : "black",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.375rem",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  }),
};

const degreeOptions = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Diploma",
  "Certificate",
  "Other",
].map((degree) => ({ value: degree, label: degree }));

const EducationCertificate = () => {
  const { user, setUser } = useAuth(); // CHANGED: Added setUser to update context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educations, setEducations] = useState([
    {
      institution: "",
      degree: degreeOptions[0],
      majorField: "",
      startDate: "",
      completionDate: "",
      isOngoing: false,
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...educations];
    updated[index][name] = value;
    setEducations(updated);
  };

  const handleDegreeChange = (index, selectedOption) => {
    const updated = [...educations];
    updated[index].degree = selectedOption;
    setEducations(updated);
  };

  const handleOngoingChange = (index) => {
    const updated = [...educations];
    updated[index].isOngoing = !updated[index].isOngoing;
    if (updated[index].isOngoing) {
      updated[index].completionDate = "";
    }
    setEducations(updated);
  };

  const handleAddMore = () => {
    setEducations((prev) => [
      ...prev,
      {
        institution: "",
        degree: degreeOptions[0],
        majorField: "",
        startDate: "",
        completionDate: "",
        isOngoing: false,
      },
    ]);
  };

  const handleContinue = async () => {
    const isValid = educations.every(
      (edu) =>
        edu.institution.trim() !== "" &&
        edu.majorField.trim() !== "" &&
        edu.startDate.trim() !== "" &&
        (edu.isOngoing || edu.completionDate.trim() !== "")
    );

    if (!isValid) {
      toast.error("Please fill in all fields for each education entry!");
      return;
    }

    const dataToSubmit = educations.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree.value,
      majorField: edu.majorField,
      startDate: edu.startDate,
      completionDate: edu.isOngoing ? "Ongoing" : edu.completionDate,
    }));

    const token = user.approvalToken;
    setLoading(true);

    try {
      console.log("Data to Submit:", dataToSubmit);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/resume/update-resume`,
        { education: dataToSubmit },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("API Response:", response);

      if (response.status === 200) {
        toast.success("Education details saved successfully!");

        // // Get current auth data from localStorage
        // const localUser = JSON.parse(localStorage.getItem("userData"));

        // // Update userMeta
        // const updatedUser = {
        //   ...localUser,
        //   userMeta: {
        //     ...localUser.userMeta,
        //     isResumeUploaded: true,
        //     isAboutMeGenerated: true,
        //     isAboutMeVideoChecked: false, // CHANGED: Explicitly set to match localStorage data
        //   },
        // };

        // // Save updated data back to localStorage
        // localStorage.setItem("userData", JSON.stringify(updatedUser));

        // // CHANGED: Update Auth context to reflect changes
        // setUser((prev) => ({
        //   ...prev,
        //   userData: {
        //     ...prev.userData,
        //     userMeta: updatedUser.userMeta,
        //   },
        // }));

        // // CHANGED: Set flag to skip redirect in UserOrAdminDBLayout
        // localStorage.setItem("skipRedirect", "true");

        // console.log("LOCAL USER Updated :: ", updatedUser);
        // Get current auth data from localStorage
        // Safely parse localStorage with fallback
        let localUser;
        try {
          const storedData = localStorage.getItem("userData");
          localUser = storedData
            ? JSON.parse(storedData)
            : { userMeta: {}, userData: {} };
        } catch (error) {
          console.error("Error parsing localStorage:", error);
          localUser = { userMeta: {}, userData: {} };
          toast.warning("Local storage data was reset due to an error.");
        }

        console.log("LOCAL USER :: ", localUser);

        // Update both top-level and nested userMeta
        const updatedUser = {
          ...localUser,
          userMeta: {
            ...localUser.userMeta,
            isResumeUploaded: true,
            isAboutMeGenerated: true,
            isAboutMeVideoChecked: false,
          },
          userData: {
            ...localUser.userData,
            userMeta: {
              ...(localUser.userData.userMeta || {}),
              isResumeUploaded: true,
              isAboutMeGenerated: true,
              isAboutMeVideoChecked: false,
            },
          },
        };

        // Save to localStorage with error handling
        try {
          localStorage.setItem("userData", JSON.stringify(updatedUser));
          console.log("LOCAL USER Updated :: ", updatedUser);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          toast.error("Failed to update local storage. Please try again.");
          setLoading(false);
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

        setTimeout(() => navigate("/userDashboard/mockInterview"), 1500); // CHANGED: Redirect to aboutMeVideoTest
      } else {
        toast.error("Failed to save education details!");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error(
        "An error occurred while saving education details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col lg:flex-row w-screen min-h-screen items-center justify-center px-4 pt-24 gap-12 max-w-[1440px]">
        {/* Left Section */}
        <div className="flex flex-col items-center text-center space-y-6 flex-1">
          <h1 className="text-4xl font-bold">Hello {user.userData.name}!</h1>
          <h2 className="text-3xl font-semibold">Welcome</h2>
          <img
            src={botImg}
            alt="Bot"
            className="w-[70%] h-[70%] object-contain mt-2"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Education & Certificate
            </h3>
            <form className="space-y-6">
              {educations.map((edu, index) => (
                <div key={index} className="space-y-4 border-b pb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institute Name
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter institution name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Degree
                    </label>
                    <Select
                      options={degreeOptions}
                      value={edu.degree}
                      onChange={(option) => handleDegreeChange(index, option)}
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Major Field of Study
                    </label>
                    <input
                      type="text"
                      name="majorField"
                      value={edu.majorField}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter major field of study"
                      required
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="completionDate"
                      value={edu.isOngoing ? "" : edu.completionDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      required={!edu.isOngoing}
                      disabled={edu.isOngoing}
                    />
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`ongoing-checkbox-${index}`}
                      checked={edu.isOngoing}
                      onChange={() => handleOngoingChange(index)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`ongoing-checkbox-${index}`}
                      className="text-sm"
                    >
                      Ongoing Education
                    </label>
                  </div> */}

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <DateInputWithIcon
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleChange(index, e)}
                      disabled={false}
                      required={true}
                    />
                  </div>

                  {/* Completion Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Completion Date
                    </label>
                    <DateInputWithIcon
                      name="completionDate"
                      value={edu.isOngoing ? "" : edu.completionDate}
                      onChange={(e) => handleChange(index, e)}
                      disabled={edu.isOngoing}
                      required={!edu.isOngoing}
                    />
                  </div>

                  {/* Ongoing Checkbox */}
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`ongoing-checkbox-${index}`}
                      checked={edu.isOngoing}
                      onChange={() => handleOngoingChange(index)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`ongoing-checkbox-${index}`}
                      className="text-sm"
                    >
                      Ongoing Education
                    </label>
                  </div>

                  {index === educations.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddMore}
                      className="text-[#37B874] font-semibold underline mt-2"
                    >
                      + Add More
                    </button>
                  )}
                </div>
              ))}

              <Buttons.SubmitButton
                text={
                  loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mx-auto text-[#FFF]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Continue"
                  )
                }
                onClick={handleContinue}
              />
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EducationCertificate;
