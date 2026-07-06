import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Plus, X, ChevronLeft, ChevronRight, Target } from 'lucide-react'
import BudgetCard from '../components/BudgetCard'
import LoadingSpinner from '../components/LoadingSpinner'
import CountUp from '../components/ui/CountUp'
import EmptyState from '../components/ui/EmptyState'
import Select from '../components/ui/Select'
import { staggerContainer, fadeUp } from '../lib/motion'
import api from '../services/api'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS, formatMonth, getCurrentMonth, formatCurrency } from '../utils/helpers'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(getCurrentMonth())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: '', monthlyLimit: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchBudgets = async (m) => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/budgets', { params: { month: m } })
      setBudgets(data.budgets)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBudgets(month) }, [month])

  const navigateMonth = (dir) => {
    const [y, m] = month.split('-').map(Number)
    const d = new Date(y, m - 1 + dir, 1)
    setMonth(d.toISOString().slice(0, 7))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.category) return setError('Please select a category.')
    if (!form.monthlyLimit || Number(form.monthlyLimit) <= 0) return setError('Enter a valid budget amount.')

    setSaving(true)
    setError('')
    try {
      const { data } = await api.post('/api/budgets', {
        category: form.category,
        monthlyLimit: Number(form.monthlyLimit),
        month,
      })
      setBudgets(prev => {
        const exists = prev.find(b => b._id === data.budget._id)
        if (exists) return prev.map(b => b._id === data.budget._id ? { ...data.budget, spent: b.spent } : b)
        return [...prev, { ...data.budget, spent: 0 }]
      })
      setForm({ category: '', monthlyLimit: '' })
      setShowForm(false)
      toast.success(`Budget set for ${form.category}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save budget.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return
    try {
      await api.delete(`/api/budgets/${id}`)
      setBudgets(prev => prev.filter(b => b._id !== id))
      toast.success('Budget removed')
    } catch {
      toast.error('Failed to delete budget')
    }
  }

  const existingCategories = budgets.map(b => b.category)
  const availableCategories = CATEGORIES.filter(c => !existingCategories.includes(c))

  const totalBudget = budgets.reduce((s, b) => s + b.monthlyLimit, 0)
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0)
  const overBudgetCount = budgets.filter(b => (b.spent || 0) > b.monthlyLimit).length

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Budgets</h1>
          <p className="text-slate-400 text-sm mt-0.5">Set and track your monthly spending limits</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary self-start">
          <Plus size={18} />
          Add Budget
        </button>
      </motion.div>

      {/* Month navigator */}
      <motion.div variants={fadeUp} className="glass-card p-4 flex items-center justify-between">
        <button onClick={() => navigateMonth(-1)} className="btn-secondary px-3">
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-white font-bold">{formatMonth(month)}</h2>
        <button
          onClick={() => navigateMonth(1)}
          disabled={month >= getCurrentMonth()}
          className="btn-secondary px-3 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </motion.div>

      {/* Summary row */}
      {budgets.length > 0 && (
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Budget</p>
            <p className="text-xl font-bold text-white tabular-nums">
              <CountUp value={totalBudget} format={formatCurrency} />
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Spent</p>
            <p className={`text-xl font-bold tabular-nums ${totalSpent > totalBudget ? 'text-red-400' : 'text-emerald-400'}`}>
              <CountUp value={totalSpent} format={formatCurrency} />
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Over Budget</p>
            <p className={`text-xl font-bold ${overBudgetCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {overBudgetCount} categor{overBudgetCount !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Add budget form */}
      <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="glass-card p-6 border-primary-500/30 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">New Budget</h3>
            <button onClick={() => { setShowForm(false); setError('') }} className="text-slate-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="form-label">Category</label>
              <Select
                value={form.category}
                onChange={(v) => setForm(f => ({ ...f, category: v }))}
                placeholder="Select category..."
                options={availableCategories.map(c => ({
                  value: c,
                  label: c,
                  icon: CATEGORY_ICONS[c],
                  color: CATEGORY_COLORS[c],
                }))}
              />
            </div>
            <div className="sm:w-48">
              <label className="form-label">Monthly Limit ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 500"
                min="1"
                step="1"
                value={form.monthlyLimit}
                onChange={e => setForm(f => ({ ...f, monthlyLimit: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                {saving ? 'Saving...' : 'Add Budget'}
              </button>
            </div>
          </form>
          {availableCategories.length === 0 && (
            <p className="text-xs text-slate-500 mt-3">All categories already have budgets for this month.</p>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Budget cards grid */}
      {loading ? (
        <LoadingSpinner text="Loading budgets..." />
      ) : budgets.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            icon={Target}
            title={`No budgets set for ${formatMonth(month)}`}
            description="Create budgets to track your spending by category and stay on target."
            action={
              <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
                <Plus size={16} /> Add your first budget
              </button>
            }
          />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {budgets.map(budget => (
            <BudgetCard key={budget._id} budget={budget} onDelete={handleDelete} />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
