// File: src/components/MemoryBook.jsx
import React, { useState, useEffect } from 'react';
import { loadMemories, memoryCategories, searchMemories, getMemoriesByCategory } from '../utils/memoryUtils';
import MemoryCard from './MemoryCard';
import MemoryCreator from './MemoryCreator';
import MemoryEditor from './MemoryEditor';

const MemoryBook = ({ currentRoom, currentUser, onClose }) => {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreator, setShowCreator] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [activeView, setActiveView] = useState('gallery'); // 'gallery', 'editor'

  // Load memories on mount and when room changes
  useEffect(() => {
    if (currentRoom) {
      loadMemoriesFromStorage();
    }
  }, [currentRoom]);

  // Filter memories when search or category changes
  useEffect(() => {
    filterMemories();
  }, [memories, searchQuery, selectedCategory]);

  const loadMemoriesFromStorage = () => {
    const loadedMemories = loadMemories(currentRoom);
    setMemories(loadedMemories);
  };

  const filterMemories = () => {
    let filtered = memories;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = getMemoriesByCategory(currentRoom, selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchMemories(currentRoom, searchQuery);
      // Re-apply category filter if needed
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(m => m.category === selectedCategory);
      }
    }

    setFilteredMemories(filtered);
  };

  const handleMemoryCreated = () => {
    loadMemoriesFromStorage();
    setShowCreator(false);
  };

  const handleEditMemory = (memory) => {
    setEditingMemory(memory);
    setActiveView('editor');
  };

  const handleMemoryUpdated = () => {
    loadMemoriesFromStorage();
    setEditingMemory(null);
    setActiveView('gallery');
  };

  const handleDeleteMemory = () => {
    loadMemoriesFromStorage();
    setEditingMemory(null);
    setActiveView('gallery');
  };

  const getCategoryStats = () => {
    const stats = {};
    memories.forEach(memory => {
      stats[memory.category] = (stats[memory.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  if (activeView === 'editor' && editingMemory) {
    return (
      <MemoryEditor
        memory={editingMemory}
        currentRoom={currentRoom}
        currentUser={currentUser}
        onClose={() => setActiveView('gallery')}
        onMemoryUpdated={handleMemoryUpdated}
        onMemoryDeleted={handleDeleteMemory}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-6xl h-[95vh] bg-gradient-to-br from-rose-50 to-pink-50 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rose-200/50 bg-white/30">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              📖 Our Memory Book
            </h1>
            <p className="text-rose-600/70 mt-1">
              {memories.length} precious {memories.length === 1 ? 'memory' : 'memories'} together
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreator(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-medium shadow-lg"
            >
              ✨ Create Memory
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-rose-200/50 bg-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories..."
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'bg-white/60 text-rose-700 hover:bg-white/80'
                }`}
              >
                All ({memories.length})
              </button>
              {Object.entries(memoryCategories).map(([key, category]) => {
                const count = categoryStats[key] || 0;
                if (count === 0) return null;
                
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                        : 'bg-white/60 text-rose-700 hover:bg-white/80'
                    }`}
                  >
                    {category.emoji} {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Memory Gallery */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredMemories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-8xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-rose-600 mb-2">
                {memories.length === 0 ? 'Your First Memory Awaits' : 'No Memories Found'}
              </h3>
              <p className="text-rose-500 mb-6 max-w-md">
                {memories.length === 0 
                  ? 'Create your first shared memory together. Document your journey, feelings, and special moments.'
                  : 'Try adjusting your search or filter to find the memory you\'re looking for.'
                }
              </p>
              {memories.length === 0 && (
                <button
                  onClick={() => setShowCreator(true)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-medium shadow-lg"
                >
                  ✨ Create Your First Memory
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => handleEditMemory(memory)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Memory Creator Modal */}
        {showCreator && (
          <MemoryCreator
            currentRoom={currentRoom}
            currentUser={currentUser}
            onClose={() => setShowCreator(false)}
            onMemoryCreated={handleMemoryCreated}
          />
        )}
      </div>
    </div>
  );
};

export default MemoryBook;