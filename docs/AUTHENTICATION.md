# 🔐 Authentication System - My Growth Space

## 📋 Overview

My Growth Space uses **Supabase Auth** with custom React components for:
- Email/Password registration and login
- Secure session management
- Row Level Security (RLS) enforcement
- Automatic session persistence

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────┐
│             React Application                      │
│  ┌──────────────────────────────────────────────┐ │
│  │  AuthContext (useAuth)                       │ │
│  │  - user: User | null                         │ │
│  │  - session: Session | null                   │ │
│  │  - loading: boolean                          │ │
│  │  - signOut: () => Promise<void>              │ │
│  └──────────────────────────────────────────────┘ │
│           │                                       │
│  ┌────────▼──────────────────────────────────┐   │
│  │  Auth Components                          │   │
│  │  • Login.tsx (signin)                     │   │
│  │  • SignUp.tsx (register + profile)        │   │
│  └────────┬──────────────────────────────────┘   │
└───────────┼─────────────────────────────────────┘
            │
    ┌───────▼────────────┐
    │   Supabase Auth    │
    │   • JWT Sessions   │
    │   • auth.users     │
    └────────┬───────────┘
             │
    ┌────────▼──────────────┐
    │   PostgreSQL DB       │
    │   • user_profiles     │
    │   • habits            │
    │   • (RLS enforced)    │
    └───────────────────────┘
```

---

## 🔧 Components

### 1️⃣ AuthContext.tsx

Global state management with Supabase auth listeners:

```typescript
import { useAuth } from './components/AuthContext';

function App() {
  const { user, loading, signOut } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginScreen />;
  
  return <Dashboard />;
}
```

**Exports:**
- `<AuthProvider>` - Wrapper component
- `useAuth()` - Hook for accessing auth state

**Context Value:**
```typescript
{
  session: Session | null,        // Supabase session object
  user: User | null,              // Current authenticated user
  loading: boolean,                // Initial load state
  signOut: () => Promise<void>    // Logout function
}
```

---

### 2️⃣ Login.tsx

Email/password signin component:

```tsx
<Login 
  onSuccess={() => setPath('app')}
  onSwitchToSignUp={() => setAuthView('signup')}
/>
```

**Features:**
- ✅ Email input with validation
- ✅ Password field
- ✅ Error message display
- ✅ Loading spinner during submit
- ✅ Responsive design
- ✅ Link to signup page

**Styling:**
- Dark theme (Tailwind)
- Cyan/blue gradients
- Icon integration (lucide-react)

---

### 3️⃣ SignUp.tsx

Two-step registration:

**Step 1: Credentials**
```typescript
{
  name: string,              // Full name
  email: string,             // Email address
  password: string,          // Password
  confirmPassword: string    // Verify password
}
```

**Step 2: Profile**
```typescript
{
  identityStatement: string,  // e.g., "I am becoming healthy"
  focusAreas: string[]       // Select from: Health, Mindset, 
                              //             Productivity, Finance, Social
}
```

**Flow:**
1. User enters credentials
2. Validation (passwords match, etc.)
3. Call `signUp()` - creates auth.users record
4. If success, show Step 2
5. User configures profile
6. Call `createUserProfile()` - creates user_profiles record
7. App auto-navigates to dashboard

---

## 📱 Services (supabaseClient.ts)

### Auth Functions

```typescript
// Sign up with email/password
const { user, error } = await signUp(
  email: string,
  password: string,
  name: string
);

// Sign in with credentials
const { user, error } = await signIn(
  email: string,
  password: string
);

// Sign out (invalidate session)
const { error } = await signOut();

// Get current session (persisted)
const session = await getSession();

// Get current user from session
const user = await getUser();

// Create user profile after signup
const { error } = await createUserProfile(
  userId: string,
  email: string,
  name: string,
  identityStatement: string,
  focusAreas: string[]
);

// Fetch user profile
const profile = await getUserProfile(userId: string);
```

---

## 🔄 Authentication Flows

### Signup Flow

```
User fills email/password form
        ↓
Click "Create Account"
        ↓
signUp() called
        ↓
Supabase creates auth.users record
        ↓
User fills profile (identity + focus areas)
        ↓
Click "Complete Setup"
        ↓
createUserProfile() called
        ↓
user_profiles record created
        ↓
AuthContext detects user from session
        ↓
App auto-navigates to dashboard
```

### Login Flow

```
User fills email/password
        ↓
Click "Sign In"
        ↓
signIn() called
        ↓
Supabase validates credentials
        ↓
JWT session token created
        ↓
Session stored in browser
        ↓
AuthContext updates state
        ↓
App navigates to dashboard
```

### Logout Flow

```
User clicks "Sign Out"
        ↓
signOut() called
        ↓
Supabase invalidates session
        ↓
AuthContext clears user state
        ↓
App navigates to login
```

### Session Persistence

```
User logs in
        ↓
Supabase stores session in localStorage
        ↓
User closes browser
        ↓
Page reload
        ↓
AuthContext checks localStorage
        ↓
Session restored automatically
        ↓
