import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

/** Catches render errors so the app never white-screens. */
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="aurora-bg" />
        <div className="glass-card p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
            <AlertTriangle size={26} className="text-red-400" />
          </div>
          <h1 className="text-lg font-bold text-white">Something went wrong</h1>
          <p className="text-sm text-slate-400 mt-2">
            An unexpected error occurred. Your data is safe — try reloading the app.
          </p>
          <button onClick={this.handleReset} className="btn-primary mt-6">
            <RotateCcw size={16} />
            Reload App
          </button>
        </div>
      </div>
    )
  }
}
