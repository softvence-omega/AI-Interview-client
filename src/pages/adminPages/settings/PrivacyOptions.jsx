import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast, ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";
import { useAuth } from "../../../context/AuthProvider";
import "./styles/PrivacyOptions.css";

const baseUrl = "http://localhost:5000/api/v1";

const flattenInterviewData = (data) => {
  return data.map((item) => ({
    // id: item._id,
    user_id: item.user_id,
    interview_id: item.interview_id,
    question_id: item.question_id,
    questionBank_id: item.questionBank_id,
    video_url: item.video_url,
    creation_date: item.createdAt,
    updated_date: item.updatedAt,
    // islast: item.islast,
    // isSummary: item.isSummary,
    articulation_score: item.assessment?.Articulation?.score || 0,
    articulation_feedback: item.assessment?.Articulation?.feedback || "",
    behavioral_score: item.assessment?.Behavioural_Cue?.score || 0,
    behavioral_feedback: item.assessment?.Behavioural_Cue?.feedback || "",
    problem_solving_score: item.assessment?.Problem_Solving?.score || 0,
    problem_solving_feedback: item.assessment?.Problem_Solving?.feedback || "",
    content_score: item.assessment?.Content_Score || 0,
    inprep_total_score: item.assessment?.Inprep_Score?.total_score || 0,
    overall_feedback:
      item.assessment?.what_can_i_do_better?.overall_feedback || "",
  }));
};

