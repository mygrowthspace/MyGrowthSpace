#!/bin/bash

# My Growth Space - Supabase Schema Deployment Helper
# This script helps you deploy the database schema to Supabase

set -e

echo "🚀 My Growth Space - Supabase Schema Deployment"
echo "================================================"
echo ""

# Check if schema file exists
if [ ! -f "schema.sql" ]; then
    echo "❌ schema.sql not found in current directory"
    echo "Please run this from the project root"
    exit 1
fi

echo "✅ Found schema.sql ($(wc -l < schema.sql) lines)"
echo ""
echo "📖 Schema Deployment Instructions:"
echo "========================================="
echo ""
echo "AUTOMATIC DEPLOYMENT (Python):"
echo "  python3 scripts/deploy.py"
echo ""
echo "MANUAL DEPLOYMENT (Recommended for first-time):"
echo "  1. Go to https://app.supabase.com"
echo "  2. Select project: dtyzunvgbmnheqbubhef"
echo "  3. Click: SQL Editor → New Query"
echo "  4. Copy & paste the schema.sql contents below:"
echo "  5. Click Run or press Ctrl+Enter"
echo ""
echo "COPY THIS TO SQL EDITOR:"
echo "========================================="
echo ""
cat schema.sql
echo ""
echo "========================================="
echo ""
echo "✨ After deployment:"
echo "  1. Verify tables exist in Tables view"
echo "  2. Check RLS policies are enabled"
echo "  3. Test login/signup in the app"
echo "  4. Monitor for any errors"
echo ""
echo "📚 Documentation:"
echo "  - docs/SUPABASE_DEPLOYMENT.md"
echo "  - docs/AUTHENTICATION.md"
echo ""
