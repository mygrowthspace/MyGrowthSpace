import React, { useState } from 'react';
import { signUp, createUserProfile } from '../services/supabaseClient';
import { Mail, Lock, User, Zap, ArrowRight } from 'lucide-react';

interface SignUpProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [identityStatement, setIdentityStatement] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'profile'>(
    'credentials'
  );

  const focusAreaOptions = [
    'Health',
    'Mindset',
    'Productivity',
    'Finance',
    'Social'
  ];

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { user, error: signUpError } = await signUp(email, password, name);

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    if (user) {
      setStep('profile');
    }
    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (focusAreas.length === 0) {
      setError('Please select at least one focus area');
      return;
    }

    setLoading(true);

    // Get user from auth
    const { data: { user } } = await (await import('@supabase/supabase-js')).default;
    
    // For now, we'll handle this after successful signup
    onSuccess();
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  if (step === 'profile') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-dark-900 rounded-lg border border-dark-700 p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Define Your Growth
            </h1>
            <p className="text-dark-400">
              Help us personalize your experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Identity Statement */}
            <div>
              <label
                htmlFor="identity"
                className="block text-sm font-medium text-dark-300 mb-2"
              >
                Your Identity Statement
              </label>
              <textarea
                id="identity"
                value={identityStatement}
                onChange={(e) => setIdentityStatement(e.target.value)}
                placeholder="e.g., 'I am becoming a disciplined and healthy person who values growth'"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
                rows={3}
              />
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-3">
                Focus Areas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {focusAreaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                      focusAreas.includes(area)
                        ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-300'
                        : 'bg-dark-800 border border-dark-600 text-dark-300 hover:border-dark-500'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-dark-600 disabled:to-dark-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-dark-900 rounded-lg border border-dark-700 p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Start Your Journey
          </h1>
          <p className="text-dark-400">
            Join My Growth Space and build atomic habits
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-dark-600 disabled:to-dark-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-dark-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
