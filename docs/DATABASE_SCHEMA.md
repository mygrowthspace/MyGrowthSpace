-- ============================================
-- My Growth Space - Supabase Database Schema
-- ============================================
-- Last Updated: 2026-01-19
-- Database: PostgreSQL

-- ============================================
-- 1. USERS EXTENSION (Authentication)
-- ============================================
-- Auth users are managed by Supabase Auth (built-in)
-- We'll reference auth.users.id in our tables

-- ============================================
-- 2. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  
  -- Atomic Habits Configuration
  identity_statement TEXT NOT NULL,
  focus_areas TEXT[] NOT NULL, -- Array of strings: ['Health', 'Mindset', etc.]
  narrative TEXT,
  
  -- Subscription
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- ============================================
-- 3. HABITS TABLE (Core Feature)
-- ============================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'Health', 'Mindset', 'Productivity', 'Finance', 'Social'
  
  -- Scheduling
  frequency VARCHAR(20) NOT NULL, -- 'daily' | 'weekly'
  days_of_week INTEGER[] NOT NULL, -- 0-6 (Sunday-Saturday)
  time_of_day TIME, -- HH:mm format
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- One-time habits
  is_one_time BOOLEAN DEFAULT FALSE,
  specific_dates DATE[], -- Array of dates for one-time habits
  
  -- Progress Tracking
  streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  total_completions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_category CHECK (category IN ('Health', 'Mindset', 'Productivity', 'Finance', 'Social')),
  CONSTRAINT valid_frequency CHECK (frequency IN ('daily', 'weekly')),
  CONSTRAINT valid_days_of_week CHECK (days_of_week IS NULL OR ALL (d = ANY(days_of_week) WHERE d >= 0 AND d <= 6))
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_category ON habits(category);
CREATE INDEX idx_habits_created_at ON habits(created_at DESC);
CREATE INDEX idx_habits_last_completed ON habits(last_completed_date DESC);

-- ============================================
-- 4. HABIT COMPLETIONS TABLE (Daily Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  
  -- Completion Record
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT, -- Optional notes for this completion
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_completion_per_day UNIQUE(habit_id, completed_date)
);

CREATE INDEX idx_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_completions_date ON habit_completions(completed_date DESC);
CREATE INDEX idx_completions_user_habit_date ON habit_completions(user_id, habit_id, completed_date);

-- ============================================
-- 5. AI INSIGHTS TABLE (Gemini Analysis)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Analysis Type
  insight_type VARCHAR(50) NOT NULL, -- 'daily_inspiration' | 'progress_analysis' | 'habit_suggestion'
  
  -- Content
  title VARCHAR(255),
  description TEXT NOT NULL,
  action_step TEXT, -- Recommended next action
  
  -- Related Habit
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- For daily inspiration (expires next day)
  
  CONSTRAINT valid_insight_type CHECK (insight_type IN ('daily_inspiration', 'progress_analysis', 'habit_suggestion'))
);

CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_insights_created_at ON ai_insights(created_at DESC);
CREATE INDEX idx_insights_habit_id ON ai_insights(habit_id);

-- ============================================
-- 6. SUGGESTED CARDS TABLE (AI Recommendations)
-- ============================================
CREATE TABLE IF NOT EXISTS suggested_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Card Content
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  card_type VARCHAR(50) NOT NULL, -- 'optimization' | 'schedule' | 'priority'
  action_label VARCHAR(100),
  
  -- AI-Generated Action
  suggested_action JSONB, -- {type: 'create_habit' | 'modify_habit', payload: {...}}
  
  -- Status
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Cards can expire
  
  CONSTRAINT valid_card_type CHECK (card_type IN ('optimization', 'schedule', 'priority'))
);

CREATE INDEX idx_suggested_cards_user_id ON suggested_cards(user_id);
CREATE INDEX idx_suggested_cards_created_at ON suggested_cards(created_at DESC);

-- ============================================
-- 7. SYNC LOG TABLE (Data Integrity)
-- ============================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Sync Details
  sync_type VARCHAR(50) NOT NULL, -- 'upload' | 'download' | 'conflict'
  entity_type VARCHAR(50), -- 'habit' | 'profile' | 'completion'
  entity_id UUID,
  
  -- Status
  status VARCHAR(20) NOT NULL, -- 'success' | 'pending' | 'failed'
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at DESC);

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS) - SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggested_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only see their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Habits: Users can only see their own habits
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Habit Completions: Users can only access their own
CREATE POLICY "Users can view their own completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions"
  ON habit_completions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- AI Insights: Users can view their own insights
CREATE POLICY "Users can view their own insights"
  ON ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create insights"
  ON ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Suggested Cards: Users can view and dismiss their own
CREATE POLICY "Users can view their suggested cards"
  ON suggested_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create suggested cards"
  ON suggested_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their suggested cards"
  ON suggested_cards FOR UPDATE
  USING (auth.uid() = user_id);

-- Sync Logs: Users can view their own
CREATE POLICY "Users can view their sync logs"
  ON sync_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sync logs"
  ON sync_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 9. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ============================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_habits_timestamp
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ai_insights_timestamp
  BEFORE UPDATE ON ai_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_sync_logs_timestamp
  BEFORE UPDATE ON sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================
-- 10. VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User's Current Streaks
CREATE OR REPLACE VIEW v_current_streaks AS
SELECT 
  h.id,
  h.user_id,
  h.name,
  h.category,
  h.streak,
  h.last_completed_date,
  CURRENT_DATE - h.last_completed_date AS days_since_last_completion,
  CASE 
    WHEN CURRENT_DATE - h.last_completed_date > 1 THEN 'at-risk'
    WHEN CURRENT_DATE - h.last_completed_date = 1 THEN 'due-today'
    WHEN CURRENT_DATE - h.last_completed_date = 0 THEN 'completed-today'
    ELSE 'pending'
  END AS status
FROM habits h
WHERE h.end_date IS NULL OR h.end_date >= CURRENT_DATE
ORDER BY h.streak DESC;

-- View: Weekly Statistics
CREATE OR REPLACE VIEW v_weekly_stats AS
SELECT 
  h.user_id,
  h.id,
  h.name,
  h.category,
  COUNT(hc.id) AS completions_this_week,
  7 AS target_completions,
  ROUND(COUNT(hc.id)::numeric / 7 * 100, 0) AS completion_percentage
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
  AND hc.completed_date >= CURRENT_DATE - INTERVAL '7 days'
WHERE h.frequency = 'daily'
GROUP BY h.user_id, h.id, h.name, h.category;

-- ============================================
-- 11. STORAGE FOR USER AVATARS (Optional)
-- ============================================

-- Create storage bucket for avatars
-- This should be done via Supabase Dashboard, but here's the SQL reference:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- ============================================
-- NOTES FOR DEPLOYMENT
-- ============================================
/*
1. Execute this entire script in Supabase SQL Editor
2. Set up authentication (Google, GitHub, Email)
3. Configure CORS if needed
4. Create API keys for your application
5. Update .env.local with:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
6. Test connections using supabaseClient.ts
*/
