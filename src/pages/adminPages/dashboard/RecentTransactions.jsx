import React, { useEffect, useState } from "react";
import axios from "axios";

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

const RecentTransactions = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/api/v1/payment/getAllPayments", {
            headers: {
              Authorization: `${user?.user?.approvalToken}`,
            },
          }),
          axios.get("http://localhost:5000/api/v1/users/getAlluser", {
            headers: {
              Authorization: `${user?.user?.approvalToken}`,
            },
          }),
        ]);

        setPayments(paymentRes.data || []);
        setUsers(userRes.data?.data || []); // Assuming users are in `data.data`
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user]);

  // Create a user lookup map
  const userMap = users.reduce((map, u) => {
    map[u._id] = u.name || `${u.firstName} ${u.lastName}` || "Unknown";
    return map;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-[16px text-[Transactions] font-semibold mb-4 leading-[130%]">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="min-w-full text-left text-[#878788]">
          <thead className="text-[14px]">
            <tr>
              <th scope="col" className="px-4 py-3">
                Transaction ID
              </th>
              <th scope="col" className="px-4 py-3">
                User Name
              </th>
              <th scope="col" className="px-4 py-3">
                Payment Amount
              </th>
              <th scope="col" className="px-4 py-3">
                Transaction Type
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {payments?.data?.map((payment, idx) => {
              const plan = PLAN_DETAILS[payment.planId] || {
                amount: 0,
                name: "Unknown Plan",
              };

              const userName = userMap[payment.userId] || "Unknown User";

              return (
                <tr
                  key={idx}
                  className="text-[#212121] text-[14px] leading-[150%]"
                >
                  <td className="px-4 py-3">
                    {payment?.subscriptionId || "N/A"}
                  </td>
                  <td className="px-4 py-3">{userName || "Unknown"}</td>
                  <td className="px-4 py-3">${plan.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">{plan.name}</td>
                  <td className="px-4 py-3">
                    {new Date(payment.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              );
            })}
            {payments?.data?.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-4 py-4 text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
