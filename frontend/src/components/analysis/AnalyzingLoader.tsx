export default function AnalyzingLoader() {
  const steps = [
    'Parsing AST...',
    'Checking naming conventions...',
    'Scanning for unused variables...',
    'Measuring function complexity...',
    'Detecting deep nesting...',
    'Calculating score...',
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      {/* Animated ring */}
      <div className="relative w-20 h-20">
        <svg className="animate-spin" viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#2a2d3a" strokeWidth="4" />
          <circle
            cx="40" cy="40" r="34"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="60 154"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-accent-cyan text-xs font-mono">AST</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-white">Analyzing your code</p>
        <p className="text-xs text-slate-500 font-mono">Running static analysis engine...</p>
      </div>

      {/* Scrolling steps */}
      <div className="space-y-1.5 w-full max-w-xs">
        {steps.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-2 text-xs font-mono text-slate-500 animate-fade-up"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <span className="text-accent-cyan">›</span>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
