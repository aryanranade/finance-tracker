const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const { categorizeDescription } = require('../services/groqService');

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type, minAmount, maxAmount, search, limit = 200 } = req.query;

    const query = { userId: req.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }
    if (category) query.category = category;
    if (type) query.type = type;
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    if (search) query.description = { $regex: search, $options: 'i' };

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let { amount, type, category, description, date, isRecurring } = req.body;

    // Auto-categorize if not provided
    if (!category || category === 'auto') {
      category = await categorizeDescription(description).catch(() => 'Other');
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      amount,
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
      isRecurring: isRecurring || false,
    });

    res.status(201).json({ transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ error: 'Transaction not found.' });
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found.' });
    res.json({ message: 'Transaction deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/transactions/export/csv
const exportCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });

    const rows = transactions.map((t) => ({
      date: new Date(t.date).toISOString().split('T')[0],
      description: t.description,
      type: t.type,
      category: t.category,
      amount: t.amount,
      isRecurring: t.isRecurring,
    }));

    const headers = ['date', 'description', 'type', 'category', 'amount', 'isRecurring'];
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction, exportCSV };
