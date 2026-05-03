<div align="left">
  <div style="background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); padding: 2px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">
    <div style="background: #0f172a; padding: 20px 40px; border-radius: 18px;">
      <h1 style="margin: 0; color: white;">🚀 AI Finance Tracker</h1>
      <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 1.1em;">AI-Powered Personal Finance Tracker</p>
    </div>
  </div>

  <p>
    <b>Take control of your financial future with intelligent insights, smart budgeting, and beautiful analytics.</b>
  </p>

  <div>
    <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-f55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </div>

  <br />
  <br />
  
  <a href="https://finance-tracker-one-alpha.vercel.app" target="_blank"><b><u><font color="#3b82f6">View Live Deployment</font></u></b></a>
</div>

<br />

## ✨ Key Features

- 🤖 **AI-Powered Insights**: Get personalized financial advice, warnings, and predictions powered by Groq's blazing-fast LLaMA 3.3 70B model.
- ⚡ **Smart Auto-Categorization**: Type "bought a latte" and the AI instantly categorizes it as `Food & Dining`.
- 📊 **Beautiful Visualizations**: Interactive pie charts, monthly bar charts, and SVG gauges built with Recharts.
- 🎯 **Budget Management**: Set monthly limits per category and track your actual spending in real-time with visual progress bars.
- 💯 **Financial Health Score**: A proprietary 0-100 score calculated based on your savings ratio, budget adherence, and spending consistency.
- 🌙 **Modern Glassmorphism UI**: A sleek, dark-mode default interface that feels premium and responsive.
- 🔒 **Secure Authentication**: JWT-based authentication with bcrypt password hashing.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 (Custom Dark Theme + Glassmorphism)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose Object Modeling)
- **Security**: Helmet, express-validator, JWT
- **AI Integration**: Groq SDK (`llama-3.3-70b-versatile`)

---

## 🚀 Live Demo & Deployment

This application is built to be deployed 100% for free using modern cloud providers:

- **Frontend Hosting**: [Vercel](https://vercel.com)
- **Backend API Hosting**: [Render](https://render.com)
- **Database**: [MongoDB Atlas (M0 Tier)](https://mongodb.com/atlas)
- **AI Engine**: [Groq Cloud](https://console.groq.com)

---

## 💻 Local Development

Want to run it locally? Follow these steps:

### 1. Prerequisites
- Node.js (v18 or newer)
- A free [MongoDB Atlas](https://mongodb.com) database URI
- A free [Groq API Key](https://console.groq.com)

### 2. Setup the Backend
```bash
cd server
npm install

# Create your environment variables
cp .env.example .env
```
Edit the `server/.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
GROQ_API_KEY=gsk_your_groq_api_key
```

### 3. Setup the Frontend
```bash
cd client
npm install
```

### 4. Run the Application
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# App starts on http://localhost:5173
```

*(Optional)* Seed your database with demo data:
```bash
cd server
npm run seed
```

---

## 🔌 API Reference

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current user profile

### Transactions
- `GET /api/transactions` - Fetch all transactions (supports filtering & sorting)
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/export/csv` - Download all data as CSV

### Budgets
- `GET /api/budgets` - Fetch budgets with real-time actual spending calculated
- `POST /api/budgets` - Create or update a category budget
- `DELETE /api/budgets/:id` - Remove a budget

### AI Capabilities
- `GET /api/ai/categorize?description=...` - Ask LLaMA to categorize a raw text string
- `POST /api/ai/insights` - Generate a comprehensive financial report
- `GET /api/ai/health-score` - Calculate the 0-100 proprietary health score

---

## 🛡️ Security Measures
- **Password Hashing**: Bcrypt with salt rounds (cost factor 12).
- **Stateless Auth**: JSON Web Tokens (JWT) for secure session management.
- **Data Isolation**: All database queries are strictly scoped to the authenticated `userId`.
- **HTTP Headers**: Helmet.js prevents cross-site scripting (XSS) and clickjacking.
- **Input Validation**: Express-validator sanitizes all incoming request bodies.

---
