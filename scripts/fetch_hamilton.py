#!/usr/bin/env python3
"""
Fetch Hamilton amenities for Nunki.

Primary source: City of Hamilton — Emergency Shelters & Drop-ins
https://www.hamilton.ca/people-programs/housing-shelter/preventing-ending-homelessness/emergency-shelters-drop-ins

Open Hamilton (open.hamilton.ca) shelter-beds and Hub bulk GeoJSON/CSV exports often return 403.
Park washrooms are loaded from the public **Park_Washrooms** FeatureServer REST `query` API (~70+ sites).
Shelters/meals remain curated from the city HTML page. Re-verify quarterly — see docs/MAINTENANCE.md.

Run from project root: python3 scripts/fetch_hamilton.py
"""

import json
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

# Open Hamilton — park washrooms (REST query works; Hub GeoJSON/CSV often 403).
# Layer metadata: docs/DATA_SOURCES.md
PARK_WASHROOMS_ARCGIS = (
    "https://services.arcgis.com/rYz782eMbySr2srL/arcgis/rest/services/"
    "Park_Washrooms/FeatureServer/46/query"
)

# Coordinated access / shelter system (Hamilton)
SHELTER_ACCESS_NOTE = "Coordinated access: call 1-844-777-1924 (CMHA Hamilton) or each site directly."

# --- Emergency shelters (official city page, April 2025) ---
SHELTERS = [
    {"name": "Good Shepherd Mary's Place", "address": "20 Pearl St N", "phone": "905-523-6277", "category": "Women & gender diverse", "region": "downtown"},
    {"name": "Good Shepherd West Avenue Shelter", "address": "46 West Ave S", "phone": "905-528-5877 ext.4331", "category": "Women & gender diverse", "region": "downtown"},
    {"name": "Mission Services Emma's Place", "address": "196 Wentworth St N", "phone": "905-528-5100 ext.1200", "category": "Women & gender diverse", "region": "east-end"},
    {"name": "Womankind Emergency Shelter", "address": "431 Whitney Ave", "phone": "905-545-9100", "category": "Women & gender diverse", "region": "mountain"},
    {"name": "YWCA Hamilton 24/7 Shelter", "address": "75 MacNab St S", "phone": "365-384-3406", "category": "Women & gender diverse", "region": "downtown"},
    {"name": "Good Shepherd Cathedral", "address": "378 Main St E", "phone": "905-528-5877 ext.2051", "category": "Men & gender diverse", "region": "downtown"},
    {"name": "Good Shepherd Men's Centre", "address": "135 Mary St", "phone": "905-528-9109", "category": "Men & gender diverse", "region": "downtown"},
    {"name": "Mission Services Men's Shelter", "address": "400 King St E", "phone": "905-528-7635", "category": "Men & gender diverse", "region": "downtown"},
    {"name": "Salvation Army Booth Centre", "address": "94 York Blvd", "phone": "905-527-1444", "category": "Men & gender diverse", "region": "downtown"},
    {"name": "Good Shepherd Notre Dame House", "address": "14 Cannon St W", "phone": "905-308-8090", "category": "Youth", "region": "downtown"},
    {"name": "Good Shepherd Family Centre", "address": "143 Wentworth St S", "phone": "905-528-9442", "category": "Families", "region": "east-end"},
    {"name": "Good Shepherd Martha House (VAW)", "address": "25 Ray St N", "phone": "905-523-6277", "category": "VAW shelter", "region": "downtown"},
    {"name": "Interval House of Hamilton (VAW)", "address": "630 Sanatorium Rd", "phone": "905-387-8881", "category": "VAW shelter", "region": "mountain"},
    {"name": "Mission Services Inasmuch House (VAW)", "address": "Call for location", "phone": "905-529-8600", "category": "VAW shelter", "region": "hamilton"},
    {"name": "Native Women's Centre", "address": "1900 King St E", "phone": "905-664-1114", "category": "VAW shelter", "region": "east-end"},
]

