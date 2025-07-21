// File: src/components/ui/Card.jsx
import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-8 w-full max-w-md">
      {children}
    </div>
  );
};

export default Card;
