import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { CATEGORY_COLORS, formatCurrency } from '../utils/helpers'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="glass-card p-3 shadow-card text-sm">
      <p className="font-semibold text-white">{name}</p>
      <p className="text-slate-300">{formatCurrency(value)}</p>
    </div>
  )
}

export default function CategoryPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-40 rounded mb-6" />
        <div className="skeleton h-56 rounded-full mx-auto w-56" />
      </div>
    )
  }

  const hasData = data && data.length > 0
  const total = hasData ? data.reduce((s, d) => s + d.value, 0) : 0

  return (
    <div className="glass-card p-6 flex flex-col">
      <h3 className="text-base font-semibold text-white mb-1">Spending by Category</h3>
      <p className="text-xs text-slate-500 mb-2">Current month breakdown</p>
      {!hasData ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10 text-slate-500 text-sm">
          <PieIcon size={28} className="opacity-40" />
          No expense data yet
        </div>
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Total</span>
              <span className="text-lg font-bold text-white tabular-nums font-display">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Legend with percentages */}
          <div className="mt-4 space-y-1.5 overflow-y-auto max-h-32 pr-1">
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[d.name] || '#64748b' }}
                  />
                  <span className="text-slate-400 truncate">{d.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-slate-500 tabular-nums">{Math.round((d.value / total) * 100)}%</span>
                  <span className="text-slate-300 font-medium tabular-nums">{formatCurrency(d.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
