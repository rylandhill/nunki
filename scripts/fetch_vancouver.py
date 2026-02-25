#!/usr/bin/env python3
"""
Fetch Vancouver amenities from Open Data and output JSON for Nunki.
Run from project root: python scripts/fetch_vancouver.py
"""

import json
import os
import re
import urllib.request
from datetime import date
from pathlib import Path

# Vancouver OpenDataSoft base URL
BASE = "https://vancouver.opendatasoft.com/api/explore/v2.1/catalog/datasets"

# Known addresses/intersections for Vancouver shelters (Open Data doesn't include them)
SHELTER_ADDRESSES = {
    "Union Gospel Mission": "601 E Hastings St (Hastings & Princess)",
    "Belkin House": "555 Homer St",
    "Catholic Charities Men's Hostel": "828 Cambie St",
    "First United Church": "320 E Hastings St (Hastings & Gore)",
    "The Haven": "616 Powell St",
    "Anchor of Hope": "616 Powell St (Powell & Gore)",
    "The Beacon": "616 Powell St (Powell & Gore)",
    "Dusk to Dawn-Directions Youth Centre": "1138 Richards St",
    "Crosswalk": "749 E Hastings St",
    "Lookout Downtown": "54 W Hastings St",
    "First Baptist Church": "969 Burrard St",
    "Vineyard Church": "1801 E 1st Ave",
    "Triage": "620 Powell St",
    "Grandview Calvary Baptist Church": "1803 E 1st Ave",
    "Tenth Avenue Church": "11 W 10th Ave (10th & Ontario)",
    "Yukon Shelter": "1300 Yukon St",
    "Aboriginal Shelter": "385 E 2nd Ave (2nd & Quebec)",
}

# Map Vancouver local areas to our region IDs
REGION_MAP = {
    "Downtown": "downtown",
    "Strathcona": "downtown",  # East side, near downtown
    "West End": "downtown",
    "Mount Pleasant": "mount-pleasant",
    "Grandview-Woodland": "east-van",
    "Kitsilano": "kitsilano",
    "Fairview": "fairview",
    "Renfrew-Collingwood": "east-van",
    "Kensington-Cedar Cottage": "east-van",
    "Hastings-Sunrise": "east-van",
    "Riley Park": "mount-pleasant",
    "Marpole": "south-van",
    "Kerrisdale": "south-van",
    "Dunbar-Southlands": "south-van",
    "Oakridge": "south-van",
    "Sunset": "south-van",
    "Victoria-Fraserview": "south-van",
    "Killarney": "south-van",
    "Shaughnessy": "south-van",
    "West Point Grey": "west-point-grey",  # Vancouver neighbourhood (not West Vancouver municipality)
    "Arbutus Ridge": "kitsilano",
    "Arbutus-Ridge": "kitsilano",  # API sometimes returns hyphenated
    "South Cambie": "fairview",
}

# Parks/locations the API mislabels. Key = substring of park_name (case-insensitive).
PARK_REGION_OVERRIDES = {
    "jericho beach": "kitsilano",  # API labels as West Point Grey; actually Kitsilano
}


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.loads(r.read().decode())


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def fetch_shelters() -> list[dict]:
    url = f"{BASE}/homeless-shelter-locations/records?limit=100"
    data = fetch_json(url)
    amenities = []
    for i, r in enumerate(data.get("results", [])):
        pt = r.get("geo_point_2d") or {}
        lat, lng = pt.get("lat"), pt.get("lon")
        area = r.get("geo_local_area") or "Unknown"
        region = REGION_MAP.get(area, slugify(area)) or "downtown"
        notes = []
        if r.get("meals") == "yes":
            notes.append("Meals available")
        if r.get("pets") == "yes":
            notes.append("Pets allowed")
        if r.get("carts") == "yes":
            notes.append("Carts allowed")
        facility_name = r.get("facility", "Unknown")
        address_or_cross = SHELTER_ADDRESSES.get(facility_name) or f"Near {area}"
        amenities.append({
            "id": f"shelter-van-{i+1}",
            "type": "shelter",
            "name": facility_name,
            "address": address_or_cross,
            "intersection": area,
            "region": region,
            "hours": "Call for hours",
            "phone": r.get("phone", ""),
            "lat": lat,
            "lng": lng,
            "notes": "; ".join(notes) if notes else "",
            "category": r.get("category", ""),
        })
    return amenities


