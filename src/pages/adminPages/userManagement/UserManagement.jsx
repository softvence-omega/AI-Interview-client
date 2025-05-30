import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import { useAuth } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const menuRefs = useRef({}); // Store refs for each user's dropdown
  const navigate = useNavigate();

  const handleUserAction = async (userId, field, value) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/users/update-user/${userId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `${user?.approvalToken}`,
          },
        }
      );
      alert(
        `${
          field === "isDeleted"
            ? "User deleted"
            : value
            ? "User suspended"
            : "User activated"
        } successfully`
      );
      fetchData(); // Refresh data
      setOpenMenuUserId(null); // Close dropdown
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check all menu refs to see if the click was outside any dropdown
      let clickedOutside = true;
      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setOpenMenuUserId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/userDashboard/user-details/${userId}`);
  };

  const fetchData = async () => {
    try {
      const userRes = await axios.get(
        "http://localhost:5000/api/v1/users/getAlluser",
        {
          headers: {
            Authorization: `${user?.approvalToken}`,
          },
        }
      );
      console.log("Raw users response:", userRes.data);

      let profileRes;
      try {
        profileRes = await axios.get(
          "http://localhost:5000/api/v1/users/all-profiles",
          {}
        );
        console.log("Raw profiles response:", profileRes.data);
      } catch (err) {
        console.error("Error fetching profiles:", err.response || err.message);
        profileRes = { data: { data: [] } };
      }

      const filteredUsers = (userRes.data?.data || []).filter(
        (user) => user.isDeleted === false && user.role === "user"
      );
      console.log("Filtered users (non-deleted):", filteredUsers);

      const profileMap = new Map(
        (profileRes.data?.data || []).map((profile) => [
          profile.user_id,
          profile,
        ])
      );
      console.log("Profile map:", Array.from(profileMap.entries()));

      const usersWithProfiles = filteredUsers.map((user) => ({
        ...user,
        profile: profileMap.get(user._id) || null,
      }));
      console.log("Merged users with profiles:", usersWithProfiles);

      setUsers(usersWithProfiles);
    } catch (err) {
      console.error("Error fetching data:", err.response || err.message);
      setError("Failed to fetch users or profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.approvalToken) {
      console.log("Auth user:", user);
      fetchData();
    } else {
      console.warn("No approvalToken found in user object");
      setError("Authentication token missing.");
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="text-black lg:p-6 md:p-6">
      <div className="md:flex lg:flex justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-6">
            User Management
          </h1>
          <p className="lg:w-[62%] text-[#676768] text-[15px] md:text-[17px] lg:text-[18px] font-normal">
            This section allows you to manage all user accounts on the platform.
            You can view their details, assign roles, and modify access levels
            as needed.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="w-full mx-auto bg-white rounded-2xl shadow-sm p-4 flex flex-col md:grid md:grid-cols-6 md:justify-between md:items-center gap-4 lg:grid lg:grid-cols-8 lg:justify-between lg:items-center cursor-pointer transition hover:shadow-md"
              >
                <div className="col-span-2 flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={
                      user.profile?.img ||
                      `https://img.freepik.com/free-photo/horizontal-portrait-smiling-happy-young-pleasant-looking-female-wears-denim-shirt-stylish-glasses-with-straight-blonde-hair-expresses-positiveness-poses_176420-13176.jpg`
                    }
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    <div className="space-y-1 flex items-center gap-2">
                      <h2 className="font-semibold text-gray-800 text-base md:text-lg">
                        {user.name}
                      </h2>
                      {user.isBlocked && (
                        <span className="text-red-500 text-xs font-semibold border border-red-400 rounded px-2 py-0.5">
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-5 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 md:ml-6">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-700 break-words">
                      {user.email}
                    </p>
                  </div>
                  <div className="md:text-center lg:text-center">
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-sm font-medium text-gray-700">
                      {user.profile?.currentPlan || (
                        <span title="Profile not found in database">
                          No Profile
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex justify-items-end items-center">
                    <div
                      className={`flex items-end border rounded-full px-4 py-1 text-sm font-medium w-fit ${
                        user.isLoggedIn
                          ? "text-[#37B874] border-[#37B874]"
                          : "text-red-500 border-red-500"
                      }`}
                    >
                      {user.isLoggedIn ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>

                <div className="col-span-1 flex gap-3 w-full md:w-auto justify-end md:justify-start">
                  <button className="bg-[#37B874] text-white rounded-md px-4 py-1 text-sm font-medium cursor-pointer">
                    Edit
                  </button>
                  <div
                    className="relative"
                    ref={(el) => (menuRefs.current[user._id] = el)} // Assign ref for this user's dropdown
                  >
                    <MoreVertical
                      className="cursor-pointer text-gray-500"
                      onClick={(e) =>{
                        e.stopPropagation();
                        setOpenMenuUserId(
                          openMenuUserId === user._id ? null : user._id
                        )
                      }
                      }
                    />
                    {openMenuUserId === user._id && (
                      <div className="absolute right-0 z-20 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() =>
                            handleUserAction(user._id, "isDeleted", true)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete User
                        </button>
                        {user.isBlocked ? (
                          <button
                            onClick={() =>
                              handleUserAction(user._id, "isBlocked", false)
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                          >
                            Activate User
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUserAction(user._id, "isBlocked", true)
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                          >
                            Suspend User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
