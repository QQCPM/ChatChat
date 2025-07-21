// File: src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customBackground, setCustomBackground] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);

  // Time-based theme presets
  const timeThemes = {
    dawn: {
      name: 'Dawn - New Beginning',
      gradient: 'from-orange-200 via-pink-200 to-yellow-100',
      time: '5:00 - 8:00 AM',
      mood: '🌅',
      bubbleStyle: 'light'
    },
    morning: {
      name: 'Morning - Bright Energy',
      gradient: 'from-yellow-200 via-blue-200 to-white',
      time: '8:00 - 11:00 AM',
      mood: '☀️',
      bubbleStyle: 'light'
    },
    midday: {
      name: 'Midday - Pure Clarity',
      gradient: 'from-sky-100 via-white to-cyan-100',
      time: '11:00 AM - 2:00 PM',
      mood: '🌤️',
      bubbleStyle: 'light'
    },
    afternoon: {
      name: 'Afternoon - Golden Calm',
      gradient: 'from-amber-200 via-orange-100 to-yellow-50',
      time: '2:00 - 5:00 PM',
      mood: '🌞',
      bubbleStyle: 'light'
    },
    evening: {
      name: 'Evening - Golden Hour Romance',
      gradient: 'from-orange-300 via-rose-200 to-purple-200',
      time: '5:00 - 8:00 PM',
      mood: '🌇',
      bubbleStyle: 'mixed'
    },
    night: {
      name: 'Night - Cozy Intimacy',
      gradient: 'from-indigo-300 via-purple-300 to-rose-300',
      time: '8:00 - 11:00 PM',
      mood: '🌆',
      bubbleStyle: 'dark'
    },
    midnight: {
      name: 'Midnight - Dreamy Blue Moon',
      gradient: 'from-slate-400 via-indigo-400 to-blue-300',
      time: '11:00 PM - 5:00 AM',
      mood: '🌙',
      bubbleStyle: 'dark'
    }
  };

  const defaultTheme = {
    name: 'Default - Soft Romance',
    gradient: 'from-rose-100 to-teal-100',
    mood: '💕',
    bubbleStyle: 'light'
  };

  // Load saved theme preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme');
    const savedBackground = localStorage.getItem('customBackground');
    const savedOpacity = localStorage.getItem('backgroundOpacity');

    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    if (savedBackground) {
      setCustomBackground(savedBackground);
    }
    if (savedOpacity) {
      setBackgroundOpacity(parseFloat(savedOpacity));
    }
  }, []);

  // Save theme preferences
  const saveThemePreferences = (theme, background, opacity) => {
    if (theme !== undefined) {
      localStorage.setItem('chatTheme', theme);
      setCurrentTheme(theme);
    }
    if (background !== undefined) {
      if (background) {
        localStorage.setItem('customBackground', background);
      } else {
        localStorage.removeItem('customBackground');
      }
      setCustomBackground(background);
    }
    if (opacity !== undefined) {
      localStorage.setItem('backgroundOpacity', opacity.toString());
      setBackgroundOpacity(opacity);
    }
  };

  // Get current theme configuration
  const getCurrentThemeConfig = () => {
    if (currentTheme === 'default') {
      return defaultTheme;
    }
    if (currentTheme === 'custom') {
      return {
        name: 'Custom Background',
        background: customBackground,
        opacity: backgroundOpacity,
        mood: '🖼️',
        bubbleStyle: 'adaptive'
      };
    }
    return timeThemes[currentTheme] || defaultTheme;
  };

  // Get suggested theme based on current time
  const getSuggestedTheme = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 14) return 'midday';
    if (hour >= 14 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    if (hour >= 20 && hour < 23) return 'night';
    return 'midnight';
  };

  const value = {
    currentTheme,
    customBackground,
    backgroundOpacity,
    timeThemes,
    defaultTheme,
    getCurrentThemeConfig,
    getSuggestedTheme,
    setTheme: (theme) => saveThemePreferences(theme, undefined, undefined),
    setCustomBackground: (background) => saveThemePreferences(undefined, background, undefined),
    setBackgroundOpacity: (opacity) => saveThemePreferences(undefined, undefined, opacity),
    resetToDefault: () => {
      localStorage.removeItem('chatTheme');
      localStorage.removeItem('customBackground');
      localStorage.removeItem('backgroundOpacity');
      setCurrentTheme('default');
      setCustomBackground(null);
      setBackgroundOpacity(0.3);
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};