const PrivacyOptions = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("User Token:", user?.approvalToken);
      const config = {
        headers: {
          Authorization: `${user?.approvalToken}`,
        },
      };

      const [paymentsRes, usersRes, interviewsRes] = await Promise.all([
        axios.get(`${baseUrl}/payment/getAllPayments`, config).catch((err) => {
          toast.error("Failed to fetch payments: " + err.message);
          return { data: { data: [] } };
        }),
        axios.get(`${baseUrl}/users/getAlluser`, config).catch((err) => {
          toast.error("Failed to fetch users: " + err.message);
          return { data: { data: [] } };
        }),
        axios
          .get(`${baseUrl}/video/getAllInterviews?isSummary=true`, config)
          .catch((err) => {
            toast.error("Failed to fetch interviews: " + err.message);
            console.error(
              "Interviews API Error:",
              err.response?.data || err.message
            );
            return { data: { data: [] } };
          }),
      ]);

      console.log("Interviews API Response:", interviewsRes);
      console.log("Interviews Data:", interviewsRes.data);

      const flattenedInterviews = flattenInterviewData(
        interviewsRes.data || []
      );
      console.log("Flattened Interviews:", flattenedInterviews);

      setPayments(paymentsRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
      setInterviews(flattenedInterviews);

      if (!flattenedInterviews.length) {
        toast.warn(
          "No interview data available. Check API response or database."
        );
      }
    } catch (err) {
      toast.error("Unexpected error: " + err.message);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Uncomment to test with Postman data

  // useEffect(() => {
  //   const postmanData = [
  //     // Paste your Postman response JSON here
  //     {
  //       assessment: {
  //         Articulation: {
  //           feedback: "You maintained a neutral tone...",
  //           score: 20,
  //         },
  //         Behavioural_Cue: {
  //           feedback: "You've demonstrated a strong command...",
  //           score: 35.53999999999999,
  //         },
  //         Problem_Solving: {
  //           feedback: "The answer was not relevant...",
  //           score: 2,
  //         },
  //         Inprep_Score: { total_score: 28.200000000000003 },
  //         what_can_i_do_better: {
  //           overall_feedback: "You did an excellent job...",
  //         },
  //         Content_Score: 2,
  //       },
  //       _id: "68316258998619eed95f2b93",
  //       question_id: "68315eed998619eed95f2b40",
  //       interview_id: "68313e98998619eed95f27d4",
  //       questionBank_id: "68313f4f998619eed95f27d8",
  //       user_id: "6833f3f7767df9c3cbb5834c",
  //       islast: true,
  //       isSummary: true,
  //       video_url:
  //         "https://res.cloudinary.com/dbnf4vmma/video/upload/v1747907612/fvfkwa6cppb5lw3o4ixz.mp4",
  //       createdAt: "2025-05-08T06:08:24.479Z",
  //       updatedAt: "2025-05-24T06:08:24.479Z",
  //       __v: 0,
  //     },
  //     // ... other records ...
  //   ];
  //   setInterviews(flattenInterviewData(postmanData));
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const exportCSV = (data, filename) => {
    if (!data.length) {
      toast.warn(`No ${filename} data to export.`);
      return;
    }
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportPDF = (data, filename) => {
    if (!data.length) {
      toast.warn(`No ${filename} data to export.`);
      return;
    }
    const doc = new jsPDF();
    const columns = Object.keys(data[0]);
    const rows = data.map((row) =>
      columns.map((col) => String(row[col] || ""))
    );

    autoTable(doc, {
      head: [columns],
      body: rows,
    });

    doc.save(`${filename}.pdf`);
  };

  const renderTable = (data, dataType) => {
    if (!data.length) {
      return (
        <div className="text-center mt-4 text-gray-500">
          No {dataType} data available.
        </div>
      );
    }

    return (
      <div className="overflow-auto h-[480px] mt-4">
        <table className="min-w-full border-2 border-[#37B874]">
          <thead>
            <tr className="bg-[#37B874] text-white text-center">
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 border-r-2 border-[#37B874]">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t-2 border-[#37B874]">
                {Object.keys(data[0]).map((key, i) => (
                  <td key={i} className="px-4 py-2 border-r-2 border-[#37B874]">
                    {typeof row[key] === "object" && row[key] !== null
                      ? JSON.stringify(row[key])
                      : String(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-center mb-4">
        Privacy & Data Export
      </h1>
      <p className="text-[#3A4C67] text-[12px] mt-4">
        <span className="text-[#878788]">Settings</span> / Privacy & Data Export
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 justify-between gap-4 my-8">
        <div className="flex flex-col justify-items-center items-center bg-blue-400 text-white py-4 rounded-md">
          <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold">Total Users</h2>
          <p className="text-3xl font-semibold">{users?.length}</p>
        </div>
        <div className="flex flex-col justify-items-center items-center bg-orange-400 text-white py-4 rounded-md">
          <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold">Total Payments</h2>
          <p className="text-3xl font-semibold">{payments?.length}</p>
        </div>
        <div className="flex flex-col justify-items-center items-center bg-teal-400 text-white py-4 rounded-md">
          <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold">Total Interviews</h2>
          <p className="text-3xl font-semibold">{interviews?.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-8 text-gray-500">Loading data...</div>
      ) : (
        <Tabs className="mt-12">
          <TabList>
            <Tab>Payments</Tab>
            <Tab>Users</Tab>
            <Tab>Interviews</Tab>
          </TabList>

          <TabPanel>
            <div className="flex gap-4 my-6 justify-end items-end">
              <button
                onClick={() => exportCSV(payments, "payments")}
                className="bg-[#3A4C67] text-white px-4 py-1 rounded shadow-md hover:shadow-lg hover:text-[#3A4C67] hover:bg-[#FFF] hover:font-semibold transition-shadow cursor-pointer"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportPDF(payments, "payments")}
                className="bg-[#3A4C67] text-white px-4 py-1 rounded shadow-md hover:shadow-lg hover:text-[#3A4C67] hover:bg-[#FFF] hover:font-semibold transition-shadow cursor-pointer"
              >
                Export PDF
              </button>
            </div>
            {renderTable(payments, "payments")}
          </TabPanel>

          <TabPanel>
            <div className="flex gap-4 my-6 justify-end items-end">
              <button
                onClick={() => exportCSV(users, "users")}
                className="bg-[#3A4C67] text-white px-4 py-1 rounded shadow-md hover:shadow-lg hover:text-[#3A4C67] hover:bg-[#FFF] hover:font-semibold transition-shadow cursor-pointer"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportPDF(users, "users")}
                className="bg-[#3A4C67] text-white px-4 py-1 rounded shadow-md hover:shadow-lg hover:text-[#3A4C67] hover:bg-[#FFF] hover:font-semibold transition-shadow cursor-pointer"
              >
                Export PDF
              </button>
            </div>
            {renderTable(users, "users")}
          </TabPanel>

          <TabPanel>
            <div className="flex gap-4 my-6 justify-end items-end">
              <button
                onClick={() => exportCSV(interviews, "interviews")}
                className="bg-[#3A4C67] text-white px-4 py-1 rounded shadow-md hover:shadow-lg hover:text-[#3A4C67] hover:bg-[#FFF] hover:font-semibold transition-shadow cursor-pointer"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportPDF(interviews, "interviews")}
                className="bg-[#3A4C67] text-white px-4 py-1 rounded shadow-md hover:shadow-lg hover:text-[#3A4C67] hover:bg-[#FFF] hover:font-semibold transition-shadow cursor-pointer"
              >
                Export PDF
              </button>
            </div>
            {renderTable(interviews, "interviews")}
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

export default PrivacyOptions;