def fetch_washrooms() -> list[dict]:
    # OpenDataSoft API max limit is 100; paginate to get all
    amenities = []
    offset = 0
    limit = 100
    while True:
        try:
            url = f"{BASE}/public-washrooms/records?limit={limit}&offset={offset}"
            data = fetch_json(url)
        except Exception:
            break
        results = data.get("results", [])
        if not results:
            break
        for r in results:
            pt = r.get("geo_point_2d") or {}
            lat, lng = pt.get("lat"), pt.get("lon")
            area = r.get("geo_local_area") or ""
            park_name = r.get("park_name", "") or ""
            name = f"{park_name} — {r.get('location', 'washroom')}"
            hours = r.get("summer_hours") or r.get("winter_hours") or "Dawn to dusk"
            notes = []
            if r.get("wheelchair_access") == "Yes":
                notes.append("Wheelchair accessible")
            address = r.get("location", "")
            if area and address:
                address = f"{address}, {area}"
            elif area:
                address = f"Near {area}"
            # Check park overrides first (API sometimes mislabels)
            region = None
            park_lower = park_name.lower()
            for key, val in PARK_REGION_OVERRIDES.items():
                if key in park_lower:
                    region = val
                    break
            if region is None:
                region = REGION_MAP.get(area, slugify(area)) or "downtown"
            amenities.append({
                "id": f"washroom-van-{len(amenities)+1}",
                "type": "washroom",
                "name": name,
                "address": address,
                "intersection": area,
                "region": region,
                "hours": hours,
                "phone": "",
                "lat": lat,
                "lng": lng,
                "notes": "; ".join(notes) if notes else "",
            })
        if len(results) < limit:
            break
        offset += limit
    return amenities


# Vancouver approximate bounds (lat/lng) for sanity checks
VANCOUVER_BOUNDS = {"lat_min": 49.15, "lat_max": 49.35, "lng_min": -123.35, "lng_max": -123.0}


def fetch_meals() -> list[dict]:
    """Free and low-cost meal programs from Vancouver Open Data."""
    try:
        url = f"{BASE}/free-and-low-cost-food-programs/records?limit=100"
        data = fetch_json(url)
    except Exception:
        return []
    amenities = []
    for i, r in enumerate(data.get("results", [])):
        if r.get("program_status") != "Open":
            continue
        if r.get("provides_meals") != "True":
            continue
        geom = r.get("geom") or {}
        lat = r.get("latitude") or geom.get("lat")
        lng = r.get("longitude") or geom.get("lon")
        # Sanity check: API sometimes returns wrong coords (e.g. Prince George for Vancouver programs)
        if lat is not None and lng is not None:
            if not (VANCOUVER_BOUNDS["lat_min"] <= lat <= VANCOUVER_BOUNDS["lat_max"] and VANCOUVER_BOUNDS["lng_min"] <= lng <= VANCOUVER_BOUNDS["lng_max"]):
                lat, lng = None, None
        addr = r.get("location_address") or ""
        area = r.get("local_areas") or ""
        desc = (r.get("description") or "")[:200]
        cost = r.get("meal_cost") or "Free"
        notes = []
        if r.get("wheelchair_accessible") == "Yes":
            notes.append("Wheelchair accessible")
        if r.get("takeout_available") == "Yes":
            notes.append("Takeout available")
        region = REGION_MAP.get(area, slugify(area)) or "downtown" if area else "downtown"
        amenities.append({
            "id": f"meal-van-{i+1}",
            "type": "meal",
            "name": r.get("program_name", "Meal program"),
            "address": addr or f"Near {area}" if area else "",
            "intersection": area,
            "region": region,
            "hours": desc.split(".")[0] if desc else "Call for hours",
            "phone": r.get("signup_phone_number") or "",
            "lat": lat,
            "lng": lng,
            "notes": f"{cost}. " + ("; ".join(notes) if notes else ""),
        })
    return amenities


