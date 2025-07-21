// File: src/App.jsx
import React, { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Them",
      text: "Hey! How are you?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      user: "You",
      text: "I'm good, thanks! How about you?",
      timestamp: "10:01 AM",
    },
    {
      id: 3,
      user: "Them",
      text: "Doing great! Just enjoying the day.",
      timestamp: "10:02 AM",
    },
  ]);

  const handleLogin = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      user: currentUser,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <>
      {currentUser ? (
        <Chat
          currentUser={currentUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          onLogout={handleLogout}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
