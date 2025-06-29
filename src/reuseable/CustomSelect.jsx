import { useEffect, useRef, useState } from "react";

const CustomSelect = ({ label, options, value, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <p className="text-sm text-gray-500 mb-2">{label}</p>
      )}

      {/* Select Box */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full bg-green-50 text-green-700 font-medium border border-green-300 rounded-md px-4 py-2 text-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        {value}
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown options */}
      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-green-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-green-100 hover:text-green-500 ${
                option === value ? "bg-green-500 text-white" : "text-gray-700"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
