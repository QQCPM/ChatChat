// File: src/components/Login.jsx
import React, { useState, useEffect } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { signInWithGoogle, signOut, supabase } from "../supabase/supabase";

const Login = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💕</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
          {user ? (
            <Button onClick={handleLogout}>
              Sign Out
            </Button>
          ) : (
            <Button onClick={handleLogin}>
              Sign in with Google
            </Button>
          )}
        </div>
      </Card>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <p>&copy; 2025 ChatChat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
