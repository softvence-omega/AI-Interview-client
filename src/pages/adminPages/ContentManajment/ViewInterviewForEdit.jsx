import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

const ViewInterviewForEdit = () => {
  const { interview_id } = useParams();
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [questionBankToDelete, setQuestionBankToDelete] = useState(null); // Track question bank to delete

  // Fetch interview data
  const fetchInterview = async () => {
    if (!AuthorizationToken) {
      setError("No authorization token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await request({
        endpoint: `/interview/get_mock_interview?_id=${interview_id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`,
        },
      });
      if (res.ok) {
        const interviewData = res.data?.body?.[0];
        if (interviewData) {
          setInterview(interviewData);
          setError(null);
        } else {
          throw new Error("Interview not found");
        }
      } else {
        throw new Error(res.message || "Failed to fetch interview");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch interview");
      console.error("Error fetching interview:", err);
      toast.error("Error fetching interview.", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interview_id) {
      fetchInterview();
    } else {
      setError("Invalid interview ID");
      setLoading(false);
    }
  }, [interview_id, AuthorizationToken]);

  // Handle delete question bank
  const handleQuestionBankDelete = (questionBankId) => {
    if (!AuthorizationToken) {
      toast.error("You must be logged in to delete a question bank.");
      return;
    }

    // Show the modal and set the question bank ID to delete
    setQuestionBankToDelete(questionBankId);
    setShowModal(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      const res = await request({
        endpoint: `/interview/delete_question_bank?questionBank_id=${questionBankToDelete}`,
        method: "DELETE",
        headers: {
          Authorization: `${AuthorizationToken}`,
        },
      });

      if (res.ok) {
        toast.success("Question bank deleted successfully!");
        fetchInterview(); // Re-fetch interview to update UI
      } else {
        throw new Error(res.message || "Failed to delete question bank");
      }
    } catch (err) {
      toast.error("Error deleting question bank.", {
        description: err.message || "Something went wrong.",
      });
      console.error("Delete question bank error:", err);
    } finally {
      setShowModal(false); // Close the modal
      setQuestionBankToDelete(null); // Clear the question bank ID
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowModal(false);
    setQuestionBankToDelete(null);
  };

  // Question Bank Card Component
  const QuestionBankCard = ({ questionBank }) => (
    <div className="bg-white mb-5 hover:shadow-md rounded-lg">
      <div className="p-4 rounded-lg shadow border-1 border-gray-300 hover:border-1 hover:border-[#37B874] transition block md:flex lg:flex items-center justify-between">
        <div className="flex items-center gap-6 mb-6 md:mb-0 lg:mb-0">
          {questionBank.img ? (
            <img
              src={questionBank.img}
              alt={questionBank.questionBank_name}
              className="h-[68px] w-[64px] object-cover rounded-lg"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="h-[68px] w-[64px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {questionBank.questionBank_name || "No name available"}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="flex justify-center items-center gap-1 h-[40px] w-[130px] bg-[#3A4C67] text-white rounded-md hover:bg-[#3A4C67] transition hover:shadow-md cursor-pointer"
            onClick={() => navigate(`editPosition/${questionBank._id}`)}
          >
            <FaPen />
            <h6>Edit</h6>
          </button>
          <button
            className="flex justify-center items-center gap-1 h-[40px] w-[130px] bg-[#Ef4444] text-white rounded-md hover:shadow-md cursor-pointer"
            onClick={() => handleQuestionBankDelete(questionBank._id)}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-black w-full px-6 py-6">
      {loading && <p>Loading interview...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && interview && (
        <div className="w-full">
          <div className="flex gap-2 items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              {interview.img ? (
                <img
                  src={interview.img}
                  alt={interview.interview_name}
                  className="h-[68px] w-[64px] object-cover rounded-lg"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="h-[68px] w-[64px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold">
                  {interview.interview_name || "No name available"}
                </h2>
                <p className="text-sm text-[#AFAFAF]">
                  {interview.total_Positions || "N/A"} Job Positions
                </p>
              </div>
            </div>

            <button
              className="flex justify-center items-center gap-1 h-[40px] w-[130px] bg-[#3A4C67] text-white rounded-md hover:bg-[#3A4D67] transition"
              onClick={() => navigate(`editInterview/${interview._id}`)}
            >
              <FaPen />
              <h6>Edit</h6>
            </button>
          </div>

          <p className="text-sm text-gray-600">
            {interview.description || "No description available"}
          </p>

          {/* Question Banks Section */}
          <h2 className="text-xl font-semibold mb-4">Question Banks</h2>
          {interview.question_bank_ids?.length > 0 ? (
            <div className="w-full">
              {interview.question_bank_ids.map((questionBank) => (
                <QuestionBankCard
                  key={questionBank._id}
                  questionBank={questionBank}
                />
              ))}
            </div>
          ) : (
            <p>No question banks available for this interview.</p>
          )}
        </div>
      )}

      {/* Custom Modal for Delete Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] md:w-full lg:w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this question bank? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#Ef4444] text-white rounded-md hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInterviewForEdit;