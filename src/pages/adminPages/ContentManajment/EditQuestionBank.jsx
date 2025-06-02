import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import useApi from "../../../hook/apiHook";
import { FaPen } from "react-icons/fa";
import { toast } from "sonner";

const EditQuestionBank = () => {
  const { questionBank_id } = useParams();
  const { user } = useAuth();
  const AuthorizationToken = user?.approvalToken;
  const { request } = useApi();
  const navigate = useNavigate();
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    questionBank_name: "",
    duration: "",
    difficulty_level: "",
    question_Type: "",
    description: "",
    what_to_expect: "",
    img: null,
  });
  const [editingFields, setEditingFields] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch question bank data
  useEffect(() => {
    const fetchQuestionBank = async () => {
      if (!AuthorizationToken) {
        setError("No authorization token available");
        setLoading(false);
        return;
      }

      if (!questionBank_id) {
        setError("Invalid question bank ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await request({
          endpoint: `/interview/get_question_bank?questionBank_id=${questionBank_id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${AuthorizationToken}`,
          },
        });
        if (res.ok) {
          const questionBankData = res.data?.body?.[0];
          if (questionBankData) {
            setQuestionBank(questionBankData);
            setFormData({
              questionBank_name: questionBankData.questionBank_name || "",
              duration: questionBankData.duration || "",
              difficulty_level: questionBankData.difficulty_level || "",
              question_Type: questionBankData.question_Type || "",
              description: questionBankData.description || "",
              what_to_expect: questionBankData.what_to_expect?.join(", ") || "",
              img: questionBankData.img || null,
            });
            setPreviewUrl(questionBankData.img || "");
            setError(null);
          } else {
            throw new Error("Question bank not found");
          }
        } else {
          throw new Error(res.message || "Failed to fetch question bank");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch question bank");
        console.error("Error fetching question bank:", err);
        toast.error("Error fetching question bank.", {
          description: err.message || "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionBank();
  }, [questionBank_id, AuthorizationToken]);

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
      toast.error("You must be logged in to update a question bank.");
      return;
    }

    const changes = {};
    Object.keys(formData).forEach((field) => {
      const originalValue =
        questionBank[field] ||
        (field === "what_to_expect" ? questionBank[field]?.join(", ") : "");
      const newValue = formData[field];
      if (field === "img" && newValue instanceof File) {
        changes[field] = newValue;
      } else if (originalValue !== newValue) {
        changes[field] =
          field === "what_to_expect"
            ? newValue.split(",").map((item) => item.trim())
            : newValue;
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
        endpoint: `/interview/update_question_bank?question_bank_id=${questionBank_id}`,
        method: "POST",
        headers: {
          Authorization: `${AuthorizationToken}`,
        },
        body: formDataToSend,
      });

      if (res.ok) {
        toast.success("All changes updated successfully!");
        setQuestionBank((prev) => ({
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
      questionBank_name: questionBank.questionBank_name || "",
      duration: questionBank.duration || "",
      difficulty_level: questionBank.difficulty_level || "",
      question_Type: questionBank.question_Type || "",
      description: questionBank.description || "",
      what_to_expect: questionBank.what_to_expect?.join(", ") || "",
      img: questionBank.img || null,
    });
    setPreviewUrl(questionBank.img || "");
  };

  return (
    <div className="text-black w-full px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Question Bank</h1>

      {loading && <p>Loading question bank...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && questionBank && (
        <div className="bg-white p-6 rounded-lg shadow">
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
                    alt="Question Bank Preview"
                    className="h-[96px] w-[96px] object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="h-[68px] w-[64px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 hidden">
                    No Image
                  </div>
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
          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Question Bank Name
              </label>
              <input
                type="text"
                name="questionBank_name"
                value={formData.questionBank_name}
                onChange={handleInputChange}
                disabled={!editingFields.questionBank_name}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.questionBank_name
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              />
            </div>
            <button
              onClick={() => toggleEditField("questionBank_name")}
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67] rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                disabled={!editingFields.duration}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.duration ? "text-gray-900" : "text-gray-500"
                }`}
              />
            </div>
            <button
              onClick={() => toggleEditField("duration")}
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67] rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Difficulty Level
              </label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                disabled={!editingFields.difficulty_level}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.difficulty_level
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <button
              onClick={() => toggleEditField("difficulty_level")}
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67] rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                Question Type
              </label>
              <select
                name="question_Type"
                value={formData.question_Type}
                onChange={handleInputChange}
                disabled={!editingFields.question_Type}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.question_Type
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Open-Ended">Open-Ended</option>
                <option value="Coding">Coding</option>
              </select>
            </div>
            <button
              onClick={() => toggleEditField("question_Type")}
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
              className="ml-4 flex items-center gap-1 px-4 py-2 text-[#3A4C67] rounded-md transition"
            >
              <FaPen />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#3A4C67]">
                What to Expect (comma-separated)
              </label>
              <input
                type="text"
                name="what_to_expect"
                value={formData.what_to_expect}
                onChange={handleInputChange}
                disabled={!editingFields.what_to_expect}
                className={`mt-1 block w-full rounded-md p-1 border-1 border-gray-100 shadow-sm focus:border-[#3A4C67] focus:ring-[#3A4C67] sm:text-sm ${
                  editingFields.what_to_expect
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
                placeholder="e.g., HTML, CSS, JavaScript"
              />
            </div>
            <button
              onClick={() => toggleEditField("what_to_expect")}
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
                className="flex items-center gap-1 px-4 py-2 bg-[#37B874] text-white rounded-md hover:bg-[#2e9b64] transition mb-2 md:mb-0 lg:mb-0"
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

export default EditQuestionBank;
