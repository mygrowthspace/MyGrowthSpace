-- =====================================================
-- My Growth Space - Useful SQL Queries Reference
-- =====================================================

-- 🔐 AUTHENTICATION & USER PROFILES
-- =====================================================

-- Get user profile with all details
SELECT 
  up.*,
  COUNT(h.id) as total_habits,
  COUNT(DISTINCT hc.id) as total_completions
FROM user_profiles up
LEFT JOIN habits h ON up.user_id = h.user_id
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
WHERE up.user_id = 'USER_ID'
GROUP BY up.id;

-- Get all active users (logged in last 7 days)
SELECT 
  up.email,
  up.name,
  MAX(CASE WHEN hc.completed_at IS NOT NULL THEN hc.completed_at END) as last_activity
FROM user_profiles up
LEFT JOIN habit_completions hc ON up.user_id = hc.user_id
WHERE hc.completed_at >= NOW() - INTERVAL '7 days'
GROUP BY up.id, up.email, up.name;

-- Get premium users
SELECT * FROM user_profiles
WHERE is_premium = true
AND premium_until > NOW();

-- Update user profile
UPDATE user_profiles
SET name = 'New Name',
    identity_statement = 'I am disciplined',
    updated_at = NOW()
WHERE user_id = 'USER_ID';

-- 📋 HABITS MANAGEMENT
-- =====================================================

-- Get all habits for a user with streak status
SELECT 
  h.*,
  CASE 
    WHEN h.last_completed_date IS NULL THEN 'never'
    WHEN CURRENT_DATE - h.last_completed_date = 0 THEN 'completed-today'
    WHEN CURRENT_DATE - h.last_completed_date = 1 THEN 'due-today'
    WHEN CURRENT_DATE - h.last_completed_date > 1 THEN 'at-risk'
    ELSE 'pending'
  END as status,
  (CURRENT_DATE - h.last_completed_date) as days_since_completion
FROM habits h
WHERE h.user_id = 'USER_ID'
AND (h.end_date IS NULL OR h.end_date >= CURRENT_DATE)
ORDER BY h.streak DESC, h.category;

-- Get habits due today
SELECT h.*
FROM habits h
WHERE h.user_id = 'USER_ID'
AND h.days_of_week::text[] @> ARRAY[EXTRACT(DOW FROM CURRENT_DATE)::text]
AND (h.end_date IS NULL OR h.end_date >= CURRENT_DATE);

-- Get habits by category with stats
SELECT 
  h.category,
  COUNT(h.id) as habit_count,
  AVG(h.streak) as avg_streak,
  MAX(h.streak) as max_streak,
  COUNT(CASE WHEN h.last_completed_date = CURRENT_DATE THEN 1 END) as completed_today
FROM habits h
WHERE h.user_id = 'USER_ID'
GROUP BY h.category
ORDER BY habit_count DESC;