# Drop-ins with food / meals (city page + common community meals)
MEALS = [
    {"name": "Cathedral Café (drop-in & meals)", "address": "252 James St N", "hours": "Mon–Sat 9am–4pm", "phone": "905-523-5546 ext.232"},
    {"name": "Hamilton Regional Indian Centre (drop-in)", "address": "407 King St W", "hours": "Mon–Fri 8:30am–6:30pm", "phone": ""},
    {"name": "Living Rock Ministries (youth drop-in)", "address": "30 Wilson St", "hours": "Mon–Fri 8am–8pm; Sat–Sun 1pm–8pm", "phone": "905-528-7625"},
    {"name": "Mission Services Willow's Place (women & gender diverse)", "address": "196 Wentworth St N", "hours": "Daily 9am–9pm", "phone": "905-528-5100 ext.1200"},
    {"name": "YWCA Carole Anne's Place (CAP)", "address": "75 MacNab St S", "hours": "Daily 10pm–1pm", "phone": "905-517-9326"},
    {"name": "Good Shepherd Men's Centre (hot meal program)", "address": "135 Mary St", "hours": "Mon–Fri 3:30–4:45pm; Sat 11:30am–12:30pm", "phone": "905-528-9109"},
    {"name": "Salvation Army Booth Centre (meals)", "address": "94 York Blvd", "hours": "Call for meal times", "phone": "905-527-1444"},
    {"name": "Hamilton Food Share (network)", "address": "Office: 339 Barton St E", "hours": "Referral to member agencies", "phone": "905-523-9673"},
    {"name": "Mission Services Community Meal Centre", "address": "196 Wentworth St N", "hours": "Call Mission Services", "phone": "905-528-5100"},
]

# Fallback if ArcGIS query fails (network / API change). Prefer live FeatureServer — see fetch_park_washrooms_from_arcgis().
WASHROOMS_FALLBACK = [
    {"name": "Bayfront Park — washroom", "address": "200 Harbour Front Dr", "hours": "Seasonal; check City of Hamilton", "notes": "Wheelchair accessible"},
    {"name": "Gage Park — washroom", "address": "1000 Main St E", "hours": "Seasonal; check City of Hamilton", "notes": ""},
    {"name": "Pier 4 Park — washroom", "address": "64 Leander Dr", "hours": "Seasonal", "notes": ""},
    {"name": "Dundurn Castle — park washroom", "address": "610 York Blvd", "hours": "Seasonal", "notes": ""},
    {"name": "Sam Lawrence Park — washroom", "address": "Upper James access", "hours": "Seasonal", "notes": ""},
    {"name": "Westdale Park — washroom", "address": "699 Paisley Ave S", "hours": "Seasonal", "notes": ""},
    {"name": "Eastwood Park — washroom", "address": "111 Eastwood Park Dr", "hours": "Seasonal", "notes": ""},
    {"name": "Victoria Park — washroom", "address": "King St E at Victoria", "hours": "Seasonal", "notes": ""},
]

# Harm reduction / supervised consumption — verify with Public Health (policy changes)
SAFE_CONSUMPTION = [
    {
        "name": "Street Health — harm reduction & OPS (verify location)",
        "address": "Multiple clinic sites; see hamilton.ca Street Health",
        "hours": "Varies by site — call",
        "phone": "905-546-4276",
        "notes": "Overdose prevention, naloxone, consumption services. Policy and sites change — verify at hamilton.ca/public-health.",
    },
]

