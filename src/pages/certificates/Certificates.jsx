import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Select from "react-select";
import botImg from "../../assets/logos/Hi_bot.png";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";

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
  const navigate = useNavigate();
  const [educations, setEducations] = useState([
    { institute: "", degree: degreeOptions[0], certificate: null },
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

  // const handleCertificateChange = (index, e) => {
  //   const file = e.target.files[0];
  //   if (
  //     file &&
  //     (file.type === "application/pdf" ||
  //       file.type === "image/jpeg" ||
  //       file.type === "image/png")
  //   ) {
  //     const updated = [...educations];
  //     updated[index].certificate = file;
  //     setEducations(updated);
  //     toast.success("Certificate file selected!");
  //   } else {
  //     toast.error("Please upload a PDF, JPEG, or PNG file!");
  //   }
  // };

  // const handleAddMore = () => {
  //   setEducations((prev) => [
  //     ...prev,
  //     { institute: "", degree: degreeOptions[0], certificate: null },
  //   ]);
  // };

  const handleContinue = () => {
    const isValid = educations.every(
      (edu) => edu.institute.trim() !== "" 
      // && edu.certificate
    );

    if (!isValid) {
      toast.error(
        "Please fill in all fields and upload a certificate for each entry!"
      );
      return;
    }

    const dataToSubmit = educations.map((edu) => ({
      institute: edu.institute,
      degree: edu.degree.value,
      // certificate: edu.certificate.name, 
      // 
      // // You might want to send file data to your backend
    }));

    // Call BE API here
    console.log(dataToSubmit);
    toast.success("Education & Certificates saved successfully!");
    setTimeout(() => navigate("/userDashboard"), 1500); // Replace "/next-page" with your desired route
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
                      name="institute"
                      value={edu.institute}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
                      placeholder="Enter institute name"
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

                  {/* <div>
                    <label className="block text-sm font-medium mb-1">
                      Upload a Certificate
                    </label>
                    <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-[#37B874] rounded bg-green-50 cursor-pointer">
                      <input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        onChange={(e) => handleCertificateChange(index, e)}
                        className="hidden"
                      />
                      <span className="text-[#37B874] text-center">
                        {edu.certificate
                          ? edu.certificate.name
                          : "Select File (PDF, JPEG, PNG)"}
                      </span>
                    </label>
                  </div>

                  {index === educations.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddMore}
                      className="text-[#37B874] font-semibold underline mt-2"
                    >
                      + Add
                    </button>
                  )} */}
                </div>
              ))}

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

export default EducationCertificate;
