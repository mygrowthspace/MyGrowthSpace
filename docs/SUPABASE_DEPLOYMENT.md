# Supabase Setup & Deployment Guide

## 📋 Status

- ✅ Database schema created (`schema.sql`)
- ✅ Supabase credentials configured
- ✅ Auth components implemented (Login, SignUp)
- ✅ Auth context provider created
- ⏳ **TODO**: Deploy schema to Supabase
- ⏳ **TODO**: Configure Supabase Auth settings
- ⏳ **TODO**: Enable RLS policies

## 🚀 Step 1: Deploy Schema to Supabase

### Option A: Manual Deployment (Recommended for First-Time)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: **dtyzunvgbmnheqbubhef**
3. Navigate to **SQL Editor** → **New Query**
4. Copy the entire contents of `/schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or Ctrl+Enter)
7. Wait for completion (should see success messages)

### Option B: Automated Deployment

```bash
# Using Python script
python3 scripts/deploy.py

# Using Node.js script
node scripts/deploy-schema.js
```

## 🔐 Step 2: Configure Supabase Authentication

1. Go to **Settings** → **Authentication**
2. Under **Auth Providers**, enable:
   - Email/Password (already enabled by default)
   - (Optional) Google OAuth, GitHub OAuth, etc.

3. Configure **Email Templates** if needed
4. Note: RLS policies will automatically enforce `auth.uid()` matching

## ✅ Step 3: Verify Schema Deployment

In SQL Editor, run:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should return:
- `ai_insights`
- `habit_completions`
- `habits`
- `suggested_cards`
- `sync_logs`
- `user_profiles`

## 🔑 Step 4: Environment Configuration

The app is configured to use:
```
VITE_SUPABASE_URL=https://dtyzunvgbmnheqbubhef.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Already set in `.env.local`

## 📱 Step 5: Test Authentication Flow

1. Start the app: `npm run dev`
2. You should see login screen
3. Click "Create one" to sign up
4. Enter email, password, and name
5. On successful signup:
   - User created in `auth.users`
   - Profile created in `user_profiles` table
   - App navigates to dashboard

## 🛡️ Row Level Security (RLS)

All tables have RLS enabled:

```sql
-- Users can only see their own data
SELECT * FROM habits WHERE user_id = auth.uid();

-- Automatically enforced by RLS policies
CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);
```

## 🔄 Sync & Offline Support

The app supports offline-first with localStorage fallback:

```typescript
// If Supabase is down, data syncs to localStorage
const { syncHabitsToSupabase } = await import('./services/supabaseClient');
await syncHabitsToSupabase(habits, userId);
```

## 🐛 Troubleshooting

### "Invalid API Key"
- Check `.env.local` has correct `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing env

### "User already exists"
- Email is already registered
- Use different email or reset auth provider

### "Permission denied" errors
- RLS policy issue
- Check that user_id in tables matches `auth.uid()`
- Verify RLS policies exist

### Schema didn't deploy
- Check Supabase SQL Editor for error messages
- Ensure Service Role Key has proper permissions
- Try deploying one table at a time

## 📞 Support

For Supabase issues:
- Docs: https://supabase.com/docs
- Community: https://supabase.com/community
- Dashboard: https://app.supabase.com

## ✨ Next Steps

1. ✅ Deploy schema
2. ✅ Test login/signup
3. Create habit management endpoints
4. Implement sync from Gemini API
5. Add multi-device sync
6. Deploy to production
