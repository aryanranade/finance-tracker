import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader, AlertCircle, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { springModal, overlayFade } from '../lib/motion'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/helpers'
import Select from './ui/Select'
import api from '../services/api'

const EMPTY_FORM = {
  description: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().split('T')[0],
  isRecurring: false,
}

const fieldStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
}

const fieldItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

const CATEGORY_OPTIONS = CATEGORIES.map(c => ({
  value: c,
  label: c,
  icon: CATEGORY_ICONS[c],
  color: CATEGORY_COLORS[c],
}))

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
    setTimeout(() => firstInput.current?.focus(), 180)
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

  const isExpense = form.type === 'expense'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayFade}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
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
            className="glass-card w-full max-w-md shadow-card-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — gradient icon + title */}
            <div className="relative flex items-center gap-3.5 p-6 border-b border-white/[0.06]">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,110,255,0.5), transparent)' }}
              />
              <motion.div
                initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.05 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow flex-shrink-0"
              >
                <Receipt size={20} className="text-white" />
              </motion.div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white leading-tight">
                  {editTx ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editTx ? 'Update the details below' : 'Record a new income or expense'}
                </p>
              </div>
              <button onClick={onClose} className="btn-icon" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
              noValidate
              variants={fieldStagger}
              initial="initial"
              animate="animate"
            >
              {/* Type — segmented control with sliding indicator */}
              <motion.div variants={fieldItem}>
                <label className="form-label">Type</label>
                <div className="relative grid grid-cols-2 gap-1 p-1 rounded-xl bg-surface-700/80 border border-white/[0.06]">
                  {['expense', 'income'].map((t) => {
                    const active = form.type === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setField('type', t)}
                        className={`relative z-10 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors duration-200
                          ${active ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="tx-type-pill"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            className="absolute inset-0 rounded-lg -z-10"
                            style={{
                              background: t === 'expense'
                                ? 'linear-gradient(180deg, rgba(239,68,68,0.25), rgba(239,68,68,0.12))'
                                : 'linear-gradient(180deg, rgba(16,185,129,0.25), rgba(16,185,129,0.12))',
                              border: t === 'expense'
                                ? '1px solid rgba(239,68,68,0.35)'
                                : '1px solid rgba(16,185,129,0.35)',
                            }}
                          />
                        )}
                        {t === 'expense'
                          ? <TrendingDown size={15} className={active ? 'text-red-400' : ''} />
                          : <TrendingUp size={15} className={active ? 'text-emerald-400' : ''} />}
                        {t === 'expense' ? 'Expense' : 'Income'}
                      </button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Description + AI categorize */}
              <motion.div variants={fieldItem}>
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
              </motion.div>

              {/* Amount + Date */}
              <motion.div variants={fieldItem} className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label" htmlFor="tx-amount">Amount</label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none
                      ${isExpense ? 'text-red-400' : 'text-emerald-400'}`}>
                      $
                    </span>
                    <input
                      id="tx-amount"
                      type="number"
                      inputMode="decimal"
                      className={`form-input pl-8 ${fieldErrors.amount ? 'form-input-error' : ''}`}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={e => setField('amount', e.target.value)}
                    />
                  </div>
                  <FieldError name="amount" />
                </div>
                <div>
                  <label className="form-label" htmlFor="tx-date">Date</label>
                  <input
                    id="tx-date"
                    type="date"
                    className="form-input [color-scheme:dark]"
                    value={form.date}
                    onChange={e => setField('date', e.target.value)}
                  />
                </div>
              </motion.div>

              {/* Category — custom animated dropdown */}
              <motion.div variants={fieldItem}>
                <label className="form-label" htmlFor="tx-category">Category</label>
                <Select
                  id="tx-category"
                  value={form.category}
                  onChange={(v) => setField('category', v)}
                  options={CATEGORY_OPTIONS}
                  placeholder="Select category..."
                  error={!!fieldErrors.category}
                />
                <FieldError name="category" />
              </motion.div>

              {/* Recurring */}
              <motion.label variants={fieldItem} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.isRecurring}
                    onChange={e => setField('isRecurring', e.target.checked)}
                  />
                  <div className="w-11 h-6 rounded-full bg-surface-600 peer-checked:bg-primary-600 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  Recurring transaction
                </span>
              </motion.label>

              {/* Actions */}
              <motion.div variants={fieldItem} className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <Loader size={16} className="animate-spin" /> : null}
                  {editTx ? 'Save Changes' : 'Add Transaction'}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
