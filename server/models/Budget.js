const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: { type: String, required: true },
    monthlyLimit: { type: Number, required: true, min: 1 },
    // Format: "YYYY-MM"
    month: { type: String, required: true },
  },
  { timestamps: true }
);

// Unique budget per user+category+month
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
