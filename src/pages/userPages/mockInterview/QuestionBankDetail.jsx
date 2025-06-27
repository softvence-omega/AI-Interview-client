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

  useEffect(() => {
    const fetchQuestionBank = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = [];
        if (questionBankId) queryParams.push(`questionBank_id=${questionBankId}`);
        if (interviewId) queryParams.push(`interview_id=${interviewId}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        const endpoint = `/interview/get_question_bank${queryString}`;
        const res = await request({
          endpoint,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthorizationToken}`,
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
          const initialPreferences = data.reduce((acc, item) => ({
            ...acc,
            [item._id]: {
              selectedExpectation: Array.isArray(item.what_to_expect) && item.what_to_expect.length > 0 ? [item.what_to_expect[0]] : [],
              selectedDifficulty: item.difficulty_level || "Beginner",
              selectedQuestionType: item.question_Type || "MCQ Question",
            },
          }), {});
          const initialExpanded = data.reduce((acc, item) => ({
            ...acc,
            [item._id]: {
              whatToExpect: false,
              difficultyLevel: false,
              questionType: false,
            },
          }), {});
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

    if (AuthorizationToken && questionBankId) {
      fetchQuestionBank();
    } else {
      setLoading(false);
      setError(AuthorizationToken ? "questionBank_id is required" : "No authorization token available");
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
      {loading && <p className="text-gray-600">Loading question bank data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {Array.isArray(questionBankData) && questionBankData.length > 0 ? (
        <div>
          {questionBankData.map((item, index) => (
            <div key={item._id || index} className="w-full bg-white p-6 rounded-lg shadow mb-6">
              <Buttons.LinkButton
                text="Start Mock Interview"
                width="w-full"
                height="h-[50px]"
                to={`/userDashboard/mockInterview/startInterview?questionBank_id=${item._id}&expectation=${encodeURIComponent(
                  JSON.stringify(expectingPreference[item._id]?.selectedExpectation || [])
                )}&difficulty=${encodeURIComponent(
                  expectingPreference[item._id]?.selectedDifficulty || ""
                )}&questionType=${encodeURIComponent(
                  expectingPreference[item._id]?.selectedQuestionType || ""
                )}`}
              />

              {/* Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
                <div className="bg-green-100 p-2 rounded text-center">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold">{item.duration || "N/A"} min</p>
                </div>
                <div className="bg-green-100 p-2 rounded text-center">
                  <button
                    type="button"
                    className="flex items-center text-sm text-gray-600 w-full focus:outline-none hover:text-green-600"
                    onClick={() => toggleSection(item._id, "difficultyLevel")}
                  >
                    <span>Difficulty Level: </span>
                    <span className="ml-1 font-semibold">
                      {expectingPreference[item._id]?.selectedDifficulty || item.difficulty_level || "Beginner"}
                    </span>
                    <span
                      className={`ml-2 transform transition-transform duration-200 ${
                        expandedSections[item._id]?.difficultyLevel ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`slide-down ${
                      expandedSections[item._id]?.difficultyLevel ? "expanded" : "collapsed"
                    }`}
                  >
                    <div className="custom-select-wrapper mt-2">
                      <select
                        className="custom-select"
                        value={expectingPreference[item._id]?.selectedDifficulty || item.difficulty_level || "Beginner"}
                        onChange={(e) => {
                          handlePreferenceChange(item._id, "selectedDifficulty", e.target.value);
                          toggleSection(item._id, "difficultyLevel"); // Auto-close after selection
                        }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <span className="custom-select-arrow">▼</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 p-2 rounded text-center">
                  <button
                    type="button"
                    className="flex items-center text-sm text-gray-600 w-full focus:outline-none hover:text-green-600"
                    onClick={() => toggleSection(item._id, "questionType")}
                  >
                    <span>Type: </span>
                    <span className="ml-1 font-semibold">
                      {expectingPreference[item._id]?.selectedQuestionType || item.question_Type || "MCQ Question"}
                    </span>
                    <span
                      className={`ml-2 transform transition-transform duration-200 ${
                        expandedSections[item._id]?.questionType ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`slide-down ${
                      expandedSections[item._id]?.questionType ? "expanded" : "collapsed"
                    }`}
                  >
                    <div className="custom-select-wrapper mt-2">
                      <select
                        className="custom-select"
                        value={expectingPreference[item._id]?.selectedQuestionType || item.question_Type || "MCQ Question"}
                        onChange={(e) => {
                          handlePreferenceChange(item._id, "selectedQuestionType", e.target.value);
                          toggleSection(item._id, "questionType"); // Auto-close after selection
                        }}
                      >
                        <option value="MCQ Question">MCQ Question</option>
                        <option value="Open Ended">Open Ended</option>
                      </select>
                      <span className="custom-select-arrow">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{item.description || "No description available"}</p>
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
                      expandedSections[item._id]?.whatToExpect ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`slide-down ${
                    expandedSections[item._id]?.whatToExpect ? "expanded" : "collapsed"
                  }`}
                >
                  {Array.isArray(item.what_to_expect) && item.what_to_expect.length > 0 ? (
                    <div className="flex flex-wrap justify-between gap-4 mt-2">
                      {item.what_to_expect.map((expectation, idx) => (
                        <label key={idx} className="flex items-center space-x-2 w-[calc(50%-0.5rem)]">
                          <input
                            type="checkbox"
                            className="h-5 w-5 border-gray-300 rounded checked:bg-green-500 checked:text-white focus:ring-green-500"
                            checked={expectingPreference[item._id]?.selectedExpectation?.includes(expectation) || false}
                            onChange={() => handlePreferenceChange(item._id, "selectedExpectation", expectation)}
                          />
                          <span className="text-gray-700">{expectation}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 mt-2">No expectations listed</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p className="text-gray-600">No question bank details available.</p>
      )}
    </div>
  );
};

export default QuestionBankDetail;