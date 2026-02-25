#!/usr/bin/env python3
"""
Fetch Toronto amenities from Open Data and output JSON for Humanity's Guide.
Toronto uses CKAN API. Run from project root: python scripts/fetch_toronto.py

Data sources:
- Shelters: Toronto CKAN datastore (daily-shelter-overnight-service-occupancy-capacity)
- Washrooms: Toronto CKAN washroom-facilities (354 park washrooms, daily refresh)
- Meals: Toronto Drop-In Network tdin.ca/meals — no API; page is JS-rendered.
  Fallback list maintained from TDIN. To update: visit tdin.ca/meals (or meals_pdf.php).
- Safe consumption: Manually maintained (Toronto Public Health)
"""

import json
import urllib.request
from datetime import date
from pathlib import Path

TORONTO_CKAN = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action"
SHELTER_RESOURCE_ID = "42714176-4f05-44e6-b157-2b57f29b856a"  # Daily shelter overnight occupancy
WASHROOM_RESOURCE_ID = "1c7d1063-2562-4de3-8cd3-4cef48419f6f"  # Park Washroom Facilities
CENTRAL_INTAKE = "416-338-4766"

# Map LOCATION_CITY from shelter API to region IDs
TORONTO_CITY_TO_REGION = {
    "Toronto": "downtown",
    "North York": "north-york",
    "Etobicoke": "etobicoke",
    "Scarborough": "scarborough",
    "East York": "east-york",
    "York": "west",
    "Vaughan": "north-york",
}


def toronto_region_from_coords(lat: float | None, lng: float | None) -> str:
    """Assign Toronto region from lat/lng. Approximate bounds for city districts."""
    if lat is None or lng is None:
        return "downtown"
    if lat >= 43.72:
        return "north-york"
    if lng >= -79.25:
        return "scarborough"
    if lng <= -79.46:
        return "etobicoke"
    if lng >= -79.36 and 43.65 <= lat < 43.72:
        return "east-york"
    if lng <= -79.40 and 43.65 <= lat < 43.72:
        return "west"
    return "downtown"


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.loads(r.read().decode())


def fetch_shelters() -> list[dict]:
    """Get unique Toronto shelter locations from CKAN datastore."""
    seen = set()
    amenities = []
    offset = 0
    limit = 100
    while True:
        url = f"{TORONTO_CKAN}/datastore_search?resource_id={SHELTER_RESOURCE_ID}&limit={limit}&offset={offset}"
        try:
            data = fetch_json(url)
        except Exception:
            break
        records = data.get("result", {}).get("records", [])
        if not records:
            break
        for r in records:
            loc_id = r.get("LOCATION_ID", "")
            key = (loc_id, r.get("LOCATION_NAME"), r.get("LOCATION_ADDRESS"))
            if key in seen:
                continue
            seen.add(key)
            addr = r.get("LOCATION_ADDRESS", "")
            if not addr:
                continue
            sector = r.get("SECTOR", "") or "All"
            city = r.get("LOCATION_CITY", "Toronto")
            region = TORONTO_CITY_TO_REGION.get(city, "downtown")
            amenities.append({
                "id": f"shelter-tor-{len(amenities)+1}",
                "type": "shelter",
                "name": r.get("LOCATION_NAME", "Shelter"),
                "address": addr,
                "intersection": city,
                "region": region,
                "hours": "Call Central Intake for access",
                "phone": CENTRAL_INTAKE,
                "lat": None,
                "lng": None,
                "notes": f"Serves {sector}. Call {CENTRAL_INTAKE} or 1-877-338-3398.",
                "category": sector,
            })
        if len(records) < limit:
            break
        offset += limit
        if offset >= 500:  # Cap to avoid huge fetches
            break
    return amenities


