import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Wallet, TrendingUp, TrendingDown, Activity,
  ArrowRight, Plus
} from 'lucide-react'
import StatCard from '../components/StatCard'
import MonthlyBarChart from '../components/MonthlyBarChart'
import CategoryPieChart from '../components/CategoryPieChart'
import TransactionTable from '../components/TransactionTable'
import TransactionModal from '../components/TransactionModal'
import { staggerContainer, fadeUp } from '../lib/motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { getLast6Months, getCurrentMonth } from '../utils/helpers'

export default function DashboardPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTx, setEditTx] = useState(null)

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/api/transactions', { params: { limit: 200 } })
      setTransactions(data.transactions)
    } catch (err) {
      console.error(err)
      toast.error('Could not load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  // Derived stats for current month
  const currentMonth = getCurrentMonth()
  const monthTx = transactions.filter(
    t => new Date(t.date).toISOString().slice(0, 7) === currentMonth
  )
  const totalIncome = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Monthly chart data (last 6 months)
  const months = getLast6Months()
  const chartData = months.map(m => {
    const mTx = transactions.filter(t => new Date(t.date).toISOString().slice(0, 7) === m)
    return {
      month: new Date(`${m}-01`).toLocaleDateString('en-US', { month: 'short' }),
      income: mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expenses: mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    }
  })

  // Category pie data for current month
  const categoryMap = {}
  monthTx.filter(t => t.type === 'expense').forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
  })
  const pieData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

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
    try {
      await api.delete(`/api/transactions/${id}`)
      setTransactions(prev => prev.filter(t => t._id !== id))
      toast.success('Transaction deleted')
    } catch {
      toast.error('Failed to delete transaction')
    }
  }

  const openAdd = () => { setEditTx(null); setModalOpen(true) }
  const openEdit = (tx) => { setEditTx(tx); setModalOpen(true) }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

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
          <h1 className="text-2xl font-black text-white">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start sm:self-auto">
          <Plus size={18} />
          Add Transaction
        </button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          title="Net Balance"
          amount={balance}
          icon={Wallet}
          color="primary"
          trendLabel="This month"
          loading={loading}
        />
        <StatCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          color="green"
          trendLabel="This month"
          loading={loading}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          color="red"
          trendLabel="This month"
          loading={loading}
        />
        <StatCard
          title="Savings Rate"
          amount={totalIncome > 0 ? totalIncome * Math.max(0, (balance / totalIncome)) : 0}
          icon={Activity}
          color="blue"
          trendLabel={totalIncome > 0 ? `${Math.max(0, Math.round((balance / totalIncome) * 100))}% of income` : 'No income yet'}
          loading={loading}
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlyBarChart data={chartData} loading={loading} />
        </div>
        <CategoryPieChart data={pieData} loading={loading} />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Recent Transactions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Last {Math.min(transactions.length, 8)} transactions</p>
          </div>
          <Link to="/transactions" className="group flex items-center gap-1 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors">
            View all <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <TransactionTable
          transactions={transactions.slice(0, 8)}
          onEdit={openEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyAction={
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Add your first transaction
            </button>
          }
        />
      </motion.div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTx(null) }}
        onSave={handleSave}
        editTx={editTx}
      />
    </motion.div>
  )
}
