import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { HiDownload } from "react-icons/hi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useAuth } from "../../../context/AuthProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Insights = () => {
  const user = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/graph/average-data",
          {
            headers: {
              Authorization: `${user.user.approvalToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching insights data:", error);
      }
    };
    fetchData();
  }, []);

  // const handleDownload = () => {
  //   const token = user.user.approvalToken;
  //   window.open(
  //     `http://localhost:5000/api/v1/graph/download-report?token=${token}`,
  //     "_blank"
  //   );
  // };
  // const handleDownload = () => {
  //   const blob = new Blob([JSON.stringify(data, null, 2)], {
  //     type: "application/json",
  //   });

  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "progress-report.json";
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };
  const handleDownload = () => {
    if (!data) return;

    const { weeklyAverages } = data;

    const headers = ["Week", ...Object.keys(weeklyAverages["Week 1"])];
    const rows = Object.entries(weeklyAverages).map(([week, scores]) => {
      return [week, ...headers.slice(1).map((key) => scores[key] ?? 0)];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "progress-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data) return <div className="text-center mt-10">Loading...</div>;

  const {
    totalInterviews,
    totalAverage,
    // weeklyPercentageChanges,
    differenceBetweenTotalAndWithoutLast,
    weeklyAverages,
  } = data;

  const metrics = [
    { label: "Content Accuracy", key: "Content_Score" },
    { label: "Behavioural Cue", key: "Behavioural_Cue" },
    { label: "Articulation Clarity", key: "Articulation" },
    { label: "Inprep Score", key: "Inprep_Score" },
    { label: "Problem Solving", key: "Problem_Solving" },
  ];

  // const chartData = Object.entries(weeklyAverages).map(([week, scores]) => {
  //   const avg =
  //     Object.values(scores).reduce((a, b) => a + b, 0) /
  //     Object.values(scores).length;
  //   return { week, avg };
  // });
  const chartData = data.weeklyOverallAverages.map(({ date, average }) => ({
    week: date,
    avg: average,
  }));

  return (
    <div className="md:p-6 lg:p-6 text-black">
      {/* Top Summary & Download */}
      <div className="block md:flex lg:flex items-center justify-between mb-6">
        <div className="bg-[#3A4C67] text-white px-8 py-6 rounded-md text-center">
          <div>
            <p className="text-xl font-bold">{totalInterviews}</p>
          </div>
          <div>
            <p className="text-sm">Total Interviews</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="bg-[#37B874] hover:bg-[#1E6540] text-white px-4 py-2 rounded-md flex justify-items-center items-center gap-2 mt-4 md:mt-0 lg:mt-0"
        >
          Download Progress Report{" "}
          <HiDownload className="bg-white text-green-400 rounded-full w-5 h-5 p-[2px]" />
        </button>
      </div>

      {/* Interview Progress Line Chart */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Interview Progress</h2>
        <div className="overflow-x-auto h-[420px] rounded-lg p-8 shadow">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#9DA6FE" stopOpacity={1.0} />
                  <stop offset="70%" stopColor="#DADEFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ dy: 20 }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[25, 50, 75, 100]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
                tick={{ dx: -20 }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <ReTooltip />
              <Area
                type="monotone"
                dataKey="avg"
                stroke="#717FFE"
                fillOpacity={1}
                fill="url(#progressGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {metrics.map((metric) => {
          const score = totalAverage[metric.key] || 0;
          // 
          const diff = differenceBetweenTotalAndWithoutLast?.[metric.key] ?? 0;

          return (
            <div
              key={metric.key}
              className="w-[320px] bg-white shadow-md rounded-xl p-2 md:p-4 lg:p-4 border-1 border-[#E0E0E1]"
            >
              <p className="font-semibold">{metric.label}</p>
              <p className="text-xl font-bold">{score}%</p>
              <div className="mt-2 h-[80px]">
                <Line
                  data={{
                    labels: Object.keys(weeklyAverages),
                    datasets: [
                      {
                        data: Object.values(weeklyAverages).map(
                          (week) => week[metric.key] || 0
                        ),
                        borderColor: "#1E6540",
                        backgroundColor: "transparent",
                        tension: 0.3,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { display: false },
                      y: { display: false },
                    },
                  }}
                />
              </div>
              {/* <p
                className={`mt-2 text-sm font-medium text-right ${
                  change >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"
                }`}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </p> */}
              <p
                className={`mt-2 text-sm font-medium text-right ${
                  diff >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"
                }`}
              >
                {diff >= 0 ? "+" : ""}
                {diff.toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Insights;
