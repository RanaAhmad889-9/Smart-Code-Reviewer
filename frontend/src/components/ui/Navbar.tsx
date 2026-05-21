'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((s: RootState) => s.auth);

  function handleLogout() {
    dispatch(logout());
    router.push('/');
  }

  return (
    <nav className="border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
            <span className="text-xs font-bold text-black">CR</span>
          </div>
          <span className="font-mono font-semibold text-sm text-white group-hover:text-accent-cyan transition-colors">
            CodeReviewer
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/analyzer"
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-bg-tertiary rounded transition-colors"
          >
            Analyzer
          </Link>
          {user && (
            <Link
              href="/history"
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-bg-tertiary rounded transition-colors"
            >
              History
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-bg-tertiary rounded transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">
                {user.username}
                {user.role === 'ADMIN' && (
                  <span className="ml-1 text-accent-purple">[admin]</span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs border border-border-subtle text-slate-400 hover:text-white hover:border-border-active rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 py-1.5 text-xs bg-accent-cyan text-black font-semibold rounded hover:bg-accent-cyan/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
