export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-tertiary border border-border-subtle flex items-center justify-center">
        <span className="text-2xl">🔍</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-1">Ready to analyze</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Paste your JavaScript or TypeScript code in the editor, then click{' '}
          <span className="text-accent-cyan font-mono">Run Analysis</span> to get started.
        </p>
      </div>
      <div className="mt-2 space-y-1.5 text-left w-full max-w-xs">
        {[
          'Unused variable detection',
          'Function complexity checks',
          'Deep nesting analysis',
          'Console log scanner',
          'Naming convention linter',
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-accent-green">✓</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
}
