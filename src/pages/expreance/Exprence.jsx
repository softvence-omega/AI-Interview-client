import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import botImg from "../../assets/logos/Hi_bot.png";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";
import { Toaster, toast } from "sonner"; // Sonner
import { useNavigate } from "react-router-dom";

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

const experienceOptions = [
  "Less than 1 Year",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "5+ Years",
].map((exp) => ({ value: exp, label: exp }));

const Experience = () => {
    const navigate= useNavigate()
  const [experiences, setExperiences] = useState([
    { description: "", experience: experienceOptions[2] },
  ]);
  const scrollRef = useRef(null); // Create a ref for the scrollable div

  // Scroll to bottom whenever experiences array changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling for better UX
      });
    }
  }, [experiences]); // Trigger on experiences array changes

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...experiences];
    updated[index][name] = value;
    setExperiences(updated);
  };

  const handleExperienceChange = (index, selectedOption) => {
    const updated = [...experiences];
    updated[index].experience = selectedOption;
    setExperiences(updated);
  };

  const handleAddMore = () => {
    setExperiences((prev) => [
      ...prev,
      { description: "", experience: experienceOptions[2] },
    ]);
  };

  const handleSubmit = () => {
    const isValid = experiences.every((exp) => exp.description.trim() !== "");

    if (!isValid) {
      toast.error("Please describe all experiences.");
      return;
    }

    const dataToSubmit = experiences.map((exp) => ({
      description: exp.description,
      experience: exp.experience.value,
    }));

    console.log(dataToSubmit);   
    toast.success("Experiences submitted!");

    //call be route here
     //call be route here

    setTimeout(() => navigate("/certificates"), 1500)
  };

  return (
    <Container>
      <Toaster richColors position="top-center" /> {/* Sonner toaster */}
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

        {/* Right Section: Split into Three Divs */}
        <div className="flex-1 flex flex-col justify-center w-full h-screen md:h-auto">
          {/* Top: Header */}
          <div className="w-full max-w-md mx-auto py-4 px-2">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Experience
            </h3>
          </div>

          {/* Middle: Scrollable Experiences */}
          <div
            ref={scrollRef} // Attach ref to scrollable div
            className="flex-1 w-full max-w-md mx-auto px-2 md:max-h-[400px] md:overflow-y-auto"
          >
            <form className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="space-y-4 border-b pb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Describe
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={exp.description}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Describe your experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Time
                    </label>
                    <Select
                      options={experienceOptions}
                      value={exp.experience}
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
                  </div>
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
              text="Continue"
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