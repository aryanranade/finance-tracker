import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, Loader } from 'lucide-react'
import { CATEGORIES } from '../utils/helpers'
import api from '../services/api'

const EMPTY_FORM = {
  description: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().split('T')[0],
  isRecurring: false,
}

export default function TransactionModal({ isOpen, onClose, onSave, editTx }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [categorizing, setCategorizing] = useState(false)
  const [error, setError] = useState('')
  const firstInput = useRef()

  useEffect(() => {
    if (!isOpen) return
    if (editTx) {
      setForm({
        description: editTx.description || '',
        amount: editTx.amount || '',
        type: editTx.type || 'expense',
        category: editTx.category || '',
        date: editTx.date ? editTx.date.split('T')[0] : new Date().toISOString().split('T')[0],
        isRecurring: editTx.isRecurring || false,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
    setTimeout(() => firstInput.current?.focus(), 100)
  }, [isOpen, editTx])

  const autoCategorize = async () => {
    if (!form.description.trim()) return
    setCategorizing(true)
    try {
      const { data } = await api.get('/api/ai/categorize', {
        params: { description: form.description }
      })
      setForm(f => ({ ...f, category: data.category }))
    } catch {
      // fail silently
    } finally {
      setCategorizing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) return setError('Description is required.')
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return setError('Enter a valid amount.')
    if (!form.category) return setError('Please select a category.')

    setSaving(true)
    setError('')
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
      })
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save transaction.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="modal-content glass-card w-full max-w-md shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-white">
            {editTx ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-surface-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Description + AI categorize */}
          <div>
            <label className="form-label">Description</label>
            <div className="flex gap-2">
              <input
                ref={firstInput}
                className="form-input flex-1"
                placeholder="e.g. Grocery store, Netflix..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
              <button
                type="button"
                onClick={autoCategorize}
                disabled={categorizing || !form.description.trim()}
                className="btn-secondary px-3 flex-shrink-0"
                title="Auto-categorize with AI"
              >
                {categorizing
                  ? <Loader size={16} className="animate-spin" />
                  : <Sparkles size={16} className="text-primary-400" />
                }
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">✨ Click the sparkle to AI auto-categorize</p>
          </div>

          {/* Amount + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>

          {/* Recurring */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.isRecurring}
                onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
              />
              <div className="w-11 h-6 rounded-full bg-surface-600 peer-checked:bg-primary-600 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Recurring transaction
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? <Loader size={16} className="animate-spin" /> : null}
              {editTx ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