def fetch_washrooms() -> list[dict]:
    """Get Toronto park washrooms from CKAN washroom-facilities dataset (354 records)."""
    amenities = []
    offset = 0
    limit = 100
    while True:
        url = f"{TORONTO_CKAN}/datastore_search?resource_id={WASHROOM_RESOURCE_ID}&limit={limit}&offset={offset}"
        try:
            data = fetch_json(url)
        except Exception:
            break
        records = data.get("result", {}).get("records", [])
        if not records:
            break
        for r in records:
            addr = r.get("address", "").strip()
            if not addr:
                continue
            # Parse lat/lng from geometry JSON
            lat, lng = None, None
            geom = r.get("geometry")
            if geom:
                try:
                    g = json.loads(geom)
                    coords = g.get("coordinates", [])
                    if len(coords) >= 2:
                        lng, lat = coords[0], coords[1]
                except (json.JSONDecodeError, TypeError):
                    pass
            name = r.get("alternative_name") or r.get("location", "Washroom")
            hours = r.get("hours") or "9am-10pm (summer), 9am-8pm (winter)"
            status = r.get("Status", "1")
            status_note = ""
            if status == "0":
                status_note = " (currently closed)"
            elif status == "2":
                status_note = f" ({r.get('Comments', 'service alert')})"
            region = toronto_region_from_coords(lat, lng)
            amenities.append({
                "id": f"washroom-tor-{len(amenities)+1}",
                "type": "washroom",
                "name": name,
                "address": addr,
                "intersection": "Toronto",
                "region": region,
                "hours": hours + status_note,
                "phone": "",
                "lat": lat,
                "lng": lng,
                "notes": r.get("location_details", ""),
            })
        if len(records) < limit:
            break
        offset += limit
    return amenities


