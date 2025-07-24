// File: src/components/StorageManager.jsx
import React from "react";

const StorageManager = ({ onClose }) => {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Storage Manager
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Storage Overview */}
        <div className="p-6 border-b border-white/30">
          <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <p className="text-lg text-gray-600">Your storage is now managed by Supabase. You can manage your storage in the Supabase dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageManager;