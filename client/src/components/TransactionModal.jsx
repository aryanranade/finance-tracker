import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { springModal, overlayFade } from '../lib/motion'
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
  const [fieldErrors, setFieldErrors] = useState({})
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
    setFieldErrors({})
    setTimeout(() => firstInput.current?.focus(), 150)
  }, [isOpen, editTx])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const setField = (key, value) => {
    setForm(f => ({ ...f, [key]: value }))
    if (fieldErrors[key]) setFieldErrors(e => ({ ...e, [key]: undefined }))
  }

  const autoCategorize = async () => {
    if (!form.description.trim()) return
    setCategorizing(true)
    try {
      const { data } = await api.get('/api/ai/categorize', {
        params: { description: form.description }
      })
      setField('category', data.category)
      toast.success(`Categorized as ${data.category}`, { icon: '✨' })
    } catch {
      toast.error('AI categorization unavailable right now')
    } finally {
      setCategorizing(false)
    }
  }

  const validate = () => {
    const errors = {}
    if (!form.description.trim()) errors.description = 'Description is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errors.amount = 'Enter a valid amount'
    if (!form.category) errors.category = 'Select a category'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
      })
      toast.success(editTx ? 'Transaction updated' : 'Transaction added')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save transaction')
    } finally {
      setSaving(false)
    }
  }

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="form-error" role="alert">
        <AlertCircle size={12} /> {fieldErrors[name]}
      </p>
    ) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayFade}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={editTx ? 'Edit transaction' : 'Add transaction'}
        >
          <motion.div
            variants={springModal}
            initial="initial"
            animate="animate"
            exit="exit"
            className="glass-card w-full max-w-md shadow-card-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-white">
                {editTx ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={onClose}
                className="btn-icon"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
              {/* Description + AI categorize */}
              <div>
                <label className="form-label" htmlFor="tx-description">Description</label>
                <div className="flex gap-2">
                  <input
                    id="tx-description"
                    ref={firstInput}
                    className={`form-input flex-1 ${fieldErrors.description ? 'form-input-error' : ''}`}
                    placeholder="e.g. Grocery store, Netflix..."
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                  />
                  <motion.button
                    type="button"
                    onClick={autoCategorize}
                    disabled={categorizing || !form.description.trim()}
                    className="btn-secondary px-3 flex-shrink-0"
                    title="Auto-categorize with AI"
                    whileTap={{ scale: 0.92 }}
                  >
                    {categorizing
                      ? <Loader size={16} className="animate-spin" />
                      : <Sparkles size={16} className="text-primary-400" />
                    }
                  </motion.button>
                </div>
                <FieldError name="description" />
                <p className="text-xs text-slate-500 mt-1">✨ Click the sparkle to AI auto-categorize</p>
              </div>

              {/* Amount + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label" htmlFor="tx-amount">Amount ($)</label>
                  <input
                    id="tx-amount"
                    type="number"
                    className={`form-input ${fieldErrors.amount ? 'form-input-error' : ''}`}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={e => setField('amount', e.target.value)}
                  />
                  <FieldError name="amount" />
                </div>
                <div>
                  <label className="form-label" htmlFor="tx-type">Type</label>
                  <select
                    id="tx-type"
                    className="form-input"
                    value={form.type}
                    onChange={e => setField('type', e.target.value)}
                  >
                    <option value="expense">💸 Expense</option>
                    <option value="income">💰 Income</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="form-label" htmlFor="tx-category">Category</label>
                <select
                  id="tx-category"
                  className={`form-input ${fieldErrors.category ? 'form-input-error' : ''}`}
                  value={form.category}
                  onChange={e => setField('category', e.target.value)}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <FieldError name="category" />
              </div>

              {/* Date */}
              <div>
                <label className="form-label" htmlFor="tx-date">Date</label>
                <input
                  id="tx-date"
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={e => setField('date', e.target.value)}
                />
              </div>

              {/* Recurring */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.isRecurring}
                    onChange={e => setField('isRecurring', e.target.checked)}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