User stays logged in
```

---

## 🛡️ Row Level Security (RLS)

All tables enforce security at database level:

```sql
-- Example: Users can only view their own habits
CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert new habits (but only for themselves)
CREATE POLICY "Users can create habits" ON habits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own habits
CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own habits
CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Benefits:**
- ✅ User A cannot see User B's data (even via direct SQL)
- ✅ User A cannot modify User B's data
- ✅ Enforced at database, not just app level
- ✅ Works with API, direct SQL, and SDKs
- ✅ Zero-trust architecture

---

## 💾 Implementation Guide

### 1. Wrap App with AuthProvider

```typescript
// index.tsx
import { AuthProvider } from './components/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
```

### 2. Use useAuth Hook

```typescript
import { useAuth } from './components/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Hello, {user.email}!</div>;
}
```

### 3. Protect Routes

```typescript
function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'login' | 'app'>('login');
  
  useEffect(() => {
    if (!loading) {
      setView(user ? 'app' : 'login');
    }
  }, [user, loading]);
  
  return view === 'app' ? <Dashboard /> : <LoginScreen />;
}
```

### 4. Access Protected Data

```typescript
// RLS automatically restricts this to user's data
const { data: habits } = await supabase
  .from('habits')
  .select('*');  // Only returns user's habits
```

---

## 🔑 Environment Configuration

**File:** `.env.local`

```bash
# Supabase credentials (Anon key only - safe for browser)
VITE_SUPABASE_URL=https://dtyzunvgbmnheqbubhef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Gemini API for AI features
VITE_GEMINI_API_KEY=your-key-here
```

**Never commit:** `.env.local`
**Always commit:** `.env.local.example`

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Schema deployed to Supabase (`schema.sql`)
- [ ] Email/Password auth enabled in Supabase settings
- [ ] RLS policies created on all 6 tables
- [ ] `.env.local` has correct keys
- [ ] Login component works
- [ ] Signup component works
- [ ] User profile created after signup
- [ ] User cannot see other users' data
- [ ] Logout clears session
- [ ] Session persists on page reload

---

## 🐛 Common Issues & Solutions

### ❌ "Invalid API Key"
**Cause:** Wrong `VITE_SUPABASE_ANON_KEY`

**Solution:**
1. Get key from Supabase → Settings → API
2. Copy entire "Anon public" value
3. Paste into `.env.local`
4. Restart dev server: `npm run dev`

### ❌ "User already exists"
**Cause:** Email already registered

**Solution:**
- Use different email for testing
- Or reset in Supabase Auth dashboard
- Or delete user via SQL:
  ```sql
  DELETE FROM auth.users WHERE email = 'test@example.com';
  ```

### ❌ "Permission denied" errors
**Cause:** RLS policies not configured

**Solution:**
1. Go to Supabase dashboard
2. Check SQL Editor → verify policies exist
3. Test RLS:
   ```sql
   SELECT auth.uid() as current_user;
   SELECT * FROM habits;  -- Should only show your habits
   ```

### ❌ "User not logged in after page reload"
**Cause:** Session not persisted

**Solution:**
1. Check browser localStorage enabled
2. In DevTools: `Application → Local Storage`
3. Should see `sb-dtyzunvgbmnheqbubhef-auth-token` key
4. If missing: manually login again

### ❌ "Email verification required"
**Cause:** Email confirmation not implemented

**Solution (Development):**
- Disable email confirmation in Supabase:
  - Settings → Auth → Email → Confirm Email unchecked

**Solution (Production):**
- Implement email confirmation flow
- Add link to confirm email in email body
- Or use passwordless magic links

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use HTTPS in production
- ✅ Keep `.env.local` secret (add to `.gitignore`)
- ✅ Use Anon Key in browser (limited permissions)
- ✅ Use Service Role Key only on backend
- ✅ Enable RLS on all tables
- ✅ Check `auth.uid()` in RLS policies
- ✅ Validate user input on frontend and backend
- ✅ Use strong password requirements
- ✅ Implement rate limiting on auth endpoints
- ✅ Log auth events for security audit

### ❌ DON'T:
- ❌ Commit `.env.local` to git
- ❌ Expose Service Role Key to browser
- ❌ Skip RLS validation
- ❌ Filter data in JavaScript (always use RLS)
- ❌ Store passwords in localStorage
- ❌ Use same auth for multiple apps
- ❌ Ignore invalid JWT tokens
- ❌ Disable CSRF protection
- ❌ Allow unlimited login attempts
- ❌ Hardcode credentials in code

---

## 📚 Related Documentation

- [SUPABASE_DEPLOYMENT.md](./SUPABASE_DEPLOYMENT.md) - Schema deployment guide
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Table structure with RLS
- [SQL_QUERIES_REFERENCE.md](./SQL_QUERIES_REFERENCE.md) - Example queries

---

## 🚀 Next Steps

1. ✅ Implement auth components
2. ⏳ Deploy schema to Supabase
3. ⏳ Enable Email/Password auth
4. ⏳ Test login/signup flows
5. ⏳ Implement profile completion
6. ⏳ Add password reset
7. ⏳ Implement OAuth (Google/GitHub)
8. ⏳ Deploy to production
9. ⏳ Monitor auth metrics
10. ⏳ Plan 2FA setup

---

**Last Updated:** January 19, 2026
**Status:** ✅ Complete (MVP v1)
**Version:** 1.0.0
