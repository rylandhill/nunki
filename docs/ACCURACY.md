# Data Accuracy & Cross-Reference

This document describes Nunki's accuracy strategy, cross-reference sources, and how to validate data before rollout to centres.

---

## Why Accuracy Matters

People using Nunki may be in crisis. Outdated or wrong information (closed shelters, wrong addresses, wrong hours) can waste time, erode trust, and put people at risk. **Accuracy is the top priority.**

---

## Current Data Gaps & Risks

| Source | Risk | Mitigation |
|--------|------|------------|
| **Vancouver shelters** | Addresses from manual lookup (`SHELTER_ADDRESSES`); Open Data has no addresses | Cross-reference with NSPL, BC211; verify with BC Housing |
| **Vancouver meals** | API sometimes returns wrong coords (e.g. Prince George); `program_status` may lag | Bounds check (already in place); cross-reference with foodpolicy@vancouver.ca |
| **Toronto shelters** | No lat/lng from API; Central Intake only | NSPL cross-reference; consider geocoding addresses |
| **Toronto meals** | Fully manual from TDIN; no API | Cross-reference with 211 Central; update from tdin.ca/meals PDF regularly |
| **Safe consumption** | Manually maintained; hours change | Verify quarterly with Vancouver Coastal Health / Toronto Public Health |

---

## Cross-Reference Resources

### Federal: National Service Provider List (NSPL)

- **URL:** https://open.canada.ca/data/en/dataset/7e0189e3-8595-4e62-a4e9-4fed6f265e10
- **Publisher:** Housing, Infrastructure and Communities Canada (HICC)
- **Contents:** Emergency and transitional shelters with permanent beds across Canada
- **Format:** CSV (2016–2019), XLSX (2020+). Latest: 2024.
- **Update:** Annual
- **Use:** Validate shelter names exist; find shelters we may be missing; cross-check city coverage

**Download 2024 (XLSX):**  
https://open.canada.ca/data/dataset/7e0189e3-8595-4e62-a4e9-4fed6f265e10/resource/bfbc387f-ac55-4bf6-8656-5a14078386be/download/nspl2024_opengov_list_jun12.xlsx

**Download 2019 (CSV, no deps):**  
https://open.canada.ca/data/dataset/7e0189e3-8595-4e62-a4e9-4fed6f265e10/resource/034882c4-60e0-4259-8a13-bcf9c0a93391/download/final_chpdopendatanspl_dataset-2019_june7_2020.csv

---

### Vancouver / BC

| Resource | URL | Use |
|----------|-----|-----|
| **BC211 Shelters** | https://shelters.bc211.ca/map | Updated twice daily (11:30am, 7:30pm). Filter by city, gender, age. PDF lists at bc.211.ca/shelter-lists. **Manual cross-check** — no API. |
| **BC Housing Shelter Map** | https://smap.bchousing.org | 169 shelters across BC. Updated weekday business hours. Year-round, temporary, EWR. **Manual cross-check** — no public API. |
| **Vancouver Open Data** | opendata.vancouver.ca | Primary source. Shelters, meals, washrooms. |
| **Vancouver food data corrections** | foodpolicy@vancouver.ca | Report meal program inaccuracies |
| **Downtown Eastside winter shelters** | downtowneastside.org | Winter shelter list; cross-check seasonal additions |

---

### Toronto / Ontario

| Resource | URL | Use |
|----------|-----|-----|
| **211 Central (Ontario)** | https://211central.ca | Community services database. Search "Community meals" or "Shelters". **Manual cross-check** — API requires auth (211HSIS). |
| **Toronto Drop-In Network (TDIN)** | https://tdin.ca/meals | Primary meal source. PDF at tdin.ca/meals. Update `MEAL_PROGRAMS` in fetch_toronto.py when list changes. |
| **Toronto Open Data** | open.toronto.ca | Shelters (CKAN), washrooms (CKAN). |
| **Toronto Central Intake** | 416-338-4766 / 1-877-338-3398 | Shelter access; individual shelter phones may not be public |

---

## Validation Workflow

### Before Each Rollout

1. **Run fetch-data:** `npm run fetch-data`
2. **Run validation:** `npm run validate-data`
3. **Review report:** Check for missing shelters, name mismatches, stale data
4. **Manual spot-check:** Pick 3–5 random entries, call or visit to verify

### Cross-Reference Script

`scripts/validate_crossref.py` downloads the NSPL (federal shelter list) and compares shelter names with Nunki's data. It reports:

- **In Nunki but not in NSPL** — May be new, seasonal, or naming difference. Review "closest" matches.
- **In NSPL but not in Nunki** — Candidates to add. Cross-check with city open data before adding.

**Run:** `npm run validate-data` or `python3 scripts/validate_crossref.py`

**Name matching:** The script uses `SHELTER_NAME_ALIASES` in `validate_crossref.py` to treat known name variants as the same shelter (e.g. "Aboriginal Shelter" ↔ "Aboriginal Central Street Shelter", "Na-Me-Res" ↔ "Na-Me-Res (Native Men's Residence)"). When you discover new alias pairs, add them to reduce false positives.

**NSPL version:** Uses NSPL 2019 CSV by default (no extra deps). With `openpyxl` installed (`pip install -r scripts/requirements.txt`), uses NSPL 2024 for latest data.

---

## Reporting Inaccuracies

| Data Type | Contact |
|-----------|---------|
| Vancouver meals | foodpolicy@vancouver.ca |
| Vancouver shelters | Open Data Portal feedback or BC Housing |
| Toronto meals | Update MEAL_PROGRAMS in fetch_toronto.py; source: tdin.ca |
| Toronto shelters | Toronto Open Data or Central Intake |
| Nunki app bugs | Open an issue or contact maintainer |

---

## Adding New Cities

When expanding to new cities:

1. **Identify primary sources** — city open data, provincial 211, NSPL
2. **Cross-reference** — NSPL has national coverage; use it to validate
3. **Document contacts** — who to email for corrections
4. **Extend validation** — add the new city to `validate_crossref.py` (in `load_nunki_shelters` and `nspl_shelters_by_city`), and add `SHELTER_NAME_ALIASES` entries as you discover name variants

---

## Related

- [DATA_SOURCES.md](DATA_SOURCES.md) — Data sources, schemas, fetch scripts
- [MAINTENANCE.md](MAINTENANCE.md) — Manual-only sources, update schedule
- [personal_docs/explanation-for-non-technical.md](../personal_docs/explanation-for-non-technical.md) — How to explain Nunki to centres
