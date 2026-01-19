import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-cyan-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
        {authView === 'login' ? (
          <Login
            onSuccess={() => window.location.reload()}
            onSwitchToSignUp={() => setAuthView('signup')}
          />
        ) : (
          <SignUp
            onSuccess={() => window.location.reload()}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#0a0a0c] text-white">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Growth Space</h1>
          <button
            onClick={async () => {
              const { signOut } = await import('./services/supabaseClient');
              await signOut();
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
        <p className="text-dark-400">Welcome, {user?.email}!</p>
        <p className="text-dark-500 text-sm mt-2">🚀 App dashboard coming soon...</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
