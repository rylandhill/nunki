"""
GTFS utility: find nearby bus/train routes for a lat/lng.
Used at fetch time only—adds ~3–8 route names per amenity (~50 bytes each).
No GTFS data in bundle.
"""

import csv
import io
import math
import urllib.request
import zipfile
from pathlib import Path

RADIUS_M = 500  # Stops within this many meters


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Distance in km between two points."""
    R = 6371  # Earth radius km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def _load_gtfs(zip_url: str, cache_dir: Path | None) -> tuple[dict[str, list[str]], list[tuple[float, float, str]]]:
    """
    Download GTFS zip, parse stops and routes.
    Returns: (stop_id -> [route_short_name], [(lat, lon, stop_id), ...])
    """
    cache_dir = cache_dir or Path(__file__).resolve().parent / ".gtfs_cache"
    cache_dir.mkdir(exist_ok=True)
    zip_path = cache_dir / "gtfs.zip"

    try:
        req = urllib.request.Request(zip_url, headers={"User-Agent": "HumanitysGuide/1.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            zip_path.write_bytes(r.read())
    except Exception as e:
        raise RuntimeError(f"GTFS download failed: {e}") from e

    stop_to_routes: dict[str, set[str]] = {}
    stops_list: list[tuple[float, float, str]] = []

    with zipfile.ZipFile(zip_path, "r") as zf:
        # routes: route_id -> route_short_name
        routes = {}
        if "routes.txt" in zf.namelist():
            with zf.open("routes.txt") as f:
                for row in csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig")):
                    rid = row.get("route_id", "").strip()
                    name = (row.get("route_short_name") or row.get("route_long_name") or rid).strip()
                    if rid:
                        routes[rid] = name

        # trips: trip_id -> route_id
        trips = {}
        if "trips.txt" in zf.namelist():
            with zf.open("trips.txt") as f:
                for row in csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig")):
                    tid = row.get("trip_id", "").strip()
                    rid = row.get("route_id", "").strip()
                    if tid and rid:
                        trips[tid] = rid

        # stop_times: stop_id -> trip_ids
        stop_to_trips: dict[str, set[str]] = {}
        if "stop_times.txt" in zf.namelist():
            with zf.open("stop_times.txt") as f:
                for row in csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig")):
                    sid = row.get("stop_id", "").strip()
                    tid = row.get("trip_id", "").strip()
                    if sid and tid:
                        stop_to_trips.setdefault(sid, set()).add(tid)

        # stops: stop_id, lat, lon
        if "stops.txt" in zf.namelist():
            with zf.open("stops.txt") as f:
                for row in csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig")):
                    sid = row.get("stop_id", "").strip()
                    try:
                        lat = float(row.get("stop_lat", 0))
                        lon = float(row.get("stop_lon", 0))
                    except (ValueError, TypeError):
                        continue
                    if sid and -90 <= lat <= 90 and -180 <= lon <= 180:
                        stops_list.append((lat, lon, sid))
                        # Build stop_id -> route names
                        for tid in stop_to_trips.get(sid, []):
                            rid = trips.get(tid)
                            if rid and rid in routes:
                                stop_to_routes.setdefault(sid, set()).add(routes[rid])

    # Convert sets to sorted lists for stable output
    result = {k: sorted(v) for k, v in stop_to_routes.items()}
    return result, stops_list


def get_nearby_routes(lat: float, lon: float, stop_to_routes: dict, stops_list: list) -> list[str]:
    """Return unique route names for stops within RADIUS_M of (lat, lon)."""
    radius_km = RADIUS_M / 1000
    seen: set[str] = set()
    for slat, slon, sid in stops_list:
        if _haversine_km(lat, lon, slat, slon) <= radius_km:
            for r in stop_to_routes.get(sid, []):
                if r and r not in seen:
                    seen.add(r)
    return sorted(seen)


def enrich_amenities_with_transit(
    amenities: list[dict],
    gtfs_url: str,
    cache_dir: Path | None = None,
) -> None:
    """
    Add nearby_routes to each amenity that has lat/lng.
    Modifies amenities in place. Skips if GTFS fails (logs to stderr, continues).
    """
    try:
        stop_to_routes, stops_list = _load_gtfs(gtfs_url, cache_dir)
    except Exception as e:
        import sys
        print(f"GTFS load failed, skipping transit enrichment: {e}", file=sys.stderr)
        return

    for a in amenities:
        lat, lng = a.get("lat"), a.get("lng")
        if lat is None or lng is None:
            continue
        try:
            routes = get_nearby_routes(float(lat), float(lng), stop_to_routes, stops_list)
            if routes:
                a["nearby_routes"] = routes
        except (ValueError, TypeError):
            pass
