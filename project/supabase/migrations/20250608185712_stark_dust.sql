/*
  # NIGHTLY Database Schema

  1. New Tables
    - `profiles` - Bruger profiler med personlige oplysninger
    - `friends` - Venskabsrelationer mellem brugere
    - `groups` - Brugergrupper
    - `group_members` - Medlemskab af grupper
    - `check_ins` - Check-ins på klubber og barer

  2. Security
    - Enable RLS på alle tabeller
    - Policies for sikker adgang til data
    - Brugere kan kun se og redigere deres egne data

  3. Performance
    - Indexes på ofte brugte kolonner
    - Automatisk opdatering af timestamps
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  nickname text NOT NULL,
  bio text,
  age integer,
  location text,
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  club_id text NOT NULL,
  checked_in_at timestamptz DEFAULT now(),
  checked_out_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Friends policies
CREATE POLICY "Users can view their friendships"
  ON friends
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
  ON friends
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friend requests"
  ON friends
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
  ON friends
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Groups policies
CREATE POLICY "Users can view groups they're members of"
  ON groups
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = groups.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups"
  ON groups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can delete their groups"
  ON groups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Group members policies
CREATE POLICY "Users can view group memberships"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM groups 
      WHERE id = group_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can join groups"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON group_members
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM groups 
      WHERE id = group_id AND owner_id = auth.uid()
    )
  );

-- Check-ins policies
CREATE POLICY "Users can view their own check-ins"
  ON check_ins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins"
  ON check_ins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
  ON check_ins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_club_id ON check_ins(club_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at 
  BEFORE UPDATE ON groups 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();