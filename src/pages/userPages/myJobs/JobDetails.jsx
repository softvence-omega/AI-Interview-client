import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get jobId from URL
import { useAuth } from "../../../context/AuthProvider";
import { FaLocationDot } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";

const JobDetails = () => {
  const { jobId } = useParams(); // Get jobId from URL
  const user = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch single job details
  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/job/single-job/${jobId}`,
        {
          headers: {
            Authorization: `${user?.user?.approvalToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch job details");
      const data = await res.json();
      setJob(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  if (loading) return <p className="text-center text-gray-500">Loading job details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!job) return <p className="text-center text-gray-600">Job not found.</p>;

  return (
    <div className="text-black p-4 max-w-full mx-auto">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">{job.title}</h1> */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <div className="mb-4">
          <div  className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#212121]">
            {job.title}
          </h2>
          <p
                className={`w-26 text-center text-sm font-medium mb-2 rounded-lg p-2 ${
                  job.isApplied
                    ? "bg-[#EBF8F1] text-[#37B874]"
                    : "bg-[#EF9614]/15 text-[#EF9614]"
                }`}
              >
                {job.isApplied ? "Applied" : "Not Applied"}
              </p>
          </div>
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white bg-[#37B874] px-4 py-2 rounded-lg hover:bg-[#2e9664] transition mt-6"
          >
            Start Mock Interview
          </a>
          <p className="mb-2 text-[#AFAFAF] mt-6"><span className="text-[#37B874]">Company: </span>{job.company || "Not specified"}</p>
          <p className="flex items-center gap-2 text-[#3A4C67] mb-4">
            <span className="text-[#37B874]">Location: </span>
            <FaLocationDot className="bg-[#3A4C67] text-white p-[4px] rounded-full w-6 h-6" />
            <span className="text-sm text-[#676768]">
              {job.location || "Remote"}
            </span>
          </p>
          
        </div>

        {job.description && (
          <div className="mb-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div className="text-gray-600 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;