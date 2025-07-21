// File: src/components/ui/Button.jsx
import React from "react";

const Button = ({ onClick, disabled, children, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
