require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const bcrypt = require('bcryptjs');

const CATEGORIES = Transaction.CATEGORIES;

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clean up previous seed user
  const existing = await User.findOne({ email: 'demo@financetracker.app' });
  if (existing) {
    await Transaction.deleteMany({ userId: existing._id });
    await Budget.deleteMany({ userId: existing._id });
    await User.deleteOne({ _id: existing._id });
  }

  // Create demo user (password will be hashed by pre-save hook)
  const user = await User.create({
    name: 'Alex Johnson',
    email: 'demo@financetracker.app',
    password: 'demo1234',
  });

  console.log('Created demo user: demo@financetracker.app / demo1234');

  const userId = user._id;

  // --- Generate 3 months of transactions ---
  const transactions = [];

  // Month -2 (two months ago)
  transactions.push(
    { userId, amount: 4800, type: 'income', category: 'Salary', description: 'Monthly salary', date: daysAgo(65), isRecurring: true },
    { userId, amount: 1200, type: 'expense', category: 'Housing & Rent', description: 'Rent payment', date: daysAgo(63), isRecurring: true },
    { userId, amount: 340, type: 'expense', category: 'Food & Dining', description: 'Grocery store', date: daysAgo(62) },
    { userId, amount: 55, type: 'expense', category: 'Transport', description: 'Uber rides', date: daysAgo(61) },
    { userId, amount: 89.99, type: 'expense', category: 'Entertainment', description: 'Netflix + Spotify subscription', date: daysAgo(60), isRecurring: true },
    { userId, amount: 250, type: 'expense', category: 'Shopping', description: 'Amazon online shopping', date: daysAgo(58) },
    { userId, amount: 120, type: 'expense', category: 'Health', description: 'Gym membership', date: daysAgo(57), isRecurring: true },
    { userId, amount: 180, type: 'expense', category: 'Bills & Utilities', description: 'Electricity and internet bill', date: daysAgo(56), isRecurring: true },
    { userId, amount: 420, type: 'expense', category: 'Food & Dining', description: 'Restaurant dining out', date: daysAgo(55) },
    { userId, amount: 500, type: 'income', category: 'Freelance', description: 'Freelance design project', date: daysAgo(52) },
    { userId, amount: 75, type: 'expense', category: 'Transport', description: 'Gas station fill-up', date: daysAgo(50) },
    { userId, amount: 60, type: 'expense', category: 'Health', description: 'Doctor appointment copay', date: daysAgo(48) },
    { userId, amount: 200, type: 'expense', category: 'Shopping', description: 'Clothing purchase', date: daysAgo(45) },
    { userId, amount: 150, type: 'expense', category: 'Food & Dining', description: 'Coffee shop and snacks', date: daysAgo(44) }
  );

  // Month -1 (last month)
  transactions.push(
    { userId, amount: 4800, type: 'income', category: 'Salary', description: 'Monthly salary', date: daysAgo(35), isRecurring: true },
    { userId, amount: 1200, type: 'expense', category: 'Housing & Rent', description: 'Rent payment', date: daysAgo(34), isRecurring: true },
    { userId, amount: 290, type: 'expense', category: 'Food & Dining', description: 'Grocery store', date: daysAgo(32) },
    { userId, amount: 45, type: 'expense', category: 'Transport', description: 'Monthly transit pass', date: daysAgo(31), isRecurring: true },
    { userId, amount: 89.99, type: 'expense', category: 'Entertainment', description: 'Netflix + Spotify subscription', date: daysAgo(30), isRecurring: true },
    { userId, amount: 320, type: 'expense', category: 'Shopping', description: 'Electronics purchase', date: daysAgo(29) },
    { userId, amount: 120, type: 'expense', category: 'Health', description: 'Gym membership', date: daysAgo(27), isRecurring: true },
    { userId, amount: 175, type: 'expense', category: 'Bills & Utilities', description: 'Electricity and internet bill', date: daysAgo(26), isRecurring: true },
    { userId, amount: 380, type: 'expense', category: 'Food & Dining', description: 'Restaurant and takeout', date: daysAgo(25) },
    { userId, amount: 800, type: 'income', category: 'Freelance', description: 'Web development contract', date: daysAgo(22) },
    { userId, amount: 95, type: 'expense', category: 'Transport', description: 'Gas and parking', date: daysAgo(20) },
    { userId, amount: 350, type: 'expense', category: 'Shopping', description: 'Home decor items', date: daysAgo(18) },
    { userId, amount: 1000, type: 'income', category: 'Investment', description: 'Stock dividend payment', date: daysAgo(15) },
    { userId, amount: 200, type: 'expense', category: 'Entertainment', description: 'Concert tickets', date: daysAgo(12) }
  );

  // Current month
  const today = new Date();
  const dayOfMonth = today.getDate();

  transactions.push(
    { userId, amount: 4800, type: 'income', category: 'Salary', description: 'Monthly salary', date: daysAgo(Math.min(dayOfMonth - 1, 3)), isRecurring: true },
    { userId, amount: 1200, type: 'expense', category: 'Housing & Rent', description: 'Rent payment', date: daysAgo(Math.min(dayOfMonth - 2, 5)), isRecurring: true },
    { userId, amount: 89.99, type: 'expense', category: 'Entertainment', description: 'Netflix + Spotify subscription', date: daysAgo(Math.min(dayOfMonth - 3, 6)), isRecurring: true },
    { userId, amount: 120, type: 'expense', category: 'Health', description: 'Gym membership', date: daysAgo(Math.min(dayOfMonth - 4, 7)), isRecurring: true },
    { userId, amount: 180, type: 'expense', category: 'Bills & Utilities', description: 'Internet and electricity', date: daysAgo(Math.min(dayOfMonth - 5, 8)), isRecurring: true },
    { userId, amount: 260, type: 'expense', category: 'Food & Dining', description: 'Grocery shopping', date: daysAgo(4) },
    { userId, amount: 65, type: 'expense', category: 'Transport', description: 'Uber and bus fare', date: daysAgo(3) },
    { userId, amount: 145, type: 'expense', category: 'Food & Dining', description: 'Weekend restaurant', date: daysAgo(2) },
    { userId, amount: 500, type: 'income', category: 'Freelance', description: 'Logo design project', date: daysAgo(1) },
    { userId, amount: 80, type: 'expense', category: 'Shopping', description: 'Amazon order', date: daysAgo(1) }
  );

  await Transaction.insertMany(transactions);
  console.log(`Inserted ${transactions.length} transactions`);

  // --- Create sample budgets for current month ---
  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgets = [
    { userId, category: 'Food & Dining', monthlyLimit: 500, month: currentMonth },
    { userId, category: 'Transport', monthlyLimit: 150, month: currentMonth },
    { userId, category: 'Shopping', monthlyLimit: 300, month: currentMonth },
    { userId, category: 'Entertainment', monthlyLimit: 120, month: currentMonth },
    { userId, category: 'Health', monthlyLimit: 150, month: currentMonth },
    { userId, category: 'Bills & Utilities', monthlyLimit: 200, month: currentMonth },
    { userId, category: 'Housing & Rent', monthlyLimit: 1300, month: currentMonth },
  ];

  await Budget.insertMany(budgets);
  console.log(`Inserted ${budgets.length} budgets`);

  console.log('\n✅ Seed complete!');
  console.log('Login with: demo@financetracker.app / demo1234');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