# Safe consumption/overdose prevention sites (no open data API; manually maintained)
SAFE_CONSUMPTION_SITES = [
    {"name": "Insite", "address": "139 E Hastings St", "hours": "9am–2am daily", "phone": "604-687-7438", "lat": 49.281, "lng": -123.087},
    {"name": "Molson Overdose Prevention Site", "address": "166 E Hastings St", "hours": "7am–10:30pm daily", "phone": "604-687-7438", "lat": 49.281, "lng": -123.086},
    {"name": "Thomas Donaghy OPS", "address": "380 E Cordova St", "hours": "Varies", "phone": "604-687-7438", "lat": 49.282, "lng": -123.098},
    {"name": "Powell Street Getaway", "address": "528 Powell St", "hours": "Varies", "phone": "604-687-7438", "lat": 49.283, "lng": -123.095},
]


def get_safe_consumption_sites() -> list[dict]:
    return [
        {
            "id": f"safe-van-{i+1}",
            "type": "safe_injection",
            "name": s["name"],
            "address": s["address"],
            "intersection": "Downtown",
            "region": "downtown",
            "hours": s["hours"],
            "phone": s["phone"],
            "lat": s["lat"],
            "lng": s["lng"],
            "notes": "Supervised consumption. Drug checking available at some sites.",
        }
        for i, s in enumerate(SAFE_CONSUMPTION_SITES)
    ]


def main():
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    today = date.today().isoformat()

    shelters = fetch_shelters()
    washrooms = fetch_washrooms()
    meals = fetch_meals()
    safe_sites = get_safe_consumption_sites()
    all_amenities = shelters + washrooms + meals + safe_sites

    # Enrich with nearby transit routes (adds ~3–8 route names per amenity with coords)
    try:
        from gtfs_nearby import enrich_amenities_with_transit
        enrich_amenities_with_transit(
            all_amenities,
            "https://gtfs-static.translink.ca/gtfs/google_transit.zip",
            cache_dir=root / "scripts" / ".gtfs_cache",
        )
    except Exception as e:
        print(f"Transit enrichment skipped: {e}")

    # Group by region (use each amenity's region field; don't recalculate from lat/lng)
    by_region: dict[str, list] = {}
    for a in all_amenities:
        region = a.get("region") or "downtown"
        if region not in by_region:
            by_region[region] = []
        by_region[region].append(a)

    # Ensure all have region; build regions list for UI (exclude empty)
    for a in all_amenities:
        if not a.get("region"):
            a["region"] = "downtown"
    regions = [
        {"id": r, "name": r.replace("-", " ").title()}
        for r in sorted({a["region"] for a in all_amenities if a.get("region")})
    ]

    # Single city file: all amenities always available
    city_data = {
        "meta": {"city": "vancouver", "updated": today, "regions": regions},
        "amenities": all_amenities,
    }
    (out_dir / "vancouver.json").write_text(json.dumps(city_data, indent=2))

    # Region files for future map-tile downloads only (kept for SW caching by region if needed)
    regions_config = []
    for region_id, amenities in sorted(by_region.items()):
        region_name = region_id.replace("-", " ").title()
        filename = f"vancouver-{region_id}.json"
        out = {
            "meta": {"city": "vancouver", "region": region_id, "updated": today},
            "amenities": amenities,
        }
        (out_dir / filename).write_text(json.dumps(out, indent=2))
        regions_config.append({"id": region_id, "name": region_name})

    # Index (regions for map download only; data comes from vancouver.json)
    index = {
        "city": "vancouver",
        "dataFile": "vancouver.json",
        "mapRegions": regions_config,
        "updated": today,
    }
    (out_dir / "vancouver-index.json").write_text(json.dumps(index, indent=2))

    print(f"Wrote vancouver.json + {len(regions_config)} region files. Total amenities: {len(all_amenities)}")


if __name__ == "__main__":
    main()
