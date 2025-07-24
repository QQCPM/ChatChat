// File: src/App.jsx
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import PairingSetup from "./components/PairingSetup";
import { ThemeProvider } from "./contexts/ThemeContext";
import { supabase, sendMessage, getMessages, getCoupleStatus } from "./supabase/supabase";

const App = () => {
  const [user, setUser] = useState(null);
  const [couple, setCouple] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingPairing, setCheckingPairing] = useState(false);

  // Initialize Supabase auth
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        checkCoupleStatus(user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      setCouple(null); // Reset couple status
      if (user) {
        checkCoupleStatus(user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user is already paired with someone
  const checkCoupleStatus = async (user) => {
    setCheckingPairing(true);
    try {
      const coupleData = await getCoupleStatus(user.id);
      setCouple(coupleData);
    } catch (error) {
      console.error('Error checking couple status:', error);
      setCouple(null);
    } finally {
      setCheckingPairing(false);
      setLoading(false);
    }
  };

  // Load messages from Supabase and set up real-time subscription
  useEffect(() => {
    if (user && couple) {
      loadMessages();
      setupRealtimeSubscription();
    }
  }, [user, couple]);

  const loadMessages = async () => {
    try {
      // Load from Supabase using couple room ID
      const roomId = couple.couple_id;
      const supabaseMessages = await getMessages(roomId);
      
      if (supabaseMessages.length > 0) {
        // Convert Supabase format to app format
        const formattedMessages = supabaseMessages.map(msg => ({
          id: msg.id,
          user: msg.user_name,
          text: msg.text,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(formattedMessages);
        
        // Save to localStorage as backup
        localStorage.setItem(`chatMessages_${roomId}`, JSON.stringify(formattedMessages));
      } else {
        // Fallback to localStorage if no Supabase data
        try {
          const savedMessages = localStorage.getItem(`chatMessages_${roomId}`);
          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages);
            setMessages(parsedMessages);
          } else {
            // Initialize with default messages
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
            localStorage.setItem(`chatMessages_${roomId}`, JSON.stringify(defaultMessages));
          }
        } catch (error) {
          console.error('Error loading messages from localStorage:', error);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to localStorage
      try {
        const savedMessages = localStorage.getItem(`chatMessages_${roomId}`);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${couple.couple_id}`
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            user: payload.new.user_name,
            text: payload.new.text,
            timestamp: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prevMessages => {
            // Avoid duplicates
            if (prevMessages.find(msg => msg.id === newMessage.id)) {
              return prevMessages;
            }
            return [...prevMessages, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && user && couple) {
      try {
        localStorage.setItem(`chatMessages_${couple.couple_id}`, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
        // If storage is full, try to clear old data and retry
        if (error.name === 'QuotaExceededError') {
          // Clear old message drafts and try again
          localStorage.removeItem('messageDraft');
          try {
            localStorage.setItem(`chatMessages_${couple.couple_id}`, JSON.stringify(messages));
          } catch (retryError) {
            alert('Storage is full. Please clear some data.');
          }
        }
      }
    }
  }, [messages, user, couple]);

  const handleSendMessage = async (text) => {
    const userName = user.user_metadata?.full_name || user.email;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Optimistically add to local state
    const tempMessage = {
      id: Date.now(), // Temporary ID
      user: userName,
      text,
      timestamp
    };
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    
    try {
      // Send to Supabase
      const savedMessage = await sendMessage(couple.couple_id, user.id, userName, text);
      
      // Replace temp message with real message from Supabase
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempMessage.id 
            ? {
                id: savedMessage.id,
                user: savedMessage.user_name,
                text: savedMessage.text,
                timestamp: new Date(savedMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message to Supabase:', error);
      // Message will stay with temp ID, which is fine for offline mode
    }
  };

  // Handle successful pairing
  const handlePairingComplete = (pairedCouple) => {
    setCouple(pairedCouple);
  };

  if (loading || checkingPairing) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-rose-100 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💕</div>
          <p className="text-gray-600">
            {checkingPairing ? 'Checking couple status...' : 'Loading ChatChat...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {!user ? (
        <Login />
      ) : !couple ? (
        <PairingSetup 
          user={user} 
          onPairingComplete={handlePairingComplete}
        />
      ) : (
        <Chat
          user={user}
          couple={couple}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
