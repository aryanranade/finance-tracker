import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, Eye, EyeOff, Loader } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => setForm({ email: 'demo@financetracker.app', password: 'demo1234' })

  return (
    <div className="min-h-screen bg-surface-900 flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-surface-800 via-primary-900/30 to-surface-900 p-12 border-r border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">FinanceAI</span>
        </div>

        <div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Take control of your<br />
            <span className="gradient-text">financial future</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            AI-powered insights, smart budgeting, and real-time spending analysis — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🤖', title: 'AI Insights', desc: 'Groq-powered analysis' },
              { icon: '📊', title: 'Smart Charts', desc: 'Visual spending overview' },
              { icon: '🎯', title: 'Budget Goals', desc: 'Track vs targets' },
              { icon: '💯', title: 'Health Score', desc: 'Financial wellness score' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="glass-card p-4">
                <span className="text-2xl">{icon}</span>
                <p className="text-white font-semibold text-sm mt-2">{title}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm">© 2024 FinanceAI. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">FinanceAI</span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email address</label>
              <input
                id="login-email"
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
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="form-input pr-11"
                  placeholder="Your password"
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
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <Loader size={18} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo account */}
          <div className="mt-4 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <p className="text-xs text-primary-300 mb-2 font-semibold">🎯 Try with demo account</p>
            <button onClick={fillDemo} className="text-sm text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors">
              Fill demo credentials
            </button>
            <p className="text-xs text-slate-600 mt-1">demo@financetracker.app / demo1234</p>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
