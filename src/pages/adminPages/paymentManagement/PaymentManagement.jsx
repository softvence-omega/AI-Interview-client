import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import RecentTransactions from "../dashboard/RecentTransactions";
import { Check } from "lucide-react";

const PLAN_DETAILS = {
  price_1RQh51AeQO2CXKLXBTbmxa3M: {
    amount: 19.99,
    name: "Premium Subscription",
  },
  price_1RQh5lAeQO2CXKLX0brJrWGJ: {
    amount: 4.99,
    name: "Pay-Per Interview",
  },
};

const PaymentManagement = () => {
  const user = useAuth();
  const [payments, setPayments] = useState([]);
  const [premiumCount, setPremiumCount] = useState(0);
  const [payPerCount, setPayPerCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  console.log(payments);

  const fetchPaymentsData = async () => {
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

      const paymentData = res.data?.data || [];
      setPayments(paymentData);

      let premium = 0;
      let payPer = 0;
      let revenue = 0;
      let currentMonthRevenue = 0;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      paymentData.forEach((payment) => {
        const plan = PLAN_DETAILS[payment.planId];
        if (!plan) return;

        const paymentDate = new Date(payment.createdAt);
        const isCurrentMonth =
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear;

        revenue += plan.amount;
        if (isCurrentMonth) currentMonthRevenue += plan.amount;

        if (payment.planId === "price_1RQh51AeQO2CXKLXBTbmxa3M") premium++;
        else if (payment.planId === "price_1RQh5lAeQO2CXKLX0brJrWGJ") payPer++;
      });

      setPremiumCount(premium);
      setPayPerCount(payPer);
      setTotalRevenue(revenue);
      setMonthlyRevenue(currentMonthRevenue);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPaymentsData();
  }, []);

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

  const revenueTrendsData = getRevenueTrendsData();

  return (
    <div className="text-black md:p-6 lg:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border-1 border-[#E0E0E1] rounded-md">
          <h3 className="text-[#676768] text-[16px] font-normal leading-[150%]">
            Total Revenue
          </h3>
          <p className="text-[#3A4C67] text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-[120%] mt-3">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 border-1 border-[#E0E0E1] rounded-md">
          <h3 className="text-[#676768] text-[16px] font-normal leading-[150%]">
            This Month
          </h3>
          <p className="text-[#3A4C67] text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-[120%] mt-3">
            ${monthlyRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 border-1 border-[#E0E0E1] rounded-md">
          <h3 className="text-[#676768] text-[16px] font-normal leading-[150%]">
            Premium Subscription
          </h3>
          <p className="text-[#3A4C67] text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-[120%] mt-3">
            {premiumCount}
          </p>
        </div>
        <div className="bg-white p-4 border-1 border-[#E0E0E1] rounded-md">
          <h3 className="text-[#676768] text-[16px] font-normal leading-[150%]">
            Pay-Per Interview
          </h3>
          <p className="text-[#3A4C67] text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-[120%] mt-3">
            {payPerCount}
          </p>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white p-4 rounded-xl shadow mt-12 md:w-[80%] lg:w-[80%] mx-auto">
        <h3 className="font-semibold mb-4 text-[#676768]">
          Revenue Trends Chart
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueTrendsData} barCategoryGap={45} barGap={5}>
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

      {/* Payment transaction history */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 md:gap-4 lg:gap-4 mt-6">
        <div className="col-span-3">
        <RecentTransactions user={user} />
        </div>
        <div className="col-span-1 bg-white p-4 rounded-xl shadow-md w-full h-48 mt-6">
          <h2 className="text-[16px] font-semibold text-[#212121] mb-2">
            Payment Methods
          </h2>

          <div className="flex items-center justify-between border border-[#EBEBEB] rounded-lg px-4 py-2 mb-4">
            <span className="text-lg font-bold text-indigo-600">stripe</span>
            <Check className="bg-[#37B874] font-bold text-white w-5 h-5 rounded-md" />
          </div>

          <button className="w-[82%] mx-auto flex items-center justify-center gap-2 bg-[#37B874] hover:bg-[#37B874] text-white text-sm font-normal px-2 md:px-0 lg:px-0 py-2 rounded-lg transition mt-6">
            Add Payment Methods
            <span className="text-xl leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
