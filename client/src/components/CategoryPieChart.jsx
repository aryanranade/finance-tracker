import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
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

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 20
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#94a3b8" textAnchor="middle" dominantBaseline="central" fontSize={11}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
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

  return (
    <div className="glass-card p-6">
      <h3 className="text-base font-semibold text-white mb-1">Spending by Category</h3>
      <p className="text-xs text-slate-500 mb-4">Current month breakdown</p>
      {!hasData ? (
        <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
          No expense data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
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
            <Legend
              formatter={(val) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{val}</span>}
              iconSize={10}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
