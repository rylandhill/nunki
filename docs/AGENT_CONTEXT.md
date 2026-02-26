# Agent Context — Nunki

*Attach this file when using an AI coding agent to work on Nunki. It provides scope, structure, conventions, and rationale for non-standard decisions.*

---

## What Nunki Is

**Nunki** is an offline-first PWA for survival resources: shelters, meals, washrooms, and foster youth life skills. Built for Vancouver and Toronto. No logins, no tracking, no backend.

**Users:** People in crisis, shelter staff, donors, foster youth. Many have unreliable internet. Accuracy is critical—wrong info can waste time and erode trust.

---

## Tech Stack

- **Frontend:** Vanilla JS (no React/Vue/Svelte), Vite, single `main.js` (~700 lines)
- **Data:** Static JSON in `public/data/`. Fetched at build time by Python scripts.
- **Service Worker:** Cache-first for shell and data. Data is cache-first to avoid iOS "no internet" popup when offline.
- **Hosting:** Static (Cloudflare Pages). No server.

---

## Project Structure

```
nunki/
├── index.html              # Single entry; app mounts in #app
├── src/
│   ├── main.js             # App shell, routing, UI, fetch, state
│   ├── style.css           # All styles (OLED dark, brutalist)
│   └── foster-content.js   # Life skills content (benefits, taxes, etc.)
├── public/
│   ├── sw.js               # Service Worker (bump cache version on deploy)
│   ├── manifest.json       # PWA manifest
│   └── data/               # JSON: vancouver.json, toronto.json, benefits.json
├── scripts/
│   ├── fetch_vancouver.py  # Vancouver amenities from Open Data
│   ├── fetch_toronto.py    # Toronto amenities from CKAN + manual meals
│   ├── fetch_benefits.py   # Foster youth benefits
│   ├── validate_crossref.py # NSPL cross-reference for shelter accuracy
│   ├── bump-cache.js       # Bump SW cache version before deploy
│   └── gtfs_nearby.py      # Transit route enrichment (optional)
└── docs/
    ├── DATA_SOURCES.md     # Data sources, schemas, add-city guide
    ├── ACCURACY.md         # Cross-reference, validation workflow
    ├── MAINTENANCE.md      # Manual-only sources, update schedule
    └── AGENT_CONTEXT.md    # This file
```

---

## Where to Put Work

| Task | Location |
|------|----------|
| New UI, routing, state | `src/main.js` |
| Styles | `src/style.css` |
| Life skills content | `src/foster-content.js` |
| New city data | `scripts/fetch_<city>.py` → `public/data/<city>.json` |
| Add city to app | `CITIES` in `src/main.js`, `package.json` fetch-data |
| Shelter validation | `scripts/validate_crossref.py` (add `SHELTER_NAME_ALIASES` for new cities) |
| Manual data (meals, safe consumption) | `MEAL_PROGRAMS`, `SAFE_CONSUMPTION_SITES` in fetch scripts |
| Vancouver shelter addresses | `SHELTER_ADDRESSES` in `fetch_vancouver.py` (`fetch_json` has no addresses) |

---

## Conventions & Patterns

### Routing

- **Hash-based:** `#survival`, `#foster`, `#donate`, `#foster/benefits`.
- `handleRoute()` reads `hash`, calls `renderSurvival()`, `renderFoster()`, etc.
- No router library.

### State

- `currentCity`, `regionData`, `currentFilterType`, `currentRegion`, `currentSearch`, `currentWheelchairOnly`, `currentFavoritesOnly` — module-level in `main.js`.
- Favorites in `localStorage`; key `nunki-favorites`.

### Render Pattern

- **Full render:** Replace `app.innerHTML` with new markup.
- **Partial update:** When `#amenity-list-container` exists (e.g. after search), only update list + header + filter button states. **Re-attach listeners** for list items. Filter buttons stay in DOM; update their `aria-pressed` in partial path.
- **Filter buttons:** Use `data-wheelchair`, `data-favorites` (not `data-action`). Selectors: `[data-wheelchair]`, `[data-favorites]`.

### Data

- `fetchJSON(path)` fetches JSON. Falls back to `caches.match()` on failure. Throws `Error('offline')` when no cache.
- City data: `regionData.meta`, `regionData.amenities`. Amenity schema: `id`, `type`, `name`, `address`, `hours`, `phone`, `lat`, `lng`, `notes`, `region`, `category`.

### Escape

- Use `escapeHtml()` for user-facing strings in templates.

---

## Why Things Are Non-Standard

| Decision | Reason |
|----------|--------|
| No framework | Small app; vanilla JS keeps bundle size down and mental model simple. |
| No backend | Static hosting; offline-first. Data pre-compiled at build time. |
| Cache-first for data | Network-first when offline triggers iOS "no internet" popup. Cache-first avoids fetch when offline. |
| `prefetchForOffline()` only when `navigator.onLine` | Same: avoid fetch when offline to prevent popup. |
| `reg.update()` only when `navigator.onLine` | Same. |
| Vancouver shelters: manual addresses | Open Data API has no addresses; `SHELTER_ADDRESSES` lookup. |
| Toronto meals: manual list | TDIN page is JS-rendered; no API. Manual curation from tdin.ca. |
| Safe consumption: manual | No open data feeds. |

---

## Data Flow

1. **Build time:** `npm run fetch-data` runs Python scripts → `public/data/*.json`.
2. **Runtime:** App fetches `vancouver.json` or `toronto.json` when user picks city.
3. **Service Worker:** Intercepts fetch. Cache-first for `/data/`; if cache miss, fetch. Caches successful responses.
4. **Deploy:** `npm run bump-cache` before deploy so cache version increments; users get fresh SW.

---

## Before Rollout

1. `npm run fetch-data`
2. `npm run validate-data` — cross-reference shelters with NSPL
3. Spot-check 3–5 random entries (call/visit)
4. See [docs/ACCURACY.md](ACCURACY.md) for full workflow

---

## Adding a New City

1. Create `scripts/fetch_<city>.py` (see [docs/DATA_SOURCES.md](DATA_SOURCES.md) templates).
2. Output `public/data/<city>.json` with standard schema.
3. Add to `CITIES` in `src/main.js`.
4. Add to `fetch-data` in `package.json`.
5. Extend `validate_crossref.py` for the new city (see [docs/ACCURACY.md](ACCURACY.md)).

---

## Key Docs

- **[DATA_SOURCES.md](DATA_SOURCES.md)** — Data sources, schemas, API endpoints, add-city templates
- **[ACCURACY.md](ACCURACY.md)** — Cross-reference resources, validation, `SHELTER_NAME_ALIASES`
- **[MAINTENANCE.md](MAINTENANCE.md)** — Manual-only sources, update schedule, how to add manual entries
