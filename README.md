# MyExpense

A web app for travel expense reports that works on a phone. Fill in a **per diem** or **itemized** report, take photos of receipts with the camera, and download everything you hand in at the office:

- the official Excel form (cloned from the company templates, one sheet per week),
- a print-ready PDF of the same form,
- the receipts, as one printable PDF or a zip of individual files.

The single built file is the whole app. It runs as a claude.ai Artifact: everyone signs in with their Claude account, each person sees and manages only their own expenses, and Claude reads the receipts. How that privacy is enforced, and how to share the app safely, is in [docs/SECURITY.md](docs/SECURITY.md).

There are two environments, **production** (`main` branch) and **QA** (`qa` branch), each with its own app link and its own data. See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md) for the links and how to release a change.

## What it does

**Per diem report** (Travel Expense Report form)
- Employee name, customer, trip start and end dates.
- Fixed terms: United States, USD, $100 full day (`Per Diam - Full Day`), $50 partial day (`Per Diam - Partial Day`), department Service.
- Partial days are only what the person marks; they must choose "None" or tap the days. Nothing is inferred from travel days or weekends.
- Splits the trip into Sunday–Saturday weeks; the first sheet starts on the trip start, the last ends on the trip end. Sheets are named `Week Ending DD-Mon-YY`, followed by the three reference tabs.

**Itemized report** (Expense Claim Report form)
- Receipts from the camera, photo library, PDFs, Word files with pictures in them, or pasted screenshots of a card statement.
- Inside Claude, each photo is read for date, vendor, type, amount, currency and payment method. On a statement only the rows marked in red are taken. Every read charge is flagged until the person confirms it against the photo.
- Usual categories: Taxi/Uber, Auto Rental, Air Fare (baggage fees), Fuel. Parking and every other row need an explicit "Include" tick.
- Amounts are the CAD that posted to the card. Foreign-currency receipts ask for that CAD amount; the app never converts.
- One sheet per week that has charges; each charge goes on its category row and day column; HST left blank; every date in row 10 filled.

**Downloads**
| File | Name |
| --- | --- |
| Excel form | `{Customer} PD Expenses {Mon D}-{Mon D} {Year}.xlsx` / `{Customer} Itemized Expenses {Mon D}-{Mon D} {Year}.xlsx` |
| PDF of the form | same name, `.pdf` |
| Receipts PDF (itemized) | `… Receipts.pdf`, two per page, numbered, labelled with date, type, vendor and CAD amount |
| Receipt files (itemized) | `… Receipts.zip`, e.g. `01 2026-04-29 Taxi - Uber - CA$36.93.jpg`; PDF receipts stay PDFs |
| One receipt | from the photo viewer |

The full rules are in [`docs/`](docs): the per diem and itemized generator specs the app implements.

## How it works

- `src/core.js`: all logic, with no UI. Week splitting, per-cell values for each weekly sheet, the `.xlsx` writer, the PDF form renderer, receipt naming, and the receipt-reading prompt. Runs in the browser and in Node.
- **Excel output clones the template XML** instead of rebuilding it: the weekly sheet is copied once per week and only the data cells change, so fonts, fills, borders, merges, column widths, number formats, data validation and formulas stay exactly as in `templates/`. Formula results are written as cached values and the workbook is flagged to recalculate on open. Leftover template text (the sample employee, the author's folder path) is dropped from every generated file.
- **PDF output** is drawn with jsPDF from `src/layouts.json`, a print-layout map (widths, heights, fills, borders, fonts, merges, number formats) extracted from the templates by `tools/extract_layout.py`.
- `src/app.src.html`: the interface (Preact + htm). `build.js` inlines the core, the layout map and both templates into one file per environment in `dist/`, using the settings in `environments.json` (title, QA band).
- Libraries load from jsDelivr at pinned versions with integrity hashes: htm 3.1.1 (Preact), JSZip 3.10.1, jsPDF 2.5.1, and pdf.js 3.11.174 (only when a PDF receipt is added).

## Where it runs

Only inside Claude, from each environment's Artifact link:
- **Sign-in:** everyone signs in with their Claude account.
- **Saving:** reports and receipts are saved to that person's private area of the app's database (`data/users/<id>/…`), so they open on any device.
- **On the device:** nothing is stored.
- **Opened elsewhere or signed out:** only a sign-in screen shows.

Pages can't open a print dialog inside an Artifact, so the PDFs are the print path. On a phone, Download opens the share sheet, which has Print.

## Develop

```bash
npm install
npm run build        # dist/prod/ and dist/qa/: the Artifact page for each environment
npm test             # builds sample reports in test/out and verifies them
npm run test:e2e     # browser run-through with several people at once (needs a Playwright Chromium)
```

`npm run test:e2e` covers the privacy guarantees: it checks that people only ever see their own data, even when they bypass the app. The full list is in [docs/SECURITY.md](docs/SECURITY.md#how-its-tested).

`npm test` builds fictional sample reports and checks three things:
- Everything outside the data cells is exactly the template's.
- Every cell matches the snapshots in `test/golden/`, recorded after the generator had reproduced Evertz's original filled-in workbooks cell for cell.
- LibreOffice (`soffice`) recalculates every workbook with no formula errors and no cached value that disagrees.

It needs Python 3 with `openpyxl`. After an intended change to the output, re-record the snapshots with `python3 test/verify.py --update`.

**Changing a template:** replace the file in `templates/` (keep the layout), run `npm run layouts` to refresh the PDF layout map, then `npm run build` and `npm test`.

## Layout

```
src/               core.js, app.src.html, layouts.json
templates/         itemized-expense-claim.xlsx, perdiem-travel-expense.xlsx (the blank Evertz forms)
tools/             extract_layout.py
test/              generate.js, verify.py, e2e.js, golden/ (snapshots), fixtures/ (fictional receipts)
docs/              the per diem and itemized generator specs, ENVIRONMENTS.md, SECURITY.md
environments.json  prod and QA settings
dist/prod, dist/qa built app for each environment
```
