'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { analyzeCode, clearResult } from '@/store/slices/analysisSlice';
import Navbar from '@/components/ui/Navbar';
import CodeEditor from '@/components/editor/CodeEditor';
import AnalysisPanel from '@/components/analysis/AnalysisPanel';
import EmptyState from '@/components/analysis/EmptyState';
import AnalyzingLoader from '@/components/analysis/AnalyzingLoader';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', ext: '.js' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts' },
];

export default function AnalyzerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { result, isLoading, error } = useSelector((s: RootState) => s.analysis);
  const { user } = useSelector((s: RootState) => s.auth);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  async function handleAnalyze() {
    if (!code.trim()) return;
    dispatch(analyzeCode({ code, language }));
  }

  function handleClear() {
    setCode('');
    dispatch(clearResult());
  }

  const highlightedLines = result?.issues.map((i) => i.line) ?? [];

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <Navbar />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-bg-secondary border-b border-border-subtle">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Language:</span>
          <div className="flex rounded-md overflow-hidden border border-border-subtle">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  language === lang.value
                    ? 'bg-accent-cyan text-black font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-bg-tertiary'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        {result && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs border border-border-subtle text-slate-400 hover:text-white hover:border-border-active rounded transition-colors font-mono"
          >
            Clear
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !code.trim()}
          className={`px-5 py-1.5 text-xs font-semibold rounded font-mono transition-all flex items-center gap-2 ${
            isLoading || !code.trim()
              ? 'bg-accent-cyan/30 text-black/50 cursor-not-allowed'
              : 'bg-accent-cyan text-black hover:bg-accent-cyan/90 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin inline-block w-3 h-3 border border-black/30 border-t-black rounded-full" />
              Analyzing...
            </>
          ) : (
            <>▶ Run Analysis</>
          )}
        </button>

        {!user && (
          <span className="text-xs text-slate-600 font-mono hidden md:block">
            💡 Login to save history
          </span>
        )}
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="flex-1 min-w-0 p-3 border-r border-border-subtle">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            highlightedLines={hoveredLine ? [hoveredLine] : highlightedLines}
          />
        </div>

        {/* Right: Analysis Results */}
        <div className="w-[400px] flex-shrink-0 bg-bg-secondary flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse-slow" />
            <span className="text-xs font-mono text-slate-400">Analysis Results</span>
            {result && (
              <span className="ml-auto text-xs font-mono text-slate-600">
                #{result.id}
              </span>
            )}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <AnalyzingLoader />
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
                <span className="text-2xl">⚠️</span>
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={handleAnalyze}
                  className="text-xs text-accent-cyan hover:underline font-mono"
                >
                  Try again
                </button>
              </div>
            ) : result ? (
              <AnalysisPanel result={result} onLineHover={setHoveredLine} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
