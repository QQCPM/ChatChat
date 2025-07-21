// File: src/components/MemoryEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createMemoryEntry, addEntryToMemory, updateMemory, deleteMemory, memoryCategories } from '../utils/memoryUtils';

const MemoryEditor = ({ memory, currentRoom, currentUser, onClose, onMemoryUpdated, onMemoryDeleted }) => {
  const [newEntry, setNewEntry] = useState('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef(null);
  const entriesEndRef = useRef(null);

  const category = memoryCategories[memory.category] || memoryCategories.general;

  // Auto-focus textarea when adding entry
  useEffect(() => {
    if (isAddingEntry && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAddingEntry]);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    scrollToBottom();
  }, [memory.entries]);

  const scrollToBottom = () => {
    entriesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;

    const entry = createMemoryEntry(currentUser, newEntry);
    const success = addEntryToMemory(currentRoom, memory.id, entry);
    
    if (success) {
      setNewEntry('');
      setIsAddingEntry(false);
      onMemoryUpdated();
    } else {
      alert('Failed to add entry. Please try again.');
    }
  };

  const handleDeleteMemory = async () => {
    const success = deleteMemory(currentRoom, memory.id);
    if (success) {
      onMemoryDeleted();
    } else {
      alert('Failed to delete memory. Please try again.');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAddEntry();
    } else if (e.key === 'Escape') {
      setIsAddingEntry(false);
      setNewEntry('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl h-[95vh] bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className={`p-6 border-b border-white/30 bg-gradient-to-r ${category.color} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{category.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold">{memory.title}</h1>
                <p className="text-white/80 text-sm">
                  {memory.entries.length} {memory.entries.length === 1 ? 'entry' : 'entries'} • 
                  Created {new Date(memory.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                title="Delete Memory"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-rose-25 to-pink-25">
          {memory.entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Start Your Memory
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                This memory is waiting for its first entry. Share your thoughts, feelings, or experiences about "{memory.title}".
              </p>
              <button
                onClick={() => setIsAddingEntry(true)}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-medium shadow-lg"
              >
                ✍️ Write First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {memory.entries.map((entry, index) => (
                <div key={entry.id} className="relative">
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    entry.author === currentUser
                      ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-400 ml-8'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 mr-8'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                          entry.author === currentUser ? 'bg-pink-500' : 'bg-blue-500'
                        }`}>
                          {entry.author === 'You' ? '👤' : '💕'}
                        </span>
                        <span className="font-medium text-gray-800">{entry.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimestamp(entry.timestamp)}</span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap m-0">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connection line */}
                  {index < memory.entries.length - 1 && (
                    <div className="flex justify-center my-4">
                      <div className="w-px h-4 bg-gradient-to-b from-pink-300 to-rose-300"></div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={entriesEndRef} />
            </div>
          )}
        </div>

        {/* Add Entry Section */}
        <div className="p-6 border-t border-gray-200/50 bg-white/80">
          {isAddingEntry ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  👤
                </span>
                <span className="font-medium text-gray-800">{currentUser}</span>
              </div>
              <textarea
                ref={textareaRef}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts about this memory... (Ctrl/Cmd + Enter to save)"
                className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none min-h-[100px]"
                rows={4}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Press Ctrl/Cmd + Enter to save, Escape to cancel
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsAddingEntry(false);
                      setNewEntry('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEntry}
                    disabled={!newEntry.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Entry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingEntry(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 text-gray-600 hover:text-pink-600"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add your thoughts to this memory...</span>
              </div>
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Memory?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{memory.title}"? This will permanently remove all entries and cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteMemory}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryEditor;