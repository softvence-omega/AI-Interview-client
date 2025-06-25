import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import botImg from "../../assets/resume.png"; // Adjust the path to your bot image
import { useAuth } from "../../context/AuthProvider";
import { FiUpload } from "react-icons/fi";

const ResumeUpload = () => {
  const { user, setUser } = useAuth();
  const userData = user.userData;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     setSelectedFile(file);
  //     toast.success("File selected successfully!");
  //   } else {
  //     setSelectedFile(null);
  //     toast.error("Please upload a PDF file only!");
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      toast.error("Please upload a PDF file only!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      toast.error("File is too large. Max size is 5 MB.");
      return;
    }

    setSelectedFile(file);
    toast.success("File selected successfully!");
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
    <div className="relative flex w-screen min-h-screen overflow-hidden items-center justify-center pt-10 md:pt-20 lg:pt-20 px-4 pb-24 bg-[#182234]">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-16">
        {/* Left: Welcome and Bot Image Section */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-left">
          <div>
            <h2 className="text-3xl font-semibold"></h2>
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold mb-6">
              Welcome, {userData.name}!
            </h1>
            <h3 className="text-2xl md:text-4xl lg:text-4xl text-gray-400 font-thin w-[80%]">
              To start off, please upload your resume.
            </h3>
          </div>
          <img
            src={botImg}
            alt="Bot"
            className="w-full h-auto object-contain p-2 rounded"
            style={{ borderColor: "var(--btn-primary-color)" }}
          />
        </div>

        {/* Right: Upload Section */}
        <div className="flex-1 flex items-center justify-center w-full text-center">
          <div className="w-full max-w-md">
            <h3 className="text-4xl md:text-5xl lg:text-5xl text-white mb-6">
              Upload Your Resume
            </h3>
            <p className="text-lg md:text-xl lg:text-xl tracking-wider text-gray-400 mb-12">
              Supported format: PDF · Max Size: 5 MB
            </p>
            {/* <div className="p-6 border-2 border-dashed border-gray-500 rounded-lg text-center space-y-4"> */}
            <div
              className={`p-6 border-2 border-dashed rounded-lg text-center space-y-4 transition ${
                isDragging ? "border-green-400 bg-violet-600" : "border-gray-500"
              }`}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileChange(e);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
            >
              <label className="cursor-pointer text-white py-2 px-4 flex  justify-center mt-6">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FiUpload size={56} />
              </label>
              <h3 className="text-3xl font-light text-white px-4 mb-8">
                Drag and drop your resume or click to browse
              </h3>
              {selectedFile && (
                <p className="text-green-700">Selected: {selectedFile.name}</p>
              )}
              <div className="mt-4 flex flex-col justify-center items-center flex-wrap">
                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="text-3xl font-semibold bg-[#FFB74E] text-[#182234] rounded-lg hover:bg-green-600 hover:text-white transition h-[64px] w-[70%] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="justify-items-center items-center">
                        <span>Uploading...</span>
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
                      </div>
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
                <button
                  onClick={handleManualUpload}
                  className="text-2xl font-light text-gray-300 hover:text-white py-2 px-6 rounded transition h-[60px] cursor-pointer mt-4"
                >
                  Enter Manually
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
