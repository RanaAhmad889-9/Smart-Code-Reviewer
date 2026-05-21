'use client';

import { useState, useCallback } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  language: string;
  highlightedLines?: number[];
}

// Minimal token-based syntax highlighter for JS/TS
function highlight(code: string): string {
  const keywords = /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|typeof|instanceof|void|null|undefined|true|false|this|super|extends|interface|type|enum|readonly|public|private|protected|static|abstract)\b/g;
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
  const numbers = /\b(\d+\.?\d*)\b/g;
  const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;

  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(comments, '<span style="color:#6b7280">$1</span>')
    .replace(strings, '<span style="color:#a3e635">$&</span>')
    .replace(keywords, '<span style="color:#c084fc">$1</span>')
    .replace(numbers, '<span style="color:#fb923c">$1</span>')
    .replace(functions, '<span style="color:#60a5fa">$1</span>');
}

const PLACEHOLDER = `// Paste your JavaScript or TypeScript code here
// Example:
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].prices.length; j++) {
      total += items[i].prices[j];
    }
  }
  console.log(total);
  return total;
}`;

export default function CodeEditor({ value, onChange, language, highlightedLines = [] }: CodeEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      // Restore cursor position after React re-render
      setTimeout(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      }, 0);
    }
  }, [value, onChange]);

  const lines = (value || PLACEHOLDER).split('\n');

  return (
    <div
      className={`relative h-full flex flex-col rounded-lg overflow-hidden border transition-colors duration-200 ${
        isFocused ? 'border-accent-cyan/40 glow-cyan' : 'border-border-subtle'
      }`}
      style={{ background: '#0d1117' }}
    >
      {/* Editor header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border-subtle bg-bg-secondary/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs font-mono text-slate-500 ml-2">
          main.{language === 'typescript' ? 'ts' : 'js'}
        </span>
        <span className="ml-auto text-xs font-mono text-slate-600">
          {lines.length} lines
        </span>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-auto min-h-0">
        {/* Line numbers */}
        <div
          className="select-none text-right pr-4 pl-3 font-mono text-xs leading-relaxed pt-3"
          style={{ color: '#3a3d4a', minWidth: '3.5rem', lineHeight: '1.6rem' }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                color: highlightedLines.includes(i + 1) ? '#ff4d6d' : '#3a3d4a',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea + highlight overlay */}
        <div className="relative flex-1">
          {/* Syntax highlighted layer */}
          <pre
            aria-hidden
            className="absolute inset-0 font-mono text-xs leading-relaxed pt-3 pr-4 pointer-events-none overflow-hidden whitespace-pre-wrap break-words"
            style={{ color: '#e2e8f0', lineHeight: '1.6rem' }}
            dangerouslySetInnerHTML={{ __html: highlight(value || '') + '\n' }}
          />

          {/* Actual textarea (invisible text, captures input) */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            className="absolute inset-0 w-full h-full font-mono text-xs leading-relaxed pt-3 pr-4 bg-transparent resize-none border-none outline-none"
            style={{
              color: 'transparent',
              caretColor: '#00d4ff',
              lineHeight: '1.6rem',
            }}
          />
        </div>
      </div>
    </div>
  );
}
