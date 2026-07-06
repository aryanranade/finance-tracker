# 🚀 FinanceAI — "Next Level" Roadmap

Goal: take the project from a solid personal build to a **mainstream, portfolio-grade, visually stunning** app.

## 🎯 Design direction (decided)
- **Aesthetic:** Premium **dark glassmorphism** — evolve the current dark theme with frosted glass, glowing gradient accents, depth, tasteful neon-ish highlights (Linear / Vercel dark energy).
- **Motion:** **Balanced & tasteful** — smooth, purposeful animations (Framer Motion) that feel polished without being distracting.
- **Focus:** Portfolio credibility + visual/UX polish.

Legend: ⭐ = inside the primary focus (visual/portfolio) · ✅ = done

---

## ✅ Done
- One-command dev setup (`npm run dev`), `npm run setup`, port-conflict fix (5001), README run docs — *committed `3ede041`*
- **Phase 0 frontend revamp** — design system, aurora bg, Framer Motion layer (page transitions, staggers, count-ups, spring modals, animated charts/progress), all pages redesigned
- **Phase 1** — one-click demo login, sonner toasts, MIT LICENSE, README badges/callout (screenshots: placeholders await real captures)
- **Phase 2** — empty states, error boundary, mobile check, inline validation, focus/aria/reduced-motion support
- **Phase 3** — 17 backend tests (Jest+Supertest+memory Mongo), 11 frontend tests (Vitest+RTL), GitHub Actions CI + badge, rate limiting (auth 20/15min, AI 30/15min)
- **Phase 4/5 (partial)** — architecture diagram, CONTRIBUTING.md, Dependabot, env troubleshooting docs, morgan logging, sanitized prod errors, pagination metadata, removed unused `json2csv`

## 🎨 Phase 0 — Complete Frontend Revamp ⭐ *(flagship)*
**Design system & visual identity**
1. Refined color palette, typography scale, spacing rhythm, consistent radii/shadows
2. Reusable polished primitives — buttons, inputs, cards, badges, tooltips (depth + gradient accents)
3. Optional light/dark theme toggle (currently dark-only)

**Animation layer (Framer Motion — balanced/tasteful)**
4. Smooth page transitions between routes
5. Staggered entrance animations for cards, lists, table rows
6. Number count-up animations on stats & health score
7. Micro-interactions — button hover/press, icon animations, subtle glow
8. Spring modals + animated drawer/sidebar
9. Charts that draw in on load (animated pie/bar/gauge)
10. Shimmer skeleton loaders (replace plain spinners)

**Page-by-page redesign**
11. Stunning landing/hero page
12. Redesigned dashboard (glass cards, depth, gradient highlights)
13. Polished transactions table + filters
14. Beautiful budgets progress UI + AI insights cards
15. Gorgeous auth (login/register) screens

## Phase 1 — Instant credibility wins ⭐
16. Screenshots + demo GIF in README (showcases the new UI)
17. Demo / guest login button
18. Toast notifications (`sonner`)
19. LICENSE (MIT)
20. Live-demo callout + status badge

## Phase 2 — UX depth ⭐
21. Empty states with illustrations + CTA
22. Error boundary + graceful API-error UI
23. Mobile responsive audit (sidebar → drawer, scrollable tables)
24. Inline form validation
25. Accessibility pass (aria, keyboard nav, focus states)

## Phase 3 — Engineering signal
26. Backend tests (Jest + Supertest): auth, transaction scoping, health-score math
27. Frontend tests (Vitest + React Testing Library)
28. CI workflow (`.github/workflows/ci.yml`) + passing badge
29. Rate limiting on `/api/ai/*` and `/api/auth/*`

## Phase 4 — Docs & repo hygiene
30. Architecture diagram in README
31. Roadmap / future-improvements section
32. Prettier + ESLint enforced in CI
33. CONTRIBUTING.md
34. Dependabot / Renovate config
35. Env "where do my values live" note (Atlas/Render/Groq)

## Phase 5 — Production robustness
36. Structured logging (`pino`/`morgan`) + sanitized error responses
37. Refresh tokens / httpOnly cookies (vs long-lived JWT in localStorage)
38. Transaction pagination (`{ transactions, total, page, hasMore }`)
39. Close input-validation gaps; resolve unused `json2csv` dependency
40. `docker-compose.yml` for full-stack one-command spin-up
