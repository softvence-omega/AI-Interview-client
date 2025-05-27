import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { FaArrowRight, FaLocationDot, FaFilter } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";

const JobList = () => {
  const user = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [companies, setCompanies] = useState([]); // For dynamic companies
  const [positions, setPositions] = useState([]); // For dynamic positions (from title)
  const [locations, setLocations] = useState([]); // For dynamic locations
  const [years, setYears] = useState([]); // For dynamic years
  const [statuses, setStatuses] = useState([]); // For dynamic statuses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Toggle filter dropdown

  // Fetch all jobs to derive filter options
  const fetchFilterOptions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/job/applied-job`, {
        headers: {
          Authorization: `${user?.user?.approvalToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch jobs for filter options");
      const data = await res.json();

      // Extract unique values for each filter
      setCompanies([...new Set(data.map((job) => job.company))]);
      setPositions([...new Set(data.map((job) => job.title))]); // Position from title
      setLocations([...new Set(data.map((job) => job.location))]);
      setYears([
        ...new Set(
          data.map((job) => new Date(job.posted).getFullYear().toString())
        ),
      ]);
      setStatuses([
        ...new Set(
          data.map((job) => (job.isApplied ? "true" : "false"))
        ),
      ]);
    } catch (err) {
      console.error("Error fetching filter options:", err.message);
      setCompanies([]);
      setPositions([]);
      setLocations([]);
      setYears([]);
      setStatuses([]);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (company) params.append("company", company);
    if (position) params.append("position", position); // Position from title
    if (year) params.append("year", year);
    if (location) params.append("location", location);
    if (status) params.append("isApplied", status);

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/job/applied-job?${params.toString()}`,
        {
          headers: {
            Authorization: `${user?.user?.approvalToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options and jobs on mount, update jobs when filters change
  useEffect(() => {
    fetchFilterOptions(); // Fetch filter options once on mount
    fetchJobs();
  }, [company, position, year, location, status]);

  // Handle frontend title search
  useEffect(() => {
    if (search) {
      const filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [search, jobs]);

  return (
    <div className="text-black p-4 max-w-6xl mx-auto">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">My Applied Jobs</h1> */}

      {/* Search Bar with Filter Button */}
      <div className="relative mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search for jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#E0E0E1] bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[37B874]"
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
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center">Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#676768] mb-1">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                >
                  <option value="">All Companies</option>
                  {companies.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#676768] mb-1">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                >
                  <option value="">All Positions</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#676768] mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                >
                  <option value="">All Years</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#676768] mb-1">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-[#37B874] px-2 py-[5px] border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
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
                  {statuses.map((stat) => (
                    <option key={stat} value={stat}>
                      {stat === "true" ? "Applied" : "Not Applied"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && <p className="text-center text-gray-500">Loading jobs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && filteredJobs.length === 0 && (
        <p className="text-center text-gray-600">No jobs found.</p>
      )}

      {filteredJobs.map((job) => (
        <div
          key={job._id}
          className="bg-white shadow-sm rounded-xl p-6 mb-6 transition-all hover:shadow-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-[70%]">
              <h2 className="text-xl font-semibold mb-2 text-[#212121]">
                {job.title}
              </h2>
              <p className="mb-2 text-[#AFAFAF]">{job.company}</p>
              <p className="flex items-center gap-2 text-[#3A4C67] mb-4">
                <FaLocationDot className="bg-[#3A4C67] text-white p-[4px] rounded-full w-6 h-6" />
                <span className="text-sm text-[#676768]">{job.location}</span>
              </p>
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
            <div className="w-[30%] text-right col-span-1 flex flex-col items-end">
              <Link
                to={`/userDashboard/job-details/${job._id}`}
                className="inline-block text-white bg-[#37B874] px-2 py-2 rounded-full hover:bg-[#37B874] transition"
              >
                <FaArrowRight className="text-right" />
              </Link>
              <p className="flex justify-items-center items-center gap-1 text-sm text-gray-500 text-right">
                <SlCalender className="text-[#3A4C67] rounded-full w-6 h-4 text-right" />
                {new Date(job.posted).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;