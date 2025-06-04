import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";
import botImg from "../../assets/logos/Hi_bot.png";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";
import axios from "axios"; // Import Axios
import { useAuth } from "../../context/AuthProvider";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: "#37B874",
    boxShadow: state.isFocused ? `0 0 0 1px #37B874` : "none",
    "&:hover": {
      borderColor: "#37B874",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#37B874"
      : state.isFocused
      ? "#37B874"
      : "white",
    color: state.isSelected || state.isFocused ? "white" : "black",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.375rem",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  }),
};

const degreeOptions = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Diploma",
  "Certificate",
  "Other",
].map((degree) => ({ value: degree, label: degree }));

const EducationCertificate = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [educations, setEducations] = useState([
    {
      institution: "",
      degree: degreeOptions[0],
      majorField: "",
      startDate: "",
      completionDate: "",
      isOngoing: false, // Add ongoing field
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...educations];
    updated[index][name] = value;
    setEducations(updated);
  };

  const handleDegreeChange = (index, selectedOption) => {
    const updated = [...educations];
    updated[index].degree = selectedOption;
    setEducations(updated);
  };

  const handleOngoingChange = (index) => {
    const updated = [...educations];
    updated[index].isOngoing = !updated[index].isOngoing;
    if (updated[index].isOngoing) {
      updated[index].completionDate = ""; // Clear completion date if ongoing
    }
    setEducations(updated);
  };

  const handleAddMore = () => {
    setEducations((prev) => [
      ...prev,
      {
        institution: "",
        degree: degreeOptions[0],
        majorField: "",
        startDate: "",
        completionDate: "",
        isOngoing: false,
      },
    ]);
  };

  const handleContinue = async () => {
    const isValid = educations.every(
      (edu) =>
        edu.institution.trim() !== "" &&
        edu.majorField.trim() !== "" &&
        edu.startDate.trim() !== "" &&
        (edu.isOngoing || edu.completionDate.trim() !== "") // Ensure completionDate is only required if not ongoing
    );

    if (!isValid) {
      toast.error("Please fill in all fields for each education entry!");
      return;
    }

    const dataToSubmit = educations.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree.value,
      majorField: edu.majorField,
      startDate: edu.startDate,
      completionDate: edu.isOngoing ? "Ongoing" : edu.completionDate,
    }));

    const token = user.user.approvalToken;

    try {
      console.log("Data to Submit:", dataToSubmit); // Debug log data before sending

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/resume/update-resume`,
        { education: dataToSubmit },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("API Response:", response); // Log the complete response

      if (response.status === 200) {
        toast.success("Education details saved successfully!");
        setTimeout(() => navigate("/userDashboard"), 1500); // Redirect after success
      } else {
        toast.error("Failed to save education details!");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error(
        "An error occurred while saving education details. Please try again."
      );
    }
  };

  return (
    <Container>
      <div className="flex flex-col lg:flex-row w-screen min-h-screen items-center justify-center px-4 pt-24 gap-12 max-w-[1440px]">
        {/* Left Section */}
        <div className="flex flex-col items-center text-center space-y-6 flex-1">
          <h1 className="text-4xl font-bold">Hello Russell!</h1>
          <h2 className="text-3xl font-semibold">Welcome</h2>
          <img
            src={botImg}
            alt="Bot"
            className="w-64 h-auto object-contain mt-6"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Education & Certificate
            </h3>
            <form className="space-y-6">
              {educations.map((edu, index) => (
                <div key={index} className="space-y-4 border-b pb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Institute Name
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter institution name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Degree
                    </label>
                    <Select
                      options={degreeOptions}
                      value={edu.degree}
                      onChange={(option) => handleDegreeChange(index, option)}
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Major Field of Study
                    </label>
                    <input
                      type="text"
                      name="majorField"
                      value={edu.majorField}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter major field of study"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={edu.startDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      name="completionDate"
                      value={edu.isOngoing ? "" : edu.completionDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      required={!edu.isOngoing} // Make it required only if not ongoing
                      disabled={edu.isOngoing} // Disable if ongoing
                    />
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`ongoing-checkbox-${index}`}
                      checked={edu.isOngoing}
                      onChange={() => handleOngoingChange(index)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`ongoing-checkbox-${index}`}
                      className="text-sm"
                    >
                      Ongoing Education
                    </label>
                  </div>

                  {index === educations.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddMore}
                      className="text-[#37B874] font-semibold underline mt-2"
                    >
                      + Add More
                    </button>
                  )}
                </div>
              ))}

              <Buttons.SubmitButton title="Continue" onClick={handleContinue} />
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EducationCertificate;
