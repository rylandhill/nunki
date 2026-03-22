#!/usr/bin/env python3
"""
Import Google Forms CSV exports into contributions/pending/* as one JSON file per row.

Usage (from repo root):
  python3 scripts/import_google_form_csv.py submissions path/to/Sheet1.csv
  python3 scripts/import_google_form_csv.py issues path/to/Sheet1.csv

Supports the official Nunki form column titles plus aliases (e.g. Address/Location, Landmark Name).
Public forms / columns: see docs/COMMUNITY_FORMS.md.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

def _norm_header(h: str) -> str:
    h = (h or "").strip()
    # Google Sheets sometimes uses curly apostrophes in headers
    h = h.replace("\u2019", "'").replace("\u2018", "'").replace("\u2032", "'")
    return re.sub(r"\s+", " ", h).strip().lower()


def _row_dict(reader_fieldnames: list[str], row: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for i, name in enumerate(reader_fieldnames):
        key = _norm_header(name)
        val = row[i].strip() if i < len(row) else ""
        out[key] = val
    return out


def normalize_amenity_type(type_raw: str) -> str:
    """Map Google Form multiple-choice labels to Nunki type ids."""
    t = (type_raw or "").strip().lower()
    if not t:
        return ""
    if "transit" in t:
        return "transit_hub"
    if "safe" in t and ("inject" in t or "consumption" in t):
        return "safe_injection"
    if t in ("shelter", "meal", "meals", "washroom", "transit_hub", "safe_injection"):
        return "meal" if t == "meals" else t
    return t.replace(" ", "_")


def _slug(s: str, max_len: int = 40) -> str:
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "-", s.strip())[:max_len].strip("-") or "row"
    return s


def _stable_name(path: Path, kind: str, row_key: str) -> str:
    h = hashlib.sha256(f"{path.name}:{row_key}".encode("utf-8")).hexdigest()[:10]
    return f"{kind}-{h}.json"


def row_to_submission(row: dict[str, str], source: str) -> dict:
    city = (row.get("city") or "").strip().lower()
    type_ = normalize_amenity_type(row.get("type") or "")
    name = (row.get("name") or "").strip()
    address = (
        row.get("address")
        or row.get("address/location")
        or ""
    ).strip()
    region_raw = (
        row.get("neighbourhood / region (optional)")
        or row.get("neighborhood")
        or row.get("neighbourhood")
        or ""
    ).strip()
    region = re.sub(r"\s+", "-", region_raw.lower()) if region_raw else ""
    phone = (
        row.get("phone")
        or row.get("phone number (of landmark submission)")
        or ""
    ).strip()
    notes = (row.get("notes") or row.get("additional information") or "").strip()

    return {
        "schema": "nunki.pending_submission.v1",
        "source": source,
        "imported_at": datetime.now(timezone.utc).isoformat(),
        "suggestion": {
            "city": city,
            "type": type_,
            "name": name,
            "address": address,
            "hours": (row.get("hours") or "").strip(),
            "phone": phone,
            "notes": notes,
            "region": region,
        },
        "raw": {k: row.get(k, "") for k in sorted(row.keys())},
    }


_AMENITY_LABELS = frozenset(
    {"washroom", "shelter", "meal", "meals", "safe injection", "transit hub", "transit"}
)


def normalize_issue_field(raw: str) -> str:
    """Map form answer labels to amenity JSON field names."""
    s = (raw or "").strip().lower()
    if s in _AMENITY_LABELS:
        # Likely CSV column misalignment (e.g. unquoted comma in landmark name)
        return "notes"
    if "address" in s:
        return "address"
    if "hour" in s:
        return "hours"
    if "phone" in s:
        return "phone"
    if s == "name" or s.startswith("name "):
        return "name"
    if "note" in s:
        return "notes"
    return "notes" if "other" in s else s.replace(" ", "_").replace("#", "")


def row_to_issue(row: dict[str, str], source: str) -> dict:
    place = (
        row.get("place name (as shown in app)")
        or row.get("landmark name (as shown in app)")
        or ""
    ).strip()
    what_wrong = (
        row.get("what needs fixing")
        or row.get("what's incorrect?")
        or row.get("whats incorrect?")
        or ""
    ).strip()
    field = normalize_issue_field(what_wrong)
    amenity_t = row.get("amenity type (optional)") or row.get("type") or ""
    return {
        "schema": "nunki.pending_issue.v1",
        "source": source,
        "imported_at": datetime.now(timezone.utc).isoformat(),
        "issue": {
            "city": (row.get("city") or "").strip().lower(),
            "record_id": (row.get("record id (optional)") or "").strip(),
            "place_name": place,
            "amenity_type": normalize_amenity_type(amenity_t),
            "field": field,
            "correct_information": (row.get("correct information") or "").strip(),
            "other_details": (
                row.get("other details (optional)")
                or row.get("other details")
                or ""
            ).strip(),
        },
        "raw": {k: row.get(k, "") for k in sorted(row.keys())},
    }


def _has_any(keys: set[str], *candidates: str) -> bool:
    return any(c in keys for c in candidates)


def validate_submission_headers(keys: set[str]) -> None:
    if "city" not in keys or "type" not in keys or "name" not in keys:
        raise SystemExit(
            f"CSV must include columns: City, Type, Name (plus Address or Address/Location). "
            f"Found: {sorted(keys)}"
        )
    if not _has_any(keys, "address", "address/location"):
        raise SystemExit(
            "CSV must include Address or Address/Location. "
            f"Found: {sorted(keys)}"
        )


def validate_issue_headers(keys: set[str]) -> None:
    if "city" not in keys or "correct information" not in keys:
        raise SystemExit(
            f"CSV must include City and Correct information. Found: {sorted(keys)}"
        )
    if not _has_any(
        keys,
        "place name (as shown in app)",
        "landmark name (as shown in app)",
    ):
        raise SystemExit(
            "CSV must include Landmark Name (as shown in app) or Place name (as shown in app). "
            f"Found: {sorted(keys)}"
        )
    if not _has_any(keys, "what needs fixing", "what's incorrect?", "whats incorrect?"):
        raise SystemExit(
            "CSV must include What's incorrect? or What needs fixing. "
            f"Found: {sorted(keys)}"
        )


def import_csv(kind: str, csv_path: Path, root: Path) -> int:
    csv_path = csv_path.resolve()
    if not csv_path.is_file():
        raise SystemExit(f"File not found: {csv_path}")

    text = csv_path.read_text(encoding="utf-8-sig", errors="replace")
    lines = text.splitlines()
    if not lines:
        return 0

    reader = csv.reader(lines)
    header_row = next(reader)
    fieldnames = [h.strip() for h in header_row]
    norm_keys = {_norm_header(h) for h in fieldnames}

    if kind == "submissions":
        validate_submission_headers(norm_keys)
        out_dir = root / "contributions" / "pending" / "submissions"
        convert = lambda r: row_to_submission(r, "google_form")
        prefix = "sub"
    elif kind == "issues":
        validate_issue_headers(norm_keys)
        out_dir = root / "contributions" / "pending" / "issues"
        convert = lambda r: row_to_issue(r, "google_form")
        prefix = "issue"
    else:
        raise SystemExit("kind must be submissions or issues")

    out_dir.mkdir(parents=True, exist_ok=True)
    written = 0

    for row in reader:
        if not row or all(not (c or "").strip() for c in row):
            continue
        rd = _row_dict(fieldnames, row)

        if kind == "submissions":
            if not (rd.get("city") or "").strip() or not (rd.get("name") or "").strip():
                continue
        else:
            place = (
                rd.get("place name (as shown in app)")
                or rd.get("landmark name (as shown in app)")
                or ""
            ).strip()
            if not place:
                continue

        payload = convert(rd)
        row_key = json.dumps(rd, sort_keys=True)
        fname = _stable_name(csv_path, prefix, row_key)
        dest = out_dir / fname
        if dest.exists():
            fname = f"{prefix}-{hashlib.sha256(row_key.encode()).hexdigest()[:12]}.json"
            dest = out_dir / fname
        dest.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        written += 1

    print(f"Wrote {written} file(s) to {out_dir.relative_to(root)}")
    return written


def main() -> None:
    ap = argparse.ArgumentParser(description="Import Google Form CSV into contributions/pending")
    ap.add_argument("kind", choices=("submissions", "issues"))
    ap.add_argument("csv_file", type=Path)
    args = ap.parse_args()
    root = Path(__file__).resolve().parent.parent
    import_csv(args.kind, args.csv_file, root)


if __name__ == "__main__":
    main()
