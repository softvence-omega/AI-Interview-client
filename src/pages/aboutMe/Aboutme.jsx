import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import botImg from "../../assets/logos/Hi_bot.png";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";
import axios from "axios";

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
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#bbf7d0", // green-200
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#166534", // green-800
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#166534",
    ":hover": {
      backgroundColor: "#37B874",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.375rem",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  }),
};

const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Bangladesh",
  "Brazil",
  "China",
  "Japan",
  "South Korea",
  "Mexico",
  "Russia",
  "South Africa",
  "Spain",
  "Italy",
  "Netherlands",
  "Norway",
  "Sweden",
  "Denmark",
  "New Zealand",
  "United Arab Emirates",
  "Saudi Arabia",
  "Pakistan",
].map((country) => ({ value: country, label: country }));

const defaultSkillOptions = [
  "UI/UX Design",
  "Frontend Development",
  "Backend Development",
  "Mobile App Development",
  "Project Management",
  "Other",
].map((skill) => ({ value: skill, label: skill }));

const AboutMe = () => {
  const user = useAuth();
  const navigate = useNavigate();

  // Add all fields like summary, experience, education, etc.
  const [formData, setFormData] = useState({
    summary: "ABCDEFGHI",
    city: "",
    country: { value: "United Kingdom", label: "United Kingdom" },
    skills: [],
    experience: {
      jobTitle: "Developer",
      company: "ABC company",
      city: "Dhaka",
      country: "Bangladesh",
      responsibilities: "Work with backend and flutter combinations...",
      skills: ["Node.js", "TypeScript", "MongoDB"],
      startDate: "10-12-2025",
      endDate: "10-12-2025",
    },
    education: [
      {
        institution: "DU",
        degree: "B.Sc in CSE",
        majorField: "Software Engineer",
        startDate: "10-10-2020",
        completionDate: "12-12-2022",
      },
      {
        institution: "JU",
        degree: "M.Sc in CSE",
        majorField: "Software Engineer",
        startDate: "10-10-2020",
        completionDate: "12-12-2022",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData((prev) => ({ ...prev, skills: selectedOptions || [] }));
  };

  const handleContinue = async () => {
    if (!formData.city || formData.skills.length === 0) {
      toast.error("Please fill in all required fields!");
      return;
    }
    toast.success("About Me saved successfully!");

    const modifyIncommingData = {
      summary: formData.summary,
      address: {
        city: formData.city,
        country: formData.country.value,
      },
      technicalSkills: formData.skills.map((skill) => skill.value),
      experience: formData.experience,
      education: formData.education,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/resume/update-resume`,
        modifyIncommingData,
        {
          headers: {
            Authorization: `${user.user.approvalToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Resume updated successfully!");
        setTimeout(() => navigate("/experience"), 1500);
      } else {
        toast.error("Error updating resume!");
      }
    } catch (error) {
      console.log(error)
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <div className="flex flex-col lg:flex-row w-screen min-h-screen items-center justify-center px-4 pt-24 gap-12 max-w-[1440px]">
        {/* Left Section */}
        <div className="flex flex-col items-center text-center space-y-6 flex-1">
          <h1 className="text-4xl font-bold">Hello {user.user.userData.name}!</h1>
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
            <h3 className="text-2xl font-semibold mb-6 text-center">About Me</h3>
            <form className="space-y-4">
              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                  placeholder="Enter your city"
                  required
                />
              </div>

              {/* Country Select */}
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Select
                  options={countryOptions}
                  value={formData.country}
                  onChange={handleCountryChange}
                  isSearchable
                  styles={customSelectStyles}
                />
              </div>

              {/* Skills Select */}
              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <CreatableSelect
                  isMulti
                  options={defaultSkillOptions}
                  value={formData.skills}
                  onChange={handleSkillsChange}
                  isSearchable
                  placeholder="Select or type to add skills"
                  styles={customSelectStyles}
                />
              </div>

              {/* Continue Button */}
              <Buttons.SubmitButton
                text="Continue"
                width="w-full"
                rounded="rounded-[12px]"
                onClick={handleContinue}
              />
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutMe;
