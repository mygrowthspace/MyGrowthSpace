#!/bin/bash

# ============================================
# My Growth Space - Setup Script
# Automates initial project setup
# ============================================

set -e  # Exit on error

echo "🚀 My Growth Space - Setup Script"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
    echo "   - VITE_GEMINI_API_KEY"
    echo "   - VITE_SUPABASE_URL (optional)"
    echo "   - VITE_SUPABASE_ANON_KEY (optional)"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm run test -- --reporter=verbose 2>/dev/null || true

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Edit .env.local with your API keys"
echo "   2. Configure Supabase (see docs/SUPABASE_QUICK_START.md)"
echo "   3. Run: npm run dev"
echo "   4. Visit: http://localhost:3000"
echo ""
echo "📚 Documentation: docs/INDEX.md"
echo "=================================="
