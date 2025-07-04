import React, { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import humanAvatar from "../../../assets/imgs/gray-human-icon-profile-placeholder-vector-35850819.jpg";

const NotificationViewer = () => {
  const { user } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch notifications from the API
  const fetchNotifications = async (type = "") => {
    if (!user?.approvalToken) {
      toast.error("You must be logged in to view notifications.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = type
        ? `/notifications/getAllNotificationForAdmin?notificationType=${type}`
        : "/notifications/getAllNotificationForAdmin";

      const response = await request({
        endpoint: url,
        method: "GET",
        headers: {
          Authorization: user.approvalToken,
        },
      });

      if (response.ok) {
        setNotifications(response.data.data); // Preserved as per instruction
        console.log("yoo", response.data.data);
      } else {
        setError(response.message || "Failed to fetch notifications.");
        toast.error(response.message || "Failed to fetch notifications.", {
          description: response.data?.error || "Please try again.",
        });
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError("Error fetching notifications.");
      toast.error("Error fetching notifications.", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount and when selectedType changes
  useEffect(() => {
    fetchNotifications(selectedType);
  }, [selectedType]);

  // Handle notification type filter change
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1); // Reset page when filter changes
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="w-full max-w-[1444px] mx-auto mt-6 mb-10 px-0 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-3xl font-bold mb-6 text-center text-[#37B874]">
        Notification Viewer
      </h2>
      <div className="p-4 sm:p-6 rounded-lg shadow-md bg-white">
        {/* Filter Dropdown */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
          <label
            htmlFor="notificationType"
            className="block text-gray-700 font-medium"
          >
            Filter by Type:
          </label>
          <select
            id="notificationType"
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-[#37B874]"
          >
            <option value="">All (except admin_notification)</option>
            <option value="interview_Progress">Interview Progress</option>
            <option value="latest_job">Latest Job</option>
            <option value="upgrade_plan">Upgrade Plan</option>
            <option value="admin_notification">Admin Notification</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center">
            <LoaderCircle className="animate-spin w-6 h-6 text-[#37B874]" />
          </div>
        )}
        {error && (
          <p className="text-sm mt-1 italic text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Notifications List */}
        {!loading && !error && notifications.length === 0 && (
          <p className="text-center text-gray-500">No notifications found.</p>
        )}
        {!loading && !error && notifications.length > 0 && (
          <>
            <div className="space-y-4">
              {currentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="border border-gray-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:space-x-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={notification.Profile_id?.img || humanAvatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover mb-2 sm:mb-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <div className="flex-2">
                        <span className="font-medium text-gray-700">
                          Notification ID:
                        </span>{" "}
                        <span className="break-all text-green-400">
                          #{notification._id}
                        </span>
                      </div>
                      <div className="flex-1 sm:text-right text-green-400">
                        <span className="font-medium text-gray-700">Type:</span>{" "}
                        {notification.notificationType}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <div className="flex-1 text-green-400">
                        <span className="font-medium text-gray-700">Date:</span>{" "}
                        {formatDate(notification.createdAt)}
                      </div>
                      <div className="flex-1 sm:text-right text-green-400">
                        <span className="font-medium text-gray-700">User:</span>{" "}
                        {notification.Profile_id?.name || "Unknown"}
                      </div>
                    </div>
                    <p className="text-gray-600 break-words">
                      {notification.notificationDetail}
                    </p>
                  </div>
                  <span
                    className={`${
                      notification.isSeen ? "bg-gray-300" : "bg-[#37B874]"
                    } text-white rounded-full w-6 h-6 flex items-center justify-center mt-2 sm:mt-0 sm:ml-4 flex-shrink-0`}
                  >
                    {notification.isSeen ? "S" : "U"}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-1 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-200 text-black rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>

              {totalPages > 5 && currentPage > 2 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-2 rounded ${
                      currentPage === 1
                        ? "bg-[#37B874] text-white"
                        : "bg-gray-500"
                    }`}
                  >
                    1
                  </button>
                  {currentPage > 3 && (
                    <span className="px-2 py-2 text-gray-500 cursor-pointer">...</span>
                  )}
                </>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 2 ||
                    page === totalPages - 1 ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded cursor-pointer ${
                      currentPage === page
                        ? "bg-[#37B874] text-white"
                        : "bg-gray-500"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              {totalPages > 5 && currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="px-2 py-2 text-gray-500 cursor-pointer">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-2 rounded cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-[#37B874] text-white"
                        : "bg-gray-500"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-200 text-black rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationViewer;
