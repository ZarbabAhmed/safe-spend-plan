# Nisaab — Personal Money Control System (V1 Prototype)

A premium, mobile-first personal budgeting app. Frontend-first, fully interactive, with mock/local data — architected so real accounts and persistent per-user data can be connected later without redesign.

Not a bank, wallet, or payment app. The product answers one question: "What can I safely spend today without hurting tomorrow?"

## Design foundation

- Purple/violet-led fintech palette (primary #6F4DD5, deep #5635B8, violet #8568E8, soft #EDE9FF), with blue #5F8FEF and turquoise #48C7C3 as supporting accents only. Semantic success/warning/danger reserved for budget status, never as the only signal.
- Full light and dark theme, both designed independently (dark uses #101014 / #18181E / #21212A surfaces, not an inversion).
- Manrope as the single type family, loaded via a link tag. Strong weights for money values, tabular numbers for alignment.
- Restrained gradients: hero cards, selected states, progress moments, onboarding, CTA accents only.
- Motion: number count-up, progress fills, bottom sheets, page transitions, small success moments. No confetti, no bounce.

## Screens and flow (built in order)

**Entry & auth (simulated, no backend yet)**
1. Splash / loading with logo mark
2. Welcome / landing — hero promise, demo dashboard preview, Get Started / Log In
3. Terms & privacy agreement with financial disclaimer
4. Sign up / log in (Google / Email / Phone options, all simulated)
5. OTP — 6 digits, auto-advance, paste, resend countdown
6. Create app PIN + confirm, optional biometric toggle (placeholder)

**Onboarding**
7. Welcome — "Let's build your money plan", stepper
8. User type — Job Holder (primary) / Business Owner
9. Currency selection (multi-currency, PKR default)
10. Income — monthly salary, salary date, optional extra income
11. Fixed expenses — rent, utilities, internet, phone, education, loans, subscriptions, custom
12. Variable expenses — with "estimate for me" option
13. Monthly savings target, with live budget impact preview
14. Emergency fund — target and current, progress shown
15. First goal — presets + name, target, saved, date
16. Budget generation — animated reveal of the full plan (the "wow" moment)

**Core app (bottom nav on mobile, sidebar on desktop)**
17. Home dashboard — Safe to Spend hero, money snapshot (income/spent/saved/remaining), budget health meters, savings card, goal card, recent transactions, prominent Add Expense. First visit runs a 5-step guided tour (skippable, shown once).
18. Budget — month header, planned vs actual vs remaining per category, editable, plus a Weekly Spending section
19. Transactions — grouped timeline (Today / Yesterday / This Week / Earlier), search, filters
20. Add Expense — bottom sheet on mobile, dialog on desktop; recalculates everything on save
21. Add Income — types, plus optional "how to use extra money" suggestion for bonuses
22. Goals list + Goal detail with milestones and estimated completion
23. Savings — monthly savings, emergency fund, goal contributions kept clearly separate
24. Emergency fund detail
25. Monthly review — income/spent/saved, category performance, forward-looking close
26. Month selector with preserved history
27. Profile, Settings (currency, categories, theme, notifications), Security (change PIN, sessions, logout, delete account)

Every area gets designed empty, loading (skeleton), error, and success states.

## Financial logic (modular)

A single calculation layer owns all math so no screen duplicates it:

- Plan: income − fixed − variable budget − savings − goal allocation = flexible money
- Safe to Spend: tracked available + remaining planned flexibility − upcoming commitments − required savings − planned goal contributions − period spending. Isolated in one function so the formula can be refined later without UI changes.
- Expenses reduce category remaining, monthly remaining, and Safe to Spend. Income raises income, flexibility, Safe to Spend. Contributions advance goals/savings/emergency fund.
- Monthly cycle: current month → close → review → next month plan, with recurring commitments and goal progress carried forward. Plan and actual cash are separate concepts.
- Overspending is stated factually with an optional "Adjust budget" action — never shaming language.

## Technical approach

- TanStack Start routes, one route per screen, grouped: `/` landing, auth flow routes, `_onboarding` layout, `_app` layout with bottom nav + desktop sidebar.
- Design tokens in `src/styles.css` (@theme inline, oklch), shadcn components customized to the palette. No hardcoded colors in components.
- Domain layer in `src/lib/finance/` — types, calculations, formatting, currency — pure functions, no UI or storage imports.
- Data access through a repository interface backed by local storage today; swapping in Lovable Cloud later means implementing that interface, not rewriting screens.
- Shared UI kit: buttons, inputs, currency input, cards, progress/budget meters, goal card, transaction row, bottom sheet, modal, tabs, chips, badges, alerts, toasts (sonner), month selector, empty states, skeletons.
- Realistic seeded demo data so the whole product can be experienced end to end.
- Accessibility: contrast, focus rings, keyboard paths, labelled fields, accessible errors, status text alongside color.
- Per-route head metadata for title/description/social tags.

## Not in this phase

Real authentication, database, bank links, payments, wallets, investments, credit scores, AI chat, business accounting. Auth and onboarding are fully navigable but simulated.
