import { useState } from 'react'
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
import { formatCurrency, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/helpers'

export default function TransactionTable({ transactions, onEdit, onDelete, loading }) {
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...(transactions || [])].sort((a, b) => {
    let aVal = a[sortKey], bVal = b[sortKey]
    if (sortKey === 'date') { aVal = new Date(aVal); bVal = new Date(bVal) }
    if (sortKey === 'amount') { aVal = Number(aVal); bVal = Number(bVal) }
    return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
  })

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-primary-400" />
      : <ChevronDown size={12} className="text-primary-400" />
  }

  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50">
            <div className="skeleton h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
            <div className="skeleton h-5 w-20 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!sorted.length) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-slate-500 text-sm">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <button className="flex items-center gap-1" onClick={() => toggleSort('description')}>
                  Description <SortIcon col="description" />
                </button>
              </th>
              <th>Category</th>
              <th>
                <button className="flex items-center gap-1" onClick={() => toggleSort('date')}>
                  Date <SortIcon col="date" />
                </button>
              </th>
              <th>Type</th>
              <th>
                <button className="flex items-center gap-1" onClick={() => toggleSort('amount')}>
                  Amount <SortIcon col="amount" />
                </button>
              </th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((tx) => (
              <tr key={tx._id}>
                {/* Description */}
                <td>
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-lg flex-shrink-0"
                      style={{ backgroundColor: `${CATEGORY_COLORS[tx.category]}20` }}
                    >
                      {CATEGORY_ICONS[tx.category] || '📦'}
                    </span>
                    <div>
                      <p className="font-medium text-white text-sm">{tx.description}</p>
                      {tx.isRecurring && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-400">
                          <RefreshCw size={10} /> Recurring
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[tx.category]}20`,
                      color: CATEGORY_COLORS[tx.category] || '#94a3b8',
                    }}
                  >
                    {tx.category}
                  </span>
                </td>

                {/* Date */}
                <td className="text-slate-400 text-sm whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>

                {/* Type */}
                <td>
                  {tx.type === 'income' ? (
                    <span className="badge-income">
                      <ArrowUpCircle size={12} /> Income
                    </span>
                  ) : (
                    <span className="badge-expense">
                      <ArrowDownCircle size={12} /> Expense
                    </span>
                  )}
                </td>

                {/* Amount */}
                <td className={`font-bold text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>

                {/* Actions */}
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(tx._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
