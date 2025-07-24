// File: src/components/CoupleInvitation.jsx
import React, { useState, useEffect } from 'react';
import { acceptCoupleInvite, checkInviteCode } from '../supabase/supabase';

const CoupleInvitation = ({ inviteCode, user, onAccept, onDecline }) => {
  const [inviteDetails, setInviteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInviteDetails();
  }, [inviteCode]);

  const loadInviteDetails = async () => {
    try {
      const invite = await checkInviteCode(inviteCode);
      if (invite) {
        setInviteDetails(invite);
      } else {
        setError('Invalid or expired invite code');
      }
    } catch (error) {
      setError('Failed to load invite details');
      console.error('Load invite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    setAccepting(true);
    setError('');
    
    try {
      const pairedCouple = await acceptCoupleInvite(inviteCode, user);
      onAccept(pairedCouple);
    } catch (error) {
      if (error.message.includes('cannot accept your own invite')) {
        setError('You cannot accept your own invite!');
      } else {
        setError('Failed to accept invite. Please try again.');
      }
      console.error('Accept invite error:', error);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4 animate-pulse">💕</div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onDecline}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center">
          <div className="text-4xl mb-2">💌</div>
          <h1 className="text-2xl font-bold">You're Invited!</h1>
          <p className="text-pink-100 mt-1">Join your partner in a private chat</p>
        </div>

        <div className="p-6">
          {inviteDetails && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800 mb-2">
                  {inviteDetails.user1_name} wants to chat with you!
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Create your private couple chat space together
                </div>
                
                <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Invite Code</div>
                  <div className="text-lg font-mono font-bold text-pink-600">
                    {inviteDetails.invite_code}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleAcceptInvite}
                  disabled={accepting}
                  className="w-full p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {accepting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    <>
                      <div className="text-xl mb-1">💕</div>
                      Accept & Start Chatting
                    </>
                  )}
                </button>

                <button
                  onClick={onDecline}
                  className="w-full p-3 text-gray-600 hover:text-gray-800 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Maybe Later
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>By accepting, you'll create a private chat space where only you two can see messages, photos, and memories.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoupleInvitation;