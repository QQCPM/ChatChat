// File: src/components/Chat.jsx
import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import PhotoAlbum from "./PhotoAlbum";
import StorageManager from "./StorageManager";

const Chat = ({ currentUser, messages, onSendMessage, onLogout, currentRoom }) => {
  const [text, setText] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [showAlbum, setShowAlbum] = useState(false);
  const [selectedPhotoForAlbum, setSelectedPhotoForAlbum] = useState(null);
  const [showStorageManager, setShowStorageManager] = useState(false);

  // Load draft message on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('messageDraft');
    if (savedDraft) {
      setText(savedDraft);
    }
  }, []);

  // Auto-save draft whenever text changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text.trim()) {
        localStorage.setItem('messageDraft', text);
      } else {
        localStorage.removeItem('messageDraft');
      }
    }, 500); // 500ms delay for auto-save

    return () => clearTimeout(timeoutId);
  }, [text]);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
      localStorage.removeItem('messageDraft'); // Clear draft after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior
      handleSendMessage(e);
    }
    // Shift+Enter will naturally create a new line due to textarea default behavior
  };

  const handleSendImage = (image) => {
    onSendMessage(image);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      
      reader.onerror = () => {
        console.error('Error reading file:', file.name);
        alert(`Error uploading "${file.name}". Please try again.`);
      };

      if (file.type.startsWith('image/')) {
        // Handle image files
        reader.onload = (e) => {
          try {
            const photoData = e.target.result;
            setUploadedPhotos(prev => [...prev, photoData]);
            onSendMessage(photoData);
          } catch (error) {
            console.error('Error processing image:', error);
            alert(`Error uploading image "${file.name}".`);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // Handle PDF files
        reader.onload = (e) => {
          try {
            const pdfData = {
              type: 'pdf',
              name: file.name,
              data: e.target.result,
              size: file.size
            };
            onSendMessage(JSON.stringify(pdfData));
          } catch (error) {
            console.error('Error processing PDF:', error);
            alert(`Error uploading PDF "${file.name}".`);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert(`File type not supported: ${file.type}`);
      }
    });

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        <header className="p-4 border-b border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ChatChat</h1>
              <p className="text-sm text-gray-600 mt-1">Connected as {currentUser}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowStorageManager(true)}
                className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                title="Storage Manager"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </button>
              <button
                onClick={() => setShowAlbum(true)}
                className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
                title="Photo Albums"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
              <button 
                onClick={onLogout}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user === currentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-xs ${msg.user === currentUser ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.text.startsWith("data:image/") || msg.text.startsWith("http") ? (
                    <div className="group relative">
                      <img src={msg.text} alt="sent" className="rounded-lg max-w-full h-auto" />
                      <button
                        onClick={() => setSelectedPhotoForAlbum(msg.text)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                        title="Save to Album"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  ) : (() => {
                    try {
                      if (msg.text.startsWith('{"type":"pdf"')) {
                        const pdfData = JSON.parse(msg.text);
                        return (
                          <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{pdfData.name}</p>
                              <p className="text-xs opacity-70">{(pdfData.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <a 
                              href={pdfData.data} 
                              download={pdfData.name}
                              className="px-3 py-1 bg-white/30 rounded text-xs hover:bg-white/50 transition-colors"
                            >
                              Download
                            </a>
                          </div>
                        );
                      } else {
                        return <p className="whitespace-pre-wrap">{msg.text}</p>;
                      }
                    } catch (error) {
                      console.error('Error parsing message:', error);
                      return <p className="whitespace-pre-wrap">{msg.text}</p>;
                    }
                  })()}
                  <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {showGallery && (
          <div className="p-4 border-t border-white/30 bg-white/40">
            <div className="mb-4 space-y-2">
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Files (Photos & PDFs)
              </label>
            </div>
            <div className="grid grid-cols-4 gap-3 max-h-32 overflow-y-auto">
              {uploadedPhotos.concat([
                "https://via.placeholder.com/100/FFB6C1/FFFFFF?text=💕",
                "https://via.placeholder.com/100/FFC0CB/FFFFFF?text=🌸",
                "https://via.placeholder.com/100/FFE4E1/FFFFFF?text=💖",
                "https://via.placeholder.com/100/F0E68C/FFFFFF?text=☀️",
                "https://via.placeholder.com/100/DDA0DD/FFFFFF?text=🦋",
                "https://via.placeholder.com/100/98FB98/FFFFFF?text=🌿",
              ]).map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt="gallery"
                  className="rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 aspect-square object-cover"
                  onClick={() => handleSendImage(image)}
                />
              ))}
            </div>
          </div>
        )}

        <footer className="p-4 border-t border-white/30">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowGallery(!showGallery)}
              className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
              className="flex-1 bg-white/80 border border-white/30 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 resize-none"
              rows="1"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                overflowY: text.split('\n').length > 3 ? 'auto' : 'hidden'
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
            >
              Send
            </button>
          </form>
        </footer>
      </div>

      {/* Storage Manager Modal */}
      {showStorageManager && (
        <StorageManager 
          currentRoom={currentRoom} 
          onClose={() => setShowStorageManager(false)} 
        />
      )}

      {/* Photo Album Modal */}
      {showAlbum && (
        <PhotoAlbum 
          currentRoom={currentRoom} 
          onClose={() => setShowAlbum(false)} 
        />
      )}

      {/* Album Selector Modal */}
      {selectedPhotoForAlbum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-center text-gray-800 mb-4">Save to Album</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { key: 'anniversary', label: 'Anniversary', icon: '💕' },
                { key: 'favorites', label: 'Favorites', icon: '⭐' },
                { key: 'memories', label: 'Memories', icon: '📸' },
                { key: 'special', label: 'Special', icon: '✨' }
              ].map(album => (
                <button
                  key={album.key}
                  onClick={() => {
                    const albums = JSON.parse(localStorage.getItem(`photoAlbums_${currentRoom}`) || '{"anniversary":[],"favorites":[],"memories":[],"special":[]}');
                    const photoData = {
                      id: Date.now() + Math.random(),
                      src: selectedPhotoForAlbum,
                      name: `Photo_${Date.now()}`,
                      uploadDate: new Date().toLocaleDateString(),
                      size: 0
                    };
                    albums[album.key].push(photoData);
                    localStorage.setItem(`photoAlbums_${currentRoom}`, JSON.stringify(albums));
                    setSelectedPhotoForAlbum(null);
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-300 border border-white/30"
                >
                  <span className="text-2xl mb-2">{album.icon}</span>
                  <span className="text-sm font-medium">{album.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedPhotoForAlbum(null)}
              className="w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
