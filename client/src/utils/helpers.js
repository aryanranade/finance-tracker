export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Bills & Utilities',
  'Housing & Rent',
  'Salary',
  'Investment',
  'Freelance',
  'Other',
]

export const CATEGORY_COLORS = {
  'Food & Dining':    '#f59e0b',
  'Transport':        '#3b82f6',
  'Shopping':         '#ec4899',
  'Health':           '#10b981',
  'Entertainment':    '#a855f7',
  'Bills & Utilities':'#ef4444',
  'Housing & Rent':   '#f97316',
  'Salary':           '#22c55e',
  'Investment':       '#06b6d4',
  'Freelance':        '#84cc16',
  'Other':            '#64748b',
}

export const CATEGORY_ICONS = {
  'Food & Dining':    '🍔',
  'Transport':        '🚗',
  'Shopping':         '🛍️',
  'Health':           '💊',
  'Entertainment':    '🎮',
  'Bills & Utilities':'⚡',
  'Housing & Rent':   '🏠',
  'Salary':           '💼',
  'Investment':       '📈',
  'Freelance':        '💻',
  'Other':            '📦',
}

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const formatMonth = (isoMonth) => {
  const [year, month] = isoMonth.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7)

export const getLast6Months = () => {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    months.push(d.toISOString().slice(0, 7))
  }
  return months
}

export const getHealthScoreColor = (score) => {
  if (score >= 75) return '#10b981'  // green
  if (score >= 50) return '#f59e0b'  // amber
  return '#ef4444'                   // red
}

export const getHealthScoreLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 45) return 'Fair'
  return 'Needs Work'
}

export const clampPercent = (val, total) =>
  total === 0 ? 0 : Math.min(100, Math.round((val / total) * 100))
