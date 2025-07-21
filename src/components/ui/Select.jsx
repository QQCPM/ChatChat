// File: src/components/ui/Select.jsx
import React from "react";

const Select = ({ value, onChange, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-white/80 border border-white/30 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
    >
      {children}
    </select>
  );
};

export default Select;
