const mongoose = require('mongoose');

const CATEGORIES = [
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
];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, index: true },
    isRecurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Transaction', transactionSchema);
