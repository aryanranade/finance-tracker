# FinanceAI — AI-Powered Personal Finance Tracker

A full-stack personal finance tracker with AI-powered insights, budget management, and financial health scoring. Built with React, Node.js, MongoDB Atlas, and Groq AI — all free.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Recharts |
| Backend | Node.js + Express + Mongoose |
| Database | MongoDB Atlas (free M0 tier) |
| AI | Groq API (LLaMA 3.1 70B — free) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and navigate
```bash
cd "finance tracker"
```

### 2. Set up MongoDB Atlas (free)
1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free **M0** cluster
3. Create a database user and get the connection string
4. Whitelist `0.0.0.0/0` in Network Access (for development)

### 3. Get a free Groq API key
1. Sign up at [console.groq.com](https://console.groq.com) (no credit card needed)
2. Generate an API key

### 4. Configure the backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Groq API key
npm install
```

Your `server/.env` should look like:
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/financetracker?retryWrites=true&w=majority
JWT_SECRET=pick_a_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=gsk_your_key_here
```

### 5. (Optional) Seed with sample data
```bash
cd server
npm run seed
# Creates: demo@financetracker.app / demo1234
# with 3 months of realistic transactions and budgets
```

### 6. Start the backend
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### 7. Configure and start the frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and log in with `demo@financetracker.app` / `demo1234` (if you seeded) or register a new account.

---

## 🚀 Deployment

### Backend → Render (free)

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set **Root Directory** to `server`
4. Set build command: `npm install`
5. Set start command: `node index.js`
6. Add all environment variables from `server/.env`
7. Set `CLIENT_URL` to your Vercel frontend URL

> **Note:** Render free tier sleeps after 15 min of inactivity. The first request after sleep takes ~30 seconds.

### Frontend → Vercel (free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `client`
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g., `https://your-app.onrender.com`)
4. Deploy!

---

## 📁 Project Structure

```
finance tracker/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── MonthlyBarChart.jsx
│   │   │   ├── CategoryPieChart.jsx
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── TransactionModal.jsx
│   │   │   ├── BudgetCard.jsx
│   │   │   ├── InsightCard.jsx
│   │   │   ├── HealthScoreGauge.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/              # Route-level pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── BudgetsPage.jsx
│   │   │   └── InsightsPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT auth state
│   │   ├── services/
│   │   │   └── api.js          # Axios instance
│   │   └── utils/
│   │       └── helpers.js      # Formatters, constants
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/
    ├── controllers/            # Business logic
    │   ├── authController.js
    │   ├── transactionController.js
    │   ├── budgetController.js
    │   └── aiController.js
    ├── models/                 # Mongoose schemas
    │   ├── User.js
    │   ├── Transaction.js
    │   └── Budget.js
    ├── routes/                 # Express routers
    │   ├── auth.js
    │   ├── transactions.js
    │   ├── budgets.js
    │   └── ai.js
    ├── middleware/
    │   └── auth.js             # JWT middleware
    ├── services/
    │   └── groqService.js      # Groq AI integration
    ├── seed.js                 # Sample data seeder
    └── index.js                # Entry point
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{name, email, password}` | Register |
| POST | `/api/auth/login` | `{email, password}` | Login → JWT |
| GET | `/api/auth/me` | — | Get current user |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | List (filterable) |
| POST | `/api/transactions` | Create |
| PUT | `/api/transactions/:id` | Update |
| DELETE | `/api/transactions/:id` | Delete |
| GET | `/api/transactions/export/csv` | CSV download |

### Budgets
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/budgets?month=YYYY-MM` | List with actual spending |
| POST | `/api/budgets` | Create/update |
| DELETE | `/api/budgets/:id` | Delete |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/insights` | Generate AI insights |
| GET | `/api/ai/categorize?description=...` | Auto-categorize |
| GET | `/api/ai/health-score` | Get health score |

---

## 🧠 Financial Health Score

Calculated server-side from 3 components:

| Component | Max Points | How |
|---|---|---|
| Savings Ratio | 40 | `(income - expenses) / income × 40` |
| Budget Adherence | 30 | `categories_within_budget / total × 30` |
| Spending Consistency | 30 | Low stddev in last 3 months = higher score |

---

## 💡 Features

- ✅ Email/password auth with JWT
- ✅ Dashboard with 4 stat cards, bar chart, pie chart
- ✅ Full transaction CRUD with sortable table
- ✅ AI auto-categorization on transaction create
- ✅ Multi-filter: date range, category, type, amount, search
- ✅ Budget management with real-time actual vs limit tracking
- ✅ AI Insights panel (Groq LLaMA 3.1 70B)
- ✅ Financial Health Score (0–100) with SVG gauge
- ✅ CSV export of all transactions
- ✅ Recurring transaction detection
- ✅ Mobile-responsive sidebar
- ✅ Dark mode UI (default)

---

## 🔐 Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with configurable expiry
- Helmet for HTTP security headers
- express-validator on all input routes
- All transaction/budget routes user-scoped (no cross-user access)
- API keys in environment variables only
