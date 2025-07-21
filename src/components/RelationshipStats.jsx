// File: src/components/RelationshipStats.jsx
import React, { useState, useEffect } from "react";

const RelationshipStats = ({ currentRoom, onClose }) => {
  const [stats, setStats] = useState({
    daysTogether: 0,
    totalMessages: 0,
    photosShared: 0,
    videosShared: 0,
    pdfsShared: 0,
    messagesFromYou: 0,
    messagesFromThem: 0
  });

  useEffect(() => {
    if (currentRoom) {
      calculateStats();
    }
  }, [currentRoom]);

  const calculateStats = () => {
    try {
      // Calculate days together
      const startDate = new Date('2024-07-21T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const timeDiff = today.getTime() - startDate.getTime();
      const daysTogether = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Load messages
      const messages = JSON.parse(localStorage.getItem(`chatMessages_${currentRoom}`) || '[]');
      
      let totalMessages = messages.length;
      let photosShared = 0;
      let videosShared = 0;
      let pdfsShared = 0;
      let messagesFromYou = 0;
      let messagesFromThem = 0;

      messages.forEach(msg => {
        // Count messages by user
        if (msg.user === 'You') {
          messagesFromYou++;
        } else if (msg.user === 'Them') {
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

      // Count photos in albums
      const albums = JSON.parse(localStorage.getItem(`photoAlbums_${currentRoom}`) || '{"anniversary":[],"favorites":[],"memories":[],"special":[]}');
      const albumPhotos = Object.values(albums).reduce((total, album) => total + album.length, 0);
      photosShared += albumPhotos;

      setStats({
        daysTogether,
        totalMessages,
        photosShared,
        videosShared,
        pdfsShared,
        messagesFromYou,
        messagesFromThem
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
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
        </div>
      </div>
    </div>
  );
};

export default RelationshipStats;