<div align="center">
  <h1>🚀 My Growth Space</h1>
  <p><strong>The Definitive Atomic Habits Toolkit</strong></p>
  <p>An AI-powered, identity-based habit tracking system built on James Clear's <em>Atomic Habits</em> principles</p>
</div>

---

## 📌 Overview

**My Growth Space** is a cutting-edge habit tracking application that combines identity-based psychology with AI-powered insights. Built on James Clear's *Atomic Habits* framework, it helps you transform routines into atomic micro-habits while maintaining complete control over your data.

### ✨ Key Features

- 🧠 **Identity-Based Habits** - Align habits with your core identity statement
- 🤖 **Google Gemini AI Integration** - Intelligent routine analysis & optimization suggestions
- 📊 **Visual Progress Tracking** - Streaks, completion rates, and growth analytics
- 🔐 **Privacy-First Architecture** - 100% local-first; optional Supabase sync
- 📱 **Progressive Web App (PWA)** - Works offline, installable on mobile/desktop
- ⚡ **Zero Backend Required** - Frontend-only deployment ready
- 🧪 **Comprehensive Test Suite** - TDD with Vitest
- 🚀 **Serverless Ready** - Deploy to Cloudflare Workers in seconds

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.3** + **TypeScript 5.8.2** - Modern React with type safety
- **Vite 6.2.0** - Lightning-fast build tool & dev server
- **Tailwind CSS** - Utility-first styling (via CDN)
- **Recharts 3.6.0** - Data visualization
- **Lucide React 0.562.0** - Beautiful icon library

### AI & Services
- **Google Generative AI (Gemini 1.37.0)** - Routine analysis & insights
- **Supabase 2.38.0** (Optional) - PostgreSQL for cloud sync
- **Service Workers** - PWA offline capabilities

### Testing & DevOps
- **Vitest** - Ultra-fast unit & integration testing
- **Cloudflare Workers** - Serverless deployment
- **Wrangler 3.26.0** - Cloudflare CLI

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **npm** or **yarn**
- **Gemini API key** (free at [ai.google.dev](https://ai.google.dev))
- (Optional) **Supabase account** for cloud sync

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/naiam-studio/MyGrowthSpace.git
cd MyGrowthSpace

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and add:
#   - VITE_GEMINI_API_KEY=your_key
#   - (Optional) VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Start development server
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [**⚡ Supabase Quick Start**](./docs/SUPABASE_QUICK_START.md) | Get database running in 15 minutes |
| [**🔐 Supabase Setup**](./docs/SUPABASE_SETUP.md) | Detailed setup and configuration |
| [**🗄️ Database Architecture**](./docs/DATABASE_ARCHITECTURE.md) | Schema design and ER diagram |
| [**🔑 Authentication**](./docs/AUTHENTICATION.md) | Login/register implementation |
| [**💾 SQL Queries Reference**](./docs/SQL_QUERIES_REFERENCE.md) | Common database queries |
| [**🧪 Testing Guide**](./docs/TESTING.md) | TDD setup, patterns, and best practices |
| [**🎨 Style Guide**](./docs/style-guide.md) | Design system & component guidelines |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Interactive UI dashboard
npm run test:ui

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests are located in `/test` directory with patterns:
- `test/setup.ts` - Global mocks & fixtures
- `test/services/` - Service layer tests
- `test/integration/` - End-to-end flows

[**See Testing Guide**](./docs/TESTING.md) for detailed patterns.

---

## 🌐 Deployment

### 🔥 Cloudflare Workers (Recommended)

```bash
# Install Wrangler (already in devDependencies)
npm install -g wrangler

# Deploy to staging
npm run deploy:cf:staging

# Deploy to production
npm run deploy:cf:prod
```

Configuration in [wrangler.toml](./wrangler.toml)

### 💾 Optional: Supabase Cloud Sync

Enable multi-device sync without losing privacy:

```bash
# Set environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

All Supabase functions are in [services/supabaseClient.ts](./services/supabaseClient.ts):
- `syncHabitsToSupabase()` - Push habits to cloud
- `fetchHabitsFromSupabase()` - Pull habits from cloud
- `syncProfileToSupabase()` - Sync user profile
- Automatic fallback to localStorage if Supabase is unavailable

---

## 📂 Project Structure

```
MyGrowthSpace/
├── components/
│   ├── HabitCard.tsx           # Individual habit display
│   ├── Onboarding.tsx          # First-run setup flow
│   └── SuggestedCardComponent.tsx
├── services/
│   ├── geminiService.ts        # Gemini API integration
│   └── supabaseClient.ts       # Cloud sync (optional)
├── test/                       # TDD test suite
│   ├── setup.ts                # Mocks & fixtures
│   ├── services/
│   │   └── geminiService.test.ts
│   ├── types.test.ts
│   └── integration/
├── docs/
│   ├── TESTING.md              # Testing guide
│   ├── style-guide.md          # Design system
│   └── DEPLOYMENT.md           # Deployment guide
├── App.tsx                     # Main app component
├── types.ts                    # Type definitions
├── sw.js                       # Service Worker (PWA)
├── vitest.config.ts            # Test configuration
├── vite.config.ts              # Build configuration
├── wrangler.toml               # Cloudflare config
└── package.json                # Dependencies & scripts
```

---

## 💡 Core Concepts

### Identity-Based Habits
Rather than goal-focused ("I want to lose weight"), the app uses identity-based thinking ("I am a healthy person"). This aligns with Atomic Habits philosophy and creates lasting change.

### Atomic Discipline
Break goals into 2-minute micro-habits with visual tracking and AI-powered insights.

### Local-First Privacy
Your data stays on your device by default. Optionally sync to Supabase without sacrificing privacy.

### Data Flow

```
User Input (Routine)
    ↓
Gemini AI Analysis
    ↓
Extract Atomic Habits + Align with Identity
    ↓
Local Storage (Primary)
    ↓
Optional: Supabase Sync
    ↓
Visual Tracking + AI Insights
```

---

## 🔄 Available Scripts

```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run test             # Run all tests once
npm run test:ui          # Launch interactive test dashboard
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run deploy:cf        # Deploy to Cloudflare production
npm run deploy:cf:staging # Deploy to Cloudflare staging
npm run deploy:cf:prod   # Deploy to Cloudflare production
```

---

## 🎯 Roadmap

- [ ] Export data as CSV/PDF
- [ ] Social accountability (optional public profiles)
- [ ] Habit templates marketplace
- [ ] Mobile apps (React Native)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Advanced analytics dashboard
- [ ] AI coaching mode

---

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Write tests** first (TDD approach)
4. **Follow** the [style guide](./docs/style-guide.md)
5. **Commit** with clear messages
6. **Push** to your fork and **open a Pull Request**

### Contribution Guidelines
- Keep components under 500 lines
- Add JSDoc comments for complex logic
- Ensure all tests pass: `npm run test`
- Maintain code coverage above 70%
- Follow TypeScript best practices

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 🙋 Support & Community

- **Issues**: [GitHub Issues](https://github.com/naiam-studio/MyGrowthSpace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/naiam-studio/MyGrowthSpace/discussions)
- **Email**: support@naiam-studio.com

---

## 🙏 Acknowledgments

- **James Clear** - *Atomic Habits* philosophy
- **Google** - Gemini API
- **Vercel/Vite** - Build tools
- **Supabase** - Database & auth
- **Tailwind Labs** - CSS framework

---

<div align="center">

**Built with 💪 by [Naiam Studio](https://naiam-studio.com)**

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle*

[⭐ Star us on GitHub](https://github.com/naiam-studio/MyGrowthSpace) if you find this helpful!

</div>
