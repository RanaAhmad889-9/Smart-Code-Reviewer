'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import Navbar from '@/components/ui/Navbar';
import api from '@/lib/api';

interface AdminStats {
  total_analyses: number;
  total_users: number;
  avg_score: number;
  recent_analyses: Array<{
    id: number;
    language: string;
    score: number;
    created_at: string;
    username: string | null;
  }>;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold font-mono text-white">{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useSelector((s: RootState) => s.auth);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'ADMIN') { router.push('/analyzer'); return; }
    fetchStats();
  }, [user]);

  async function fetchStats() {
    try {
      const res = await api.get('/analyses/admin/stats');
      setStats(res.data);
    } catch {
      // handle
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <span className="px-2 py-0.5 text-xs font-mono bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded">
            ADMIN
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard label="Total Analyses" value={stats.total_analyses} sub="all time" />
              <StatCard label="Total Users" value={stats.total_users} sub="registered accounts" />
              <StatCard label="Avg. Score" value={stats.avg_score} sub="across all submissions" />
            </div>

            {/* Recent analyses table */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-subtle">
                <h2 className="text-sm font-semibold text-white">Recent Analyses</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle text-xs font-mono text-slate-500">
                      <th className="text-left px-5 py-3">ID</th>
                      <th className="text-left px-5 py-3">User</th>
                      <th className="text-left px-5 py-3">Language</th>
                      <th className="text-left px-5 py-3">Score</th>
                      <th className="text-left px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_analyses.map((a) => (
                      <tr key={a.id} className="border-b border-border-subtle/50 hover:bg-bg-tertiary/30 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">#{a.id}</td>
                        <td className="px-5 py-3 text-xs text-slate-300">{a.username || 'Guest'}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-tertiary text-slate-400 border border-border-subtle">
                            {a.language}
                          </span>
                        </td>
                        <td className={`px-5 py-3 font-mono font-bold text-sm ${scoreColor(a.score)}`}>
                          {a.score}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500 font-mono">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">Failed to load stats</p>
        )}
      </div>
    </div>
  );
}
