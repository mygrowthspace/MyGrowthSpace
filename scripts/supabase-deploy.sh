#!/bin/bash

# Supabase deployment helper
# This script generates instructions for deploying to Supabase

SCHEMA_FILE="/workspaces/MyGrowthSpace/schema.sql"
OUTPUT_FILE="/tmp/supabase-deploy.md"

cat > "$OUTPUT_FILE" << 'EOF'
# Supabase Schema Deployment Instructions

## Method: Use Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project: **dtyzunvgbmnheqbubhef**
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste the SQL schema content below
6. Click **Run** or press `Ctrl+Enter`

## SQL Schema

```sql
EOF

cat "$SCHEMA_FILE" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'EOF'
```

## Verification

After running the script, verify:
1. All 6 tables created: `user_profiles`, `habits`, `habit_completions`, `ai_insights`, `suggested_cards`, `sync_logs`
2. Row Level Security (RLS) enabled on all tables
3. All indices created
4. All RLS policies in place

Check via SQL Editor:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
```

Should return 6 tables listed above.

## What's Next

1. Configure authentication in Supabase Auth
2. Test RLS policies with authenticated users
3. Set up webhook for sync_logs
4. Implement Auth UI in React
EOF

echo "✅ Deployment guide created: $OUTPUT_FILE"
echo "📖 Next steps written to file"
cat "$OUTPUT_FILE" | head -50

