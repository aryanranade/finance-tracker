const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { getFinancialInsights, categorizeDescription } = require('../services/groqService');

// Calculate financial health score server-side
function calculateHealthScore(transactions, budgets) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthTx = transactions.filter(
    (t) => new Date(t.date).toISOString().slice(0, 7) === currentMonth
  );

  const income = monthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 1. Savings ratio score (0-40 pts)
  let savingsScore = 0;
  if (income > 0) {
    const ratio = Math.max(0, (income - expenses) / income);
    // 0% savings = 0, 50%+ savings = 40
    savingsScore = Math.min(40, Math.round(ratio * 80));
  }

  // 2. Budget adherence score (0-30 pts)
  let budgetScore = 15; // neutral if no budgets
  if (budgets.length > 0) {
    const spendingMap = {};
    monthTx
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        spendingMap[t.category] = (spendingMap[t.category] || 0) + t.amount;
      });

    const within = budgets.filter((b) => (spendingMap[b.category] || 0) <= b.monthlyLimit).length;
    budgetScore = Math.round((within / budgets.length) * 30);
  }

  // 3. Spending consistency score (0-30 pts) — lower variance is better
  const last3Months = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    last3Months.push(d.toISOString().slice(0, 7));
  }

  const monthlyExpenses = last3Months.map((m) =>
    transactions
      .filter((t) => t.type === 'expense' && new Date(t.date).toISOString().slice(0, 7) === m)
      .reduce((s, t) => s + t.amount, 0)
  );

  let consistencyScore = 15;
  const avg = monthlyExpenses.reduce((a, b) => a + b, 0) / 3;
  if (avg > 0) {
    const variance = monthlyExpenses.reduce((s, e) => s + Math.pow(e - avg, 2), 0) / 3;
    const cv = Math.sqrt(variance) / avg;
    consistencyScore = Math.max(0, Math.round(30 * (1 - Math.min(cv, 1))));
  }

  return Math.min(100, savingsScore + budgetScore + consistencyScore);
}

// POST /api/ai/insights
const getInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(100);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgets = await Budget.find({ userId: req.userId, month: currentMonth });

    const currentMonthTx = transactions.filter(
      (t) => new Date(t.date).toISOString().slice(0, 7) === currentMonth
    );

    const income = currentMonthTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const healthScore = calculateHealthScore(transactions, budgets);

    // Call AI if Groq key configured
    if (!process.env.GROQ_API_KEY) {
      return res.json({
        insights: [
          'Connect your Groq API key to enable AI-powered insights.',
          `This month you earned $${income.toFixed(2)} and spent $${expenses.toFixed(2)}.`,
        ],
        warnings: expenses > income ? ['You are spending more than you earn this month!'] : [],
        predictions: {
          endOfMonthBalance: income - expenses,
          projectedSavings: Math.max(0, income - expenses),
        },
        recommendations: [
          'Set up monthly budgets to track spending by category.',
          'Review your largest expense categories to identify savings opportunities.',
        ],
        health_score: healthScore,
        ai_powered: false,
      });
    }

    const aiResult = await getFinancialInsights({
      transactions: transactions.slice(0, 50),
      income,
      expenses,
      budgets,
      healthScore,
      currentMonth,
    });

    res.json({ ...aiResult, health_score: healthScore, ai_powered: true });
  } catch (err) {
    console.error('AI insights error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/ai/categorize?description=...
const categorize = async (req, res) => {
  try {
    const { description } = req.query;
    if (!description) return res.status(400).json({ error: 'description is required' });

    const category = await categorizeDescription(description);
    res.json({ category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/ai/health-score
const getHealthScore = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 }).limit(90);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budgets = await Budget.find({ userId: req.userId, month: currentMonth });
    const score = calculateHealthScore(transactions, budgets);
    res.json({ health_score: score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInsights, categorize, getHealthScore };
