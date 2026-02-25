# Upcoming Steps — Deployment Readiness

A checklist to get Humanity's Guide deployed and usable.

---

## 1. Version Control

- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Create remote repo (GitHub, GitLab, etc.)
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Push: `git push -u origin main`

---

## 2. Cloudflare Pages Setup

- [ ] Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project
- [ ] Connect to Git (your repo)
- [ ] Configure build settings:
  - **Build command:** `npm run fetch-data && npm run build`
  - **Build output directory:** `dist`
  - **Root directory:** (leave blank if project is at repo root)
- [ ] Optional: Set environment variables if needed (e.g. `NODE_VERSION`, `PYTHON_VERSION`)
- [ ] Deploy

---

## 3. Post-Deploy Verification

- [ ] Visit the deployed URL and confirm the app loads
- [ ] Check city selection (Vancouver, Toronto)
- [ ] Test Survival Guide: filters, amenity list, detail view with nearby transit
- [ ] Test Foster Youth Navigator: sections, benefits
- [ ] Test offline: enable airplane mode, reload — app shell should still work
- [ ] Test PWA install: add to home screen on mobile

---

## 4. Optional Enhancements

- [ ] Custom domain (Cloudflare Pages → Custom domains)
- [ ] Add `fetch-data` to `package.json` scripts if not already: `"build:full": "npm run fetch-data && npm run build"`
- [ ] Schedule periodic data updates (e.g. GitHub Actions cron to run fetch-data and commit, or manual refresh)
- [ ] Update README with live URL once deployed

---

## 5. Data Refresh Strategy

- **Option A (recommended):** Build command includes `fetch-data` — every deploy gets fresh data
- **Option B:** Run `npm run fetch-data` locally before pushing; commit updated JSON when needed

---

## Quick Deploy (Wrangler CLI)

If you prefer manual deploys:

```bash
npm run fetch-data && npm run build
npx wrangler pages deploy dist --project-name=humanitys-guide
```

---

## Reference

| Item | Value |
|------|-------|
| Build output | `dist` |
| Data files | `public/data/*.json` (copied to `dist/data/`) |
| Build command | `npm run fetch-data && npm run build` |
| Dev server | `npm run dev` |
| Preview build | `npm run preview` |
