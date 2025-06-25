import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import botImg from "../../assets/logos/Hi_bot.png"; // Adjust the path to your bot image
import { useAuth } from "../../context/AuthProvider";

const ResumeUpload = () => {
  const { user, setUser } = useAuth();
  const userData = user.userData;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
 
  const handleContinue = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resumeFile", selectedFile);
    formData.append("manualData", JSON.stringify({})); // send empty object or actual manual data if available

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/resume/upload-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `${user.approvalToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      toast.success("Resume uploaded successfully!");

      // Get current auth data from localStorage
      const localUser = JSON.parse(localStorage.getItem("userData"));

      console.log("Local USER ::: ", localUser);

      // Update top-level userMeta in localStorage
      const updatedUser = {
        ...localUser,
        userMeta: {
          ...localUser.userMeta,
          isResumeUploaded: true,
          isAboutMeGenerated: true,
        },
        userData: {
          ...localUser.userData,
          userMeta: {
            ...(localUser.userData.userMeta || {}),
            isResumeUploaded: true,
            isAboutMeGenerated: true,
          },
        },
      };

      // Save to localStorage with error handling
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      console.log("localStorage updated successfully:", updatedUser);

      // Update Auth context to align with localStorage
      setUser((prev) => ({
        ...prev,
        userMeta: updatedUser.userMeta, // CHANGED: Update top-level userMeta
        userData: {
          ...prev.userData,
          userMeta: updatedUser.userData.userMeta, // CHANGED: Update nested userMeta
        },
      }));

      // // Update userMeta
      // const updatedUser = {
      //   ...localUser,
      //   userMeta: {
      //     ...localUser.userMeta,
      //     isResumeUploaded: true, // ✅ Set the desired flag to true
      //     isAboutMeGenerated: true, // CHANGED: Set to true as before
      //     isAboutMeVideoChecked: false, // CHANGED: Explicitly set to false to match workflow
      //   },
      // };

      // Save updated data back to localStorage
      // localStorage.setItem("userData", JSON.stringify(updatedUser));

      // CHANGED: Update Auth context to reflect changes
      // Update AuthContext
      // setUser((prev) => ({
      //   ...prev,
      //   userData: updatedUser,
      // }));
      // setUser((prev) => ({
      //   ...prev,
      //   userData: {
      //     ...prev.userData,
      //     userMeta: updatedUser.userMeta,
      //   },
      // }));

      console.log("updatedUser ::: ", updatedUser);

      setTimeout(() => navigate("/generateAboutMe"), 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualUpload = () => {
    // Logic for manual upload (e.g., navigate to a manual entry page)
    toast.info("Redirecting to manual upload...");
    setTimeout(() => navigate("/aboutMe"), 1500); // Replace "/manual-upload" with your desired route
  };

  return (
    <div className="relative flex w-screen min-h-screen overflow-hidden items-center justify-center pt-24 px-4 pb-24">
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
                  disabled={loading}
                  className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition h-[60px]"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    "Continue"
                  )}
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

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="animate-spin h-6 w-6 text-[#37B874] mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <p className="text-lg text-[#37B874] font-semibold">
                Analyzing your resume...
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Please wait while we process your file.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
