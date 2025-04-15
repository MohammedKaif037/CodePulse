-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  max_xp INTEGER NOT NULL DEFAULT 1000,
  streak INTEGER NOT NULL DEFAULT 0,
  weekly_coding_time FLOAT NOT NULL DEFAULT 0,
  weekly_problems_solved INTEGER NOT NULL DEFAULT 0,
  weekly_commits INTEGER NOT NULL DEFAULT 0,
  target_coding_time FLOAT NOT NULL DEFAULT 10,
  target_problems_solved INTEGER NOT NULL DEFAULT 15,
  target_commits INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Create RLS policies
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own stats
CREATE POLICY user_stats_select_policy ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update only their own stats
CREATE POLICY user_stats_update_policy ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own stats
CREATE POLICY user_stats_insert_policy ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
