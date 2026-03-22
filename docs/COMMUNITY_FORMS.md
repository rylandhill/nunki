# Community submissions (Google Forms)

> **Hidden submission tooling (read this first)**  
> This document is **in the repo** so everyone sees public form links and CSV column shapes. A **large part of the submission pipeline is not in git** (listed in **`.gitignore`**):
>
> | Path | Role | In clone? |
> |------|------|-----------|
> | **`contributions/`** | Pending imports, archive, merged JSON, local maintainer notes | **No** — maintainer-only on disk |
> | **`tools/`** | Optional local review UI (e.g. Node app under `contributions-manager/`) | **No** |
> | **`docs/SUBMISSIONS_ARCHITECTURE.md`** | Optional planning notes | **No** |
>
> **Tracked** and safe to edit in PRs: **`scripts/import_google_form_csv.py`**, **`scripts/apply_merged_to_public.py`**, **`scripts/contribution_merge.py`**, and **this file**. Agents: do not search the repo for `contributions/` or `tools/` sources—they are excluded from version control on purpose.

**Public intake:** use the forms below only. Crowd-sourced place data is **not** accepted via JSON in pull requests.

**Maintainers:** link each form to a **Google Sheet** (Responses → spreadsheet). **File → Download → Comma-separated values (.csv)** to export, then:

```bash
npm run import-form-submissions -- path/to/LandmarkSubmissions.csv
npm run import-form-issues -- path/to/IncorrectInfo.csv
```

Imports write under **`contributions/pending/`** (local maintainer tree, not in git). After review, use **`npm run apply-merged`** or **`npm run fetch-data`** so changes land in **`public/data/*.json`** (then commit those files). See **[DATA_PIPELINE.md](DATA_PIPELINE.md)** for how the community layer merges with automatic fetches.

### In-app links & prefill

The PWA (**`src/main.js`**) links to both forms from **Places**: “**Suggest a missing place**” under the filters (city pre-selected on the suggest form), and “**Report wrong or missing info**” on each place detail (city, landmark name, type, and **Other details** text that includes the app’s stable **`id`**). Google does not expose a dedicated “record id” field on the live report form, so the id is prefilled in **Other details** instead. If you add a short-answer “Record ID” question, grab its `entry.########` from **⋮ → Get pre-filled link** and add it in `main.js` next to the other `FORM_*_ENTRY_*` constants.

---

## Live forms (Nunki)

| Form | Link |
|------|------|
| **New landmark / place** | [Nunki — Landmark Submissions](https://docs.google.com/forms/d/e/1FAIpQLSdyoqRqDGKCx8w4r4AHaM-UFcENICq2KR_Raag4f-3BQxzK8Q/viewform) |
| **Incorrect or missing info** | [Nunki — Incorrect or Missing Information](https://docs.google.com/forms/d/e/1FAIpQLSdMVjBa-Zr3FOd6k8klAAx1AX-0KspOsw2dBgENxS64Ycf-FQ/viewform) |

If a cell contains commas, Sheets usually wraps it in quotes so CSV columns stay aligned.

---

## Form 1 — Landmark submissions (column titles)

These match **`import_google_form_csv.py submissions`** (aliases like `Address`, `Phone`, `Notes` are also accepted).

| Question title | Type | Required |
|----------------|------|----------|
| **City** | Multiple choice | Yes — `Vancouver`, `Toronto`, `Hamilton` |
| **Type** | Multiple choice | Yes — e.g. `Washroom`, `Shelter`, `Meals`, `Safe Injection`, `Transit Hub` |
| **Name** | Short answer | Yes |
| **Address/Location** | Short answer | Yes |
| **Neighborhood** | Short answer | No |
| **Hours** | Short answer / paragraph | No |
| **Phone Number (of landmark submission)** | Short answer | No |
| **Additional Information** | Paragraph | No |

---

## Form 2 — Incorrect or missing information

These match **`import_google_form_csv.py issues`**.

| Question title | Type | Required |
|----------------|------|----------|
| **City** | Multiple choice | Yes |
| **Landmark Name (as shown in app)** | Short answer | Yes |
| **Type** | Multiple choice | Yes |
| **What's incorrect?** | Multiple choice | Yes |
| **Correct information** | Paragraph | Yes |
| **Other details** | Paragraph | No |

---

## See also

- **[DATA_PIPELINE.md](DATA_PIPELINE.md)** — `fetch-data`, `apply-merged`, `build:deploy`, and `contributions/merged/` behavior on a clean clone.
