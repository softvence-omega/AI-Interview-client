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
  YAxis,
} from "recharts";
import { useAuth } from "../../../context/AuthProvider";
import { Link } from "react-router-dom";
import RecentTransactions from "./RecentTransactions";

// const baseUrl = "http://localhost:5000/api/v1"; // Replace with your base URL
// const userEndpoint = "/users/getAlluser";

const Dashboard = () => {
  const user = useAuth();
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // console.log("All users", res?.data?.data?.length);
      setUsers(res.data || []);
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
      // console.log("All interviews:", res?.data);
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
      // console.log("All Payments:", res.data);
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

  // useEffect(() => {
  //   if (!loading) {
  //     console.log("All users ::::", users);
  //     console.log("Interview ::::", interviews);
  //     console.log("payments ::: ", payments);
  //   }
  // }, [users, userProfile, interviews, payments, loading]);

  const recentActiveUsers = users?.data?.filter((user) => {
    if (!user || typeof user !== "object") return false;

    const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return user.isDeleted === false && updatedAt && updatedAt >= sevenDaysAgo;
  });

  // calculate user increase in monthly
  const calculateUserGrowth = () => {
    // Get today's date
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30); // 30 days ago

    // Filter users created in the last 30 days
    const totalUsers = users?.data?.length || 0;

    // Get users created more than 30 days ago
    const users30DaysAgo = users?.data?.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt <= thirtyDaysAgo;
    });

    const totalUsers30DaysAgo = users30DaysAgo?.length || 0;

    // Calculate the percentage change in total users
    const percentageChange = totalUsers30DaysAgo
      ? ((totalUsers - totalUsers30DaysAgo) / totalUsers30DaysAgo) * 100
      : 0;

    return { totalUsers, totalUsers30DaysAgo, percentageChange };
  };

  // calculate active user increase in last 7 days
  const calculateActiveUserGrowth = () => {
    // Get today's date and calculate the start and end dates for the last 7 days and the previous 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Filter active users for the last 7 days
    const activeUsersLast7Days = users?.data?.filter((user) => {
      const updatedAt = new Date(user.updatedAt);
      return (
        updatedAt >= sevenDaysAgo &&
        updatedAt <= today &&
        user.isDeleted === false
      );
    });

    // Filter active users for the previous 7 days (7 to 14 days ago)
    const activeUsersPrevious7Days = users?.data?.filter((user) => {
      const updatedAt = new Date(user.updatedAt);
      return (
        updatedAt >= fourteenDaysAgo &&
        updatedAt < sevenDaysAgo &&
        user.isDeleted === false
      );
    });

    const activeUsersLast7DaysCount = activeUsersLast7Days?.length || 0;
    const activeUsersPrevious7DaysCount = activeUsersPrevious7Days?.length || 0;

    // Calculate the percentage change in active users
    const activeUserPercentageChange = activeUsersPrevious7DaysCount
      ? ((activeUsersLast7DaysCount - activeUsersPrevious7DaysCount) /
          activeUsersPrevious7DaysCount) *
        100
      : 0;

    return {
      activeUsersLast7DaysCount,
      activeUsersPrevious7DaysCount,
      activeUserPercentageChange,
    };
  };

  // Calculate interview growth in the last 30 days
  const calculateInterviewGrowth = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const interviewsLast30Days = interviews?.filter((interview) => {
      const createdAt = new Date(interview.createdAt);
      return createdAt >= thirtyDaysAgo;
    });

    const interviewsPrevious30Days = interviews?.filter((interview) => {
      const createdAt = new Date(interview.createdAt);
      return createdAt < thirtyDaysAgo;
    });

    const interviewsLast30DaysCount = interviewsLast30Days?.length || 0;
    const interviewsPrevious30DaysCount = interviewsPrevious30Days?.length || 0;

    const interviewPercentageChange = interviewsPrevious30DaysCount
      ? ((interviewsLast30DaysCount - interviewsPrevious30DaysCount) /
          interviewsPrevious30DaysCount) *
        100
      : 0;

    return {
      interviewsLast30DaysCount,
      interviewsPrevious30DaysCount,
      interviewPercentageChange,
    };
  };

  // Calculate payment revenue growth in the last 30 days
  const calculatePaymentRevenueGrowth = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Define a map for planId to price
    const planPriceMap = {
      price_1RQh51AeQO2CXKLXBTbmxa3M: 19.99, // Price for this planId
      price_1RQh5lAeQO2CXKLX0brJrWGJ: 4.99, // Price for this planId
      // Add more planIds and their corresponding prices if needed
    };

    // Ensure payments.data exists and is an array
    const paymentsData = payments?.data || [];
    if (!Array.isArray(paymentsData)) {
      return {
        revenueLast30Days: 0,
        revenuePrevious30Days: 0,
        paymentRevenuePercentageChange: 0,
      };
    }

    // Filter payments made in the last 30 days
    const paymentsLast30Days = paymentsData.filter((payment) => {
      const createdAt = new Date(payment.createdAt);
      return createdAt >= thirtyDaysAgo;
    });

    // Filter payments made in the previous 30 days
    const paymentsPrevious30Days = paymentsData.filter((payment) => {
      const createdAt = new Date(payment.createdAt);
      return createdAt < thirtyDaysAgo;
    });

    // Calculate total revenue for the last 30 days
    const revenueLast30Days = paymentsLast30Days.reduce((acc, payment) => {
      const price = planPriceMap[payment.planId] || 0; // Use the planId to get the price, default to 0 if no match
      return acc + price;
    }, 0);

    // Calculate total revenue for the previous 30 days
    const revenuePrevious30Days = paymentsPrevious30Days.reduce(
      (acc, payment) => {
        const price = planPriceMap[payment.planId] || 0; // Use the planId to get the price, default to 0 if no match
        return acc + price;
      },
      0
    );

    // Calculate the percentage change in payment revenue
    const paymentRevenuePercentageChange = revenuePrevious30Days
      ? ((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days) *
        100
      : 0;

    return {
      revenueLast30Days,
      revenuePrevious30Days,
      paymentRevenuePercentageChange,
    };
  };

  const { percentageChange } = calculateUserGrowth();
  const { activeUsersLast7DaysCount } = calculateActiveUserGrowth();
  const { interviewsLast30DaysCount } = calculateInterviewGrowth();
  const { revenueLast30Days } = calculatePaymentRevenueGrowth();

  // Helper function to get month name from date
  const getMonthName = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[date.getMonth()];
  };

  const getUserGrowthData = () => {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const userGrowthByMonth = {};

    users?.data?.forEach((user) => {
      if (user.createdAt) {
        const createdAt = new Date(user.createdAt);
        const month = createdAt.getMonth(); // 0-based index
        userGrowthByMonth[month] = (userGrowthByMonth[month] || 0) + 1;
      }
    });

    // Map all months with 0 fallback
    return allMonths.map((month, index) => ({
      month,
      users: userGrowthByMonth[index] || 0,
    }));
  };

  // Function to group payments by month for revenue trends chart
  const getRevenueTrendsData = () => {
    const revenueData = [];

    const planPriceMap = {
      price_1RQh51AeQO2CXKLXBTbmxa3M: 19.99,
      price_1RQh5lAeQO2CXKLX0brJrWGJ: 4.99,
    };

    payments?.data?.forEach((payment) => {
      const createdAt = new Date(payment.createdAt);
      const monthName = getMonthName(createdAt);

      const price = planPriceMap[payment.planId] || 0;

      if (revenueData[monthName]) {
        revenueData[monthName] += price;
      } else {
        revenueData[monthName] = price;
      }
    });

    // Ensure all months are included, even if no revenue exists in a month
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return allMonths.map((month) => ({
      month,
      revenue: revenueData[month] || 0,
    }));
  };

  const userGrowthData = getUserGrowthData();
  const revenueTrendsData = getRevenueTrendsData();

  return (
    <div className="md:p-6 lg:p-6 text-gray-800">
      <div className="flex justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-6">Admin Dashboard</h1>

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
            <p className="text-green-500 text-sm mt-1 text-right">
              +{percentageChange.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Active Users</p>
            <h2 className="text-2xl font-bold">{recentActiveUsers?.length}</h2>
            <p className="text-green-500 text-sm mt-1 text-right">
              +{activeUsersLast7DaysCount.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Interviews</p>
            <h2 className="text-2xl font-bold">{interviews?.length}</h2>
            <p className="text-green-500 text-sm mt-1 text-right">
              +{interviewsLast30DaysCount.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Revenue</p>
            <h2 className="text-2xl font-bold">${payments.totalRevenue}</h2>
            <p className="text-green-500 text-sm mt-1 text-right">
              +{revenueLast30Days.toFixed(2)}%
            </p>
          </div>
        </div>
        {/* <div className="col-span-3 grid grid-cols-1 md:grid-cols-1 gap-6">
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
        </div> */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-4 text-[#676768]">User Growth Chart</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userGrowthData}>
                <XAxis
                  dataKey="month"
                  interval={0}
                  padding={{ left: 20, right: 20 }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14 }}
                />
                <YAxis
                  domain={[0]}
                  tickFormatter={(tick) => `${tick}%`}
                  tick={{ fontSize: 14 }}
                  axisLine={false}
                  tickLine={false}
                />
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
            <h3 className="font-semibold mb-4 text-[#676768]">Revenue Trends Chart</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueTrendsData} barCategoryGap={40} barGap={5}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14 }}
                />
                <YAxis
                  domain={[25, 100]}
                  tickFormatter={(tick) => `${tick}%`}
                  tick={{ fontSize: 14 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Payment transactions history */}
        
      </div>
      <div className="">
          <RecentTransactions user={user} />
        </div>
    </div>
  );
};

export default Dashboard;
