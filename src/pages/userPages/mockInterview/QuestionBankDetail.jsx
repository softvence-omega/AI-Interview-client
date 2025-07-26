// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useAuth } from "../../../context/AuthProvider";
// import useApi from "../../../hook/apiHook";
// import Buttons from "../../../reuseable/AllButtons";

// const QuestionBankDetail = () => {
//   const [searchParams] = useSearchParams();
//   const questionBankId = searchParams.get("questionBank_id");
//   const interviewId = searchParams.get("interview_id");
//   const { user } = useAuth();
//   const AuthorizationToken = user?.approvalToken;
//   const { request } = useApi();

//   const [questionBankData, setQuestionBankData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchQuestionBank = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const queryParams = [];
//         if (questionBankId) queryParams.push(`questionBank_id=${questionBankId}`);
//         if (interviewId) queryParams.push(`interview_id=${interviewId}`);
//         const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

//         const endpoint = `/interview/get_question_bank${queryString}`;
//         const res = await request({
//           endpoint,
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AuthorizationToken}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error(res.message || "Failed to fetch question bank data");
//         }

//         const data = res.data.body;
//         console.log("Fetched Question Bank Data:", data); // Print the data to the console
//         setQuestionBankData(data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch question bank data");
//         console.error("Error fetching question bank:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (AuthorizationToken && questionBankId) {
//       fetchQuestionBank();
//     } else {
//       setLoading(false);
//       setError(AuthorizationToken ? "questionBank_id is required" : "No authorization token available");
//     }
//   }, [questionBankId, interviewId, AuthorizationToken]);

//   return (
//     <div className="text-black w-full md:px-6 lg:px-6 py-8">
//       {loading && <p>Loading question bank data...</p>}
//       {error && <p className="text-red-500">Error: {error}</p>}
//       {Array.isArray(questionBankData) && questionBankData.length > 0 ? (
//         <div>
//           {questionBankData.map((item, index) => (
//             <div key={item._id || index} className="w-full bg-white p-6 rounded-lg shadow mb-6">
//                 <Buttons.LinkButton
//                 text="Start Mock Interview"
//                 width="w-full"
//                 height="h-[50px]"
//                 to={`/userDashboard/mockInterview/startInterview?questionBank_id=${item._id}`}/>

//               {/* Metadata Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">

//                 <div className="bg-green-100 p-2 rounded text-center">
//                   <p className="text-sm text-gray-600">Duration</p>
//                   <p className="text-lg font-semibold">{item.duration || "N/A"} min</p>
//                 </div>
//                 <div className="bg-green-100 p-2 rounded text-center">
//                   <p className="text-sm text-gray-600">Difficulty Level</p>
//                   <p className="text-lg font-semibold">{item.difficulty_level || "N/A"}</p>
//                 </div>
//                 <div className="bg-green-100 p-2 rounded text-center">
//                   <p className="text-sm text-gray-600">Type</p>
//                   <p className="text-lg font-semibold">{item.question_Type || "N/A"}</p>
//                 </div>

//               </div>

//               {/* Description Section */}
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold mb-2">Description</h2>
//                 <p className="text-gray-700">{item.description || "No description available"}</p>
//               </div>

//               {/* What to Expect Section */}
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold mb-2">What to Expect</h2>
//                 <ul className="list-disc pl-5 text-gray-700">
//                   {Array.isArray(item.what_to_expect) &&
//                     item.what_to_expect.map((expectation, idx) => (
//                       <li key={idx} className="mb-2">
//                         {expectation}
//                       </li>
//                     ))}
//                   {!Array.isArray(item.what_to_expect) && <li>No expectations listed</li>}
//                 </ul>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         !loading && !error && <p>No question bank details available.</p>
//       )}
//     </div>
//   );
// };

// export default QuestionBankDetail;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import Buttons from "../../../reuseable/AllButtons";
import CustomSelect from "../../../reuseable/CustomSelect";

// const difficultyOptions = ["Beginner", "Intermediate", "Expert"];

// const CustomSelect = ({ value, onChange }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       {/* Label */}
//       <p className="text-sm text-gray-500 mb-2">Difficulty Level</p>

//       {/* Selected Box */}
//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className="w-full bg-green-50 text-green-700 font-medium border border-green-300 rounded-md px-4 py-2 text-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-400"
//       >
//         {value}
//         <svg
//           className={`w-4 h-4 ml-2 transform transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           strokeWidth={2}
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {/* Options */}
//       {open && (
//         <ul className="absolute z-10 w-full mt-1 bg-white border border-green-300 rounded-md shadow-lg">
//           {difficultyOptions.map((option) => (
//             <li
//               key={option}
//               onClick={() => {
//                 onChange(option);
//                 setOpen(false);
//               }}
//               className={`px-4 py-2 text-sm cursor-pointer hover:bg-green-100 hover:text-green-500 ${
//                 option === value ? "bg-green-500 text-white" : "text-gray-700"
//               }`}
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

