// File: src/components/MemoryCreator.jsx
import React, { useState } from 'react';
import { createMemory, addMemory, memoryCategories, memoryTemplates } from '../utils/memoryUtils';

const MemoryCreator = ({ currentRoom, currentUser, onClose, onMemoryCreated }) => {
  const [step, setStep] = useState(1); // 1: Select category, 2: Choose template, 3: Set title
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setStep(2);
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    const template = memoryTemplates[templateKey];
    if (template) {
      setCustomTitle(template.title);
    }
    setStep(3);
  };

  const handleCreateMemory = async () => {
    if (!customTitle.trim()) return;

    setIsCreating(true);
    
    try {
      const memory = createMemory(customTitle, selectedCategory, selectedTemplate);
      const success = await addMemory(currentRoom, memory);
      
      if (success) {
        onMemoryCreated();
      } else {
        alert('Failed to create memory. Please try again.');
      }
    } catch (error) {
      console.error('Error creating memory:', error);
      alert('Error creating memory. Please try again.');
    } finally {
        setIsCreating(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const category = selectedCategory ? memoryCategories[selectedCategory] : null;
  const template = selectedTemplate ? memoryTemplates[selectedTemplate] : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">✨ Create New Memory</h2>
              <p className="text-gray-600 mt-1">
                Step {step} of 3: {step === 1 ? 'Choose Category' : step === 2 ? 'Select Template' : 'Set Title'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                What kind of memory would you like to create?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(memoryCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => handleCategorySelect(key)}
                    className="group p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left hover:scale-105"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{category.emoji}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-rose-600">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {step === 2 && category && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Choose a template for your {category.name.toLowerCase()}
                </h3>
              </div>
              
              <div className="space-y-3">
                {/* Template options based on category */}
                {memoryTemplates[selectedCategory] && (
                  <button
                    onClick={() => handleTemplateSelect(selectedCategory)}
                    className="w-full p-4 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left group"
                  >
                    <h4 className="font-semibold text-gray-800 group-hover:text-rose-600">
                      📝 {category.name} Template
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Pre-made prompts: {memoryTemplates[selectedCategory].prompts.join(', ')}
                    </p>
                  </button>
                )}
                
                {/* Custom option */}
                <button
                  onClick={() => handleTemplateSelect(null)}
                  className="w-full p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 text-left group"
                >
                  <h4 className="font-semibold text-gray-800 group-hover:text-rose-600">
                    ✍️ Custom Memory
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Create your own memory from scratch
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Title Input */}
          {step === 3 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="text-lg font-semibold text-gray-800">
                  Give your memory a title
                </h3>
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter memory title..."
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg"
                  autoFocus
                />
                {template && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Template prompts:</p>
                    <ul className="text-sm text-blue-600 space-y-1">
                      {template.prompts.map((prompt, index) => (
                        <li key={index}>• {prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50 bg-gray-50/50 flex justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={goBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            
            {step === 3 && (
              <button
                onClick={handleCreateMemory}
                disabled={!customTitle.trim() || isCreating}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Memory'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCreator;