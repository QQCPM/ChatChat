// File: src/utils/memoryUtils.js

// Memory data structure
const createMemory = (title, category = 'general', template = null) => ({
  id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: title.trim(),
  category,
  template,
  entries: [],
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  participants: ['You', 'Them']
});

// Memory entry structure
const createMemoryEntry = (author, content, type = 'text') => ({
  id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  author,
  content: content.trim(),
  type, // 'text', 'photo', 'quote'
  timestamp: new Date().toISOString(),
  formattedDate: new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
});

// Memory categories with emojis and colors
const memoryCategories = {
  anniversary: {
    name: 'Anniversary',
    emoji: '💕',
    color: 'from-pink-400 to-rose-400',
    description: 'Special milestones and anniversaries'
  },
  date: {
    name: 'Date Night',
    emoji: '🌹',
    color: 'from-red-400 to-pink-400',
    description: 'Romantic dates and special evenings'
  },
  travel: {
    name: 'Adventures',
    emoji: '✈️',
    color: 'from-blue-400 to-cyan-400',
    description: 'Trips and adventures together'
  },
  letters: {
    name: 'Love Letters',
    emoji: '💌',
    color: 'from-purple-400 to-pink-400',
    description: 'Deep thoughts and love letters'
  },
  moments: {
    name: 'Sweet Moments',
    emoji: '😊',
    color: 'from-yellow-400 to-orange-400',
    description: 'Funny stories and cute interactions'
  },
  dreams: {
    name: 'Future Dreams',
    emoji: '🌟',
    color: 'from-indigo-400 to-purple-400',
    description: 'Plans, hopes and dreams together'
  },
  photos: {
    name: 'Photo Memories',
    emoji: '📸',
    color: 'from-green-400 to-teal-400',
    description: 'Pictures with stories and captions'
  },
  general: {
    name: 'General',
    emoji: '💭',
    color: 'from-gray-400 to-slate-400',
    description: 'Miscellaneous memories'
  }
};

// Memory templates
const memoryTemplates = {
  anniversary: {
    title: 'Our [Number] Year Anniversary',
    prompts: [
      'How did this year feel?',
      'What was your favorite memory from this year?',
      'What are you looking forward to next year?'
    ]
  },
  date: {
    title: '[Date Location/Activity]',
    prompts: [
      'What made this date special?',
      'Favorite moment from today',
      'How did you feel during this date?'
    ]
  },
  travel: {
    title: 'Our Trip to [Destination]',
    prompts: [
      'Best moment from this trip',
      'Funniest thing that happened',
      'What we learned about each other'
    ]
  },
  letters: {
    title: 'A Letter to You',
    prompts: [
      'What I want you to know...',
      'How you make me feel...',
      'Why I love you...'
    ]
  }
};

// Storage functions
const getMemoryStorageKey = (roomCode) => `memories_${roomCode}`;

const saveMemories = (roomCode, memories) => {
  try {
    localStorage.setItem(getMemoryStorageKey(roomCode), JSON.stringify(memories));
    return true;
  } catch (error) {
    console.error('Error saving memories:', error);
    return false;
  }
};

const loadMemories = (roomCode) => {
  try {
    const stored = localStorage.getItem(getMemoryStorageKey(roomCode));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading memories:', error);
    return [];
  }
};

const addMemory = (roomCode, memory) => {
  const memories = loadMemories(roomCode);
  memories.unshift(memory); // Add to beginning for recent-first order
  return saveMemories(roomCode, memories);
};

const updateMemory = (roomCode, memoryId, updatedMemory) => {
  const memories = loadMemories(roomCode);
  const index = memories.findIndex(m => m.id === memoryId);
  if (index !== -1) {
    memories[index] = { ...updatedMemory, lastModified: new Date().toISOString() };
    return saveMemories(roomCode, memories);
  }
  return false;
};

const deleteMemory = (roomCode, memoryId) => {
  const memories = loadMemories(roomCode);
  const filtered = memories.filter(m => m.id !== memoryId);
  return saveMemories(roomCode, filtered);
};

const addEntryToMemory = (roomCode, memoryId, entry) => {
  const memories = loadMemories(roomCode);
  const memory = memories.find(m => m.id === memoryId);
  if (memory) {
    memory.entries.push(entry);
    memory.lastModified = new Date().toISOString();
    return saveMemories(roomCode, memories);
  }
  return false;
};

const searchMemories = (roomCode, query) => {
  const memories = loadMemories(roomCode);
  if (!query.trim()) return memories;
  
  const lowerQuery = query.toLowerCase();
  return memories.filter(memory => 
    memory.title.toLowerCase().includes(lowerQuery) ||
    memory.entries.some(entry => 
      entry.content.toLowerCase().includes(lowerQuery)
    )
  );
};

const getMemoriesByCategory = (roomCode, category) => {
  const memories = loadMemories(roomCode);
  return category === 'all' ? memories : memories.filter(m => m.category === category);
};

export {
  createMemory,
  createMemoryEntry,
  memoryCategories,
  memoryTemplates,
  loadMemories,
  saveMemories,
  addMemory,
  updateMemory,
  deleteMemory,
  addEntryToMemory,
  searchMemories,
  getMemoriesByCategory
};