# Toronto meal programs - Toronto Drop-In Network (tdin.ca/meals).
# No API; page is JS-rendered. Update from tdin.ca/meals or meals_pdf.php when needed.
MEAL_PROGRAMS = [
    {"name": "Church of the Holy Trinity: Trinity CommUNITY Hub", "address": "19 Trinity Square", "hours": "Tue-Wed 12pm-1:30pm lunch", "phone": "416-598-4521"},
    {"name": "Church of the Redeemer: Common Table", "address": "162 Bloor St W", "hours": "Mon-Fri 8am-11:30am B/L/S", "phone": "416-922-4948"},
    {"name": "Covenant House Toronto", "address": "20 Gerrard St E", "hours": "Daily 12pm-6:45pm L/D (youth)", "phone": "416-598-4898"},
    {"name": "Evangel Hall Mission", "address": "552 Adelaide St W", "hours": "Mon-Fri 9am-12:30pm B/L, Sun 5pm D", "phone": "416-504-3563"},
    {"name": "Sanctuary", "address": "25 Charles St E", "hours": "Tue 11am-3pm B, Thu 5pm-9pm D", "phone": "416-922-0628"},
    {"name": "The 519", "address": "519 Church St", "hours": "Various (trans/2SLGBTQ+)", "phone": "416-392-6874"},
    {"name": "The Corner Drop-in", "address": "260 Augusta Ave", "hours": "Mon-Sat 8am-11:30am B/L", "phone": "416-803-4857"},
    {"name": "The Scott Mission", "address": "502 Spadina Ave", "hours": "Mon-Fri 8am-11:30am B, 11:30am L", "phone": "416-923-8872"},
    {"name": "West Neighbourhood House: The Meeting Place", "address": "588 Queen St W", "hours": "Tue-Fri 10am-3:45pm B/L/S", "phone": "416-504-4275"},
    {"name": "YMCA Wagner Green Drop-in", "address": "7 Vanauley St", "hours": "Mon-Fri 9am-5pm B/L/S (youth)", "phone": "416-603-6366"},
    {"name": "Margaret's: Toronto East Drop-in", "address": "323 Dundas St E", "hours": "Mon-Fri 7am-3pm B/L/S", "phone": "647-367-2100"},
    {"name": "St. Stephen-in-the-Fields: Safe Space", "address": "103 Bellevue Ave", "hours": "Fri 6pm-10pm D, Sat-Sun 7am B", "phone": "416-526-5438"},
    {"name": "St. James Cathedral Drop-in", "address": "65 Church St", "hours": "Fri 1:30pm-3:30pm D", "phone": "416-364-7865"},
    {"name": "St Thomas's Church: Friday Food Ministry", "address": "383 Huron St", "hours": "Fri 5pm-7:30pm D", "phone": "416-722-1724"},
    {"name": "ACSA Scarborough Drop-in North", "address": "4155 Sheppard Ave E", "hours": "Tue-Fri 9am-3pm B/L", "phone": "647-781-9957"},
    {"name": "Fontbonne Ministries: Mustard Seed", "address": "791 Queen St E", "hours": "Mon-Fri 9am-2pm S", "phone": "416-465-2889"},
    {"name": "St John the Compassionate Mission", "address": "155 Broadview Ave", "hours": "Tue B, Wed B/L, Thu-Fri B/L, Sat B", "phone": "416-466-1357"},
    {"name": "Fred Victor 40 Oak Drop-in", "address": "40 Oak St", "hours": "Mon-Fri 9am-8pm B/L", "phone": "416-363-4234"},
    {"name": "Warden Woods: Helping Hands Drop-in", "address": "40 Teesdale Pl", "hours": "Mon-Fri 9am-3pm B/L", "phone": "416-694-1138"},
    {"name": "Dixon Hall: Food Access Program", "address": "47 Darling Lane", "hours": "Tue/Wed/Fri 11am-3pm L", "phone": "416-863-0499"},
    {"name": "Regent Park Community Health Centre", "address": "465 Dundas St E", "hours": "Mon-Fri 9am-4:30pm, Tue L", "phone": "416-364-2261"},
    {"name": "Fred Victor 145 Queen St", "address": "145 Queen St E", "hours": "Mon-Fri 10am-5pm B/D/S", "phone": "416-361-2833"},
    {"name": "Saint Luke's United Church", "address": "353 Sherbourne St", "hours": "Mon 5pm-7pm D", "phone": "416-924-0619"},
    {"name": "Syme Woolner: Jane's Drop-in", "address": "2468 Eglinton Ave W", "hours": "Mon-Fri 9am-6pm B/L/D", "phone": "416-766-4634"},
    {"name": "Weston King Neighbourhood Centre", "address": "2017 Weston Rd", "hours": "Mon-Fri 9:30am-4:30pm B/L, Tue D", "phone": "416-241-9898"},
    {"name": "Christie Ossington: Drop-In/Food Access", "address": "854 Bloor St W", "hours": "Mon-Fri 8am-4pm B/L", "phone": "416-792-8941"},
    {"name": "LAMP Adult Drop-in", "address": "156 Sixth St (St Margaret Church)", "hours": "Mon-Fri 9:30am-2:30pm B/L", "phone": "647-525-2521"},
    {"name": "Parkdale Activity Recreation Centre (PARC)", "address": "1499 Queen St W", "hours": "Mon-Fri 9am-6pm B/L/D, Sat-Sun B/L", "phone": "416-537-2262"},
    {"name": "Sistering", "address": "962 Bloor St W", "hours": "24hr B/L/D/S (women/trans)", "phone": "416-926-9762"},
    {"name": "The Stop Community Food Centre", "address": "1884 Davenport Rd", "hours": "Mon/Tue/Thu/Fri 9am-1pm B/L", "phone": "416-652-7867"},
    {"name": "The Stop's Wychwood Open Door", "address": "729 St Clair Ave W", "hours": "Wed 8:30am-2:30pm B/L, Thu D", "phone": "416-412-4452"},
    {"name": "Our Place Community of Hope", "address": "1183 Davenport Rd", "hours": "Mon-Fri 12pm-6pm L/S", "phone": "416-598-2919"},
    {"name": "Progress Place/Community Place Hub", "address": "1765 Weston Rd", "hours": "Mon-Fri 9am-6:30pm B/L/D", "phone": "416-323-1429"},
    {"name": "Parkdale Community Food Bank", "address": "5 Brock Ave", "hours": "Wed-Sat, check for times", "phone": "416-531-9975"},
    {"name": "Daily Bread Food Bank", "address": "191 New Toronto St", "hours": "Varies by location", "phone": "416-203-0050"},
    {"name": "Fort York Food Bank", "address": "250 The Esplanade", "hours": "Check for times", "phone": "416-392-0335"},
    {"name": "Good Shepherd Ministries", "address": "412 Queen St E", "hours": "Daily 2pm-4pm", "phone": "416-869-3619"},
    {"name": "Davenport Perth Neighbourhood Centre", "address": "1900 Davenport Rd", "hours": "Mon/Wed 10am-12:30pm S, Tue 5pm", "phone": "416-656-8025"},
]


# Toronto safe consumption sites (manually maintained - Toronto Public Health)
SAFE_CONSUMPTION_SITES = [
    {"name": "Fred Victor", "address": "139 Jarvis St", "hours": "Mon 8am-10pm, Tue-Sun 7:30am-7pm", "phone": "416-364-9328"},
    {"name": "Parkdale Queen West CHC", "address": "1229 Queen St W", "hours": "Mon/Tue/Thu/Fri 9am-5/8pm, Wed 1pm-8pm, Sat-Sun 10am-6pm", "phone": "416-537-2455"},
    {"name": "Street Health", "address": "338 Dundas St E", "hours": "Mon-Fri 9:30am-4:30pm", "phone": "416-921-8668"},
    {"name": "Casey House", "address": "119 Isabella St", "hours": "Mon-Fri 10am-8pm (patients only)", "phone": "416-962-7600"},
]

