// Dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
} from "recharts";
import { useAuth } from "../../../context/AuthProvider";
import Buttons from "../../../reuseable/AllButtons";
import { Link } from "react-router-dom";

// const baseUrl = "http://localhost:5000/api/v1"; // Replace with your base URL
// const userEndpoint = "/users/getAlluser";

const Dashboard = () => {
  const user = useAuth();
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  //   console.log(user?.user?.approvalToken)

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/users/getAlluser`,
        {
          headers: {
            Authorization: `${user?.user?.approvalToken}`,
          },
        }
      );
      console.log("All users", res?.data?.data?.length);
      setUsers(res.data || []);

      console.log(res);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/users/getProfile`,
          {
            headers: {
              Authorization: user?.user?.approvalToken,
            },
          }
        );
        setUserProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/video/getAllInterviews`,
        {
          headers: {
            Authorization: `${user?.user.approvalToken}`,
          },
        }
      );
      console.log("All interviews:", res?.data);
      setInterviews(res.data || []);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/payment/getAllPayments`,
        {
          headers: {
            Authorization: `${user?.user?.approvalToken}`,
          },
        }
      );
      console.log("All Payments:", res.data);
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchInterviews();
    fetchPayments();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log("All users ::::", users);
      console.log("Interview ::::", interviews);
      console.log("payments ::: ", payments);
    }
  }, [users, userProfile, interviews, payments, loading]);

  console.log("INNNNN ::: ", interviews?.length);

  const recentActiveUsers = users?.data?.filter((user) => {
    if (!user || typeof user !== "object") return false;

    const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return user.isDeleted === false && updatedAt && updatedAt >= sevenDaysAgo;
  });

  console.log("Recent Active Users:", recentActiveUsers?.length);

  const mockLineData = [
    { month: "Jan", users: 3000 },
    { month: "Feb", users: 3500 },
    { month: "Mar", users: 5100 },
    { month: "Apr", users: 5200 },
    { month: "May", users: 6000 },
    { month: "Jun", users: 6700 },
  ];

  const mockBarData = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 4300 },
    { month: "Mar", revenue: 5100 },
    { month: "Apr", revenue: 4800 },
    { month: "May", revenue: 5600 },
    { month: "Jun", revenue: 4900 },
  ];

  return (
    <div className="p-6 text-gray-800">
      <div className="flex justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="flex items-center gap-3 my-6">
            {/* Avatar Stack */}
            <div className="flex -space-x-3">
              {users?.data?.slice(0, 4).map((user, index) => (
                <img
                  key={index}
                  src={
                    userProfile.img ||
                    "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
                  }
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow"
                />
              ))}
            </div>

            {/* User Name Text */}
            <span className="text-gray-700 text-sm font-medium">
              {users?.data
                ?.slice(0, 3)
                .map((user) => user?.name)
                .join(", ")}
              {users?.data?.length > 3 && ` +${users.data.length - 3} others`}
            </span>
          </div>
        </div>
        <div>
          <Link
            to="/"
            className="btn border-none rounded-lg bg-[#37B874] text-white text-sm md:text-md lg:text-lg font-medium w-24 md:w-32 lg:w-42 h-12"
          >
            Add Interview
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 md:gap-6 lg:gap-6">
        <div className="col-span-1 grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 md:mb-0 lg:mb-0">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold">
              {loading ? "..." : users?.data?.length}
            </h2>
            <p className="text-green-500 text-sm mt-1">+5%</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Active Users</p>
            <h2 className="text-2xl font-bold">{recentActiveUsers?.length}</h2>
            <p className="text-green-500 text-sm mt-1">+5%</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Interviews</p>
            <h2 className="text-2xl font-bold">{interviews?.length}</h2>
            <p className="text-green-500 text-sm mt-1">+5%</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Revenue</p>
            <h2 className="text-2xl font-bold">${payments.totalRevenue}</h2>
            <p className="text-green-500 text-sm mt-1">+5%</p>
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-4">User Growth Chart</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockLineData}>
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  fill="#c7d2fe"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Revenue Trends Chart</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockBarData} barCategoryGap={40} barGap={5}>
                <XAxis dataKey="month" />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  activeBar={{ bg: "transparent" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
