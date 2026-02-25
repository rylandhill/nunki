# Data Sources & Adding New Cities

This document describes all data sources used by Nunki and how to add support for new cities. The app is designed to be adopted by developers in other cities—this guide makes that process straightforward.

---

## Overview

The app uses **static JSON files** in `public/data/`. Data is fetched at build time by Python scripts in `scripts/`. No live database—everything is pre-compiled for fast, offline-first loading.

### Output Files

| File | Contents |
|------|----------|
| `vancouver.json` | All Vancouver amenities (shelters, meals, washrooms, safe consumption) |
| `toronto.json` | All Toronto amenities (shelters, meals, washrooms, safe consumption) |
| `benefits.json` | BC and Ontario foster youth benefits programs |

### Adding a New City

1. Create `scripts/fetch_<city>.py` (see templates below)
2. Output `public/data/<city>.json` with the schema in [Data Schema](#data-schema)
3. Add the city to `CITIES` in `src/main.js`
4. Add `python3 scripts/fetch_<city>.py` to the `fetch-data` script in `package.json`

---

## Data Schema

### City Amenities (`<city>.json`)

```json
{
  "meta": {
    "city": "vancouver",
    "updated": "2025-02-24"
  },
  "amenities": [
    {
      "id": "shelter-van-1",
      "type": "shelter",
      "name": "Union Gospel Mission",
      "address": "601 E Hastings St (Hastings & Princess)",
      "intersection": "Strathcona",
      "hours": "Call for hours",
      "phone": "604-253-3323",
      "lat": 49.281,
      "lng": -123.089,
      "notes": "Meals available",
      "category": "Men"
    }
  ]
}
```

**Amenity types:** `shelter`, `meal`, `washroom`, `safe_injection`, `transit_hub`

**Required fields:** `id`, `type`, `name`, `address` (or `intersection`), `phone` (can be empty), `lat`, `lng` (can be null)

**Optional:** `region` — used for area/neighbourhood grouping in the UI (e.g. Downtown, North York). Enables users to filter by area without scrolling through hundreds of items.

---

## Vancouver Data Sources

Vancouver uses **OpenDataSoft** (opendata.vancouver.ca / vancouver.opendatasoft.com). API base: `https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets`

**Important:** OpenDataSoft has a **max limit of 100** per request. Use pagination with `offset` for larger datasets.

### Shelters

- **Dataset:** `homeless-shelter-locations`
- **API:** `{BASE}/homeless-shelter-locations/records?limit=100`
- **Fields:** `facility`, `category`, `phone`, `meals`, `pets`, `carts`, `geo_local_area`, `geo_point_2d`
- **Note:** Addresses are not in the API; we use a manual lookup table (`SHELTER_ADDRESSES`) in the script
- **Portal:** https://opendata.vancouver.ca/explore/dataset/homeless-shelter-locations/

### Meals

- **Dataset:** `free-and-low-cost-food-programs`
- **API:** `{BASE}/free-and-low-cost-food-programs/records?limit=100`
- **Filter:** `provides_meals == "True"` and `program_status == "Open"`
- **Fields:** `program_name`, `location_address`, `local_areas`, `description`, `meal_cost`, `latitude`, `longitude`, `signup_phone_number`
- **Portal:** https://opendata.vancouver.ca/explore/dataset/free-and-low-cost-food-programs/

### Washrooms

- **Dataset:** `public-washrooms`
- **API:** `{BASE}/public-washrooms/records?limit=100&offset={offset}` (paginate—146 total)
- **Fields:** `park_name`, `location`, `geo_local_area`, `summer_hours`, `winter_hours`, `wheelchair_access`, `geo_point_2d`
- **Portal:** https://opendata.vancouver.ca/explore/dataset/public-washrooms/

### Safe Consumption Sites

- **Source:** No open data API. Manually maintained list in `fetch_vancouver.py` (`SAFE_CONSUMPTION_SITES`)
- **Reference:** Vancouver Coastal Health OPS map

---

## Toronto Data Sources

Toronto uses **CKAN** (open.toronto.ca). API base: `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action`

### Shelters

- **Dataset:** `daily-shelter-overnight-service-occupancy-capacity`
- **Resource ID:** `42714176-4f05-44e6-b157-2b57f29b856a` (current year data)
- **API:** `datastore_search?resource_id={id}&limit=100&offset={offset}`
- **Key fields:** `LOCATION_NAME`, `LOCATION_ADDRESS`, `LOCATION_CITY`, `SECTOR`, `PROGRAM_NAME`
- **Note:** Toronto uses Central Intake (416-338-4766 / 1-877-338-3398) for shelter access—individual shelter phones may not be public
- **Portal:** https://open.toronto.ca/dataset/daily-shelter-overnight-service-occupancy-capacity/

### Washrooms

- **Dataset:** `washroom-facilities` (Park Washroom Facilities)
- **Resource ID:** `1c7d1063-2562-4de3-8cd3-4cef48419f6f`
- **API:** `datastore_search?resource_id={id}&limit=100&offset={offset}`
- **Fields:** `location`, `alternative_name`, `address`, `hours`, `geometry` (lat/lng), `Status` (0=closed, 1=open, 2=service alert)
- **Refresh:** Daily. ~354 records (parks, community centres, pool buildings, etc.)
- **Portal:** https://open.toronto.ca/dataset/washroom-facilities/

### Meals

- **Source:** [Toronto Drop-In Network](https://tdin.ca/meals) (tdin.ca)—drop-ins, churches, community centres.
- **No API.** The meals page is JavaScript-rendered (content loads client-side), so simple HTTP scraping does not work. Data is manually curated from tdin.ca/meals or meals_pdf.php. Update `MEAL_PROGRAMS` in `fetch_toronto.py` when the list changes.

### Safe Consumption

- **Source:** 4 sites (Fred Victor, Parkdale Queen West CHC, Street Health, Casey House). Manually maintained from [Toronto.ca supervised injection services](https://www.toronto.ca/community-people/health-wellness-care/health-programs-advice/supervised-injection-services/).

---

## Foster Youth Benefits

Benefits are **curated** in `scripts/fetch_benefits.py`. Data is written to `benefits.json`. No scraping yet—content is manually maintained from official sources.

### British Columbia

| Program | Source URL | Notes |
|---------|------------|-------|
| SAJE | https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/youth-transitions | Replaced AYA (Apr 2024) |
| Aging out overview | https://www2.gov.bc.ca/gov/content/family-social-supports/youth-and-family-services/teens-in-foster-care/aging-out-of-care | |
| Youth Educational Assistance Fund | https://studentaidbc.ca/explore/grants-scholarships/youth-educational-assistance-fund-former-youth-care | |
| AgedOut.com | https://agedout.com/ | General resource |

### Ontario

| Program | Source URL | Notes |
|---------|------------|-------|
| Aftercare Benefits Initiative (ABI) | https://www.ontario.ca/document/mccss-service-objectives-child-welfare-and-protection/services-delivered-aftercare | Health/dental 21–25 |
| Ready, Set, Go | Child welfare policy directives on ontario.ca | |
| OSAP / Living and Learning Grant | https://www.ontario.ca/page/ontario-student-assistance-program-osap | |

### Adding a New Province

Edit `scripts/fetch_benefits.py`. Add a new key (e.g. `"ab"` for Alberta) to `BENEFITS` with `province` and `programs` array. Each program: `name`, `age`, `what`, `phone`, `link`.

---

## Transit

- **Vancouver (TransLink):** Text bus stop number to **33333** for real-time arrivals
- **Toronto (TTC):** Text stop number to **898882** (TXTTTC) for real-time arrivals

These are documented in the app UI, not fetched as data.

### Future: Nearby Bus/Train Lines per Landmark

To show nearby transit stops/routes on each amenity detail (e.g. "Bus 4, 7, 84; Canada Line"):

| City | Data Source | Notes |
|------|-------------|-------|
| **Vancouver** | [TransLink GTFS](https://developer.translink.ca/about-us/doing-business-with-translink/app-developer-resources/gtfs) | Requires API registration. Static GTFS has stops + routes. At fetch time: for each amenity with lat/lng, find stops within ~500m, extract route names. |
| **Toronto** | [TTC GTFS](https://open.toronto.ca/dataset/ttc-bustime-real-time-next-vehicle-arrival-nvas/) or [MyTTC near API](https://myttc.ca/near/43.65,-79.38.json) | MyTTC `near/{lat},{lng}.json` returns nearby stops (no API key, undocumented). Could call at runtime or pre-compute at fetch. |
| **Both** | [Transitland REST API](https://www.transit.land/documentation/rest-api/stops) | `GET /stops?lat={lat}&lon={lng}&r=500` returns stops within radius. Requires Transitland API key. |

**Implementation options:**
1. **Pre-compute at fetch:** Download GTFS, for each amenity with lat/lng find stops within 500m, add `nearby_routes: ["4", "7", "84"]` to JSON. No runtime API calls.
2. **Runtime:** Call MyTTC (Toronto) or Transitland when user opens amenity detail. Requires network; adds latency.
3. **Hybrid:** Pre-compute for Vancouver/Toronto at build time; keep data in amenity JSON. Offline-friendly.

---

## API Limits & Pagination

| Platform | Max limit per request | Pagination |
|----------|----------------------|------------|
| Vancouver OpenDataSoft | 100 | `offset` parameter |
| Toronto CKAN datastore | 100 (default) | `offset` parameter |

---

## Template: Add a New City (OpenDataSoft)

If your city uses OpenDataSoft (common for Canadian cities):

```python
BASE = "https://yourcity.opendatasoft.com/api/explore/v2.1/catalog/datasets"

def fetch_shelters():
    url = f"{BASE}/homeless-shelters/records?limit=100"  # adjust dataset name
    data = fetch_json(url)
    # Map to amenity schema...
```

---

## Template: Add a New City (CKAN)

If your city uses CKAN:

1. Find the dataset on the open data portal
2. Get the resource ID from the API: `package_show?id=<dataset-name>`
3. Use `datastore_search?resource_id=<id>&limit=100&offset=0`

```python
CKAN = "https://yourcity.ca/api/3/action"
RESOURCE_ID = "..."  # from package_show

def fetch_shelters():
    url = f"{CKAN}/datastore_search?resource_id={RESOURCE_ID}&limit=100&offset=0"
    data = fetch_json(url)
    records = data["result"]["records"]
    # Map to amenity schema...
```

---

## Dependencies

- `requests` (optional; we use `urllib` in scripts)
- Python 3.8+

---

## License

Data from these sources may have their own licenses (e.g. Open Government License). Check each portal. Attribution may be required.
