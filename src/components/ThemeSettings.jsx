// File: src/components/ThemeSettings.jsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSettings = ({ onClose }) => {
  const {
    currentTheme,
    customBackground,
    backgroundOpacity,
    timeThemes,
    defaultTheme,
    getCurrentThemeConfig,
    getSuggestedTheme,
    setTheme,
    setCustomBackground,
    setBackgroundOpacity,
    resetToDefault
  } = useTheme();

  const [activeTab, setActiveTab] = useState('presets');
  const [uploadError, setUploadError] = useState('');

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setCustomBackground(e.target.result);
        setTheme('custom');
        setUploadError('');
      } catch (error) {
        setUploadError('Failed to process image');
        console.error('Error processing background image:', error);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read image file');
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleThemeSelect = (themeKey) => {
    setTheme(themeKey);
  };

  const removeCustomBackground = () => {
    setCustomBackground(null);
    setTheme('default');
  };

  const suggestedTheme = getSuggestedTheme();
  const currentConfig = getCurrentThemeConfig();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Chat Themes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Current: {currentConfig.mood} {currentConfig.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-4 bg-white/40">
          {[
            { key: 'presets', label: 'Time Themes', icon: '🕐' },
            { key: 'custom', label: 'Custom Background', icon: '🖼️' },
            { key: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <span className="text-lg mr-2">{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Suggested Theme */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Suggested for Now</h3>
                    <p className="text-sm text-gray-600">
                      {timeThemes[suggestedTheme].mood} {timeThemes[suggestedTheme].name}
                    </p>
                    <p className="text-xs text-gray-500">{timeThemes[suggestedTheme].time}</p>
                  </div>
                  <button
                    onClick={() => handleThemeSelect(suggestedTheme)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Default Theme */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  currentTheme === 'default' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white/60 hover:bg-white/80'
                }`}
                onClick={() => handleThemeSelect('default')}
              >
                <div className={`h-16 rounded-lg bg-gradient-to-br ${defaultTheme.gradient} mb-3`}></div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{defaultTheme.mood} {defaultTheme.name}</h3>
                    <p className="text-sm text-gray-600">Original soft romance theme</p>
                  </div>
                  {currentTheme === 'default' && (
                    <div className="text-pink-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Themes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(timeThemes).map(([key, theme]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      currentTheme === key ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white/60 hover:bg-white/80'
                    }`}
                    onClick={() => handleThemeSelect(key)}
                  >
                    <div className={`h-16 rounded-lg bg-gradient-to-br ${theme.gradient} mb-3`}></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{theme.mood} {theme.name.split(' - ')[1]}</h3>
                        <p className="text-xs text-gray-500">{theme.time}</p>
                      </div>
                      {currentTheme === key && (
                        <div className="text-pink-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Custom Background</h3>
                <p className="text-gray-600 text-sm mb-6">Upload your favorite couple photo as chat background</p>
              </div>

              {/* Current Custom Background */}
              {customBackground && (
                <div className="relative">
                  <div className="h-40 rounded-xl overflow-hidden relative">
                    <img 
                      src={customBackground} 
                      alt="Custom background" 
                      className="w-full h-full object-cover"
                      style={{ opacity: backgroundOpacity }}
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  <button
                    onClick={removeCustomBackground}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove background"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                  id="background-upload"
                />
                <label htmlFor="background-upload" className="cursor-pointer">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">Click to upload background</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </label>
              </div>

              {uploadError && (
                <div className="text-center p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  {uploadError}
                </div>
              )}

              {/* Opacity Slider */}
              {customBackground && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Background Opacity: {Math.round(backgroundOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={backgroundOpacity}
                    onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtle</span>
                    <span>Bold</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Theme Settings</h3>
                <p className="text-gray-600 text-sm mb-6">Manage your theme preferences</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/60 rounded-lg">
                  <h4 className="font-medium mb-2">Current Theme</h4>
                  <p className="text-sm text-gray-600">
                    {currentConfig.mood} {currentConfig.name}
                  </p>
                </div>

                <button
                  onClick={resetToDefault}
                  className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset to Default Theme
                </button>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-800">💡 Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Time themes change the mood for different parts of the day</li>
                    <li>• Custom backgrounds work best with couple photos</li>
                    <li>• Lower opacity keeps text readable</li>
                    <li>• Themes are saved and sync across devices</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;