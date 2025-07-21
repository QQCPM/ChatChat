// File: src/components/Login.jsx
import React, { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Select from "./ui/Select";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [createNew, setCreateNew] = useState(false);

  const calculateLoveDays = () => {
    const startDate = new Date('2024-07-21T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const timeDiff = today.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setCreateNew(false);
  };

  const handleLogin = () => {
    if (username && roomCode) {
      onLogin(username, roomCode);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="text-center mb-8 z-10">
        <h1 className="text-6xl font-bold text-gray-800">ChatChat</h1>
        <p className="text-gray-600 text-lg mt-2">The softest chat app ever.</p>
      </div>

      <Card>
        <div className="w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join Your Private Room</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <Select value={username} onChange={(e) => setUsername(e.target.value)}>
              <option value="" disabled>Select a user</option>
              <option value="You">You</option>
              <option value="Them">Them</option>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter or create room code"
              className="w-full bg-white/80 border border-white/30 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 font-mono text-center text-lg tracking-wider"
              maxLength="6"
            />
          </div>

          <div className="mb-6">
            <button
              onClick={handleCreateRoom}
              className="w-full py-2 px-4 text-sm text-pink-600 hover:text-pink-800 hover:bg-pink-50 rounded-lg transition-all duration-300"
            >
              Generate New Room Code
            </button>
          </div>

          <Button onClick={handleLogin} disabled={!username || !roomCode}>
            Join Room
          </Button>

          {roomCode && (
            <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-pink-800 text-center">
                <span className="font-medium">Share this code with your partner:</span><br/>
                <span className="font-mono text-lg font-bold">{roomCode}</span>
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="text-center mt-8 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg px-6 py-4 inline-block">
          <p className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Day {calculateLoveDays()} of our journey ❤️
          </p>
        </div>
      </div>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>&copy; 2025 ChatChat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
