import { Lightbulb, AlertTriangle, TrendingUp, Star } from 'lucide-react'

const typeConfig = {
  insight: {
    icon: Lightbulb,
    bg: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
    label: 'Insight',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
    label: 'Warning',
  },
  recommendation: {
    icon: Star,
    bg: 'bg-primary-500/10 border-primary-500/20',
    iconColor: 'text-primary-400',
    label: 'Recommendation',
  },
  prediction: {
    icon: TrendingUp,
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    label: 'Prediction',
  },
}

export default function InsightCard({ type = 'insight', text, index = 0 }) {
  const config = typeConfig[type] || typeConfig.insight
  const Icon = config.icon

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${config.bg}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`p-2 rounded-lg bg-surface-800 flex-shrink-0 ${config.iconColor}`}>
        <Icon size={16} />
      </div>
      <div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${config.iconColor} block mb-1`}>
          {config.label}
        </span>
        <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