-- Find one-time habits coming up
SELECT *
FROM habits h
WHERE h.user_id = 'USER_ID'
AND h.is_one_time = true
AND h.specific_dates && ARRAY[CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days']::date[]
ORDER BY h.specific_dates[1];

-- Get habits at risk (not completed for 3+ days)
SELECT 
  h.id,
  h.name,
  h.streak,
  h.last_completed_date,
  (CURRENT_DATE - h.last_completed_date) as days_since_completion
FROM habits h
WHERE h.user_id = 'USER_ID'
AND h.last_completed_date < CURRENT_DATE - INTERVAL '3 days'
ORDER BY days_since_completion DESC;

-- Create new habit
INSERT INTO habits (
  user_id, name, category, frequency, 
  days_of_week, time_of_day, description, 
  start_date, streak
) VALUES (
  'USER_ID',
  'Morning Run',
  'Health',
  'daily',
  '{1,3,5}',
  '07:00',
  'Run 5km in the morning',
  CURRENT_DATE,
  0
) RETURNING *;

-- Update habit (mark as completed today)
UPDATE habits
SET streak = streak + 1,
    last_completed_date = CURRENT_DATE,
    total_completions = total_completions + 1,
    updated_at = NOW()
WHERE id = 'HABIT_ID'
AND user_id = 'USER_ID'
RETURNING *;

-- 📊 COMPLETIONS TRACKING
-- =====================================================

-- Get completion history for a habit
SELECT 
  hc.*,
  h.name as habit_name,
  ROW_NUMBER() OVER (ORDER BY hc.completed_date DESC) as completion_number
FROM habit_completions hc
JOIN habits h ON hc.habit_id = h.id
WHERE hc.habit_id = 'HABIT_ID'
ORDER BY hc.completed_date DESC;

-- Get completion streak details
SELECT 
  h.id,
  h.name,
  h.streak,
  h.last_completed_date,
  COUNT(hc.id) as total_completions,
  MIN(hc.completed_date) as first_completion,
  MAX(hc.completed_date) as last_completion,
  (MAX(hc.completed_date) - MIN(hc.completed_date)) as days_active
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
WHERE h.user_id = 'USER_ID'
GROUP BY h.id, h.name, h.streak, h.last_completed_date;

-- Get completions for current week
SELECT 
  h.id,
  h.name,
  COUNT(hc.id) as completions_this_week,
  7 as target,
  ROUND(COUNT(hc.id)::numeric / 7 * 100, 0) as completion_percentage
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
  AND hc.completed_date >= date_trunc('week', CURRENT_DATE)
WHERE h.user_id = 'USER_ID'
AND h.frequency = 'daily'
GROUP BY h.id, h.name
ORDER BY completions_this_week DESC;

-- Add completion
INSERT INTO habit_completions (
  user_id, habit_id, completed_date, notes
) VALUES (
  'USER_ID',
  'HABIT_ID',
  CURRENT_DATE,
  'Great session!'
) RETURNING *;

-- Undo completion (if marked by mistake)
DELETE FROM habit_completions
WHERE user_id = 'USER_ID'
AND habit_id = 'HABIT_ID'
AND completed_date = CURRENT_DATE;

-- 🤖 AI INSIGHTS
-- =====================================================

-- Get latest insights
SELECT *
FROM ai_insights
WHERE user_id = 'USER_ID'
AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC
LIMIT 5;

-- Get insights by type
SELECT 
  insight_type,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM ai_insights
WHERE user_id = 'USER_ID'
GROUP BY insight_type;

-- Get insights related to a habit
SELECT 
  ai.*,
  h.name as habit_name
FROM ai_insights ai
LEFT JOIN habits h ON ai.habit_id = h.id
WHERE ai.user_id = 'USER_ID'
AND ai.habit_id IS NOT NULL
ORDER BY ai.created_at DESC;

-- Add new insight
INSERT INTO ai_insights (
  user_id, insight_type, title, 
  description, action_step, expires_at
) VALUES (
  'USER_ID',
  'daily_inspiration',
  'Keep your streak alive!',
  'You have 3 days to complete your morning routine...',
  'Complete your morning meditation today',
  NOW() + INTERVAL '1 day'
) RETURNING *;

-- Clean up expired insights
DELETE FROM ai_insights
WHERE expires_at < NOW()
AND user_id = 'USER_ID';

-- 💡 SUGGESTED CARDS
-- =====================================================

-- Get active suggestions
SELECT *
FROM suggested_cards
WHERE user_id = 'USER_ID'
AND is_dismissed = false
AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY created_at DESC;

-- Get suggestion performance
SELECT 
  card_type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_dismissed THEN 1 END) as dismissed,
  ROUND(COUNT(CASE WHEN is_dismissed THEN 1 END)::numeric / COUNT(*) * 100, 0) as dismiss_rate
FROM suggested_cards
WHERE user_id = 'USER_ID'
GROUP BY card_type;

-- Dismiss a suggestion
UPDATE suggested_cards
SET is_dismissed = true,
    dismissed_at = NOW()
WHERE id = 'CARD_ID'
AND user_id = 'USER_ID';

-- 📈 ANALYTICS QUERIES
-- =====================================================

-- User progress overview
SELECT 
  up.name,
  COUNT(DISTINCT h.id) as total_habits,
  AVG(h.streak) as avg_streak,
  MAX(h.streak) as longest_streak,
  COUNT(CASE WHEN CURRENT_DATE - h.last_completed_date = 0 THEN 1 END) as completed_today,
  COUNT(CASE WHEN h.last_completed_date < CURRENT_DATE - INTERVAL '3 days' THEN 1 END) as at_risk_habits
