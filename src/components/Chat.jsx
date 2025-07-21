// File: src/components/Chat.jsx
import React, { useState } from "react";
import Button from "./ui/Button";

const Chat = ({ currentUser, messages, onSendMessage, onLogout }) => {
  const [text, setText] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-white/30">
          <h1 className="text-2xl font-bold text-gray-800">ChatChat</h1>
          <Button onClick={onLogout}>Logout</Button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user === currentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-xs ${msg.user === currentUser ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="p-4 border-t border-white/30">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/80 border border-white/30 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            />
            <Button type="submit">Send</Button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
