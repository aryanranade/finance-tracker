const { calculateHealthScore } = require('../controllers/aiController');

// Helpers to build transactions dated in the current month
const now = new Date();
const thisMonth = (day = 10) => new Date(now.getFullYear(), now.getMonth(), day, 12);

const tx = (type, amount, category = 'Other', date = thisMonth()) => ({
  type,
  amount,
  category,
  date,
});

describe('calculateHealthScore', () => {
  test('returns 0-ish score with no data (neutral budget + consistency)', () => {
    const score = calculateHealthScore([], []);
    // No income -> 0 savings pts; no budgets -> 15 neutral; no expenses -> 15 neutral consistency
    expect(score).toBe(30);
  });

  test('rewards high savings ratio', () => {
    const transactions = [tx('income', 5000, 'Salary'), tx('expense', 1000)];
    const score = calculateHealthScore(transactions, []);
    // 80% savings ratio -> full 40 savings pts + 15 + consistency
    expect(score).toBeGreaterThanOrEqual(55);
  });

  test('penalizes spending over income (0 savings pts)', () => {
    const noSavings = calculateHealthScore(
      [tx('income', 1000, 'Salary'), tx('expense', 1500)],
      []
    );
    const healthySavings = calculateHealthScore(
      [tx('income', 1000, 'Salary'), tx('expense', 200)],
      []
    );
    expect(healthySavings).toBeGreaterThan(noSavings);
  });

  test('full budget adherence beats blown budgets', () => {
    const transactions = [tx('income', 3000, 'Salary'), tx('expense', 400, 'Food & Dining')];
    const withinBudget = calculateHealthScore(transactions, [
      { category: 'Food & Dining', monthlyLimit: 500 },
    ]);
    const overBudget = calculateHealthScore(transactions, [
      { category: 'Food & Dining', monthlyLimit: 300 },
    ]);
    expect(withinBudget).toBeGreaterThan(overBudget);
  });

  test('never exceeds 100 or goes below 0', () => {
    const rich = [tx('income', 100000, 'Salary')];
    expect(calculateHealthScore(rich, [])).toBeLessThanOrEqual(100);
    expect(calculateHealthScore([], [])).toBeGreaterThanOrEqual(0);
  });
});
