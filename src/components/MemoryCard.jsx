// File: src/components/MemoryCard.jsx
import React from 'react';
import { memoryCategories } from '../utils/memoryUtils';

const MemoryCard = ({ memory, onClick }) => {
  const category = memoryCategories[memory.category] || memoryCategories.general;
  const entryCount = memory.entries.length;
  const lastEntry = memory.entries[memory.entries.length - 1];
  
  // Get preview text from the last entry
  const getPreviewText = () => {
    if (!lastEntry) return 'No entries yet...';
    const text = lastEntry.content;
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  };

  // Format the creation date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get contributors (unique authors)
  const getContributors = () => {
    const authors = [...new Set(memory.entries.map(entry => entry.author))];
    return authors.length > 0 ? authors : ['No entries yet'];
  };

  const contributors = getContributors();

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
    >
      {/* Category Color Bar */}
      <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{category.emoji}</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-rose-600 transition-colors">
                {memory.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {category.name} • {formatDate(memory.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Entry Count Badge */}
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-rose-600 px-2 py-1 rounded-full text-xs font-medium">
            {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
          </div>
        </div>

        {/* Preview Content */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            {getPreviewText()}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span>{contributors.join(' & ')}</span>
          </div>
          
          {lastEntry && (
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated {formatDate(memory.lastModified)}</span>
            </div>
          )}
        </div>

        {/* Hover Effect Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Subtle Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/0 to-rose-50/0 group-hover:from-pink-50/30 group-hover:to-rose-50/30 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default MemoryCard;