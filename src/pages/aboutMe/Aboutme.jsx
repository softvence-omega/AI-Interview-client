import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import botImg from "../../assets/logos/Hi_bot.png"; // Adjust path as needed

// Country list (you can move this to a separate file if preferred)
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "India", "Bangladesh", "Brazil", "China", "Japan", "South Korea", "Mexico",
  "Russia", "South Africa", "Spain", "Italy", "Netherlands", "Norway", "Sweden",
  "Denmark", "New Zealand", "United Arab Emirates", "Saudi Arabia", "Pakistan"
  // Add more as needed
];

const AboutMe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: "",
    country: "United Kingdom",
    skills: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e) => {
    const skill = e.target.value;
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleContinue = () => {
    if (!formData.city || !formData.skills.length) {
      toast.error("Please fill in all required fields!");
      return;
    }
    toast.success("About Me saved successfully!");
    setTimeout(() => navigate("/next-page"), 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen items-center justify-center px-4 pt-24 gap-12">
      {/* Left: Bot and Welcome */}
      <div className="flex flex-col items-center text-center space-y-6 flex-1">
        <h1 className="text-4xl font-bold text-black">Hello Russell!</h1>
        <h2 className="text-3xl font-semibold text-black">Welcome</h2>
        <img
          src={botImg}
          alt="Bot"
          className="w-64 h-auto object-contain mt-6"
        />
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-md">
          <h3 className="text-2xl font-semibold text-black mb-6 text-center">
            About Me
          </h3>
          <form className="space-y-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter your city"
                required
              />
            </div>

            {/* Country Dropdown */}
            <div className="bg-white">
              <label className="block text-sm font-medium mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded relative"
              >
                {countries.map((country, idx) => (
                  <option key={idx} value={country}  >
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Skills</label>
              <select
                multiple
                value={formData.skills}
                onChange={handleSkillChange}
                className="w-full p-2 border rounded"
              >
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Project Management">Project Management</option>
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-200 text-green-800 px-2 py-1 rounded"
                  >
                    {skill}{" "}
                    <span
                      className="ml-1 cursor-pointer font-bold"
                      onClick={() =>
                        handleSkillChange({ target: { value: skill } })
                      }
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