const QuestionBankDetail = () => {
  const [searchParams] = useSearchParams();
  const questionBankId = searchParams.get("questionBank_id");
  const interviewId = searchParams.get("interview_id");
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();

  const [questionBankData, setQuestionBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expectingPreference, setExpectingPreference] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [userPreferenceData, setUserPreferenceData] = useState(null);

  useEffect(() => {
    const fetchQuestionBank = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = [];
        if (questionBankId)
          queryParams.push(`questionBank_id=${questionBankId}`);
        if (interviewId) queryParams.push(`interview_id=${interviewId}`);
        const queryString =
          queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const endpoint = `/interview/get_question_bank${queryString}`;
        const res = await request({
          endpoint,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(res.message || "Failed to fetch question bank data");
        }

        const data = res.data.body;
        console.log("Fetched Question Bank Data:", data);
        setQuestionBankData(data);

        // Initialize expectingPreference and expandedSections
        if (Array.isArray(data)) {
          const initialPreferences = data.reduce(
            (acc, item) => ({
              ...acc,
              [item._id]: {
                selectedExpectation:
                  Array.isArray(item.what_to_expect) &&
                  item.what_to_expect.length > 0
                    ? [item.what_to_expect[0]]
                    : [],
                selectedDifficulty: item.difficulty_level || "Beginner",
                selectedQuestionType: item.question_Type || "MCQ Question",
              },
            }),
            {}
          );
          const initialExpanded = data.reduce(
            (acc, item) => ({
              ...acc,
              [item._id]: {
                whatToExpect: false,
                difficultyLevel: false,
                questionType: false,
              },
            }),
            {}
          );
          setExpectingPreference(initialPreferences);
          setExpandedSections(initialExpanded);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch question bank data");
        console.error("Error fetching question bank:", err);
      } finally {
        setLoading(false);
      }
    };

    const getUserPreference = async () => {
      try {
        const response = await request({
          endpoint: `/interview/getUserPreferenceBasedOnQuestionBankId?questionBank_id=${questionBankId}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            response.message || "Failed to fetch user preferences"
          );
        }

        const data = response.data.body;
        console.log("Fetched User Preferences:", data);

        // ✅ Pre-fill expectingPreference with saved values
        if (data) {
          setExpectingPreference((prev) => ({
            ...prev,
            [questionBankId]: {
              selectedDifficulty: data.difficulty_level || "Beginner",
              selectedQuestionType: data.question_Type || "Multiple Choice",
              selectedExpectation: data.what_to_expect || [],
            },
          }));
        }

        setUserPreferenceData(data); // ✅ save to state
      } catch (err) {
        console.error("Error fetching user preferences:", err);
      }
    };

    if (AuthorizationToken && questionBankId) {
      fetchQuestionBank();
      getUserPreference();
    } else {
      setLoading(false);
      setError(
        AuthorizationToken
          ? "questionBank_id is required"
          : "No authorization token available"
      );
    }
  }, [questionBankId, interviewId, AuthorizationToken]);

  const handlePreferenceChange = (itemId, field, value) => {
    setExpectingPreference((prev) => {
      if (field === "selectedExpectation") {
        const currentExpectations = prev[itemId]?.selectedExpectation || [];
        const updatedExpectations = currentExpectations.includes(value)
          ? currentExpectations.filter((exp) => exp !== value)
          : [...currentExpectations, value];
        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            [field]: updatedExpectations,
          },
        };
      }
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: value,
        },
      };
    });
  };

  const toggleSection = (itemId, section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [section]: !prev[itemId][section],
      },
    }));
  };

  return (
    <div className="text-black w-full md:px-6 lg:px-6 py-8">
      <style>
        {`
          .custom-select-wrapper {
            position: relative;
            display: inline-block;
            width: 100%;
          }
          .custom-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            padding: 0.5rem 2.5rem 0.5rem 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            width: 100%;
            font-size: 0.875rem;
          }
          .custom-select:hover {
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }
          .custom-select:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
          }
          .custom-select-arrow {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #374151;
            font-size: 0.875rem;
          }
          .slide-down {
            transition: all 0.3s ease-in-out;
            overflow: hidden;
          }
          .slide-down.collapsed {
            max-height: 0;
            opacity: 0;
          }
          .slide-down.expanded {
            max-height: 500px;
            opacity: 1;
          }
        `}
      </style>
      {loading && (
        <p className="text-gray-600">Loading question bank data...</p>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      {Array.isArray(questionBankData) && questionBankData.length > 0 ? (
        <div>
          {questionBankData.map((item, index) => (
            <div
              key={item._id || index}
              className="w-full bg-white p-6 rounded-lg shadow mb-6"
            >
              <Buttons.LinkButton
                text="Start Mock Interview"
                width="w-full"
                height="h-[50px]"
                to={`/userDashboard/mockInterview/startInterview?questionBank_id=${
                  item._id
                }&expectation=${encodeURIComponent(
                  JSON.stringify(
                    expectingPreference[item._id]?.selectedExpectation || []
                  )
                )}&difficulty=${encodeURIComponent(
                  expectingPreference[item._id]?.selectedDifficulty || ""
                )}&questionType=${encodeURIComponent(
                  expectingPreference[item._id]?.selectedQuestionType || ""
                )}`}
              />

              {/* Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
                {/* Duration */}
                <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-xl text-center">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-xl font-bold text-green-600">
                    {item.duration || "N/A"} min{" "}
                    <span className="text-sm font-semibold text-gray-600">
                      (Approximate)
                    </span>
                  </p>
                </div>

                {/* Difficulty Level */}
                <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-xl">
                  {/* <p className="text-sm text-gray-500 mb-2">Difficulty Level</p> */}
                  <CustomSelect
                    label="Difficulty Level"
                    options={["Beginner", "Intermediate", "Expert"]}
                    // value={
                    //   expectingPreference[item._id]?.selectedDifficulty ||
                    //   item.difficulty_level ||
                    //   "Beginner"
                    // }
                    value={
                      expectingPreference[item._id]?.selectedDifficulty ||
                      "Beginner"
                    }
                    onChange={(val) =>
                      handlePreferenceChange(
                        item._id,
                        "selectedDifficulty",
                        val
                      )
                    }
                    // ✅ Disable if user preference has difficulty_level
                    disabled={!!userPreferenceData?.difficulty_level}
                  />
                  {userPreferenceData?.difficulty_level && (
                    <p className="text-sm italic text-gray-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span> Locked due to saved preference
                    </p>
                  )}
                </div>

                {/* Question Type */}
                <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-xl">
                  {/* <p className="text-sm text-gray-500 mb-2">Question Type</p> */}
                  <CustomSelect
                    label="Question Type"
                    options={["Multiple Choice", "Open Ended"]}
                    // value={
                    //   expectingPreference[item._id]?.selectedQuestionType ||
                    //   item.question_Type ||
                    //   "Multiple Choice"
                    // }
                    value={
                      expectingPreference[item._id]?.selectedQuestionType ||
                      "Multiple Choice"
                    }
                    onChange={(val) =>
                      handlePreferenceChange(
                        item._id,
                        "selectedQuestionType",
                        val
                      )
                    }
                    // ✅ Disable if user preference has question_Type
                    disabled={!!userPreferenceData?.question_Type}
                  />
                  {userPreferenceData?.question_Type && (
                    <p className="text-sm italic text-gray-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span> Locked due to saved preference
                    </p>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">
                  {item.description || "No description available"}
                </p>
              </div>

              {/* What to Expect Section */}
              <div className="mb-6">
                <button
                  type="button"
                  className="flex items-center text-xl font-semibold mb-2 focus:outline-none hover:text-green-600"
                  onClick={() => toggleSection(item._id, "whatToExpect")}
                >
                  What to Expect
                  <span
                    className={`ml-2 transform transition-transform duration-200 ${
                      expandedSections[item._id]?.whatToExpect
                        ? "rotate-180"
                        : ""
                    }`}
                  ></span>
                </button>
                <div
                  className={`slide-down 
                    
                  `}
                  // ${
                  //   expandedSections[item._id]?.whatToExpect
                  //     ? "expanded"
                  //     : "collapsed"
                  // }
                >
                  {Array.isArray(item.what_to_expect) &&
                  item.what_to_expect.length > 0 ? (
                    <div className="lg:flex md:flex lg:flex-wrap md:flex-wrap lg:justify-between md:justify-between lg:gap-4 md:gap-4 mt-2 lg:p-2 md:p-2">
                      {item.what_to_expect.map((expectation, idx) => {
                        // const isChecked =
                        //   expectingPreference[
                        //     item._id
                        //   ]?.selectedExpectation?.includes(expectation) ||
                        //   false;
                        const isChecked =
                          expectingPreference[
                            item._id
                          ]?.selectedExpectation?.includes(expectation) ||
                          false;

                        return (
                          <label
                            key={idx}
                            className="flex items-center gap-3 lg:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] cursor-pointer relative mb-1 lg:mb-0"
                          >
                            <input
                              type="checkbox"
                              disabled={
                                Array.isArray(
                                  userPreferenceData?.what_to_expect
                                ) &&
                                userPreferenceData.what_to_expect.length > 0
                              }
                              className={`appearance-none h-5 w-5 rounded-full border-2 transition-all duration-200 ${
                                isChecked
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              } checked:bg-green-500 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400`}
                              checked={isChecked}
                              onChange={() =>
                                handlePreferenceChange(
                                  item._id,
                                  "selectedExpectation",
                                  expectation
                                )
                              }
                            />

                            {isChecked && (
                              <svg
                                className="absolute left-1.5 top-1.5 pointer-events-none"
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4L4 7L9 1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            <span className="text-sm text-gray-800">
                              {expectation}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">No expectations listed</p>
                  )}
                  {userPreferenceData?.question_Type && (
                    <p className="text-sm italic text-gray-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span> Locked due to saved preference
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-gray-600">No question bank details available.</p>
        )
      )}
    </div>
  );
};

export default QuestionBankDetail;
