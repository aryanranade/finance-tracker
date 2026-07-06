import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw, ChevronUp, ChevronDown, Inbox } from 'lucide-react'
import EmptyState from './ui/EmptyState'
import { formatCurrency, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/helpers'

const rowVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: Math.min(i * 0.04, 0.4), ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
}

export default function TransactionTable({ transactions, onEdit, onDelete, loading, emptyAction }) {
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
      <div className="glass-card">
        <EmptyState
          icon={Inbox}
          title="No transactions yet"
          description="Add your first transaction to start tracking your finances — or seed some demo data to explore."
          action={emptyAction}
        />
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
            <AnimatePresence initial={true}>
              {sorted.map((tx, i) => (
                <motion.tr
                  key={tx._id}
                  custom={i}
                  variants={rowVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout="position"
                >
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
                  <td className={`font-bold text-sm whitespace-nowrap tabular-nums ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
                        title="Edit"
                        aria-label={`Edit ${tx.description}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(tx._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                        aria-label={`Delete ${tx.description}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