FROM user_profiles up
LEFT JOIN habits h ON up.user_id = h.user_id
WHERE up.user_id = 'USER_ID'
GROUP BY up.name;

-- Completion rate by day of week
SELECT 
  CASE 
    WHEN EXTRACT(DOW FROM hc.completed_date) = 0 THEN 'Sunday'
    WHEN EXTRACT(DOW FROM hc.completed_date) = 1 THEN 'Monday'
    WHEN EXTRACT(DOW FROM hc.completed_date) = 2 THEN 'Tuesday'
    WHEN EXTRACT(DOW FROM hc.completed_date) = 3 THEN 'Wednesday'
    WHEN EXTRACT(DOW FROM hc.completed_date) = 4 THEN 'Thursday'
    WHEN EXTRACT(DOW FROM hc.completed_date) = 5 THEN 'Friday'
    WHEN EXTRACT(DOW FROM hc.completed_date) = 6 THEN 'Saturday'
  END as day_of_week,
  COUNT(*) as completions
FROM habit_completions hc
WHERE hc.user_id = 'USER_ID'
AND hc.completed_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY EXTRACT(DOW FROM hc.completed_date)
ORDER BY EXTRACT(DOW FROM hc.completed_date);

-- Completion calendar (last 30 days)
SELECT 
  DATE(hc.completed_date) as date,
  COUNT(DISTINCT h.id) as habits_completed,
  COUNT(*) as total_completions
FROM habit_completions hc
JOIN habits h ON hc.habit_id = h.id
WHERE hc.user_id = 'USER_ID'
AND hc.completed_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(hc.completed_date)
ORDER BY date DESC;

-- Most consistent habits
SELECT 
  h.id,
  h.name,
  h.category,
  h.streak,
  COUNT(hc.id) as total_completions,
  ROUND(COUNT(hc.id)::numeric / 
    EXTRACT(DAY FROM (CURRENT_DATE - h.created_at::date)) * 100, 1) as consistency_percentage
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
WHERE h.user_id = 'USER_ID'
GROUP BY h.id, h.name, h.category, h.streak
ORDER BY consistency_percentage DESC;

-- 🔄 SYNC & MAINTENANCE
-- =====================================================

-- Check sync status
SELECT 
  sync_type,
  status,
  COUNT(*) as count,
  MAX(created_at) as last_sync
FROM sync_logs
WHERE user_id = 'USER_ID'
GROUP BY sync_type, status
ORDER BY last_sync DESC;

-- Failed syncs
SELECT *
FROM sync_logs
WHERE user_id = 'USER_ID'
AND status = 'failed'
ORDER BY created_at DESC;

-- Log a sync
INSERT INTO sync_logs (
  user_id, sync_type, entity_type, 
  entity_id, status
) VALUES (
  'USER_ID',
  'upload',
  'habit',
  'HABIT_ID',
  'success'
);

-- Clean old sync logs (keep last 30 days)
DELETE FROM sync_logs
WHERE user_id = 'USER_ID'
AND created_at < CURRENT_DATE - INTERVAL '30 days';

-- ⚙️ ADMIN QUERIES
-- =====================================================

-- Get all users and their stats
SELECT 
  up.id as profile_id,
  up.user_id,
  up.email,
  up.name,
  up.is_premium,
  COUNT(DISTINCT h.id) as total_habits,
  COUNT(DISTINCT hc.id) as total_completions,
  MAX(hc.completed_date) as last_activity
FROM user_profiles up
LEFT JOIN habits h ON up.user_id = h.user_id
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
GROUP BY up.id, up.user_id, up.email, up.name, up.is_premium
ORDER BY MAX(hc.completed_date) DESC NULLS LAST;

-- Database size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Count records by table
SELECT 
  'user_profiles' as table_name, COUNT(*) FROM user_profiles
UNION ALL
SELECT 'habits', COUNT(*) FROM habits
UNION ALL
SELECT 'habit_completions', COUNT(*) FROM habit_completions
UNION ALL
SELECT 'ai_insights', COUNT(*) FROM ai_insights
UNION ALL
SELECT 'suggested_cards', COUNT(*) FROM suggested_cards
UNION ALL
SELECT 'sync_logs', COUNT(*) FROM sync_logs;
