import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";
import botImg from "../../assets/logos/Hi_bot.png";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { DateInputWithIcon } from "../../reuseable/DateInputWithIcon";

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
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

// const skillOptions = [
//   "JavaScript",
//   "TypeScript",
//   "Python",
//   "Ruby",
//   "Java",
//   "PHP",
//   "Node.js",
//   "React.js",
//   "Express js",
//   "Swift",
//   "C#",
//   "Go",
//   "C++",
//   "Kotlin",
//   "Dart",
//   "HTML",
//   "CSS",
//   "SQL",
//   "NoSQL",
//   "MySQL",
//   "R",
//   "Rust",
//   "Shell Scripting",
//   "Perl",
//   "Solidity",
// ].map((lang) => ({ value: lang, label: lang }));

// const experienceOptions = [
//   "Less than 1 Year",
//   "1 Year",
//   "2 Years",
//   "3 Years",
//   "4 Years",
//   "5 Years",
//   "5+ Years",
// ].map((exp) => ({ value: exp, label: exp }));

const Experience = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const countries = response.data
          .filter((country) => country.name.common !== "Israel")
          .map((country) => ({
            value: country.name.common,
            label: country.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountryOptions(countries);
      } catch (error) {
        console.error("Failed to fetch countries", error);
        toast.error("Could not load country list");
      }
    };
    fetchCountries();
  }, []);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/skill/all-skills`
        );
        const skills = response.data.data.map((skill) => ({
          value: skill.name,
          label: skill.name,
        }));
        setSkillOptions(skills);
      } catch (error) {
        console.error("Failed to fetch skills", error);
        toast.error("Could not load skills list");
      }
    };
    fetchSkills();
  }, []);

  const [experiences, setExperiences] = useState([
    {
      jobTitle: "",
      company: "",
      city: "",
      country: "",
      responsibilities: "",
      skills: [],
      startDate: "",
      endDate: "",
      isOngoing: false,
      // experienceDuration: experienceOptions[2], // Default selected experience duration
    },
  ]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [experiences]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...experiences];
    updated[index][name] = value;
    setExperiences(updated);
  };

  // const handleExperienceChange = (index, selectedOption) => {
  //   const updated = [...experiences];
  //   updated[index].experienceDuration = selectedOption;
  //   setExperiences(updated);
  // };

  const handleCountryChange = (index, selectedOption) => {
    const updated = [...experiences];
    updated[index].country = selectedOption;
    setExperiences(updated);
  };

  const handleSkillsChange = (index, selectedSkills) => {
    const updated = [...experiences];
    updated[index].skills = selectedSkills || [];
    setExperiences(updated);
  };

  const handleCreateSkill = async (inputValue, index) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/skill/create-skill`,
        {
          name: inputValue,
        }
      );

      const newSkill = { value: res.data.name, label: res.data.name };

      // Update skillOptions globally
      setSkillOptions((prev) => [...prev, newSkill]);

      // Add new skill to the selected experience's skills
      const updated = [...experiences];
      updated[index].skills = [...updated[index].skills, newSkill];
      setExperiences(updated); // <-- use setExperiences here!

      toast.success("New skill added!");
    } catch (error) {
      console.error("Failed to create skill", error);
      toast.error("Could not add new skill");
    }
  };

  const handleOngoingChange = (index) => {
    const updated = [...experiences];
    updated[index].isOngoing = !updated[index].isOngoing;
    updated[index].endDate = updated[index].isOngoing
      ? ""
      : updated[index].endDate; // Clear end date if ongoing
    setExperiences(updated);
  };

  const handleAddMore = () => {
    setExperiences((prev) => [
      ...prev,
      {
        jobTitle: "",
        company: "",
        city: "",
        country: "",
        responsibilities: "",
        skills: [],
        startDate: "",
        endDate: "",
        isOngoing: false,
        // experienceDuration: experienceOptions[2],
      },
    ]);
  };

  const handleSubmit = async () => {
    const isValid = experiences.every(
      (exp) =>
        exp.jobTitle.trim() !== "" &&
        exp.company.trim() !== "" &&
        exp.city.trim() !== "" &&
        exp.country.trim() !== "" &&
        exp.responsibilities.trim() !== "" &&
        exp.skills.length > 0 &&
        exp.startDate.trim() !== "" &&
        (exp.isOngoing || exp.endDate.trim() !== "") && // Ensure endDate is only required if not ongoing
        exp.experienceDuration // Ensure experienceDuration is selected
    );

    if (!isValid) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const dataToSubmit = experiences.map((exp) => ({
      jobTitle: exp.jobTitle,
      company: exp.company,
      city: exp.city,
      country: exp.country,
      responsibilities: exp.responsibilities,
      skills: exp.skills.map((skill) => skill.value),
      startDate: exp.startDate,
      endDate: exp.isOngoing ? "Ongoing" : exp.endDate,
      experienceDuration: exp.experienceDuration.value,
    }));

    console.log(dataToSubmit); // This logs the data to the console before submitting it

    toast.success("Experiences submitted!");

    const token = user.user.approvalToken; // Retrieve the token from context
    setLoading(true); // 🔄 Start loading

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/resume/update-resume`,
        { experience: dataToSubmit },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Experience updated successfully!");
        setTimeout(() => navigate("/certificates"), 1500);
      } else {
        toast.error("Error updating experience!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <Container>
      <div className="flex flex-col lg:flex-row w-screen min-h-screen items-center justify-center px-4 pt-24 gap-12 max-w-[1440px]">
        {/* Left Section */}
        <div className="flex flex-col items-center text-center space-y-6 flex-1">
          <h1 className="text-4xl font-bold">
            Hello {user.user.userData.name}!
          </h1>
          <h2 className="text-3xl font-semibold">Welcome</h2>
          <img
            src={botImg}
            alt="Bot"
            className="w-[70%] h-[70%] object-contain mt-2"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-center w-full h-screen md:h-auto">
          {/* Top: Header */}
          <div className="w-full max-w-md mx-auto py-4 px-2">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Experience
            </h3>
          </div>

          {/* Middle: Scrollable Experiences */}
          <div
            ref={scrollRef}
            className="flex-1 w-full max-w-md mx-auto px-2 md:max-h-[450px] md:overflow-y-auto"
          >
            <form className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="space-y-4 border-b pb-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={exp.jobTitle}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter your job title"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter your company"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={exp.city}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter your city"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    {/* <input
                      type="text"
                      name="country"
                      value={exp.country}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter your country"
                    /> */}
                    <Select
                      options={countryOptions}
                      value={exp.country}
                      onChange={(option) => handleCountryChange(index, option)}
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Responsibilities
                    </label>
                    <textarea
                      name="responsibilities"
                      rows="4"
                      value={exp.responsibilities}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Describe your responsibilities"
                    />
                  </div>

                  {/* Skills */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      Skills
                    </label>
                    <Select
                      isMulti
                      options={skillOptions}
                      value={exp.skills}
                      onChange={(skills) => handleSkillsChange(index, skills)}
                      className="text-black"
                      styles={customSelectStyles}
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Skills
                    </label>
                    <CreatableSelect
                      isMulti
                      options={skillOptions}
                      value={exp.skills}
                      onChange={(skills) => handleSkillsChange(index, skills)}
                      onCreateOption={(inputValue) =>
                        handleCreateSkill(inputValue, index)
                      }
                      className="text-black"
                      styles={customSelectStyles}
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div>

                  {/* Start Date */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                    />
                  </div> */}

                  {/* End Date */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={exp.isOngoing ? "" : exp.endDate}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      disabled={exp.isOngoing}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`ongoing-checkbox-${index}`}
                      checked={exp.isOngoing}
                      onChange={() => handleOngoingChange(index)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`ongoing-checkbox-${index}`}
                      className="text-sm"
                    >
                      Currently working (Ongoing)
                    </label>
                  </div> */}

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <DateInputWithIcon
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, e)}
                      disabled={false}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <DateInputWithIcon
                      name="endDate"
                      value={exp.isOngoing ? "" : exp.endDate}
                      onChange={(e) => handleChange(index, e)}
                      disabled={exp.isOngoing}
                    />
                  </div>

                  {/* Ongoing Checkbox */}
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`ongoing-checkbox-${index}`}
                      checked={exp.isOngoing}
                      onChange={() => handleOngoingChange(index)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`ongoing-checkbox-${index}`}
                      className="text-sm"
                    >
                      Currently working (Ongoing)
                    </label>
                  </div>

                  {/* Experience Duration */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      Experience Duration
                    </label>
                    <Select
                      options={experienceOptions}
                      value={exp.experienceDuration}
                      onChange={(option) =>
                        handleExperienceChange(index, option)
                      }
                      isSearchable
                      styles={customSelectStyles}
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                      menuPosition="fixed"
                    />
                  </div> */}
                </div>
              ))}
            </form>
          </div>

          {/* Bottom: Buttons */}
          <div className="w-full max-w-md mx-auto px-2 py-4">
            <button
              type="button"
              onClick={handleAddMore}
              className="text-[#37B874] font-semibold underline mb-2 block"
            >
              + Add More
            </button>

            <Buttons.SubmitButton
              text={
                loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-[#FFF]"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Continue"
                )
              }
              width="w-full"
              rounded="rounded-[12px]"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Experience;
