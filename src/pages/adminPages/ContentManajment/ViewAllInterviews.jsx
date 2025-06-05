import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

const ViewAllInterviews = () => {
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [interviewToDelete, setInterviewToDelete] = useState(null); // Track interview to delete

  // Fetch all interviews
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await request({
        endpoint: "/interview/get_mock_interview",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${AuthorizationToken}`,
        },
      });
      if (res.ok) {
        const allInterviews = res.data?.body?.all_InterView || [];
        setInterviews(allInterviews);
        setError(null);
      } else {
        throw new Error(res.message || "Failed to fetch interviews");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch interviews");
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (AuthorizationToken) {
      fetchInterviews();
    } else {
      setError("No authorization token available");
      setLoading(false);
    }
  }, [AuthorizationToken]);

  // Handle delete interview
  const handleDeleteInterview = async (interviewId) => {
    if (!AuthorizationToken) {
      toast.error("You must be logged in to delete an interview.");
      return;
    }

    // Show the modal and set the interview ID to delete
    setInterviewToDelete(interviewId);
    setShowModal(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      const res = await request({
        endpoint: `/interview/delete_mock_interview?interview_id=${interviewToDelete}`,
        method: "DELETE",
        headers: {
          Authorization: `${AuthorizationToken}`,
        },
      });

      if (res.ok) {
        toast.success("Interview deleted successfully!");
        fetchInterviews(); // Re-fetch interviews to update UI
      } else {
        throw new Error(res.message || "Failed to delete interview");
      }
    } catch (err) {
      toast.error("Error deleting interview.", {
        description: err.message || "Something went wrong.",
      });
      console.error("Delete interview error:", err);
    } finally {
      setShowModal(false); // Close the modal
      setInterviewToDelete(null); // Clear the interview ID
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowModal(false);
    setInterviewToDelete(null);
  };

  // Reusable Interview Card Component
  const InterviewCard = ({ interview }) => (
    <div className="bg-white mb-5">
      <div className="p-4 rounded-lg shadow border-1 border-gray-100 hover:shadow-lg hover:border-1 hover:border-[#37B874] transition block md:flex lg:flex items-center justify-between">
        <div className="flex flex-row items-center gap-6 mb-6 md:mb-0 lg:mb-0">
          {interview.img ? (
            <img
              src={interview.img}
              alt={interview.interview_name}
              className="h-[68px] w-[64px] object-cover rounded-lg"
              onError={(e) => (e.target.style.display = "none")} // Hide on error
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
            <h2>Interview</h2>
            <p className="text-sm text-[#AFAFAF]">
              {interview.total_Positions || "N/A"} Job Positions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-white">
          <button
            className="flex justify-center items-center gap-1 h-[40px] w-[130px] bg-[#Ef4444] rounded-md cursor-pointer hover:shadow-lg"
            onClick={() => handleDeleteInterview(interview._id)}
          >
            <RiDeleteBin5Fill />
            <h6>Delete</h6>
          </button>

          <button
            className="flex justify-center items-center gap-1 h-[40px] w-[130px] bg-[#3A4C67] rounded-md cursor-pointer hover:shadow-lg"
            onClick={() => navigate(`view_Interview_To_Edit/${interview._id}`)}
          >
            <FaPen />
            <h6>Edit</h6>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-black w-full px-6 mt-12">
      <h1 className="text-2xl font-bold mb-4">All Interviews</h1>

      {loading && <p>Loading interviews...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="w-full">
          {interviews.length === 0 ? (
            <p>No interviews available.</p>
          ) : (
            <div className="w-full h-[88px]">
              {interviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom Modal for Delete Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] md:w-full lg:w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this interview? This action cannot be undone.</p>
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

export default ViewAllInterviews;