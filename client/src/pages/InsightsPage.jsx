import { useState } from 'react'
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, Lightbulb, Star, DollarSign } from 'lucide-react'
import InsightCard from '../components/InsightCard'
import HealthScoreGauge from '../components/HealthScoreGauge'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'
import { formatCurrency } from '../utils/helpers'

export default function InsightsPage() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchInsights = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/ai/insights')
      setInsights(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate insights.')
    } finally {
      setLoading(false)
    }
  }

  const { insights: insightList = [], warnings = [], predictions = {}, recommendations = [], health_score, ai_powered } = insights || {}

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-primary-400" />
            <h1 className="text-2xl font-black text-white">AI Insights</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Get AI-powered analysis of your finances using Groq LLaMA 3.1
          </p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="btn-primary self-start"
        >
          {loading
            ? <RefreshCw size={16} className="animate-spin" />
            : <Sparkles size={16} />
          }
          {loading ? 'Analyzing...' : insights ? 'Refresh Insights' : 'Generate Insights'}
        </button>
      </div>

      {/* AI status badge */}
      {insights && (
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg w-fit ${ai_powered
          ? 'bg-primary-500/10 border border-primary-500/20 text-primary-300'
          : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'}`}
        >
          <Sparkles size={12} />
          {ai_powered
            ? 'Powered by Groq — LLaMA 3.1 70B'
            : 'Static mode — Add GROQ_API_KEY for AI insights'}
          {lastUpdated && (
            <span className="text-slate-500 ml-2">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!insights && !loading && (
        <div className="glass-card p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={36} className="text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Your AI Financial Advisor</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            Click <strong className="text-white">Generate Insights</strong> to analyze your transactions,
            identify spending patterns, and get personalized recommendations powered by Groq AI.
          </p>
          <button onClick={fetchInsights} className="btn-primary mx-auto">
            <Sparkles size={18} />
            Generate My Insights
          </button>
        </div>
      )}

      {loading && (
        <div className="glass-card p-16">
          <LoadingSpinner size="lg" text="Analyzing your financial data with AI..." />
          <p className="text-center text-xs text-slate-600 mt-2">This may take a few seconds</p>
        </div>
      )}

      {/* Insights dashboard */}
      {insights && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Insights */}
            {insightList.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-blue-400" />
                  <h3 className="font-bold text-white">Spending Insights</h3>
                </div>
                <div className="space-y-3">
                  {insightList.map((text, i) => (
                    <InsightCard key={i} type="insight" text={text} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-amber-400" />
                  <h3 className="font-bold text-white">Warnings</h3>
                </div>
                <div className="space-y-3">
                  {warnings.map((text, i) => (
                    <InsightCard key={i} type="warning" text={text} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={18} className="text-primary-400" />
                  <h3 className="font-bold text-white">Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {recommendations.map((text, i) => (
                    <InsightCard key={i} type="recommendation" text={text} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Predictions */}
            {predictions && Object.keys(predictions).length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-emerald-400" />
                  <h3 className="font-bold text-white">End-of-Month Predictions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {predictions.endOfMonthBalance !== undefined && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                      <DollarSign size={20} className="text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Projected Balance</p>
                      <p className={`text-xl font-bold ${predictions.endOfMonthBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(predictions.endOfMonthBalance)}
                      </p>
                    </div>
                  )}
                  {predictions.projectedSavings !== undefined && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                      <TrendingUp size={20} className="text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 mb-1">Projected Savings</p>
                      <p className="text-xl font-bold text-blue-400">
                        {formatCurrency(predictions.projectedSavings)}
                      </p>
                    </div>
                  )}
                </div>
                {predictions.summary && (
                  <InsightCard type="prediction" text={predictions.summary} />
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Health Score */}
          <div className="space-y-6">
            <HealthScoreGauge score={health_score} />

            {/* Score tips */}
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-white mb-3">Score Breakdown</h4>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">●</span>
                  <p><strong className="text-white">Savings Ratio</strong> (40 pts) — How much of your income you save</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">●</span>
                  <p><strong className="text-white">Budget Adherence</strong> (30 pts) — Staying within budget limits</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">●</span>
                  <p><strong className="text-white">Consistency</strong> (30 pts) — Stable spending month-to-month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
