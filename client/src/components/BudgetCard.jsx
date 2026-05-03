import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS, clampPercent } from '../utils/helpers'

export default function BudgetCard({ budget, onDelete }) {
  const { category, monthlyLimit, spent, _id } = budget
  const pct = clampPercent(spent, monthlyLimit)
  const remaining = monthlyLimit - spent
  const isOver = spent > monthlyLimit
  const isWarning = pct >= 80 && !isOver

  const color = CATEGORY_COLORS[category] || '#64748b'

  let barColor = '#10b981'        // green
  if (isWarning) barColor = '#f59e0b'  // amber
  if (isOver) barColor = '#ef4444'      // red

  return (
    <div className="glass-card-hover p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 flex items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {CATEGORY_ICONS[category] || '📦'}
          </span>
          <div>
            <p className="font-semibold text-white text-sm">{category}</p>
            <p className="text-xs text-slate-500">Budget: {formatCurrency(monthlyLimit)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOver ? (
            <AlertTriangle size={16} className="text-red-400" />
          ) : isWarning ? (
            <AlertTriangle size={16} className="text-amber-400" />
          ) : (
            <CheckCircle size={16} className="text-emerald-400" />
          )}
          <button
            onClick={() => onDelete(_id)}
            className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Spent: <span className="font-semibold" style={{ color: barColor }}>{formatCurrency(spent)}</span>
        </span>
        <span className={`font-semibold ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
          {isOver
            ? `$${formatCurrency(Math.abs(remaining))} over`
            : `${formatCurrency(remaining)} left`}
        </span>
        <span className="text-slate-500">{pct}%</span>
      </div>

      {/* Warning message */}
      {isOver && (
        <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
          ⚠️ Over budget by {formatCurrency(Math.abs(remaining))}
        </p>
      )}
      {isWarning && (
        <p className="mt-3 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
          ⚡ Approaching limit — only {formatCurrency(remaining)} left
        </p>
      )}
    </div>
  )
}
