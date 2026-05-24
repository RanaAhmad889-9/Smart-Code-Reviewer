import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';

export default function HomePage() {
  const features = [
    { icon: '📦', title: 'Unused Variables', desc: 'Detects variables declared but never referenced' },
    { icon: '📏', title: 'Function Length', desc: 'Flags functions over 40 lines for refactoring' },
    { icon: '🌀', title: 'Deep Nesting', desc: 'Identifies 3+ levels of nested control flow' },
    { icon: '🖨️', title: 'Console Logs', desc: 'Finds debug statements left in production code' },
    { icon: '🏷️', title: 'Bad Naming', desc: 'Catches cryptic or non-descriptive identifiers' },
    { icon: '⚡', title: 'Nested Loops', desc: 'Warns about O(n²) complexity patterns' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 text-xs font-mono text-accent-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
          Static Analysis Engine · JS + TS
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Code that reviews{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff, #c084fc)' }}
          >
            itself.
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">
          Smart Code Reviewer analyzes your JavaScript and TypeScript for real issues — unused variables,
          deep nesting, poor naming, and more. Get a clean code score in seconds.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/analyzer"
            className="px-6 py-3 bg-accent-cyan text-black font-bold rounded-lg hover:bg-accent-cyan/90 transition-all active:scale-95"
          >
            Start Analyzing →
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 border border-border-active text-slate-300 rounded-lg hover:border-border-subtle hover:text-white transition-colors"
          >
            Create account
          </Link>
        </div>

        {/* Feature grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl w-full">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card rounded-xl p-4 text-left hover:border-border-active transition-colors"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Score preview */}
        <div className="mt-16 glass-card rounded-2xl p-6 max-w-sm w-full animated-border">
          <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-widest">Sample Report</p>
          <div className="flex items-center justify-between">
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs text-slate-400">2 Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-xs text-slate-400">5 Warnings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs text-slate-400">3 Info</span>
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-5xl font-bold font-mono"
                style={{ color: '#ffd700' }}
              >
                62
              </div>
              <div className="text-xs text-yellow-400 font-mono mt-1">Good</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
