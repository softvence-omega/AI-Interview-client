import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import botImg from "../../assets/logos/Hi_bot.png"; // Adjust the path to your bot image
import { useAuth } from "../../context/AuthProvider";

const ResumeUpload = () => {
  const { user } = useAuth();
  const userData = user.userData;

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      toast.success("File selected successfully!");
    } else {
      setSelectedFile(null);
      toast.error("Please upload a PDF file only!");
    }
  };

  const handleContinue = () => {
    if (selectedFile) {
      // Simulate file upload logic (replace with actual API call)
      toast.success("Resume uploaded successfully!");
      setTimeout(() => navigate("/next-page"), 1500); // Replace "/next-page" with your desired route
    } else {
      toast.error("Please select a PDF file first!");
    }
  };

  const handleManualUpload = () => {
    // Logic for manual upload (e.g., navigate to a manual entry page)
    toast.info("Redirecting to manual upload...");
    setTimeout(() => navigate("/aboutMe"), 1500); // Replace "/manual-upload" with your desired route
  };

  return (
    <div className="flex w-screen min-h-screen overflow-hidden items-center justify-center pt-24 px-4">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-12">
        {/* Left: Welcome and Bot Image Section */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {userData.name?.toUpperCase()}
            </h1>
            <h2 className="text-3xl font-semibold">Welcome</h2>
          </div>
          <img
            src={botImg}
            alt="Bot"
            className="w-64 h-auto object-contain border-2 border-dashed p-2 rounded"
            style={{ borderColor: "var(--btn-primary-color)" }}
          />
        </div>

        {/* Right: Upload Section */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-md">
            <div
              className="p-6 border-2 border-dashed rounded-lg text-center space-y-4"
              style={{ borderColor: "var(--btn-primary-color)" }}
            >
              <h3 className="text-xl font-semibold text-green-700">
                Upload Your Resume
              </h3>
              <p className="text-gray-600">
                <span className="text-green-500">Select File</span>
                <br />
                Supported format: PDF
              </p>
              <label className="cursor-pointer bg-green-200 text-green-800 py-2 px-4 rounded hover:bg-green-300 transition">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                Choose File
              </label>
              {selectedFile && (
                <p className="text-green-700">Selected: {selectedFile.name}</p>
              )}
              <div className="mt-4 flex justify-center space-x-4 flex-wrap">
                <button
                  onClick={handleContinue}
                  className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition h-[60px]"
                >
                  Continue
                </button>
                <button
                  onClick={handleManualUpload}
                  className="bg-green-200 text-green-800 py-2 px-6 rounded hover:bg-green-300 transition h-[60px]"
                >
                  Manual Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
