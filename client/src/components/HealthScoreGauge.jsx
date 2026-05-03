import { getHealthScoreColor, getHealthScoreLabel } from '../utils/helpers'

export default function HealthScoreGauge({ score = 0, loading }) {
  const color = getHealthScoreColor(score)
  const label = getHealthScoreLabel(score)

  // SVG ring math
  const size = 160
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const offset = circumference - (clampedScore / 100) * circumference

  if (loading) {
    return (
      <div className="glass-card p-6 flex flex-col items-center">
        <div className="skeleton w-40 h-40 rounded-full" />
        <div className="skeleton h-4 w-24 rounded mt-4" />
      </div>
    )
  }

  return (
    <div className="glass-card p-6 flex flex-col items-center text-center">
      <h3 className="text-base font-semibold text-white mb-4">Financial Health Score</h3>

      {/* SVG gauge */}
      <div className="relative">
        <svg width={size} height={size} className="score-ring">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2d2d5e"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${color}60)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white leading-none">{clampedScore}</span>
          <span className="text-xs text-slate-500 mt-1">out of 100</span>
        </div>
      </div>

      {/* Label */}
      <div
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-bold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {label}
      </div>

      {/* Score breakdown guide */}
      <div className="mt-5 w-full space-y-1.5 text-left">
        {[
          { range: '80–100', label: 'Excellent', color: '#10b981' },
          { range: '65–79',  label: 'Good',      color: '#22c55e' },
          { range: '45–64',  label: 'Fair',       color: '#f59e0b' },
          { range: '0–44',   label: 'Needs Work', color: '#ef4444' },
        ].map(({ range, label: l, color: c }) => (
          <div key={range} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
              <span className="text-slate-400">{l}</span>
            </div>
            <span className="text-slate-600">{range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
