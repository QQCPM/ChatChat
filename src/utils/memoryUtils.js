// File: src/utils/memoryUtils.js
// Using localStorage for memory storage (can be migrated to Supabase later)

// Memory data structure
const createMemory = (title, category = 'general', template = null) => ({
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
  },
  moments: {
    title: 'A Sweet Moment',
    prompts: [
      'What happened?',
      'What made this moment special?',
      'How did we both react?'
    ]
  },
  dreams: {
    title: 'Our Future Dreams',
    prompts: [
      'What do we dream about together?',
      'Where do we see ourselves?',
      'What are we most excited about?'
    ]
  },
  photos: {
    title: 'Photo Memory',
    prompts: [
      'What was happening in this photo?',
      'What do you remember about this day?',
      'Why is this photo special to us?'
    ]
  },
  general: {
    title: 'A Memory Together',
    prompts: [
      'What happened?',
      'How did it make you feel?',
      'Why is this memory important?'
    ]
  }
};

// localStorage-based memory storage functions
const getMemoriesKey = (uid) => `memories_${uid}`;

const loadMemories = async (uid) => {
  try {
    const stored = localStorage.getItem(getMemoriesKey(uid));
    const memories = stored ? JSON.parse(stored) : [];
    // Sort by creation date (descending)
    return memories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error loading memories:', error);
    return [];
  }
};

const addMemory = async (uid, memory) => {
  try {
    const memories = await loadMemories(uid);
    const newMemory = {
      ...memory,
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    memories.push(newMemory);
    localStorage.setItem(getMemoriesKey(uid), JSON.stringify(memories));
    return true;
  } catch (error) {
    console.error('Error adding memory:', error);
    return false;
  }
};

const updateMemory = async (uid, memoryId, updatedMemory) => {
  try {
    const memories = await loadMemories(uid);
    const index = memories.findIndex(m => m.id === memoryId);
    if (index !== -1) {
      memories[index] = { 
        ...memories[index], 
        ...updatedMemory, 
        lastModified: new Date().toISOString() 
      };
      localStorage.setItem(getMemoriesKey(uid), JSON.stringify(memories));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating memory:', error);
    return false;
  }
};

const deleteMemory = async (uid, memoryId) => {
  try {
    const memories = await loadMemories(uid);
    const filtered = memories.filter(m => m.id !== memoryId);
    localStorage.setItem(getMemoriesKey(uid), JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting memory:', error);
    return false;
  }
};

const addEntryToMemory = async (uid, memoryId, entry) => {
  try {
    const memories = await loadMemories(uid);
    const memoryIndex = memories.findIndex(m => m.id === memoryId);
    if (memoryIndex !== -1) {
      memories[memoryIndex].entries.push(entry);
      memories[memoryIndex].lastModified = new Date().toISOString();
      localStorage.setItem(getMemoriesKey(uid), JSON.stringify(memories));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding entry to memory:', error);
    return false;
  }
};

const searchMemories = async (uid, query) => {
  const memories = await loadMemories(uid);
  if (!query.trim()) return memories;
  
  const lowerQuery = query.toLowerCase();
  return memories.filter(memory => 
    memory.title.toLowerCase().includes(lowerQuery) ||
    memory.entries.some(entry => 
      entry.content.toLowerCase().includes(lowerQuery)
    )
  );
};

const getMemoriesByCategory = async (uid, category) => {
  const memories = await loadMemories(uid);
  return category === 'all' ? memories : memories.filter(m => m.category === category);
};

export {
  createMemory,
  createMemoryEntry,
  memoryCategories,
  memoryTemplates,
  loadMemories,
  addMemory,
  updateMemory,
  deleteMemory,
  addEntryToMemory,
  searchMemories,
  getMemoriesByCategory
};
