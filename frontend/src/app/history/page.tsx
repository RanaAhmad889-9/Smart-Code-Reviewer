'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RootState } from '@/store';
import Navbar from '@/components/ui/Navbar';
import ScoreBadge from '@/components/ui/ScoreBadge';
import api from '@/lib/api';
import { HistoryItem } from '@/types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useSelector((s: RootState) => s.auth);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchHistory();
  }, [user]);

  async function fetchHistory() {
    try {
      const res = await api.get('/analyses/history');
      setHistory(res.data);
    } catch (err: any) {
      setError('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Analysis History</h1>
          <p className="text-sm text-slate-500 font-mono">
            Your past {history.length} code review{history.length !== 1 ? 's' : ''}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-bg-tertiary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-bg-tertiary rounded w-1/3" />
                    <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-4xl">📭</div>
            <p className="text-slate-400 text-sm">No analyses yet</p>
            <Link
              href="/analyzer"
              className="inline-block px-5 py-2 bg-accent-cyan text-black font-semibold rounded-lg text-sm hover:bg-accent-cyan/90 transition-colors"
            >
              Run your first analysis
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => {
              const { summary } = item;
              return (
                <Link
                  key={item.id}
                  href={`/analyzer?id=${item.id}`}
                  className="block glass-card rounded-xl p-4 hover:border-border-active transition-all animate-fade-up group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={item.score} size="sm" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-tertiary border border-border-subtle text-slate-400">
                          {item.language}
                        </span>
                        <span className="text-xs text-slate-600 font-mono">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-red-400">
                          {summary.errors} error{summary.errors !== 1 ? 's' : ''}
                        </span>
                        <span className="text-yellow-400">
                          {summary.warnings} warning{summary.warnings !== 1 ? 's' : ''}
                        </span>
                        <span className="text-blue-400">
                          {summary.infos} info
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
