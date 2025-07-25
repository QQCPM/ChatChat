// File: src/components/RelationshipStats.jsx
import React, { useState, useEffect } from "react";

const RelationshipStats = ({ currentRoom, currentUser, onClose }) => {
  const [stats, setStats] = useState({
    daysTogether: 0,
    totalMessages: 0,
    photosShared: 0,
    videosShared: 0,
    pdfsShared: 0,
    messagesFromYou: 0,
    messagesFromThem: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRoom && currentUser) {
      calculateStats();
    }
  }, [currentRoom, currentUser]);

  const calculateStats = async () => {
    setLoading(true);
    try {
      // Check cache first (5 minute cache)
      const cacheKey = `relationshipStats_${currentRoom}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;
        const cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        if (cacheAge < cacheTimeout) {
          setStats(data);
          setLoading(false);
          return;
        }
      }
      // Calculate days together with timezone awareness
      // Start date: July 21, 2024 (excluded), so July 22 is day 1
      const startDate = new Date(2024, 6, 22); // July 22, 2024 in local timezone (day 1)
      const today = new Date();
      const timeDiff = today.getTime() - startDate.getTime();
      const daysTogether = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

      // Load messages from localStorage instead of Firestore
      const savedMessages = localStorage.getItem(`chatMessages_${currentRoom}`);
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      
      let totalMessages = messages.length;
      let photosShared = 0;
      let videosShared = 0;
      let pdfsShared = 0;
      let messagesFromYou = 0;
      let messagesFromThem = 0;

      messages.forEach(msg => {
        // Count messages by user using actual displayName
        if (msg.user === currentUser) {
          messagesFromYou++;
        } else {
          messagesFromThem++;
        }

        // Count media types
        if (msg.text.startsWith('data:image/') || msg.text.startsWith('http')) {
          photosShared++;
        } else if (msg.text.startsWith('{"type":"video"')) {
          videosShared++;
        } else if (msg.text.startsWith('{"type":"pdf"')) {
          pdfsShared++;
        }
      });

      // Count photos in albums from localStorage
      const albumsData = localStorage.getItem(`photoAlbums_${currentRoom}`);
      if (albumsData) {
        const albums = JSON.parse(albumsData);
        Object.values(albums).forEach(album => {
          if (Array.isArray(album)) {
            photosShared += album.length;
          }
        });
      }

      const newStats = {
        daysTogether,
        totalMessages,
        photosShared,
        videosShared,
        pdfsShared,
        messagesFromYou,
        messagesFromThem
      };

      setStats(newStats);

      // Cache the results
      const cacheKey = `relationshipStats_${currentRoom}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        data: newStats,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
    setLoading(false);
  };

  const statCards = [
    { label: 'Days Together', value: stats.daysTogether, icon: '💕', color: 'from-pink-500 to-rose-500' },
    { label: 'Total Messages', value: stats.totalMessages, icon: '💬', color: 'from-blue-500 to-indigo-500' },
    { label: 'Photos Shared', value: stats.photosShared, icon: '📸', color: 'from-green-500 to-emerald-500' },
    { label: 'Videos Shared', value: stats.videosShared, icon: '🎥', color: 'from-purple-500 to-violet-500' },
    { label: 'PDFs Shared', value: stats.pdfsShared, icon: '📄', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Our Journey Together
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

        {/* Stats Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statCards.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 hover:bg-white/70 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{stat.icon}</span>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Distribution */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Distribution</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{stats.messagesFromYou}</p>
                    <p className="text-sm text-gray-600">Messages from You</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-rose-600">{stats.messagesFromThem}</p>
                    <p className="text-sm text-gray-600">Messages from Them</p>
                  </div>
                </div>
              </div>

              {/* Fun Facts */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fun Facts</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📅</span>
                    <p className="text-sm text-gray-700">
                      You've been chatting for <strong>{stats.daysTogether}</strong> beautiful days!
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">💌</span>
                    <p className="text-sm text-gray-700">
                      That's an average of <strong>{stats.daysTogether > 0 ? (stats.totalMessages / stats.daysTogether).toFixed(1) : 0}</strong> messages per day!
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🎭</span>
                    <p className="text-sm text-gray-700">
                      You've shared <strong>{stats.photosShared + stats.videosShared}</strong> precious memories together!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipStats;