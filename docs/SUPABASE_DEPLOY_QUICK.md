# 🚀 Desplegar Schema en Supabase SQL Editor

## Pasos rápidos:

1. **Ve a Supabase Dashboard**
   - URL: https://app.supabase.com
   - Proyecto: `dtyzunvgbmnheqbubhef`

2. **Abre SQL Editor**
   - Click en "SQL Editor" (izquierda)
   - Click en "+ New Query"

3. **Copia el SQL de abajo**
   - Selecciona TODO el texto SQL
   - `Ctrl+C` (copiar)

4. **Pégalo en Supabase**
   - Ctrl+V en el editor SQL
   - Click en botón "Run" (arriba a la derecha)
   - O presiona: `Ctrl+Enter`

5. **Espera a que se complete**
   - Verás confirmación: "✓ Success"
   - Todas las 6 tablas se crearán

---

## SQL COMPLETO PARA COPIAR Y PEGAR:

```sql
-- ============================================
-- My Growth Space - PostgreSQL Database Schema
-- Execute in Supabase SQL Editor
-- ============================================

-- ============================================
-- TABLE 1: user_profiles
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  identity_statement TEXT NOT NULL,
  focus_areas TEXT[] NOT NULL,
  narrative TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- ============================================
-- TABLE 2: habits
-- ============================================
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  frequency VARCHAR(20) NOT NULL,
  days_of_week INTEGER[] NOT NULL,
  time_of_day TIME,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_one_time BOOLEAN DEFAULT FALSE,
  specific_dates DATE[],
  streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  total_completions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_category CHECK (category IN ('Health', 'Mindset', 'Productivity', 'Finance', 'Social')),
  CONSTRAINT valid_frequency CHECK (frequency IN ('daily', 'weekly'))
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at DESC);

-- ============================================
-- TABLE 3: habit_completions
-- ============================================
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_completion_per_day UNIQUE(habit_id, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON habit_completions(completed_date DESC);

-- ============================================
-- TABLE 4: ai_insights
-- ============================================
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  description TEXT NOT NULL,
  action_step TEXT,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_insight_type CHECK (insight_type IN ('daily_inspiration', 'progress_analysis', 'habit_suggestion'))
);

CREATE INDEX IF NOT EXISTS idx_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON ai_insights(created_at DESC);

-- ============================================
-- TABLE 5: suggested_cards
-- ============================================
CREATE TABLE IF NOT EXISTS suggested_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  card_type VARCHAR(50) NOT NULL,
  action_label VARCHAR(100),
  suggested_action JSONB,
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_card_type CHECK (card_type IN ('optimization', 'schedule', 'priority'))
);

CREATE INDEX IF NOT EXISTS idx_suggested_cards_user_id ON suggested_cards(user_id);

-- ============================================
-- TABLE 6: sync_logs
-- ============================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON sync_logs(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggested_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- habits policies
CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- habit_completions policies
CREATE POLICY "Users can view their own completions" ON habit_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create completions" ON habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions" ON habit_completions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions" ON habit_completions
  FOR DELETE USING (auth.uid() = user_id);

-- ai_insights policies
CREATE POLICY "Users can view their own insights" ON ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create insights" ON ai_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- suggested_cards policies
CREATE POLICY "Users can view their suggested cards" ON suggested_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create suggested cards" ON suggested_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their suggested cards" ON suggested_cards
  FOR UPDATE USING (auth.uid() = user_id);

-- sync_logs policies
CREATE POLICY "Users can view their sync logs" ON sync_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sync logs" ON sync_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR AUTO-TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_habits_timestamp
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_sync_logs_timestamp
  BEFORE UPDATE ON sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

CREATE OR REPLACE VIEW v_current_streaks AS
SELECT 
  h.id,
  h.user_id,
  h.name,
  h.category,
  h.streak,
  h.last_completed_date,
  (CURRENT_DATE - h.last_completed_date) AS days_since_completion
FROM habits h
WHERE h.end_date IS NULL OR h.end_date >= CURRENT_DATE;

CREATE OR REPLACE VIEW v_weekly_stats AS
SELECT 
  h.user_id,
  h.id as habit_id,
  h.name,
  COUNT(hc.id) as completions_this_week
FROM habits h
LEFT JOIN habit_completions hc ON h.id = hc.habit_id
  AND hc.completed_date >= CURRENT_DATE - INTERVAL '7 days'
WHERE h.frequency = 'daily'
GROUP BY h.user_id, h.id, h.name;
```

---

## ✅ Verificación después de ejecutar:

En SQL Editor ejecuta esto para verificar:

```sql
-- Ver todas las tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver:
- `ai_insights`
- `habit_completions`
- `habits`
- `suggested_cards`
- `sync_logs`
- `user_profiles`

---

## 🎯 Siguiente paso:

Después de ejecutar el SQL:
1. Ve a **Authentication** → **Policies** en Supabase
2. Verifica que las RLS policies estén activas en todas las tablas
3. En tu app, la autenticación ya está configurada en React
4. Los datos se sincronizarán automáticamente con Supabase
