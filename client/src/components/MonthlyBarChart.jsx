import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { formatCurrency } from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card p-3 shadow-card text-sm">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-400 capitalize">{p.name}:</span>
          <span className="font-semibold text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBarChart({ data, loading }) {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-48 rounded mb-6" />
        <div className="skeleton h-56 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-base font-semibold text-white mb-1">Monthly Overview</h3>
      <p className="text-xs text-slate-500 mb-6">Income vs expenses over the last 6 months</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={18} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d5e" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.05)' }} />
          <Legend
            formatter={(val) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{val}</span>}
          />
          <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
