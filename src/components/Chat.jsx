// File: src/components/Chat.jsx
import React, { useState } from "react";
import Button from "./ui/Button";

const Chat = ({ currentUser, messages, onSendMessage, onLogout }) => {
  const [text, setText] = useState("");
  const [showGallery, setShowGallery] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  const handleSendImage = (image) => {
    onSendMessage(image);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-white/30">
          <h1 className="text-2xl font-bold text-gray-800">ChatChat</h1>
          <button 
            onClick={onLogout}
            className="px-3 py-1.5 text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user === currentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-xs ${msg.user === currentUser ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.text.startsWith("http") ? (
                    <img src={msg.text} alt="sent" className="rounded-lg" />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {showGallery && (
          <div className="p-4 border-t border-white/30 bg-white/40">
            <div className="grid grid-cols-4 gap-3 max-h-32 overflow-y-auto">
              {[
                "https://via.placeholder.com/100/FFB6C1/FFFFFF?text=💕",
                "https://via.placeholder.com/100/FFC0CB/FFFFFF?text=🌸",
                "https://via.placeholder.com/100/FFE4E1/FFFFFF?text=💖",
                "https://via.placeholder.com/100/F0E68C/FFFFFF?text=☀️",
                "https://via.placeholder.com/100/DDA0DD/FFFFFF?text=🦋",
                "https://via.placeholder.com/100/98FB98/FFFFFF?text=🌿",
              ].map((image, i) => (
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
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/80 border border-white/30 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
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
    </div>
  );
};

export default Chat;
