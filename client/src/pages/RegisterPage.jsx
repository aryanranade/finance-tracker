import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { staggerContainer, fadeUp } from '../lib/motion'
import { TrendingUp, Eye, EyeOff, Loader, Check } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const pwStrength = () => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    return s
  }

  const strength = pwStrength()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e', '#10b981'][strength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'AI-powered spending insights',
    'Smart budget tracking',
    'Financial health score',
    'CSV export & more',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="aurora-bg" />
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left info panel */}
        <motion.div
          className="hidden lg:block"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">FinanceAI</span>
          </div>

          <motion.h2 variants={fadeUp} className="text-4xl font-black text-white mb-3 leading-tight">
            Your AI-powered<br />
            <span className="gradient-text">money manager</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 mb-8">
            Join thousands of users who have transformed their financial lives with intelligent tracking.
          </motion.p>

          <ul className="space-y-3">
            {features.map((f) => (
              <motion.li key={f} variants={fadeUp} className="flex items-center gap-3 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-primary-600/30 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-primary-400" />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right register form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">FinanceAI</span>
          </div>

          <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-6">Start tracking your finances for free</p>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Email address</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="form-input pr-11"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= strength ? strengthColor : '#26262c' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? <Loader size={18} className="animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