# Approximate coords for map / directions (centre of city block)
ADDR_COORDS = {
    "20 Pearl St N": (43.2647, -79.8681),
    "46 West Ave S": (43.2478, -79.8612),
    "196 Wentworth St N": (43.2562, -79.8534),
    "431 Whitney Ave": (43.2221, -79.8772),
    "75 MacNab St S": (43.2545, -79.8714),
    "378 Main St E": (43.2535, -79.8618),
    "135 Mary St": (43.2568, -79.8689),
    "400 King St E": (43.2528, -79.8588),
    "94 York Blvd": (43.2597, -79.8731),
    "14 Cannon St W": (43.2593, -79.8725),
    "143 Wentworth St S": (43.2495, -79.8542),
    "25 Ray St N": (43.2651, -79.8675),
    "630 Sanatorium Rd": (43.2412, -79.9278),
    "1900 King St E": (43.2321, -79.8085),
    "252 James St N": (43.2635, -79.8678),
    "407 King St W": (43.2598, -79.8812),
    "30 Wilson St": (43.2578, -79.8695),
    "339 Barton St E": (43.2605, -79.8520),
    "200 Harbour Front Dr": (43.2742, -79.8645),
    "1000 Main St E": (43.2415, -79.8438),
    "64 Leander Dr": (43.2755, -79.8620),
    "610 York Blvd": (43.2684, -79.8844),
    "699 Paisley Ave S": (43.2579, -79.9012),
    "111 Eastwood Park Dr": (43.2289, -79.7610),
    "King St E at Victoria": (43.2530, -79.8670),
}


def lat_lng_for_address(addr: str) -> tuple[float | None, float | None]:
    for key, ll in ADDR_COORDS.items():
        if key.split("(")[0].strip() in addr or addr.startswith(key[:12]):
            return ll
    return None, None


def build_shelters() -> list[dict]:
    out = []
    for i, s in enumerate(SHELTERS):
        lat, lng = lat_lng_for_address(s["address"])
        out.append({
            "id": f"shelter-ham-{i+1}",
            "type": "shelter",
            "name": s["name"],
            "address": s["address"],
            "intersection": "Hamilton",
            "region": s["region"],
            "hours": "Call for hours and eligibility",
            "phone": s["phone"],
            "lat": lat,
            "lng": lng,
            "notes": f"{s['category']}. {SHELTER_ACCESS_NOTE}",
            "category": s["category"],
        })
    return out


def build_meals() -> list[dict]:
    out = []
    region_map = {
        "252 James St N": "downtown",
        "407 King St W": "west-end",
        "30 Wilson St": "downtown",
        "196 Wentworth St N": "east-end",
        "75 MacNab St S": "downtown",
        "135 Mary St": "downtown",
        "94 York Blvd": "downtown",
        "339 Barton St E": "east-end",
    }
    for i, m in enumerate(MEALS):
        lat, lng = lat_lng_for_address(m["address"])
        region = "downtown"
        for k, r in region_map.items():
            if k in m["address"]:
                region = r
                break
        out.append({
            "id": f"meal-ham-{i+1}",
            "type": "meal",
            "name": m["name"],
            "address": m["address"],
            "intersection": "Hamilton",
            "region": region,
            "hours": m["hours"],
            "phone": m["phone"],
            "lat": lat,
            "lng": lng,
            "notes": "Call for current hours. Source: hamilton.ca emergency shelters & drop-ins page.",
        })
    return out


def fetch_park_washrooms_from_arcgis() -> list[dict] | None:
    """Return washroom amenity dicts from City FeatureServer, or None on failure."""
    params = urllib.parse.urlencode({
        "where": "1=1",
        "outFields": "OBJECTID,LOCATION,PARK_ADDRESS,WARD,WASHROOM_TYPE,AODA_ACCESSIBILITY,CATEGORY",
        "returnGeometry": "true",
        "outSR": "4326",
        "f": "json",
        "resultRecordCount": "2000",
    })
    url = f"{PARK_WASHROOMS_ARCGIS}?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "nunki-fetch-hamilton/1.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode())
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, TimeoutError) as e:
        print(f"Warning: park washrooms ArcGIS fetch failed ({e}); using fallback list.")
        return None

    feats = data.get("features") or []
    if not feats:
        print("Warning: park washrooms ArcGIS returned no features; using fallback list.")
        return None

    out: list[dict] = []
    seasonal = (
        "Seasonal (typically May–Oct); confirm at hamilton.ca/park-washrooms. "
        "Issues: 905-546-2489."
    )
    for f in feats:
        a = f.get("attributes") or {}
        geom = f.get("geometry") or {}
        oid = a.get("OBJECTID")
        park = (a.get("LOCATION") or "Park").strip()
        addr = (a.get("PARK_ADDRESS") or "").strip() or "Hamilton, ON"
        ward = (a.get("WARD") or "").strip()
        wtype = (a.get("WASHROOM_TYPE") or "").strip()
        aoda = (a.get("AODA_ACCESSIBILITY") or "").strip()
        cat = (a.get("CATEGORY") or "").strip()
        lat = geom.get("y")
        lng = geom.get("x")
        if lat is None or lng is None:
            lat, lng = lat_lng_for_address(addr)

        note_parts = [p for p in [cat, f"Type: {wtype}" if wtype else "", f"AODA: {aoda}" if aoda else ""] if p]
        notes = "; ".join(note_parts)
        notes = (notes + "; ") if notes else ""
        notes += "Source: Open Hamilton park washrooms (ArcGIS)."

        region = f"ward-{ward}" if ward else "hamilton"
        out.append({
            "id": f"washroom-ham-{oid}",
            "type": "washroom",
            "name": f"{park} — washroom",
            "address": addr,
            "intersection": "Hamilton",
            "region": region,
            "hours": seasonal,
            "phone": "905-546-2489",
            "lat": lat,
            "lng": lng,
            "notes": notes,
        })
    print(f"Park washrooms: loaded {len(out)} from ArcGIS FeatureServer.")
    return out


