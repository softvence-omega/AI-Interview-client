import { useState } from "react";
import image from "../../../assets/home-banner.png";
import Buttons from "../../../reuseable/AllButtons";
import "./ContactForm.css";
import CountryList from "country-list-with-dial-code-and-flag";

const ContactForm = () => {
  const countries = CountryList.getAll();

  // Find USA in the countries array
  const usa = countries.find((country) => country.code === "US") || countries[0];

  const getFlagUrl = (countryCode) =>
    `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[240]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    // countryCode: "+1",
    // countryCode: countries[0].dialCode,
    countryCode: usa.dialCode,
  });

  // const [selectedCountry, setSelectedCountry] = useState({
  //   code: "us",
  //   name: "United States",
  //   flag: "https://flagcdn.com/w20/us.png",
  //   phoneCode: "+1",
  // });

  const [isOpen, setIsOpen] = useState(false);

  // const countries = [
  //   {
  //     code: "us",
  //     name: "United States",
  //     flag: "https://flagcdn.com/w20/us.png",
  //     phoneCode: "+1",
  //   },
  //   {
  //     code: "uk",
  //     name: "United Kingdom",
  //     flag: "https://flagcdn.com/w20/gb.png",
  //     phoneCode: "+44",
  //   },
  //   {
  //     code: "fr",
  //     name: "France",
  //     flag: "https://flagcdn.com/w20/fr.png",
  //     phoneCode: "+33",
  //   },
  // ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      countryCode: country.dialCode,
      phone: "",
    }));
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/contact/contact-us`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      let data = null;
      const contentType = response.headers.get("content-type");
  
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
  
      if (response.ok) {
        alert(data?.message || "Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          // countryCode: countries[0].dialCode,
          countryCode: usa.dialCode,
        });
        setSelectedCountry(usa);
      } else {
        alert(data?.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto pt-12 md:pt-20 lg:pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 ">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt="Home Banner"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="w-[80%] mx-auto h-full px-8 items-center justify-center border-1 border-[#37B874] rounded-xl bg-white py-8">
        <form onSubmit={handleSubmit}>
          <div className="form-group w-full">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black text-left">
                First Name<span className="text-[#F00]">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-black text-left bg-[#F1F1F1] focus:border-[#37B874] transition duration-200"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black text-left">
                Last Name<span className="text-[#F00]">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-black text-left bg-[#F1F1F1] focus:border-[#37B874] transition duration-200"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black text-left">
                Phone Number
              </label>
              <div className="phone-input flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center w-24 p-2 border border-gray-300 rounded-l text-black text-left"
                  >
                    <img
                      src={getFlagUrl(selectedCountry.code)}
                      alt={selectedCountry.name}
                      className="w-6 h-4 mr-2"
                    />
                    {selectedCountry.dialCode}
                  </button>

                  {isOpen && (
                    <div className="absolute z-10 text-black bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-60 overflow-auto w-44">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-2 py-1 border-b border-gray-300 text-sm text-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />

                      {countries
                        .filter(
                          (country) =>
                            country.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            country.dialCode.includes(searchQuery) ||
                            country.code
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((country) => (
                          <button
                            key={country.code}
                            onClick={() => handleCountryChange(country)}
                            className="w-full px-2 py-1 text-left flex items-center hover:bg-gray-100"
                          >
                            <img
                              src={getFlagUrl(country.code)}
                              alt={country.name}
                              className="w-6 h-4 mr-2"
                            />
                            {country.dialCode}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* <div className="relative">
                  <button
                    type="button"
                    className="flex items-center w-24 p-2 border border-gray-300 rounded-l text-black text-left"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <img
                      src={selectedCountry.flag}
                      alt={`${selectedCountry.name} Flag`}
                      className="w-6 h-4 mr-2"
                    />
                    {selectedCountry.phoneCode}
                  </button>
                  {isOpen && (
                    <div className="absolute z-10 text-black bg-white border border-gray-300 rounded shadow-lg mt-1 w-full">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountryChange(country)}
                          className="w-full px-2 py-1 text-left flex items-center hover:bg-gray-100"
                        >
                          <img
                            src={country.flag}
                            alt={`${country.name} Flag`}
                            className="w-6 h-4 mr-2"
                          />
                          {country.phoneCode}
                        </button>
                      ))}
                    </div>
                  )}
                </div> */}
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-r text-black text-left bg-[#F1F1F1] focus:border-[#37B874] transition duration-200"
                  placeholder={selectedCountry.phoneCode}
                  // required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black text-left">
                Email<span className="text-[#F00]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-black text-left bg-[#F1F1F1] focus:border-[#37B874] transition duration-200"
                placeholder="@gmail.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-black text-left">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-black text-left bg-[#F1F1F1] focus:border-[#37B874] transition duration-200"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="flex justify-center items-center mt-8">
              <button
                type="submit"
                className="h-12 w-36 rounded-xl bg-[#37B874] text-white font-semibold hover:bg-[#2c9458] transition duration-200"
              >
                Send Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
