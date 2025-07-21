// File: src/components/PhotoAlbum.jsx
import React, { useState, useEffect } from "react";

const PhotoAlbum = ({ currentRoom, onClose }) => {
  const [albums, setAlbums] = useState({
    anniversary: [],
    favorites: [],
    memories: [],
    special: []
  });
  const [activeTab, setActiveTab] = useState('anniversary');
  const [showUpload, setShowUpload] = useState(false);

  // Load albums from localStorage
  useEffect(() => {
    if (currentRoom) {
      const savedAlbums = localStorage.getItem(`photoAlbums_${currentRoom}`);
      if (savedAlbums) {
        setAlbums(JSON.parse(savedAlbums));
      }
    }
  }, [currentRoom]);

  // Save albums to localStorage
  useEffect(() => {
    if (currentRoom && Object.values(albums).some(album => album.length > 0)) {
      localStorage.setItem(`photoAlbums_${currentRoom}`, JSON.stringify(albums));
    }
  }, [albums, currentRoom]);

  const handlePhotoUpload = (event, albumType) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const photoData = {
              id: Date.now() + Math.random(),
              src: e.target.result,
              name: file.name,
              uploadDate: new Date().toLocaleDateString(),
              size: file.size
            };
            setAlbums(prev => ({
              ...prev,
              [albumType]: [...prev[albumType], photoData]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
    event.target.value = '';
  };

  const removePhoto = (albumType, photoId) => {
    setAlbums(prev => ({
      ...prev,
      [albumType]: prev[albumType].filter(photo => photo.id !== photoId)
    }));
  };

  const albumTabs = [
    { key: 'anniversary', label: 'Anniversary 💕', icon: '💕' },
    { key: 'favorites', label: 'Favorites ⭐', icon: '⭐' },
    { key: 'memories', label: 'Memories 📸', icon: '📸' },
    { key: 'special', label: 'Special ✨', icon: '✨' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Our Photo Albums
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

        {/* Tabs */}
        <div className="flex space-x-1 p-4 bg-white/40">
          {albumTabs.map(tab => (
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
              <span className="text-sm">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {albumTabs.find(tab => tab.key === activeTab)?.label}
            </h3>
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e, activeTab)}
                className="hidden"
                id={`album-upload-${activeTab}`}
              />
              <label
                htmlFor={`album-upload-${activeTab}`}
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Photos
              </label>
            </div>
          </div>

          {/* Photo Grid */}
          {albums[activeTab].length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{albumTabs.find(tab => tab.key === activeTab)?.icon}</div>
              <p className="text-gray-500 text-lg">No photos yet</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first special moment!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums[activeTab].map((photo) => (
                <div
                  key={photo.id}
                  className="group relative bg-white/60 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={photo.src}
                    alt={photo.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    <button
                      onClick={() => removePhoto(activeTab, photo.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600 truncate">{photo.name}</p>
                    <p className="text-xs text-gray-400">{photo.uploadDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoAlbum;