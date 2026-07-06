# Contributing to Finance Tracker

Thanks for your interest! This project welcomes issues and pull requests.

## Getting started

```bash
npm run setup   # installs root + server + client deps, bootstraps server/.env
npm run dev     # starts backend (5001) + frontend (5173) together
```

Fill in `server/.env` with your MongoDB Atlas URI and (optionally) a Groq API key — see the README's Local Development section.

## Running tests

```bash
# Backend (Jest + Supertest, in-memory MongoDB)
cd server && npm test

# Frontend (Vitest + React Testing Library)
cd client && npm test
```

Both suites must pass before a PR is merged — CI runs them automatically.

## Guidelines

- **Match the existing style** — the frontend uses Tailwind utility classes and the shared design tokens in `client/src/index.css`; animations use the shared variants in `client/src/lib/motion.js`.
- **Keep motion tasteful** — durations 0.3–0.5s, ease-out, subtle staggers. No gratuitous animation.
- **Scope database queries to `req.userId`** — every server query must be user-isolated.
- **Add tests** for new endpoints or scoring/derivation logic.
- Small, focused PRs are easier to review than big ones.

## Reporting bugs

Open an issue with reproduction steps, expected vs. actual behavior, and console/server logs if relevant.
