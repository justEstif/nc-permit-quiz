# NC Permit Practice

A zero-dependency static site for practicing the North Carolina DMV learner permit knowledge test. Host it free on GitHub Pages.

**116 questions** (100 knowledge + 16 road-sign) — every answer verified against the official NC Driver Handbook (ncdot.gov, Sep 2025) and cross-checked against frequently-reported real-test questions.

## Features

- **Dashboard** — questions seen, lifetime accuracy, trouble count, exam history, per-section progress
- **Practice mode** — by section or mixed; prioritizes unseen and missed questions; instant feedback + handbook explanation
- **Mock exam** — mirrors the real test: 25 random questions, no feedback until the end, pass at 20/25 (80%), with full review
- **Troubles** — auto-tracks every miss; questions missed repeatedly are flagged bold and can be practiced as a set
- **Offline-friendly** — progress stored in `localStorage`; no account, no server, no tracking

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `nc-permit-quiz`)
2. Push this folder to it:
   ```bash
   git init && git add . && git commit -m "nc permit practice site"
   git branch -M main
   git remote add origin https://github.com/<you>/nc-permit-quiz.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `/ (root)` → Save
4. Site goes live at `https://<you>.github.io/nc-permit-quiz/` in ~1 minute

To run locally: `python3 -m http.server 8000` and open http://localhost:8000

## Files

- `index.html` — markup, styled with the [Vercel design system](https://vercel.com/design.md)
- `app.js` — [Alpine.js](https://alpinejs.dev) component; imports Alpine, registers, and starts it (no load-order races)
- `assets/alpine.esm.js` — Alpine.js 3 ESM build, self-hosted (no CDN dependency or races)
- `assets/vercel-brand.css` — Vercel Brand foundation (Geist typography, tokens, automatic light/dark). Note: 17 unused `@supports selector(:has())` blocks were neutralized because `bun index.html`'s CSS parser rejects `:has()`; page appearance is unchanged
- `assets/signs/` — 16 road-sign SVGs (MUTCD-style shapes) shown as images in the signs questions
- `questions.js` — question bank with explanations; edit this to add/change questions

## Question sources

- NC Driver Handbook (official): ncdot.gov/dmv/license-id/driver-licenses/new-drivers/Documents/nc-driver-handbook.pdf
- NCDMV test overview pages
- driving-tests.org NC data (most-missed topics, 4,357 NC learners)
- dmv-written-test.com NC practice tests (real submitted questions)
- Community pool reports (r/NorthCarolina, Quizlet)

Note: the real test draws 25 questions from a ~100-question pool; this bank covers that pool's topics but is not the copyrighted official list.
