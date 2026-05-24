'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(signup({ email, username, password }));
    if (signup.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">🎉</div>
          <p className="text-white font-semibold">Account created!</p>
          <p className="text-sm text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <span className="text-sm font-bold text-black">CR</span>
            </div>
            <span className="font-mono font-semibold text-white">CodeReviewer</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Start reviewing code for free</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="devuser"
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                minLength={6}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan/50 transition-colors font-mono"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 font-mono">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-accent-cyan text-black font-bold rounded-lg text-sm hover:bg-accent-cyan/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
