import { useState, useEffect } from 'react'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import BudgetCard from '../components/BudgetCard'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'
import { CATEGORIES, formatMonth, getCurrentMonth } from '../utils/helpers'

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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save budget.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return
    await api.delete(`/api/budgets/${id}`)
    setBudgets(prev => prev.filter(b => b._id !== id))
  }

  const existingCategories = budgets.map(b => b.category)
  const availableCategories = CATEGORIES.filter(c => !existingCategories.includes(c))

  const totalBudget = budgets.reduce((s, b) => s + b.monthlyLimit, 0)
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0)
  const overBudgetCount = budgets.filter(b => (b.spent || 0) > b.monthlyLimit).length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Budgets</h1>
          <p className="text-slate-400 text-sm mt-0.5">Set and track your monthly spending limits</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary self-start">
          <Plus size={18} />
          Add Budget
        </button>
      </div>

      {/* Month navigator */}
      <div className="glass-card p-4 flex items-center justify-between">
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
      </div>

      {/* Summary row */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Budget</p>
            <p className="text-xl font-bold text-white">${totalBudget.toLocaleString()}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Spent</p>
            <p className={`text-xl font-bold ${totalSpent > totalBudget ? 'text-red-400' : 'text-emerald-400'}`}>
              ${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Over Budget</p>
            <p className={`text-xl font-bold ${overBudgetCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {overBudgetCount} categor{overBudgetCount !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </div>
      )}

      {/* Add budget form */}
      {showForm && (
        <div className="glass-card p-6 border-primary-500/30 animate-slide-up">
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
              <select
                className="form-input"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                <option value="">Select category...</option>
                {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
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
        </div>
      )}

      {/* Budget cards grid */}
      {loading ? (
        <LoadingSpinner text="Loading budgets..." />
      ) : budgets.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-4xl mb-4">🎯</p>
          <p className="text-white font-semibold mb-2">No budgets set for {formatMonth(month)}</p>
          <p className="text-slate-500 text-sm mb-6">Create budgets to track your spending by category</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            <Plus size={16} /> Add your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map(budget => (
            <BudgetCard key={budget._id} budget={budget} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
