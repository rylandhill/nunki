# Humanity's Guide

Offline-first PWA for survival resources (shelters, meals, washrooms) and foster youth benefits. No logins. No tracking.

**Built for Vancouver and Toronto.** Designed to be adopted by developers in other cities—see [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) for how to add your city.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Update data

```bash
npm run fetch-data
```

Fetches Vancouver (shelters, meals, washrooms, safe consumption), Toronto (shelters), and foster youth benefits. Then rebuild: `npm run build`

## Data sources

| City | Source | Datasets |
|------|--------|----------|
| Vancouver | [Open Data Portal](https://opendata.vancouver.ca) | Homeless shelters, free meal programs, public washrooms |
| Toronto | [Open Data Portal](https://open.toronto.ca) | Daily shelter occupancy |
| Benefits | Curated | BC (SAJE, AYA, etc.), Ontario (ABI, Ready Set Go) |

Full details, API endpoints, schemas, and how to add new cities: **[docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)**

## Adding your city

1. Create `scripts/fetch_<city>.py` (see [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) for templates)
2. Output `public/data/<city>.json` with the standard schema
3. Add the city to `CITIES` in `src/main.js`
4. Run `npm run fetch-data` and rebuild

## Deploy (Cloudflare Pages)

1. Connect your repo at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Build command: `npm run build`
3. Output directory: `dist`

Or use Wrangler: `npx wrangler pages deploy dist --project-name=humanitys-guide`

## Project structure

- `src/` — App shell, styles, routing
- `public/data/` — Static JSON (amenities, benefits)
- `public/sw.js` — Service Worker (cache-first shell, stale-while-revalidate data)
- `scripts/` — Data fetchers (`fetch_vancouver.py`, `fetch_toronto.py`, `fetch_benefits.py`)
- `docs/` — Documentation for contributors and adopters
