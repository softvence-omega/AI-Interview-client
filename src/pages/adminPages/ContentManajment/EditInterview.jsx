import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

const EditInterview = () => {
  const { interview_id } = useParams();
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    interview_name: "",
    description: "",
    img: null,
  });
  const [editingFields, setEditingFields] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch interview data
  useEffect(() => {
    const fetchInterview = async () => {
      if (!AuthorizationToken) {
        setError("No authorization token available");
        setLoading(false);
        return;
      }

      if (!interview_id) {
        setError("Invalid interview ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await request({
          endpoint: `/interview/get_mock_interview?_id=${interview_id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });
        if (res.ok) {
          const interviewData = res.data?.body?.[0];
          if (interviewData) {
            setInterview(interviewData);
            setFormData({
              interview_name: interviewData.interview_name || "",
              description: interviewData.description || "",
              img: interviewData.img || null,
            });
            setPreviewUrl(interviewData.img || "");
            setError(null);
          } else {
            throw new Error("Interview not found");
          }
        } else {
          throw new Error(res.message || "Failed to fetch interview");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch interview");
        console.error("Error fetching interview:", err);
        toast.error("Error fetching interview.", {
          description: err.message || "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interview_id, AuthorizationToken]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Toggle editing state for a field
  const toggleEditField = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle submit for all changed fields
  const handleSubmitAll = async () => {
    if (!AuthorizationToken) {
      toast.error("You must be logged in to update an interview.");
      return;
    }

    const changes = {};
    Object.keys(formData).forEach((field) => {
      const originalValue = interview[field];
      const newValue = formData[field];
      if (field === "img" && newValue instanceof File) {
        changes[field] = newValue;
      } else if (originalValue !== newValue) {
        changes[field] = newValue;
      }
    });

    if (Object.keys(changes).length === 0) {
      toast.info("No changes to submit.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      if (changes.img instanceof File) {
        formDataToSend.append("file", changes.img);
        delete changes.img;
      }
      formDataToSend.append("data", JSON.stringify(changes));

      const res = await request({
        endpoint: `/interview/update_mock_interview?interview_id=${interview_id}`,
        method: "POST",
        headers: {
          Authorization: `${AuthorizationToken}`,
        },
        body: formDataToSend,
      });

      if (res.ok) {
        toast.success("All changes updated successfully!");
        setInterview((prev) => ({
          ...prev,
          ...changes,
        }));
        setPreviewUrl(
          changes.img instanceof File
            ? URL.createObjectURL(changes.img)
            : changes.img || ""
        );
        setEditingFields({});
        navigate(-1);
      } else {
        throw new Error(res.message || "Failed to update changes");
      }
    } catch (err) {
      toast.error("Error updating changes.", {
        description: err.message || "Something went wrong.",
      });
      console.error("Error updating changes:", err);
    }
  };

  // Cancel all edits
  const handleCancelAll = () => {
    setEditingFields({});
    setFormData({
      interview_name: interview.interview_name || "",
      description: interview.description || "",
      img: interview.img || null,
    });
    setPreviewUrl(interview.img || "");
  };

  return (
    <div className="text-black w-full px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Interview</h1>

      {loading && <p>Loading interview...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && interview && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Interview Name
              </label>
              <input
                type="text"
                name="interview_name"
                value={formData.interview_name}
                onChange={handleInputChange}
                disabled={!editingFields.interview_name}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.interview_name
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              />
            </div>
            <button
              onClick={() => toggleEditField("interview_name")}
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67] rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!editingFields.description}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.description ? "text-gray-900" : "text-gray-500"
                }`}
                rows="3"
              />
            </div>
            <button
              onClick={() => toggleEditField("description")}
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67]rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Image Preview
              </label>
              {(previewUrl ||
                (formData.img && formData.img instanceof File)) && (
                <div className="mt-1">
                  <img
                    src={
                      previewUrl ||
                      (formData.img instanceof File
                        ? URL.createObjectURL(formData.img)
                        : "")
                    }
                    alt="Interview Preview"
                    className="h-[68px] w-[64px] object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                </div>
              )}
              {editingFields.img && (
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm"
                />
              )}
            </div>
            <button
              onClick={() => toggleEditField("img")}
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67] rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          {/* Submit and Cancel Buttons */}
          {Object.values(editingFields).some((val) => val) && (
            <div className="mt-6 md:flex lg:flex justify-items-center md:justify-end lg:justify-end gap-4">
              <button
                onClick={handleSubmitAll}
                className="flex items-center gap-1 px-4 py-2 bg-[#37B874] text-white rounded-md hover:bg-[#2e9b64] transition mb-4 md:mb-0 lg:mb-0"
              >
                Submit All Changes
              </button>
              <button
                onClick={handleCancelAll}
                className="flex items-center gap-1 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
              >
                Cancel All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditInterview;
