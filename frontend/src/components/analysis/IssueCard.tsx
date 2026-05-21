'use client';

import { useState } from 'react';
import { Issue } from '@/types';

const severityConfig = {
  error: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', label: 'Error' },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400', label: 'Warning' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', label: 'Info' },
};

const typeIcons: Record<string, string> = {
  unused_variable: '📦',
  long_function: '📏',
  deep_nesting: '🌀',
  console_log: '🖨️',
  bad_naming: '🏷️',
  complexity: '⚡',
};

interface IssueCardProps {
  issue: Issue;
  index: number;
  onHover?: (line: number | null) => void;
}

export default function IssueCard({ issue, index, onHover }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[issue.severity];
  const icon = typeIcons[issue.type] || '⚠️';

  return (
    <div
      className={`rounded-lg border ${config.border} ${config.bg} transition-all duration-200 animate-fade-up`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => onHover?.(issue.line)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Header */}
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-base mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-mono font-semibold ${config.color}`}>
              Line {issue.line}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${config.bg} ${config.color} border ${config.border}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-slate-300 font-medium">{issue.message}</p>
        </div>
        <span className={`text-slate-500 text-xs mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
          {/* Explanation */}
          <div>
            <p className="text-xs text-slate-500 uppercase font-mono mb-1 tracking-wider">Why this matters</p>
            <p className="text-sm text-slate-400">{issue.explanation}</p>
          </div>

          {/* Code snippet */}
          {issue.code_snippet && (
            <div>
              <p className="text-xs text-slate-500 uppercase font-mono mb-1 tracking-wider">Detected</p>
              <code className="block text-xs font-mono bg-bg-primary rounded px-3 py-2 text-slate-300 border border-border-subtle">
                {issue.code_snippet}
              </code>
            </div>
          )}

          {/* Suggestion */}
          <div className="rounded-md bg-green-500/5 border border-green-500/20 px-3 py-2">
            <p className="text-xs text-green-400 uppercase font-mono mb-1 tracking-wider">✓ How to fix</p>
            <p className="text-sm text-slate-300">{issue.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
