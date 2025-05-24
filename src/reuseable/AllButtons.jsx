import React from 'react';
import { Link } from 'react-router-dom';

const baseStyles = 'transition-all duration-200 hover:cursor-pointer';

const LinkButton = ({
  text = 'Click Me',
  to = '/',
  height = 'h-full',
  width = 'w-full',
  textColor = 'text-white',
  bgColor = 'bg-[#37B874]',
  rounded='rounded-4xl',
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center ${height} ${width} ${textColor} ${bgColor} ${baseStyles} ${rounded}`}>
      {text}
    </Link>
  );
};


const NormalLinkButton = ({
  text = 'Click Me',
  to = '/',
  height = 'h-[40px]',
  width = 'w-full',
  textColor = 'text-[#676768]',
  bgColor = 'bg-transparent',
  rounded='rounded-4xl',
  className = ''
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center ${height} ${width} ${textColor} ${bgColor} ${baseStyles} ${rounded} ${className}`}>
      {text}
    </Link>
  );
};

const SubmitButton = ({
  text = 'Submit',
  height = 'h-[40px]',
  width = 'w-full',
  textColor = 'text-white',
  bgColor = 'bg-[#37B874]',
  rounded = 'rounded-[12px]',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = `flex items-center justify-center font-semibold transition duration-200 cursor-pointer`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${height} ${width} ${bgColor} ${textColor} ${rounded} ${baseStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};



const Buttons = {
  LinkButton,
  SubmitButton,
  NormalLinkButton
};

export default Buttons;
