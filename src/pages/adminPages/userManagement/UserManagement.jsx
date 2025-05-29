import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useAuth } from "../../../context/AuthProvider";

const UserManagement = () => {
  const { user } = useAuth(); // Destructure user from useAuth
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users and profiles
  const fetchData = async () => {
    try {
      // Fetch all users
      const userRes = await axios.get("http://localhost:5000/api/v1/users/getAlluser", {
        headers: {
          Authorization: `${user?.approvalToken}`,
        },
      });
      console.log("Raw users response:", userRes.data); // Log raw user API response

      // Fetch all profiles
      let profileRes;
      try {
        profileRes = await axios.get("http://localhost:5000/api/v1/users/all-profiles", {
        });
        console.log("Raw profiles response:", profileRes.data); // Log raw profiles API response
      } catch (err) {
        console.error("Error fetching profiles:", err.response || err.message);
        profileRes = { data: { data: [] } }; // Fallback to empty profiles
      }

      // Filter users who are not deleted
      const filteredUsers = (userRes.data?.data || []).filter(
        (user) => user.isDeleted === false
      );
      console.log("Filtered users (non-deleted):", filteredUsers);

      // Create a map of profiles by user_id for efficient lookup
      const profileMap = new Map(
        (profileRes.data?.data || []).map((profile) => {
          console.log("Profile entry:", profile); // Log each profile
          return [profile.user_id, profile]; // Match profile.user_id to user._id
        })
      );
      console.log("Profile map:", Array.from(profileMap.entries()));

      // Merge users with their profiles
      const usersWithProfiles = filteredUsers.map((user) => {
        const matchedProfile = profileMap.get(user._id);
        if (!matchedProfile) {
          console.warn(`No profile found for user _id: ${user._id}`);
        }
        return {
          ...user,
          profile: matchedProfile || null,
        };
      });
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
            You can view their details, assign roles, and modify access levels as needed.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="btn border-none rounded-lg bg-[#37B874] text-white text-sm md:text-md lg:text-lg font-medium w-36 md:w-28 lg:w-42 h-10 md:h-10 lg:h-12 mt-6 lg:mt-0 md:mt-2"
          >
            Add User +
          </Link>
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
                className="w-full mx-auto bg-white rounded-2xl shadow-sm p-4 grid grid-cols-8 justify-between items-start md:items-center gap-4"
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
                    <h2 className="font-semibold text-gray-800 text-base md:text-lg">
                      {user.name}
                    </h2>
                  </div>
                </div>

                <div className="col-span-5 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 md:ml-6">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-700 break-words">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-sm font-medium text-gray-700">
                      {user.profile?.currentPlan || (
                        <span title="Profile not found in database">No Profile</span>
                      )}
                    </p>
                  </div>
                  <div className="flex justify-items-end items-center">
                    <div className="flex items-end border rounded-full px-4 py-1 text-sm text-green-600 border-green-600 cursor-pointer w-fit">
                      {user.isLoggedIn ? "Active" : "Inactive"}
                      <ChevronDown className="w-12 h-4 ml-2" />
                    </div>
                  </div>
                </div>

                <div className="col-span-1 flex gap-3 w-full md:w-auto justify-end md:justify-start">
                  <button className="bg-[#37B874] text-white rounded-md px-4 py-1 text-sm font-medium">
                    Edit
                  </button>
                  <MoreVertical className="cursor-pointer text-gray-500" />
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