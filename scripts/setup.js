#!/usr/bin/env node
/**
 * One-time setup helper.
 * - Copies server/.env.example -> server/.env if it doesn't exist.
 * - Warns if the .env still contains placeholder values so the app won't
 *   silently fail to connect to MongoDB / Groq.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, 'server', '.env');
const examplePath = path.join(root, 'server', '.env.example');

const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

console.log(`\n${c.cyan}🔧 Finance Tracker setup${c.reset}\n`);

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log(`${c.green}✔${c.reset} Created server/.env from .env.example`);
  } else {
    console.log(`${c.yellow}!${c.reset} No server/.env.example found — skipping env copy`);
  }
} else {
  console.log(`${c.green}✔${c.reset} server/.env already exists`);
}

// Detect leftover placeholders that would break the app.
const placeholders = [
  { key: 'MONGODB_URI', bad: '<username>' },
  { key: 'GROQ_API_KEY', bad: 'gsk_your_groq_api_key_here' },
  { key: 'JWT_SECRET', bad: 'your_super_secret_jwt_key_change_this_in_production' },
];

if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  const unset = placeholders.filter((p) => env.includes(p.bad));
  if (unset.length) {
    console.log(
      `\n${c.yellow}⚠  Action needed:${c.reset} fill in real values in ${c.cyan}server/.env${c.reset} before running:`
    );
    unset.forEach((p) => console.log(`   ${c.dim}•${c.reset} ${p.key}`));
    console.log(
      `\n   ${c.dim}MongoDB: https://mongodb.com/atlas  ·  Groq: https://console.groq.com${c.reset}`
    );
  } else {
    console.log(`${c.green}✔${c.reset} server/.env looks configured`);
  }
}

console.log(`\n${c.green}Done.${c.reset} Next: ${c.cyan}npm run dev${c.reset}\n`);