def build_washrooms() -> list[dict]:
    api = fetch_park_washrooms_from_arcgis()
    if api is not None:
        return api

    out = []
    regions = ["downtown", "downtown", "downtown", "west-end", "mountain", "west-end", "mountain", "east-end"]
    for i, w in enumerate(WASHROOMS_FALLBACK):
        lat, lng = lat_lng_for_address(w["address"])
        out.append({
            "id": f"washroom-ham-fb-{i+1}",
            "type": "washroom",
            "name": w["name"],
            "address": w["address"],
            "intersection": "Hamilton",
            "region": regions[i] if i < len(regions) else "downtown",
            "hours": w["hours"],
            "phone": "905-546-2489",
            "lat": lat,
            "lng": lng,
            "notes": w.get("notes", "") + ("; " if w.get("notes") else "") + "Seasonal hours: hamilton.ca/park-washrooms",
        })
    return out


def build_safe() -> list[dict]:
    return [
        {
            "id": f"safe-ham-{i+1}",
            "type": "safe_injection",
            "name": s["name"],
            "address": s["address"],
            "intersection": "Hamilton",
            "region": "downtown",
            "hours": s["hours"],
            "phone": s["phone"],
            "lat": None,
            "lng": None,
            "notes": s["notes"],
        }
        for i, s in enumerate(SAFE_CONSUMPTION)
    ]


def main():
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()

    shelters = build_shelters()
    meals = build_meals()
    washrooms = build_washrooms()
    safe_sites = build_safe()
    all_amenities = shelters + meals + washrooms + safe_sites

    try:
        from contribution_merge import apply_merged_contributions

        apply_merged_contributions(root, "hamilton", all_amenities)
    except ImportError:
        pass

    # Nearby bus routes: optional GTFS when a stable HSR feed URL is documented in DATA_SOURCES.md.
    # (Vancouver/Toronto use known feeds; Hamilton skips until feed is confirmed.)

    REGION_NAMES = {
        "downtown": "Downtown",
        "east-end": "East End",
        "west-end": "West End",
        "mountain": "Mountain",
        "hamilton": "Hamilton",
    }
    for a in all_amenities:
        a.setdefault("region", "downtown")
    regions = [
        {"id": r, "name": REGION_NAMES.get(r, r.replace("-", " ").title())}
        for r in sorted({a["region"] for a in all_amenities})
    ]

    city_data = {
        "meta": {"city": "hamilton", "updated": today, "regions": regions},
        "amenities": all_amenities,
    }
    (out_dir / "hamilton.json").write_text(json.dumps(city_data, indent=2))
    print(
        f"Wrote hamilton.json. Total: {len(all_amenities)} "
        f"(shelters {len(shelters)}, meals {len(meals)}, washrooms {len(washrooms)}, safe {len(safe_sites)})"
    )


if __name__ == "__main__":
    main()
