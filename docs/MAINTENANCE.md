# Maintenance — Manual Updates & Unscrapable Sources

Some data cannot be fetched automatically. This document lists what requires manual updates and how often to do it.

---

## Manual-Only Sources (No API / No Scraping)

| Source | What | Update frequency | How |
|--------|------|------------------|-----|
| **Toronto meals** | MEAL_PROGRAMS in `fetch_toronto.py` | Quarterly | Visit [tdin.ca/meals](https://tdin.ca/meals) or tdin.ca/meals_pdf.php. Compare with list. Add/remove/update entries. |
| **Vancouver safe consumption** | SAFE_CONSUMPTION_SITES in `fetch_vancouver.py` | Quarterly | Check [Vancouver Coastal Health OPS map](https://www.vch.ca/en/overdose-prevention-sites) or contact 604-687-7438. |
| **Toronto safe consumption** | SAFE_CONSUMPTION_SITES in `fetch_toronto.py` | Quarterly | Check [Toronto.ca supervised injection services](https://www.toronto.ca/community-people/health-wellness-care/health-programs-advice/supervised-injection-services/). |
| **Vancouver shelter addresses** | SHELTER_ADDRESSES in `fetch_vancouver.py` | When new shelters appear | Vancouver Open Data has no addresses. Add to lookup when new facility appears in API. Cross-check with [BC211 shelters](https://shelters.bc211.ca/map) or [BC Housing map](https://smap.bchousing.org). |
| **BC211** | Cross-reference only | Before rollout | No API. Use shelters.bc211.ca (updated 2× daily) for manual validation. PDF lists at bc.211.ca/shelter-lists. |
| **BC Housing** | Cross-reference only | Before rollout | No public API. Use smap.bchousing.org for manual validation. |
| **211 Ontario / 211 Central** | Cross-reference only | Before rollout | API requires auth (211HSIS). Use 211central.ca for manual search. |

---

## Why These Can't Be Automated

- **Toronto meals (TDIN):** Page is JavaScript-rendered; content loads client-side. Simple HTTP fetch returns empty. Would need headless browser (Puppeteer/Playwright) — heavy for a static build. TDIN PDF is human-readable; manual curation is more reliable.
- **BC211 / BC Housing / 211 Ontario:** No public API. Data is behind authenticated or interactive interfaces.
- **Safe consumption sites:** No open data feeds. Maintained by health authorities; small lists, infrequent changes.

---

## Recommended Schedule

| Task | Frequency |
|------|-----------|
| Run `npm run fetch-data` | Weekly or before rollout |
| Run `npm run validate-data` | Before each rollout |
| Update Toronto MEAL_PROGRAMS | Quarterly |
| Update safe consumption lists | Quarterly |
| Spot-check 3–5 random entries (call/visit) | Before rollout |
| Cross-check with BC211 (Vancouver) or 211 Central (Toronto) | Before rollout |

---

## Adding a New Manual Entry

### Toronto meal

Edit `scripts/fetch_toronto.py`, add to `MEAL_PROGRAMS`:

```python
{"name": "Organization Name", "address": "123 Street", "hours": "Mon-Fri 9am-5pm", "phone": "416-555-1234"},
```

Add to `MEAL_REGION_OVERRIDES` if not downtown.

### Vancouver shelter address

When Vancouver Open Data adds a new facility without an address, add to `SHELTER_ADDRESSES`:

```python
"Facility Name": "123 Street (Cross & Street)",
```

### Safe consumption site

Add to `SAFE_CONSUMPTION_SITES` in the relevant fetch script. Include name, address, hours, phone, lat/lng (optional).

### Shelter name alias (validation)

When `npm run validate-data` reports a false positive (same shelter, different name in NSPL), add both names to `SHELTER_NAME_ALIASES` in `scripts/validate_crossref.py`. Example:

```python
# In the city's set, add both the Nunki name and NSPL name (normalized to lowercase)
"our shelter name", "n spl official name",
```
