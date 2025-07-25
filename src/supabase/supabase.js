// File: src/supabase/supabase.js
import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your actual Supabase credentials
const supabaseUrl = 'https://lfeiscrvvizgoruydwwp.supabase.co' // https://your-project.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZWlzY3J2dml6Z29ydXlkd3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTUyNzUsImV4cCI6MjA2ODg3MTI3NX0.35USfR6n3-PEbqGtUreQar4rY7Mp7Z59OS7-PcRwsGE' // Your anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: import.meta.env.PROD ? 'https://chatchaat.netlify.app' : `${window.location.origin}`
    }
  })
  
  if (error) {
    console.error('Error signing in:', error)
    throw error
  }
  
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Database helpers
export const getMessages = async (roomId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }
  
  return data
}

export const sendMessage = async (roomId, userId, userName, text) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        room_id: roomId,
        user_id: userId,
        user_name: userName,
        text: text,
        created_at: new Date().toISOString()
      }
    ])
    .select()
  
  if (error) {
    console.error('Error sending message:', error)
    throw error
  }
  
  return data[0]
}

export const getPhotoAlbums = async (roomId) => {
  const { data, error } = await supabase
    .from('photo_albums')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching photo albums:', error)
    return []
  }
  
  return data
}

export const addPhotoToAlbum = async (roomId, albumName, photoData) => {
  const { data, error } = await supabase
    .from('photo_albums')
    .insert([
      {
        room_id: roomId,
        album_name: albumName,
        photo_url: photoData.src,
        photo_name: photoData.name,
        upload_date: photoData.uploadDate,
        file_size: photoData.size || 0
      }
    ])
    .select()
  
  if (error) {
    console.error('Error adding photo to album:', error)
    throw error
  }
  
  return data[0]
}

// Couple pairing functions
export const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'COUPLE-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const createCoupleInvite = async (user) => {
  let attempts = 0
  const maxAttempts = 3
  
  while (attempts < maxAttempts) {
    const inviteCode = generateInviteCode()
    const coupleId = `couple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const { data, error } = await supabase
      .from('couples')
      .insert([
        {
          couple_id: coupleId,
          user1_id: user.id,
          user1_email: user.email,
          user1_name: user.user_metadata?.full_name || user.email,
          invite_code: inviteCode,
          created_by: user.id,
          status: 'pending'
        }
      ])
      .select()
    
    if (!error) {
      return data[0]
    }
    
    // If it's a duplicate key error, try again with a new code
    if (error.code === '23505' && error.message.includes('invite_code')) {
      attempts++
      continue
    }
    
    // For any other error, throw it
    console.error('Error creating couple invite:', error)
    throw error
  }
  
  throw new Error('Failed to generate unique invite code after multiple attempts')
}

export const acceptCoupleInvite = async (inviteCode, user) => {
  // First, get the invite
  const { data: invite, error: fetchError } = await supabase
    .from('couples')
    .select('*')
    .eq('invite_code', inviteCode)
    .eq('status', 'pending')
    .single()
  
  if (fetchError || !invite) {
    throw new Error('Invalid or expired invite code')
  }
  
  // Check if user is not trying to accept their own invite
  if (invite.user1_id === user.id) {
    throw new Error('You cannot accept your own invite')
  }
  
  // Update the invite to include the second user
  const { data, error } = await supabase
    .from('couples')
    .update({
      user2_id: user.id,
      user2_email: user.email,
      user2_name: user.user_metadata?.full_name || user.email,
      status: 'paired',
      paired_at: new Date().toISOString()
    })
    .eq('id', invite.id)
    .select()
  
  if (error) {
    console.error('Error accepting couple invite:', error)
    throw error
  }
  
  return data[0]
}

export const getCoupleStatus = async (userId) => {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('status', 'paired')
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error getting couple status:', error)
    throw error
  }
  
  return data
}

export const getPendingInvites = async (userId) => {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('user1_id', userId)
    .eq('status', 'pending')
  
  if (error) {
    console.error('Error getting pending invites:', error)
    throw error
  }
  
  return data
}

export const checkInviteCode = async (inviteCode) => {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('invite_code', inviteCode)
    .eq('status', 'pending')
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking invite code:', error)
    throw error
  }
  
  return data
}