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

const baseUrl = "http://localhost:5000/api/v1";

const flattenInterviewData = (data) => {
  return data.map((item) => ({
    id: item._id,
    user_id: item.user_id,
    interview_id: item.interview_id,
    question_id: item.question_id,
    questionBank_id: item.questionBank_id,
    video_url: item.video_url,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    islast: item.islast,
    isSummary: item.isSummary,

    articulation_score: item.assessment?.Articulation?.score || 0,
    articulation_feedback: item.assessment?.Articulation?.feedback || "",

    behavioral_score: item.assessment?.Behavioural_Cue?.score || 0,
    behavioral_feedback: item.assessment?.Behavioural_Cue?.feedback || "",

    problem_solving_score: item.assessment?.Problem_Solving?.score || 0,
    problem_solving_feedback: item.assessment?.Problem_Solving?.feedback || "",

    content_score: item.assessment?.Content_Score || 0,
    inprep_total_score: item.assessment?.Inprep_Score?.total_score || 0,
    overall_feedback: item.assessment?.what_can_i_do_better?.overall_feedback || "",
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
      const config = {
        headers: {
          Authorization: `${user?.approvalToken}`,
        },
      };

      const [paymentsRes, usersRes, interviewsRes] = await Promise.all([
        axios.get(`${baseUrl}/payment/getAllPayments`, config),
        axios.get(`${baseUrl}/users/getAlluser`, config),
        axios.get(`${baseUrl}/video/getAllInterviews?isSummary=true`, config),
      ]);

      setPayments(paymentsRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
      setInterviews(flattenInterviewData(interviewsRes.data?.data || []));
    } catch (err) {
      toast.error("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportPDF = (data, filename) => {
    if (!data.length) return;
    const doc = new jsPDF();
    const columns = Object.keys(data[0]);
    const rows = data.map((row) => columns.map((col) => String(row[col] || "")));

    autoTable(doc, {
      head: [columns],
      body: rows,
    });

    doc.save(`${filename}.pdf`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTable = (data) => (
    <div className="overflow-auto mt-4">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            {Object.keys(data[0] || {}).map((key) => (
              <th key={key} className="px-4 py-2 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              {Object.keys(data[0] || {}).map((key, i) => {
                const val = row[key];
                return (
                  <td key={i} className="px-4 py-2 border">
                    {typeof val === 'object' && val !== null
                      ? JSON.stringify(val)
                      : String(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  

  return (
    <div className="p-6 text-black">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-center mb-4">Privacy & Data Export</h1>

      {loading ? (
        <div className="text-center mt-8 text-gray-500">Loading data...</div>
      ) : (
        <Tabs>
          <TabList>
            <Tab>Payments</Tab>
            <Tab>Users</Tab>
            <Tab>Interviews</Tab>
          </TabList>

          <TabPanel>
            <div className="flex gap-4 my-4">
              <button onClick={() => exportCSV(payments, "payments")} className="bg-blue-500 text-white px-4 py-1 rounded">
                Export CSV
              </button>
              <button onClick={() => exportPDF(payments, "payments")} className="bg-red-500 text-white px-4 py-1 rounded">
                Export PDF
              </button>
            </div>
            {renderTable(payments)}
          </TabPanel>

          <TabPanel>
            <div className="flex gap-4 my-4">
              <button onClick={() => exportCSV(users, "users")} className="bg-blue-500 text-white px-4 py-1 rounded">
                Export CSV
              </button>
              <button onClick={() => exportPDF(users, "users")} className="bg-red-500 text-white px-4 py-1 rounded">
                Export PDF
              </button>
            </div>
            {renderTable(users)}
          </TabPanel>

          <TabPanel>
            <div className="flex gap-4 my-4">
              <button onClick={() => exportCSV(interviews, "interviews")} className="bg-blue-500 text-white px-4 py-1 rounded">
                Export CSV
              </button>
              <button onClick={() => exportPDF(interviews, "interviews")} className="bg-red-500 text-white px-4 py-1 rounded">
                Export PDF
              </button>
            </div>
            {renderTable(interviews)}
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

export default PrivacyOptions;
