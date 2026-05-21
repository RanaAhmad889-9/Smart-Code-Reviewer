'use client';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number): { stroke: string; text: string; label: string } {
  if (score >= 80) return { stroke: '#00ff88', text: 'text-green-400', label: 'Excellent' };
  if (score >= 60) return { stroke: '#ffd700', text: 'text-yellow-400', label: 'Good' };
  if (score >= 40) return { stroke: '#ff9500', text: 'text-orange-400', label: 'Fair' };
  return { stroke: '#ff4d6d', text: 'text-red-400', label: 'Poor' };
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const { stroke, text, label } = getScoreColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const dimensions = { sm: 80, md: 110, lg: 140 };
  const dim = dimensions[size];
  const fontSize = size === 'lg' ? '22' : size === 'md' ? '18' : '14';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#2a2d3a"
            strokeWidth="6"
          />
          {/* Score arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className="score-ring transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${stroke}66)` }}
          />
          <text
            x="50"
            y="50"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="white"
            fontSize={fontSize}
            fontWeight="700"
            fontFamily="JetBrains Mono, monospace"
          >
            {score}
          </text>
        </svg>
      </div>
      <span className={`text-xs font-semibold font-mono ${text}`}>{label}</span>
    </div>
  );
}
