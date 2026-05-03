const Groq = require('groq-sdk');

let groqClient = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

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

/**
 * Categorize a transaction description using Groq AI
 */
async function categorizeDescription(description) {
  const client = getGroqClient();
  if (!client) return 'Other';

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a financial transaction categorizer. Given a transaction description, respond with ONLY the category name — nothing else. Choose from: ${CATEGORIES.join(', ')}.`,
        },
        {
          role: 'user',
          content: description,
        },
      ],
      temperature: 0.1,
      max_tokens: 20,
    });

    const raw = completion.choices[0].message.content.trim();
    return CATEGORIES.includes(raw) ? raw : 'Other';
  } catch (err) {
    console.error('Categorize error:', err.message);
    return 'Other';
  }
}

/**
 * Generate AI financial insights using Groq
 */
async function getFinancialInsights({ transactions, income, expenses, budgets, healthScore, currentMonth }) {
  const client = getGroqClient();
  if (!client) throw new Error('Groq API key not configured');

  const payload = {
    currentMonth,
    income,
    expenses,
    netSavings: income - expenses,
    healthScore,
    budgets: budgets.map((b) => ({ category: b.category, limit: b.monthlyLimit })),
    recentTransactions: transactions.slice(0, 30).map((t) => ({
      date: new Date(t.date).toISOString().split('T')[0],
      description: t.description,
      category: t.category,
      type: t.type,
      amount: t.amount,
    })),
  };

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI financial assistant. Analyze the user\'s financial data and return insights, warnings, predictions, and recommendations in JSON format. Be precise, data-driven, and concise. Always return valid JSON with these exact keys: insights (array of strings), warnings (array of strings), predictions (object with endOfMonthBalance and projectedSavings as numbers, and summary as string), recommendations (array of strings).',
      },
      {
        role: 'user',
        content: JSON.stringify(payload),
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 1024,
  });

  const result = JSON.parse(completion.choices[0].message.content);

  return {
    insights: result.insights || [],
    warnings: result.warnings || [],
    predictions: result.predictions || {},
    recommendations: result.recommendations || [],
  };
}

module.exports = { categorizeDescription, getFinancialInsights };
