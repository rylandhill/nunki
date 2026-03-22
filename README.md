# Nunki

Offline-first PWA for survival resources (shelters, meals, washrooms) and foster youth benefits. No logins. No tracking.

**Built for Vancouver, Toronto, and Hamilton.** Designed to be adopted by developers in other cities—see [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) for how to add your city.

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

- **`npm run fetch-data`** — Refreshes **automatic** data from APIs / scripts, then merges **`contributions/merged/`** into `public/data/*.json`. Use when open data changed or before a release. **Does not** delete your merged submissions/overrides (those files are only read).
- **`npm run apply-merged`** — Re-applies **`contributions/merged/`** (maintainer-local; see **[DATA_PIPELINE.md](docs/DATA_PIPELINE.md)**) onto existing `public/data/*.json` **without** calling the internet. Use after merging approved submissions or hand-editing merged JSON locally.

See **[docs/DATA_PIPELINE.md](docs/DATA_PIPELINE.md)** for the full model (what overwrites what, deploy vs local dev).

## Community submissions (Google Forms)

> **Other developers & AI agents:** Part of the submissions workflow is **intentionally not in this repository** (see `.gitignore`). The clone you have may be **missing**:
>
> - **`contributions/`** — pending queue, archive, merged additions/overrides, and any local maintainer README (the paths still exist on a maintainer machine; scripts expect them when run there).
> - **`tools/`** — optional local review UI (e.g. Node server under `tools/contributions-manager/`) used only by maintainers who keep that tree locally.
> - **`docs/SUBMISSIONS_ARCHITECTURE.md`** — optional local planning doc, not shipped in git.
>
> **What *is* tracked:** `scripts/import_google_form_csv.py`, `scripts/apply_merged_to_public.py`, `scripts/contribution_merge.py`, and **[docs/COMMUNITY_FORMS.md](docs/COMMUNITY_FORMS.md)** (public form links + CSV column reference). Do **not** assume you can open or edit hidden paths when working from a fresh clone.

**Suggesting or correcting places:** use the **Google Forms** in **[docs/COMMUNITY_FORMS.md](docs/COMMUNITY_FORMS.md)**—we don’t take crowd-sourced place data as JSON in PRs.

**Maintainers:** Sheet → **CSV export** → **`npm run import-form-*`** → review/merge locally (using your local **`contributions/`** / **`tools/`** trees), then **`npm run apply-merged`** or **`npm run fetch-data`**. Form URLs and CSV column maps: **[docs/COMMUNITY_FORMS.md](docs/COMMUNITY_FORMS.md)**.

## Validate data (cross-reference with NSPL)

Before rollout, cross-reference shelter data with the federal National Service Provider List:

```bash
npm run validate-data
```

See [docs/ACCURACY.md](docs/ACCURACY.md) for full accuracy strategy and resources.

## Data sources

| City | Source | Datasets |
|------|--------|----------|
| Vancouver | [Open Data Portal](https://opendata.vancouver.ca) | Homeless shelters, free meal programs, public washrooms |
| Toronto | [Open Data Portal](https://open.toronto.ca) | Daily shelter occupancy |
| Hamilton | [City of Hamilton](https://www.hamilton.ca) + [Open Hamilton](https://open.hamilton.ca) | Curated shelters, meals, washrooms (see DATA_SOURCES) |
| Benefits | Curated | BC (SAJE, AYA, etc.), Ontario (ABI, Ready Set Go) |

Full details, API endpoints, schemas, and how to add new cities: **[docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)**

## Adding your city

1. Create `scripts/fetch_<city>.py` (see [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md) for templates)
2. Output `public/data/<city>.json` with the standard schema
3. Add the city to `CITIES` in `src/main.js`
4. Run `npm run fetch-data` (or `apply-merged` if only using `contributions/merged/`) and rebuild

## Deploy (Cloudflare Pages)

1. Connect your repo at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Build command: **`npm run build:deploy`** (runs `fetch-data`, bump-cache, and `vite build` so each deploy pulls automatic data and applies **`contributions/merged/`**)
3. Output directory: `dist`

For a static build without refetching (e.g. fork with only committed `public/data/`), use `npm run build` instead.

Or use Wrangler: `npx wrangler pages deploy dist --project-name=nunki`

## Project structure

- `src/` — App shell, styles, routing
- `public/data/` — Static JSON (amenities, benefits)
- `public/sw.js` — Service Worker (cache-first shell and data)
- `scripts/` — Data fetchers (`fetch_vancouver.py`, `fetch_toronto.py`, `fetch_hamilton.py`, `fetch_benefits.py`), validation (`validate_crossref.py`), plus **tracked** submission merge/import helpers (`import_google_form_csv.py`, `apply_merged_to_public.py`, `contribution_merge.py`)
- `docs/` — [DATA_SOURCES](docs/DATA_SOURCES.md), [ACCURACY](docs/ACCURACY.md), [MAINTENANCE](docs/MAINTENANCE.md), [COMMUNITY_FORMS](docs/COMMUNITY_FORMS.md), [AGENT_CONTEXT](docs/AGENT_CONTEXT.md) (for AI coding agents)

**Not in git (by design):** `contributions/`, `tools/`, and optionally `docs/SUBMISSIONS_ARCHITECTURE.md` — see blockquote under [Community submissions](#community-submissions-google-forms) above.
