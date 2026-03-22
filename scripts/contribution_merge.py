#!/usr/bin/env python3
"""
Merge maintainer-approved contributions into city amenity lists at fetch time.

- additions: contributions/merged/additions/<city>.json  → { "amenities": [ ... ] }
- overrides: contributions/merged/overrides/<city>.json → { "<amenity_id>": { "hours": "...", ... } }

See docs/COMMUNITY_FORMS.md and docs/DATA_PIPELINE.md.
"""

from __future__ import annotations

import json
from pathlib import Path

VALID_TYPES = frozenset(
    {"shelter", "meal", "washroom", "safe_injection", "transit_hub"}
)


def _is_contribution_id(aid: object) -> bool:
    return isinstance(aid, str) and aid.startswith("contrib-")


def _merge_incoming_amenity(target: dict, incoming: dict) -> None:
    """Apply fields from additions file into an existing row (same id). Skips id; skips empty strings."""
    for key, val in incoming.items():
        if key == "id":
            continue
        if val is None:
            continue
        if isinstance(val, str) and not val.strip():
            continue
        target[key] = val


def _additions_path(root: Path, city_id: str) -> Path:
    return root / "contributions" / "merged" / "additions" / f"{city_id}.json"


def _overrides_path(root: Path, city_id: str) -> Path:
    return root / "contributions" / "merged" / "overrides" / f"{city_id}.json"


def load_additions(root: Path, city_id: str) -> list[dict]:
    p = _additions_path(root, city_id)
    if not p.is_file():
        return []
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"Warning: invalid JSON {p}: {e}")
        return []
    items = data.get("amenities")
    if not isinstance(items, list):
        return []
    return items


def load_overrides(root: Path, city_id: str) -> dict[str, dict]:
    p = _overrides_path(root, city_id)
    if not p.is_file():
        return {}
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"Warning: invalid JSON {p}: {e}")
        return {}
    if not isinstance(data, dict):
        return {}
    out: dict[str, dict] = {}
    for k, v in data.items():
        if isinstance(v, dict):
            out[str(k)] = v
    return out


def apply_merged_contributions(root: Path, city_id: str, all_amenities: list[dict]) -> tuple[int, int]:
    """
    Mutates all_amenities: appends additions, applies per-id overrides.
    Returns (num_added, num_patched).
    """
    root = Path(root)
    added = 0
    refreshed_contrib = 0
    patched = 0

    additions = load_additions(root, city_id)
    existing_ids = {a.get("id") for a in all_amenities if a.get("id")}
    by_id = {a.get("id"): a for a in all_amenities if a.get("id")}

    for a in additions:
        if not isinstance(a, dict):
            continue
        aid = a.get("id")
        t = a.get("type")
        if not aid or t not in VALID_TYPES:
            print(f"Warning: skip invalid contribution amenity (id/type): {aid!r} {t!r}")
            continue
        if aid in existing_ids:
            if _is_contribution_id(aid):
                target = by_id.get(aid)
                if target:
                    _merge_incoming_amenity(target, a)
                    refreshed_contrib += 1
            else:
                print(
                    f"Warning: contribution id collides with built data, skipping: {aid}"
                )
            continue
        all_amenities.append(a)
        by_id[aid] = a
        existing_ids.add(aid)
        added += 1

    overrides = load_overrides(root, city_id)
    if overrides:
        by_id = {a.get("id"): a for a in all_amenities if a.get("id")}
        for oid, patch in overrides.items():
            target = by_id.get(oid)
            if not target:
                print(f"Warning: override for unknown amenity id: {oid}")
                continue
            for key, val in patch.items():
                if key == "id":
                    continue
                target[key] = val
            patched += 1

    if added or refreshed_contrib or patched:
        print(
            f"Contributions ({city_id}): +{added} new addition(s), "
            f"{refreshed_contrib} contrib row(s) updated from additions file, "
            f"{patched} record(s) had field override(s)."
        )
    return added, patched
