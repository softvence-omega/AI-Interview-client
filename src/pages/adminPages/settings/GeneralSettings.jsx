import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GeneralSettings = () => {
  const [title, setTitle] = useState("");
  const [triggerText, setTriggerText] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title && !triggerText && !logo) {
      alert("Please update at least one field.");
      return;
    }

    const formData = new FormData();
    if (title) formData.append("title", title);
    if (triggerText) formData.append("triggerText", triggerText);
    if (logo) formData.append("logo", logo);

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/v1/website/update-website`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);

      toast.success("Settings updated successfully!");
      // ✅ Clear input fields after successful upload
      setTitle("");
      setTriggerText("");
      setLogo(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* 🔄 Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#37B874] border-solid"></div>
        </div>
      )}

      <h1 className="text-[#212121] text-[28px] font-semibold text-center">
        General Settings
      </h1>
      <p className="text-[#3A4C67] text-[12px] mt-4 px-6">
        <span className="text-[#878788]">Settings</span>/ General Settings
      </p>
      <div className="mt-2">
        <div className="max-w-full mx-auto p-6 rounded-lg space-y-6">
          {/* Platform Name */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Platform Name
            </label>
            <input
              type="text"
              placeholder="Enter platform name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37B874] bg-white mt-2"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Logo & Branding
            </label>
            <div className="flex items-center justify-center h-32 border bg-white rounded-lg mt-2 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center pointer-events-none">
                <p className="text-[#37B874] text-sm font-medium">
                  Logo Upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, SVG, JPEG, PNG under 1MB
                </p>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Tagline
            </label>
            <input
              type="text"
              placeholder="Enter tagline"
              value={triggerText}
              onChange={(e) => setTriggerText(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37B874] bg-white mt-2"
            />
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#37B874] text-white text-sm px-4 py-2 rounded-lg text-center"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
