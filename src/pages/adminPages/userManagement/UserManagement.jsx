import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import { FaFilter } from "react-icons/fa6";
import { useAuth } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const menuRefs = useRef({});
  const filterRef = useRef(null); // Add ref for filter dropdown
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [plans, setPlans] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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
      fetchData();
      setOpenMenuUserId(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutsideMenus = true;
      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedOutsideMenus = false;
        }
      });

      // Check if click is outside filter dropdown
      const clickedOutsideFilter = filterRef.current && !filterRef.current.contains(event.target);

      // Close menus if click is outside all user action menus
      if (clickedOutsideMenus) {
        setOpenMenuUserId(null);
      }

      // Close filter dropdown if click is outside filter dropdown
      if (clickedOutsideFilter) {
        setShowFilters(false);
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
        (user) => user.isDeleted === false
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

      setPlans([...new Set(usersWithProfiles.map((u) => u.profile?.currentPlan || "No Profile"))]);
      setStatuses([...new Set(usersWithProfiles.map((u) => (u.isLoggedIn ? "Active" : "Inactive")))]);
      setRoles([...new Set(usersWithProfiles.map((u) => u.role))]);

      let filtered = usersWithProfiles;
      if (plan) {
        filtered = filtered.filter((u) => (u.profile?.currentPlan || "No Profile") === plan);
      }
      if (status) {
        filtered = filtered.filter((u) => (u.isLoggedIn ? "Active" : "Inactive") === status);
      }
      if (role) {
        filtered = filtered.filter((u) => u.role === role);
      }

      setUsers(usersWithProfiles);
      setFilteredUsers(filtered);
    } catch (err) {
      console.error("Error fetching data:", err.response || err.message);
      setError("Failed to fetch users or profiles.");
      setUsers([]);
      setFilteredUsers([]);
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
  }, [user, plan, status, role]);

  useEffect(() => {
    if (search) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      let filtered = users;
      if (plan) {
        filtered = filtered.filter((u) => (u.profile?.currentPlan || "No Profile") === plan);
      }
      if (status) {
        filtered = filtered.filter((u) => (u.isLoggedIn ? "Active" : "Inactive") === status);
      }
      if (role) {
        filtered = filtered.filter((u) => u.role === role);
      }
      setFilteredUsers(filtered);
    }
  }, [search, users, plan, status, role]);

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
        {/* Search Bar with Filter Button */}
        <div className="relative mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search for users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-[#E0E0E1] bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#37B874]"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg transition"
            >
              <FaFilter className="text-[#37B874]" />
              <span className="text-[#37B874]">Filter</span>
            </button>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div
              ref={filterRef} // Attach ref to filter dropdown
              className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-4 text-center">Filter</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#676768] mb-1">
                    Plan
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                  >
                    <option value="">All Plans</option>
                    {plans.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#676768] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#676768] mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                  >
                    <option value="">All Roles</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-items-center items-center text-center space-x-3">
            <div className="w-6 h-6 border-4 border-[#37B874] border-t-transparent rounded-full animate-spin text-center"></div>
            <p className="text-[#676768] text-lg text-center">Loading...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
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
                    ref={(el) => (menuRefs.current[user._id] = el)}
                  >
                    <MoreVertical
                      className="cursor-pointer text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuUserId(
                          openMenuUserId === user._id ? null : user._id
                        );
                      }}
                    />
                    {openMenuUserId === user._id && (
                      <div
                        className="absolute right-0 z-20 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
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