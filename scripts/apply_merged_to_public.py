#!/usr/bin/env python3
"""
Re-apply contributions/merged/* onto existing public/data/*.json without calling remote APIs.

Use when you edited merged/additions or merged/overrides (or saved from the contributions UI)
and want public/data updated without re-running fetch-data.

This does NOT refresh Open Data / CKAN / ArcGIS — for that, run npm run fetch-data.

Safe to run repeatedly: additions skip duplicate ids; overrides re-apply idempotently.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from contribution_merge import apply_merged_contributions

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "data"

# Display names for region ids (keep in sync with fetch_<city>.py)
HAMILTON_REGIONS = {
    "downtown": "Downtown",
    "east-end": "East End",
    "west-end": "West End",
    "mountain": "Mountain",
    "hamilton": "Hamilton",
}
TORONTO_REGIONS = {
    "downtown": "Downtown",
    "east-york": "East York",
    "etobicoke": "Etobicoke",
    "north-york": "North York",
    "scarborough": "Scarborough",
    "west": "West",
}


def region_list(amenities: list, names: dict[str, str]) -> list[dict]:
    for a in amenities:
        a.setdefault("region", "downtown")
    return [
        {"id": r, "name": names.get(r, r.replace("-", " ").title())}
        for r in sorted({a["region"] for a in amenities if a.get("region")})
    ]


def write_vancouver_shards(all_amenities: list, today: str) -> None:
    by_region: dict[str, list] = {}
    for a in all_amenities:
        region = a.get("region") or "downtown"
        by_region.setdefault(region, []).append(a)
    regions_config = []
    for region_id, ams in sorted(by_region.items()):
        region_name = region_id.replace("-", " ").title()
        filename = f"vancouver-{region_id}.json"
        out = {
            "meta": {"city": "vancouver", "region": region_id, "updated": today},
            "amenities": ams,
        }
        (OUT / filename).write_text(json.dumps(out, indent=2))
        regions_config.append({"id": region_id, "name": region_name})
    index = {
        "city": "vancouver",
        "dataFile": "vancouver.json",
        "mapRegions": regions_config,
        "updated": today,
    }
    (OUT / "vancouver-index.json").write_text(json.dumps(index, indent=2))


def process_city(city: str, filename: str, region_names: dict[str, str]) -> bool:
    path = OUT / filename
    if not path.is_file():
        print(f"Skip {city}: missing {path.relative_to(ROOT)}")
        return False
    raw = json.loads(path.read_text(encoding="utf-8"))
    amenities = raw.get("amenities")
    if not isinstance(amenities, list):
        print(f"Skip {city}: no amenities array")
        return False

    amenities = json.loads(json.dumps(amenities))
    apply_merged_contributions(ROOT, city, amenities)

    today = date.today().isoformat()
    regions = region_list(amenities, region_names)

    if city == "vancouver":
        raw["meta"] = {"city": "vancouver", "updated": today, "regions": regions}
        raw["amenities"] = amenities
        path.write_text(json.dumps(raw, indent=2), encoding="utf-8")
        write_vancouver_shards(amenities, today)
        print(f"Updated vancouver.json + region shards + index ({len(amenities)} amenities)")
    else:
        meta = raw.get("meta") if isinstance(raw.get("meta"), dict) else {}
        meta["city"] = city
        meta["updated"] = today
        meta["regions"] = regions
        raw["meta"] = meta
        raw["amenities"] = amenities
        path.write_text(json.dumps(raw, indent=2), encoding="utf-8")
        print(f"Updated {filename} ({len(amenities)} amenities)")

    return True


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    if process_city("hamilton", "hamilton.json", HAMILTON_REGIONS):
        n += 1
    if process_city("toronto", "toronto.json", TORONTO_REGIONS):
        n += 1
    if process_city("vancouver", "vancouver.json", {}):
        n += 1
    if n == 0:
        print("No city JSON files updated. Run npm run fetch-data once to create public/data.")
    else:
        print("apply-merged: done. benefits.json unchanged (no contribution merge).")


if __name__ == "__main__":
    main()
