# Data pipeline: automatic fetch vs community layer

**Repo vs hidden:** The **community layer** reads from **`contributions/merged/`** on disk. That entire **`contributions/`** directory (and **`tools/`** for the optional review UI) is **gitignored** — other developers and CI do **not** get those folders from `git clone`. Only **`public/data/*.json`** (when committed) and the Python merge scripts in **`scripts/`** are shared. See **[COMMUNITY_FORMS.md](COMMUNITY_FORMS.md)** and the root **README** for the explicit “hidden submissions” callout.

## Two layers

| Layer | Where it lives | Role |
|-------|----------------|------|
| **Automatic** | `scripts/fetch_*.py` + APIs / curated lists in those files | Up-to-date open data and official lists. |
| **Community** | `contributions/merged/additions/*.json`, `contributions/merged/overrides/*.json` | New places you approved; field corrections that **override** the automatic row for a given `id`. |

`fetch-data` **rebuilds** `public/data/*.json` from scratch, then **applies** the community layer (same logic as `apply_merged_to_public.py`). Your merged JSON files are **never deleted** by fetch — they are **read** and merged in. You only “lose” work if you edit **`public/data/*.json` directly** without putting overrides in `contributions/merged/`.

## npm scripts

| Command | When to use |
|---------|-------------|
| **`npm run dev`** / **`npm run start-dev`** | Local dev. **Does not** run fetch — uses whatever is already in `public/data/`. |
| **`npm run start`** | Local production build: bump cache + `vite build`. **Does not** fetch. |
| **`npm run apply-merged`** | After changing **`contributions/merged/`** only. Updates `public/data/*.json` **without** calling external APIs. |
| **`npm run fetch-data`** | Refresh automatic data from the internet + merge community layer into `public/data/`. |
| **`npm run build:deploy`** | **CI / deploy:** fetch fresh automatic data, bump cache, build. Use this (or equivalent) on Cloudflare Pages so each release pulls upstream + applies submissions/overrides. |

## Overrides beat automatic data

For an existing amenity `id`, `merged/overrides/<city>.json` stores field patches. At merge time (during `fetch-data` or `apply-merged`), those patches are applied **after** the list is built from APIs/scripts, so a corrected address or hours **wins** over the raw fetch.

New rows come from `merged/additions/<city>.json` and are **appended**. If an `id` already exists and starts with **`contrib-`**, the row is **updated** from the additions file (so you can fix hours/phone without deleting the id). Other duplicate ids are still skipped with a warning.

## Committing to git

- The whole **`contributions/`** tree (pending, archive, merged, and any local README) is **not in this repo** — it’s maintainer-local. **`tools/`** (optional review UI) is also excluded. **Commit `public/data/*.json`** so the shipped snapshot and other developers match what you built after `apply-merged` / `fetch-data`.
- **CI / `build:deploy`:** This runs **`fetch-data`**, which **rewrites** `public/data/` from APIs/scripts, then merges **`contributions/merged/`** (missing on a fresh clone → treated as empty). So deploys get **upstream + empty community** unless you **change CI** to `npm run build` / `npm run start` so the site ships **committed** `public/data/*.json` without re-fetching, or you keep a local `contributions/merged/` on the build machine.
- **Optional:** run `fetch-data` only when upstream data changed or you’re cutting a release; day-to-day UI edits only need `apply-merged`.
