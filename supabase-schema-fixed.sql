-- Supabase Database Schema for ChatChat App (FIXED VERSION)
-- Run this in your Supabase SQL Editor

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'video', 'pdf'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo Albums table
CREATE TABLE IF NOT EXISTS photo_albums (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  album_name TEXT NOT NULL, -- 'anniversary', 'favorites', 'memories', 'special'
  photo_url TEXT NOT NULL,
  photo_name TEXT NOT NULL,
  upload_date TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memories table (keeping your existing structure)
CREATE TABLE IF NOT EXISTS memories (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  template JSONB,
  entries JSONB DEFAULT '[]'::jsonb,
  participants JSONB DEFAULT '["You", "Them"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Couples table for partner pairing
CREATE TABLE IF NOT EXISTS couples (
  id BIGSERIAL PRIMARY KEY,
  couple_id TEXT UNIQUE NOT NULL, -- Shared room ID for the couple
  user1_id TEXT NOT NULL, -- First partner's user ID
  user1_email TEXT NOT NULL, -- First partner's email
  user1_name TEXT NOT NULL, -- First partner's display name
  user2_id TEXT, -- Second partner's user ID (null until they join)
  user2_email TEXT, -- Second partner's email (null until they join)
  user2_name TEXT, -- Second partner's display name (null until they join)
  invite_code TEXT UNIQUE NOT NULL, -- Unique invite code for pairing
  status TEXT DEFAULT 'pending', -- 'pending', 'paired', 'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paired_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT NOT NULL -- user_id of who created the pairing
);

-- Relationship stats cache table (for performance)
CREATE TABLE IF NOT EXISTS relationship_stats (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT UNIQUE NOT NULL,
  days_together INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  photos_shared INTEGER DEFAULT 0,
  videos_shared INTEGER DEFAULT 0,
  pdfs_shared INTEGER DEFAULT 0,
  messages_from_user1 INTEGER DEFAULT 0,
  messages_from_user2 INTEGER DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- Couples policies
CREATE POLICY "Users can view their couple pairings" ON couples
  FOR SELECT USING (
    auth.uid()::text = user1_id OR 
    auth.uid()::text = user2_id
  );

CREATE POLICY "Users can create couple pairings" ON couples
  FOR INSERT WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update their couple pairings" ON couples
  FOR UPDATE USING (
    auth.uid()::text = user1_id OR 
    auth.uid()::text = user2_id
  );

-- Messages policies - Allow users to see messages in rooms where their user_id appears in room_id
CREATE POLICY "Users can view messages in their rooms" ON messages
  FOR SELECT USING (
    auth.uid()::text = user_id OR 
    room_id LIKE '%' || auth.uid()::text || '%'
  );

CREATE POLICY "Users can insert messages in their rooms" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Photo albums policies
CREATE POLICY "Users can view photos in their rooms" ON photo_albums
  FOR SELECT USING (
    room_id LIKE '%' || auth.uid()::text || '%'
  );

CREATE POLICY "Users can insert photos in their rooms" ON photo_albums
  FOR INSERT WITH CHECK (
    room_id LIKE '%' || auth.uid()::text || '%'
  );

-- Memories policies
CREATE POLICY "Users can view memories in their rooms" ON memories
  FOR SELECT USING (
    room_id LIKE '%' || auth.uid()::text || '%'
  );

CREATE POLICY "Users can manage memories in their rooms" ON memories
  FOR ALL USING (
    room_id LIKE '%' || auth.uid()::text || '%'
  );

-- Stats policies
CREATE POLICY "Users can view stats for their rooms" ON relationship_stats
  FOR SELECT USING (
    room_id LIKE '%' || auth.uid()::text || '%'
  );

CREATE POLICY "Users can update stats for their rooms" ON relationship_stats
  FOR ALL USING (
    room_id LIKE '%' || auth.uid()::text || '%'
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_albums_room_id ON photo_albums(room_id);
CREATE INDEX IF NOT EXISTS idx_memories_room_id ON memories(room_id);
CREATE INDEX IF NOT EXISTS idx_relationship_stats_room_id ON relationship_stats(room_id);
CREATE INDEX IF NOT EXISTS idx_couples_user1_id ON couples(user1_id);
CREATE INDEX IF NOT EXISTS idx_couples_user2_id ON couples(user2_id);
CREATE INDEX IF NOT EXISTS idx_couples_invite_code ON couples(invite_code);
CREATE INDEX IF NOT EXISTS idx_couples_couple_id ON couples(couple_id);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_albums;
ALTER PUBLICATION supabase_realtime ADD TABLE memories;
ALTER PUBLICATION supabase_realtime ADD TABLE couples;