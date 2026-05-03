const { validationResult } = require('express-validator');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// GET /api/budgets?month=YYYY-MM
const getBudgets = async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    const budgets = await Budget.find({ userId: req.userId, month });

    // Get actual spending per category for this month
    const startOfMonth = new Date(`${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const expenses = await Transaction.find({
      userId: req.userId,
      type: 'expense',
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const spendingMap = {};
    expenses.forEach((t) => {
      spendingMap[t.category] = (spendingMap[t.category] || 0) + t.amount;
    });

    const budgetsWithActual = budgets.map((b) => ({
      ...b.toObject(),
      spent: spendingMap[b.category] || 0,
    }));

    res.json({ budgets: budgetsWithActual, month });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/budgets  (create or update)
const upsertBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { category, monthlyLimit, month } = req.body;
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, category, month: targetMonth },
      { monthlyLimit },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!budget) return res.status(404).json({ error: 'Budget not found.' });
    res.json({ message: 'Budget deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
