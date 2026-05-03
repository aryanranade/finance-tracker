import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Download, X } from 'lucide-react'
import TransactionTable from '../components/TransactionTable'
import TransactionModal from '../components/TransactionModal'
import api from '../services/api'
import { CATEGORIES, getCurrentMonth } from '../utils/helpers'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    category: '',
    type: '',
    minAmount: '',
    maxAmount: '',
  })

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.search)    params.search    = filters.search
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate)   params.endDate   = filters.endDate
      if (filters.category)  params.category  = filters.category
      if (filters.type)      params.type      = filters.type
      if (filters.minAmount) params.minAmount = filters.minAmount
      if (filters.maxAmount) params.maxAmount = filters.maxAmount
      params.limit = 500

      const { data } = await api.get('/api/transactions', { params })
      setTransactions(data.transactions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const timer = setTimeout(fetchTransactions, 300)
    return () => clearTimeout(timer)
  }, [fetchTransactions])

  const handleSave = async (formData) => {
    if (editTx) {
      const { data } = await api.put(`/api/transactions/${editTx._id}`, formData)
      setTransactions(prev => prev.map(t => t._id === editTx._id ? data.transaction : t))
    } else {
      const { data } = await api.post('/api/transactions', formData)
      setTransactions(prev => [data.transaction, ...prev])
    }
    setEditTx(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await api.delete(`/api/transactions/${id}`)
    setTransactions(prev => prev.filter(t => t._id !== id))
  }

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/api/transactions/export/csv', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${getCurrentMonth()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('CSV export failed', err)
    }
  }

  const clearFilters = () => setFilters({
    search: '', startDate: '', endDate: '', category: '', type: '', minAmount: '', maxAmount: ''
  })

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  const openAdd = () => { setEditTx(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditTx(tx); setModalOpen(true) }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Transactions</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            {hasActiveFilters ? ' (filtered)' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="btn-secondary gap-2 text-sm">
            <Download size={15} />
            Export CSV
          </button>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`btn-secondary gap-2 text-sm flex-shrink-0 ${showFilters ? 'border-primary-500/50 text-primary-400' : ''}`}
          >
            <Filter size={15} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-400" />
            )}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-secondary flex-shrink-0 px-3" title="Clear filters">
              <X size={15} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={filters.startDate}
                onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={filters.endDate}
                onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              >
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={filters.type}
                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
              >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="form-label">Min Amount ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                value={filters.minAmount}
                onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Max Amount ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Any"
                min="0"
                value={filters.maxAmount}
                onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <TransactionTable
        transactions={transactions}
        onEdit={openEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTx(null) }}
        onSave={handleSave}
        editTx={editTx}
      />
    </div>
  )
}
