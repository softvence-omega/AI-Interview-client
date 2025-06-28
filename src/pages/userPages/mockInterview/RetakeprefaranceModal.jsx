import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";

const RetakePreferenceModal = ({ isOpen, onClose, onStartInterview, questionBankId }) => {
    const { user } = useAuth();
    const AuthorizationToken = user?.approvalToken;
    const { request } = useApi();
  
    const [preferences, setPreferences] = useState({
      selectedExpectation: [],
      selectedDifficulty: "Beginner",
      selectedQuestionType: "MCQ Question",
    });
  
    const [expandedSections, setExpandedSections] = useState({
      whatToExpect: false,
      difficultyLevel: false,
      questionType: false,
    });
  
    const [questionBankTopicsModal, setQuestionBankTopicsModal] = useState([]);
    const [loadingTopicsModal, setLoadingTopicsModal] = useState(false);
    const [errorTopicsModal, setErrorTopicsModal] = useState(null);
  
    useEffect(() => {
      if (!isOpen) {
        // Reset states when modal closes
        setQuestionBankTopicsModal([]);
        setLoadingTopicsModal(false);
        setErrorTopicsModal(null);
        return;
      }
  
      let isCancelled = false;
  
      const fetchQuestionBankTopics = async () => {
        setLoadingTopicsModal(true);
  
        if (!AuthorizationToken || !questionBankId) {
          if (!isCancelled) {
            setErrorTopicsModal(
              AuthorizationToken
                ? "questionBank_id is required"
                : "No authorization token available"
            );
            setLoadingTopicsModal(false);
          }
          return;
        }
  
        try {
          const endpoint = `/interview/get_question_bank?questionBank_id=${questionBankId}`;
  
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
          const questionBank = Array.isArray(data)
            ? data.find((item) => item._id === questionBankId)
            : null;
  
          if (!isCancelled) {
            if (questionBank && Array.isArray(questionBank.what_to_expect)) {
              setQuestionBankTopicsModal(questionBank.what_to_expect);
            } else {
              setQuestionBankTopicsModal([]);
            }
            setErrorTopicsModal(null);
          }
        } catch (err) {
          if (!isCancelled) {
            setErrorTopicsModal(err.message || "Failed to fetch question bank topics");
            console.error("Error fetching question bank topics:", err);
          }
        } finally {
          if (!isCancelled) {
            setLoadingTopicsModal(false);
          }
        }
      };
  
      fetchQuestionBankTopics();
  
      return () => {
        isCancelled = true;
      };
    }, [isOpen, AuthorizationToken, questionBankId]);
  
    const handlePreferenceChange = (field, value) => {
      setPreferences((prev) => {
        if (field === "selectedExpectation") {
          const updatedExpectations = prev.selectedExpectation.includes(value)
            ? prev.selectedExpectation.filter((exp) => exp !== value)
            : [...prev.selectedExpectation, value];
          return { ...prev, selectedExpectation: updatedExpectations };
        }
        return { ...prev, [field]: value };
      });
    };
  
    const toggleSection = (section) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <style>
            {`
              .custom-select-wrapper {
                position: relative;
                width: 100%;
              }
              .custom-select {
                appearance: none;
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
  
          <h2 className="text-xl font-semibold mb-4">Customize Interview Preferences</h2>
  
          {/* What to Expect */}
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
              onClick={() => toggleSection("whatToExpect")}
            >
              What to Expect
              <span className={`ml-2 transform transition-transform ${expandedSections.whatToExpect ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <div className={`slide-down ${expandedSections.whatToExpect ? "expanded" : "collapsed"}`}>
              {loadingTopicsModal ? (
                <p className="text-gray-600 mt-2">Loading topics...</p>
              ) : errorTopicsModal ? (
                <p className="text-red-500 mt-2">Error: {errorTopicsModal}</p>
              ) : questionBankTopicsModal.length > 0 ? (
                <div className="flex flex-wrap gap-4 mt-2">
                  {questionBankTopicsModal.map((expectation, idx) => (
                    <label key={idx} className="flex items-center space-x-2 w-[calc(50%-0.5rem)]">
                      <input
                        type="checkbox"
                        className="h-5 w-5 border-gray-300 rounded focus:ring-green-500"
                        checked={preferences.selectedExpectation.includes(expectation)}
                        onChange={() => handlePreferenceChange("selectedExpectation", expectation)}
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
  
          {/* Difficulty Level */}
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
              onClick={() => toggleSection("difficultyLevel")}
            >
              Difficulty Level: {preferences.selectedDifficulty}
              <span className={`ml-2 transform transition-transform ${expandedSections.difficultyLevel ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <div className={`slide-down ${expandedSections.difficultyLevel ? "expanded" : "collapsed"}`}>
              <div className="custom-select-wrapper mt-2">
                <select
                  className="custom-select"
                  value={preferences.selectedDifficulty}
                  onChange={(e) => {
                    handlePreferenceChange("selectedDifficulty", e.target.value);
                    toggleSection("difficultyLevel");
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
  
          {/* Question Type */}
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center text-lg font-semibold mb-2 focus:outline-none hover:text-green-600"
              onClick={() => toggleSection("questionType")}
            >
              Question Type: {preferences.selectedQuestionType}
              <span className={`ml-2 transform transition-transform ${expandedSections.questionType ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <div className={`slide-down ${expandedSections.questionType ? "expanded" : "collapsed"}`}>
              <div className="custom-select-wrapper mt-2">
                <select
                  className="custom-select"
                  value={preferences.selectedQuestionType}
                  onChange={(e) => {
                    handlePreferenceChange("selectedQuestionType", e.target.value);
                    toggleSection("questionType");
                  }}
                >
                  <option value="MCQ Question">MCQ Question</option>
                  <option value="Open Ended">Open Ended</option>
                </select>
                <span className="custom-select-arrow">▼</span>
              </div>
            </div>
          </div>
  
          {/* Modal Actions */}
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() =>
                onStartInterview(
                  preferences.selectedExpectation,
                  preferences.selectedDifficulty,
                  preferences.selectedQuestionType
                )
              }
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default RetakePreferenceModal;