// File: src/components/Login.jsx
import React, { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Select from "./ui/Select";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username) {
      onLogin(username);
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
          <div className="mb-4">
            <Select value={username} onChange={(e) => setUsername(e.target.value)}>
              <option value="" disabled>Select a user</option>
              <option value="You">You</option>
              <option value="Them">Them</option>
            </Select>
          </div>
          <Button onClick={handleLogin} disabled={!username}>
            Login
          </Button>
        </div>
      </Card>

      <div className="text-center mt-8 text-gray-600 z-10">
        <p>Day 1 of our journey</p>
      </div>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>&copy; 2025 ChatChat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
