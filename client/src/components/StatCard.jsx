import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function StatCard({ title, amount, icon: Icon, trend, trendLabel, color = 'primary', loading }) {
  const colorMap = {
    primary: 'from-primary-600/20 to-primary-500/5 border-primary-500/20 text-primary-400',
    green:   'from-emerald-600/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    red:     'from-red-600/20 to-red-500/5 border-red-500/20 text-red-400',
    blue:    'from-blue-600/20 to-blue-500/5 border-blue-500/20 text-blue-400',
  }

  const iconBg = {
    primary: 'bg-primary-500/20 text-primary-400',
    green:   'bg-emerald-500/20 text-emerald-400',
    red:     'bg-red-500/20 text-red-400',
    blue:    'bg-blue-500/20 text-blue-400',
  }

  if (loading) {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-36 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden glass-card-hover p-6 bg-gradient-to-br ${colorMap[color]}`}>
      {/* Background glow blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl bg-current" />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${iconBg[color]}`}>
          <Icon size={22} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${trend >= 0
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'}`
          }>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{formatCurrency(amount || 0)}</p>
      {trendLabel && (
        <p className="text-xs text-slate-500 mt-1">{trendLabel}</p>
      )}
    </div>
  )
}
