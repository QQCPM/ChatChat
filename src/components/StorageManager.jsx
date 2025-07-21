// File: src/components/StorageManager.jsx
import React, { useState, useEffect } from "react";

const StorageManager = ({ currentRoom, onClose }) => {
  const [storageInfo, setStorageInfo] = useState({
    total: 0,
    messages: 0,
    albums: 0,
    drafts: 0
  });
  const [messagePhotos, setMessagePhotos] = useState([]);
  const [albumPhotos, setAlbumPhotos] = useState([]);

  useEffect(() => {
    calculateStorageUsage();
    loadPhotos();
  }, [currentRoom]);

  const calculateStorageUsage = () => {
    let totalSize = 0;
    let messagesSize = 0;
    let albumsSize = 0;
    let draftsSize = 0;

    // Calculate all localStorage usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage[key].length;
        totalSize += size;

        if (key.startsWith('chatMessages_')) {
          messagesSize += size;
        } else if (key.startsWith('photoAlbums_')) {
          albumsSize += size;
        } else if (key === 'messageDraft') {
          draftsSize += size;
        }
      }
    }

    setStorageInfo({
      total: totalSize,
      messages: messagesSize,
      albums: albumsSize,
      drafts: draftsSize
    });
  };

  const loadPhotos = () => {
    try {
      // Load photos from messages
      const messages = JSON.parse(localStorage.getItem(`chatMessages_${currentRoom}`) || '[]');
      const photos = messages.filter(msg => 
        msg.text.startsWith('data:image/') || msg.text.startsWith('http')
      ).map(msg => ({
        id: msg.id,
        src: msg.text,
        timestamp: msg.timestamp,
        user: msg.user,
        type: 'message'
      }));
      setMessagePhotos(photos);

      // Load photos from albums
      const albums = JSON.parse(localStorage.getItem(`photoAlbums_${currentRoom}`) || '{"anniversary":[],"favorites":[],"memories":[],"special":[]}');
      const allAlbumPhotos = [];
      Object.entries(albums).forEach(([albumName, photos]) => {
        photos.forEach(photo => {
          allAlbumPhotos.push({
            ...photo,
            albumName,
            type: 'album'
          });
        });
      });
      setAlbumPhotos(allAlbumPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const clearAllMessages = () => {
    if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
      localStorage.removeItem(`chatMessages_${currentRoom}`);
      calculateStorageUsage();
      loadPhotos();
      alert('All messages cleared!');
    }
  };

  const clearAllAlbums = () => {
    if (confirm('Are you sure you want to clear all photo albums? This cannot be undone.')) {
      localStorage.removeItem(`photoAlbums_${currentRoom}`);
      calculateStorageUsage();
      loadPhotos();
      alert('All photo albums cleared!');
    }
  };

  const clearDrafts = () => {
    localStorage.removeItem('messageDraft');
    calculateStorageUsage();
    alert('Message drafts cleared!');
  };

  const deletePhoto = (photo) => {
    if (photo.type === 'message') {
      // Remove from messages
      const messages = JSON.parse(localStorage.getItem(`chatMessages_${currentRoom}`) || '[]');
      const updatedMessages = messages.filter(msg => msg.id !== photo.id);
      localStorage.setItem(`chatMessages_${currentRoom}`, JSON.stringify(updatedMessages));
    } else if (photo.type === 'album') {
      // Remove from album
      const albums = JSON.parse(localStorage.getItem(`photoAlbums_${currentRoom}`) || '{"anniversary":[],"favorites":[],"memories":[],"special":[]}');
      albums[photo.albumName] = albums[photo.albumName].filter(p => p.id !== photo.id);
      localStorage.setItem(`photoAlbums_${currentRoom}`, JSON.stringify(albums));
    }
    calculateStorageUsage();
    loadPhotos();
  };

  const clearOldMessages = () => {
    if (confirm('Clear messages older than 7 days? Photos and recent messages will be kept.')) {
      const messages = JSON.parse(localStorage.getItem(`chatMessages_${currentRoom}`) || '[]');
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentMessages = messages.filter(msg => {
        // Keep photos and recent messages
        if (msg.text.startsWith('data:image/') || msg.text.startsWith('http') || msg.text.startsWith('{"type":"pdf"')) {
          return true;
        }
        // Keep messages from last 7 days (simplified check)
        return msg.id > Date.now() - (7 * 24 * 60 * 60 * 1000);
      });
      
      localStorage.setItem(`chatMessages_${currentRoom}`, JSON.stringify(recentMessages));
      calculateStorageUsage();
      loadPhotos();
      alert('Old messages cleared!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Storage Manager
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

        {/* Storage Overview */}
        <div className="p-6 border-b border-white/30">
          <h3 className="text-lg font-semibold mb-4">Storage Usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-800">{formatSize(storageInfo.total)}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-xl font-bold text-blue-600">{formatSize(storageInfo.messages)}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Albums</p>
              <p className="text-xl font-bold text-pink-600">{formatSize(storageInfo.albums)}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-xl font-bold text-gray-600">{formatSize(storageInfo.drafts)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b border-white/30">
          <h3 className="text-lg font-semibold mb-4">Quick Cleanup</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={clearOldMessages}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Clear Old Messages
            </button>
            <button
              onClick={clearDrafts}
              className="py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Clear Drafts
            </button>
            <button
              onClick={clearAllMessages}
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Clear All Messages
            </button>
            <button
              onClick={clearAllAlbums}
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Clear All Albums
            </button>
          </div>
        </div>

        {/* Photo Management */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Photo Management</h3>
          
          {/* Message Photos */}
          {messagePhotos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 text-gray-700">Message Photos ({messagePhotos.length})</h4>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {messagePhotos.map((photo) => (
                  <div key={photo.id} className="group relative">
                    <img
                      src={photo.src}
                      alt="Message photo"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => deletePhoto(photo)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.user}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Album Photos */}
          {albumPhotos.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-700">Album Photos ({albumPhotos.length})</h4>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {albumPhotos.map((photo) => (
                  <div key={photo.id} className="group relative">
                    <img
                      src={photo.src}
                      alt="Album photo"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => deletePhoto(photo)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.albumName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messagePhotos.length === 0 && albumPhotos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No photos found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageManager;