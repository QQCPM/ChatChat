// File: src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage on app start
  useEffect(() => {
    if (currentRoom) {
      try {
        const savedMessages = localStorage.getItem(`chatMessages_${currentRoom}`);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } else {
          // Initialize with default messages if no saved messages for this room
          const defaultMessages = [
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
          ];
          setMessages(defaultMessages);
          try {
            localStorage.setItem(`chatMessages_${currentRoom}`, JSON.stringify(defaultMessages));
          } catch (error) {
            console.error('Error saving default messages:', error);
          }
        }
      } catch (error) {
        console.error('Error loading messages from localStorage:', error);
        // Reset to empty messages if loading fails
        setMessages([]);
      }
    }
  }, [currentRoom]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentRoom) {
      try {
        localStorage.setItem(`chatMessages_${currentRoom}`, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
        // If storage is full, try to clear old data and retry
        if (error.name === 'QuotaExceededError') {
          // Clear old message drafts and try again
          localStorage.removeItem('messageDraft');
          try {
            localStorage.setItem(`chatMessages_${currentRoom}`, JSON.stringify(messages));
          } catch (retryError) {
            alert('Storage is full. Please clear some data.');
          }
        }
      }
    }
  }, [messages, currentRoom]);

  const handleLogin = (username, roomCode) => {
    setCurrentUser(username);
    setCurrentRoom(roomCode);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRoom(null);
    setMessages([]);
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(), // Use timestamp as unique ID
      user: currentUser,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <>
      {currentUser ? (
        <Chat
          currentUser={currentUser}
          currentRoom={currentRoom}
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
