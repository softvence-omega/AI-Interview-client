import { FaCalendarAlt } from "react-icons/fa";
import { useRef } from "react";

export const DateInputWithIcon = ({ value, onChange, name, disabled }) => {
  const inputRef = useRef(null);

  const openDatePicker = () => {
    if (inputRef.current) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-2 pr-10 border rounded bg-white text-black border-[#37B874] focus:outline-none focus:ring-2 focus:ring-[#37B874]"
      />
      <FaCalendarAlt
        size={20}
        className={`absolute right-3 top-2.5 cursor-pointer text-[#37B874] ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={disabled ? null : openDatePicker}
      />
    </div>
  );
};
