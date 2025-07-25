// File: src/components/PairingSetup.jsx
import React, { useState, useEffect } from 'react';
import { createCoupleInvite, getPendingInvites, acceptCoupleInvite, checkInviteCode } from '../supabase/supabase';

const PairingSetup = ({ user, onPairingComplete }) => {
  const [mode, setMode] = useState('choose'); // 'choose', 'create', 'join'
  const [inviteCode, setInviteCode] = useState('');
  const [pendingInvite, setPendingInvite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Check for existing pending invites on mount
  useEffect(() => {
    checkExistingInvites();
  }, [user]);

  const checkExistingInvites = async () => {
    try {
      const invites = await getPendingInvites(user.id);
      if (invites.length > 0) {
        setPendingInvite(invites[0]);
        setMode('waiting');
      }
    } catch (error) {
      console.error('Error checking existing invites:', error);
    }
  };

  const handleCreateInvite = async () => {
    setLoading(true);
    setError('');
    
    try {
      const invite = await createCoupleInvite(user);
      setInviteCode(invite.invite_code);
      setPendingInvite(invite);
      setMode('waiting');
    } catch (error) {
      console.error('Create invite error:', error);
      // Show more specific error messages
      if (error.message?.includes('duplicate key')) {
        setError('Invite code already exists. Please try again.');
      } else if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
        setError('Permission denied. Please check your database permissions.');
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        setError('Database table not found. Please run the database setup first.');
      } else {
        setError(`Failed to create invite: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCouple = async () => {
    if (!joinCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // First check if the code is valid
      const invite = await checkInviteCode(joinCode.toUpperCase());
      if (!invite) {
        setError('Invalid invite code. Please check and try again.');
        return;
      }

      // Accept the invite
      const pairedCouple = await acceptCoupleInvite(joinCode.toUpperCase(), user);
      onPairingComplete(pairedCouple);
    } catch (error) {
      if (error.message.includes('cannot accept your own invite')) {
        setError('You cannot use your own invite code!');
      } else if (error.message.includes('Invalid or expired')) {
        setError('Invalid or expired invite code');
      } else {
        setError('Failed to join. Please check the invite code and try again.');
      }
      console.error('Join couple error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    // Could add a toast notification here
  };

  const userName = user.user_metadata?.full_name || user.email;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center">
          <div className="text-4xl mb-2">💕</div>
          <h1 className="text-2xl font-bold">Connect with Your Partner</h1>
          <p className="text-pink-100 mt-1">Create your private couple chat space</p>
        </div>

        <div className="p-6">
          {/* Choose Mode */}
          {mode === 'choose' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome {userName}!</h2>
                <p className="text-gray-600">How would you like to connect with your partner?</p>
              </div>

              <button
                onClick={() => setMode('create')}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg"
              >
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Create Invite</div>
                <div className="text-sm text-pink-100">Generate a code for your partner to join</div>
              </button>

              <button
                onClick={() => setMode('join')}
                className="w-full p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
              >
                <div className="text-2xl mb-2">🔗</div>
                <div className="font-semibold">Join Partner</div>
                <div className="text-sm text-teal-100">Enter your partner's invite code</div>
              </button>
            </div>
          )}

          {/* Create Invite Mode */}
          {mode === 'create' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Your Invite</h2>
                <p className="text-gray-600">Generate a unique code for your partner to join your chat</p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleCreateInvite}
                disabled={loading}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Generate Invite Code'}
              </button>

              <button
                onClick={() => setMode('choose')}
                className="w-full p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to options
              </button>
            </div>
          )}

          {/* Join Mode */}
          {mode === 'join' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Join Your Partner</h2>
                <p className="text-gray-600">Enter the invite code your partner shared with you</p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="COUPLE-ABC123"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-center font-mono text-lg"
                  maxLength={13}
                />
              </div>

              <button
                onClick={handleJoinCouple}
                disabled={loading || !joinCode.trim()}
                className="w-full p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Chat'}
              </button>

              <button
                onClick={() => setMode('choose')}
                className="w-full p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to options
              </button>
            </div>
          )}

          {/* Waiting Mode */}
          {mode === 'waiting' && pendingInvite && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4 animate-pulse">💕</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Waiting for Your Partner</h2>
                <p className="text-gray-600">Share this code with your partner to connect</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl text-center">
                <div className="text-sm text-gray-600 mb-2">Your Invite Code</div>
                <div className="text-2xl font-mono font-bold text-pink-600 mb-3">
                  {pendingInvite.invite_code}
                </div>
                <button
                  onClick={copyInviteCode}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                >
                  📋 Copy Code
                </button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-sm text-blue-800">
                  <div className="font-semibold mb-2">💡 How to share:</div>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• Send the code via text or WhatsApp</li>
                    <li>• Tell them to enter it in the app</li>
                    <li>• Once they join, you'll both be connected!</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setMode('choose');
                  setPendingInvite(null);
                  setInviteCode('');
                }}
                className="w-full p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Create a new invite
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PairingSetup;