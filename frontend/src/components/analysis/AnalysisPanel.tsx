'use client';

import { useState } from 'react';
import { AnalysisResult, Issue } from '@/types';
import ScoreBadge from '@/components/ui/ScoreBadge';
import IssueCard from './IssueCard';

interface AnalysisPanelProps {
  result: AnalysisResult;
  onLineHover?: (line: number | null) => void;
}

type FilterType = 'all' | 'error' | 'warning' | 'info';

export default function AnalysisPanel({ result, onLineHover }: AnalysisPanelProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const { summary, issues } = result;

  const filtered = filter === 'all' ? issues : issues.filter((i) => i.severity === filter);

  const statBar = (label: string, value: number, color: string) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-semibold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Score summary */}
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Analysis Complete</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {summary.total_issues} issue{summary.total_issues !== 1 ? 's' : ''} detected
            </p>
          </div>
          <ScoreBadge score={summary.overall_score} size="md" />
        </div>

        {/* Issue counts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Errors', count: summary.errors, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
            { label: 'Warnings', count: summary.warnings, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
            { label: 'Info', count: summary.infos, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`rounded-lg border ${bg} p-2 text-center`}>
              <div className={`text-lg font-bold font-mono ${color}`}>{count}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Score bars */}
        <div className="space-y-2">
          {statBar('Readability', summary.readability_score, '#00d4ff')}
          {statBar('Maintainability', summary.maintainability_score, '#c084fc')}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-3 border-b border-border-subtle bg-bg-secondary/30">
        {(['all', 'error', 'warning', 'info'] as FilterType[]).map((f) => {
          const count = f === 'all' ? issues.length : issues.filter((i) => i.severity === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                filter === f
                  ? 'bg-accent-cyan text-black font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-bg-tertiary'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Issue list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <span className="text-2xl mb-2">✅</span>
            <p className="text-sm text-slate-400">No {filter === 'all' ? '' : filter} issues found</p>
          </div>
        ) : (
          filtered.map((issue, i) => (
            <IssueCard key={issue.id} issue={issue} index={i} onHover={onLineHover} />
          ))
        )}
      </div>
    </div>
  );
}