def get_safe_consumption_sites() -> list[dict]:
    # All 4 sites are downtown
    return [
        {
            "id": f"safe-tor-{i+1}",
            "type": "safe_injection",
            "name": s["name"],
            "address": s["address"],
            "intersection": "Toronto",
            "region": "downtown",
            "hours": s["hours"],
            "phone": s["phone"],
            "lat": None,
            "lng": None,
            "notes": "Supervised consumption. Call for current hours.",
        }
        for i, s in enumerate(SAFE_CONSUMPTION_SITES)
    ]


# Meal address -> region (from street names / areas). Rest default to downtown.
MEAL_REGION_OVERRIDES = {
    "4155 Sheppard Ave E": "scarborough",
    "40 Teesdale Pl": "scarborough",
    "2017 Weston Rd": "west",
    "2468 Eglinton Ave W": "west",
    "1765 Weston Rd": "west",
    "156 Sixth St (St Margaret Church)": "west",
    "191 New Toronto St": "west",
    "729 St Clair Ave W": "west",
    "1884 Davenport Rd": "west",
    "1183 Davenport Rd": "west",
    "1900 Davenport Rd": "west",
    "962 Bloor St W": "west",
    "854 Bloor St W": "west",
    "1499 Queen St W": "west",
    "5 Brock Ave": "west",
    "588 Queen St W": "west",
    "791 Queen St E": "east-york",
    "465 Dundas St E": "east-york",
    "323 Dundas St E": "east-york",
    "155 Broadview Ave": "east-york",
}


def get_meal_programs() -> list[dict]:
    out = []
    for i, s in enumerate(MEAL_PROGRAMS):
        region = MEAL_REGION_OVERRIDES.get(s["address"], "downtown")
        out.append({
            "id": f"meal-tor-{i+1}",
            "type": "meal",
            "name": s["name"],
            "address": s["address"],
            "intersection": "Toronto",
            "region": region,
            "hours": s["hours"],
            "phone": s["phone"],
            "lat": None,
            "lng": None,
            "notes": "Call for current hours and eligibility. Source: tdin.ca/meals",
        })
    return out


def get_washrooms() -> list[dict]:
    return fetch_washrooms()


def main():
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()

    shelters = fetch_shelters()
    meals = get_meal_programs()
    washrooms = get_washrooms()
    safe_sites = get_safe_consumption_sites()
    all_amenities = shelters + meals + washrooms + safe_sites

    # Enrich with nearby transit routes (adds ~3–8 route names per amenity with coords)
    try:
        from gtfs_nearby import enrich_amenities_with_transit
        enrich_amenities_with_transit(
            all_amenities,
            "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/b811ead4-6eaf-4adb-8408-d389fb5a069c/resource/c920e221-7a1c-488b-8c5b-6d8cd4e85eaf/download/completegtfs.zip",
            cache_dir=root / "scripts" / ".gtfs_cache",
        )
    except Exception as e:
        print(f"Transit enrichment skipped: {e}")

    # Ensure all have region; build regions list for UI
    REGION_NAMES = {
        "downtown": "Downtown",
        "east-york": "East York",
        "etobicoke": "Etobicoke",
        "north-york": "North York",
        "scarborough": "Scarborough",
        "west": "West",
    }
    for a in all_amenities:
        a.setdefault("region", "downtown")
    regions = [
        {"id": r, "name": REGION_NAMES.get(r, r.replace("-", " ").title())}
        for r in sorted({a["region"] for a in all_amenities})
    ]

    city_data = {
        "meta": {"city": "toronto", "updated": today, "regions": regions},
        "amenities": all_amenities,
    }
    (out_dir / "toronto.json").write_text(json.dumps(city_data, indent=2))
    print(f"Wrote toronto.json. Total amenities: {len(all_amenities)} (shelters: {len(shelters)}, meals: {len(meals)}, washrooms: {len(washrooms)}, safe: {len(safe_sites)})")


if __name__ == "__main__":
    main()
