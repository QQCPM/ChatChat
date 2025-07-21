// File: src/components/ThemeElements.jsx
import React from 'react';

const ThemeElements = ({ theme }) => {
  const renderDawnElements = () => (
    <>
      {/* Sunrise */}
      <div className="absolute bottom-0 right-10 w-32 h-32 bg-gradient-to-t from-orange-300 via-yellow-300 to-transparent rounded-full opacity-80 animate-pulse"></div>
      
      {/* Sun rays */}
      <div className="absolute bottom-16 right-16 w-20 h-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-8 bg-gradient-to-t from-orange-400 to-transparent opacity-60"
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: '50% 100%',
              left: '50%',
              bottom: '0'
            }}
          />
        ))}
      </div>

      {/* Morning clouds */}
      <div className="absolute top-10 left-10 w-16 h-8 bg-white/40 rounded-full blur-sm"></div>
      <div className="absolute top-8 left-14 w-12 h-6 bg-white/30 rounded-full blur-sm"></div>
      <div className="absolute top-20 right-20 w-20 h-10 bg-white/35 rounded-full blur-sm"></div>
    </>
  );

  const renderMorningElements = () => (
    <>
      {/* Bright sun */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-radial from-yellow-300 via-yellow-400 to-orange-400 rounded-full opacity-90 animate-spin" style={{ animationDuration: '20s' }}></div>
      
      {/* Sun rays */}
      <div className="absolute top-16 right-16 w-16 h-16">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-6 bg-gradient-to-t from-yellow-400 to-transparent opacity-80"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '50% 100%',
              left: '50%',
              bottom: '0'
            }}
          />
        ))}
      </div>

      {/* White fluffy clouds */}
      <div className="absolute top-16 left-8 w-20 h-10 bg-white/50 rounded-full blur-sm animate-float"></div>
      <div className="absolute top-12 left-12 w-16 h-8 bg-white/40 rounded-full blur-sm"></div>
      <div className="absolute top-8 right-40 w-24 h-12 bg-white/45 rounded-full blur-sm animate-float-delayed"></div>
    </>
  );

  const renderMiddayElements = () => (
    <>
      {/* Bright midday sun */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-gradient-radial from-yellow-200 via-yellow-300 to-orange-300 rounded-full opacity-95"></div>
      
      {/* Intense sun rays */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-20">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-8 bg-gradient-to-t from-yellow-300 to-transparent opacity-70"
            style={{
              transform: `rotate(${i * 22.5}deg)`,
              transformOrigin: '50% 100%',
              left: '50%',
              bottom: '0'
            }}
          />
        ))}
      </div>

      {/* Clear sky - minimal clouds */}
      <div className="absolute top-20 right-12 w-18 h-9 bg-white/30 rounded-full blur-sm"></div>
      <div className="absolute top-24 left-16 w-16 h-8 bg-white/25 rounded-full blur-sm"></div>
    </>
  );

  const renderAfternoonElements = () => (
    <>
      {/* Warm afternoon sun */}
      <div className="absolute top-12 right-12 w-26 h-26 bg-gradient-radial from-amber-200 via-orange-300 to-red-300 rounded-full opacity-85 animate-pulse" style={{ animationDuration: '3s' }}></div>
      
      {/* Warm rays */}
      <div className="absolute top-18 right-18 w-18 h-18">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-7 bg-gradient-to-t from-amber-400 to-transparent opacity-75"
            style={{
              transform: `rotate(${i * 36}deg)`,
              transformOrigin: '50% 100%',
              left: '50%',
              bottom: '0'
            }}
          />
        ))}
      </div>

      {/* Soft afternoon clouds */}
      <div className="absolute top-8 left-10 w-22 h-11 bg-white/40 rounded-full blur-sm animate-float"></div>
      <div className="absolute top-14 left-14 w-18 h-9 bg-white/35 rounded-full blur-sm"></div>
      <div className="absolute top-6 right-40 w-24 h-12 bg-white/38 rounded-full blur-sm animate-float-delayed"></div>
    </>
  );

  const renderEveningElements = () => (
    <>
      {/* Setting sun */}
      <div className="absolute bottom-8 right-8 w-32 h-32 bg-gradient-radial from-orange-400 via-red-400 to-purple-400 rounded-full opacity-90"></div>
      
      {/* Golden hour rays */}
      <div className="absolute bottom-14 right-14 w-24 h-24">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-10 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent opacity-80"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '50% 100%',
              left: '50%',
              bottom: '0'
            }}
          />
        ))}
      </div>

      {/* Evening clouds with golden tint */}
      <div className="absolute top-12 left-8 w-24 h-12 bg-gradient-to-r from-orange-200/40 to-pink-200/40 rounded-full blur-sm animate-float"></div>
      <div className="absolute top-8 left-12 w-20 h-10 bg-gradient-to-r from-yellow-200/35 to-orange-200/35 rounded-full blur-sm"></div>
      <div className="absolute top-16 right-32 w-28 h-14 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-sm animate-float-delayed"></div>
    </>
  );

  const renderNightElements = () => (
    <>
      {/* Moon */}
      <div className="absolute top-8 right-12 w-20 h-20 bg-gradient-radial from-yellow-100 via-gray-100 to-gray-200 rounded-full opacity-90"></div>
      
      {/* Moon craters */}
      <div className="absolute top-10 right-14 w-3 h-3 bg-gray-300/50 rounded-full"></div>
      <div className="absolute top-14 right-16 w-2 h-2 bg-gray-300/40 rounded-full"></div>
      <div className="absolute top-12 right-18 w-2 h-2 bg-gray-300/45 rounded-full"></div>

      {/* Stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-twinkle"
          style={{
            top: `${10 + (i * 7) % 60}%`,
            left: `${15 + (i * 13) % 70}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: '2s'
          }}
        />
      ))}

      {/* City lights silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 w-2 h-8 bg-yellow-300/40 opacity-80 animate-pulse"
          style={{
            left: `${20 + i * 10}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </>
  );

  const renderMidnightElements = () => (
    <>
      {/* Crescent moon */}
      <div className="absolute top-6 right-8 w-16 h-16 relative">
        <div className="w-16 h-16 bg-gradient-radial from-gray-100 to-gray-300 rounded-full opacity-95"></div>
        <div className="absolute top-0 right-2 w-12 h-16 bg-slate-900/20 rounded-full"></div>
      </div>

      {/* Bright stars constellation */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            top: `${5 + (i * 11) % 80}%`,
            left: `${10 + (i * 17) % 80}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: '3s',
            opacity: Math.random() * 0.8 + 0.2
          }}
        />
      ))}

      {/* Shooting star */}
      <div className="absolute top-20 left-20 w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-shooting-star"></div>

      {/* Dark clouds */}
      <div className="absolute top-16 left-16 w-32 h-16 bg-slate-700/20 rounded-full blur-lg"></div>
      <div className="absolute top-10 right-24 w-28 h-14 bg-slate-600/15 rounded-full blur-lg"></div>
    </>
  );

  const themeElements = {
    dawn: renderDawnElements,
    morning: renderMorningElements,
    midday: renderMiddayElements,
    afternoon: renderAfternoonElements,
    evening: renderEveningElements,
    night: renderNightElements,
    midnight: renderMidnightElements
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {themeElements[theme] && themeElements[theme]()}
    </div>
  );
};

export default ThemeElements;