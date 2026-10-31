# MyExpense

A web app for travel expense reports that works on a phone. Fill in a **per diem** or **itemized** report, take photos of receipts with the camera, and download everything you hand in at the office:

- the official Excel form (cloned from the company templates, one sheet per week),
- a print-ready PDF of the same form,
- the receipts, as one printable PDF or a zip of individual files.

It runs in two ways, from one codebase:
- **On Claude**, as a claude.ai Artifact. Everyone signs in with their Claude account.
- **As a website** on your own hosting, such as Hostinger. People are invited and sign in with email, a password and a code from an authenticator app. Setup is in [docs/HOSTINGER.md](docs/HOSTINGER.md).

Either way, each person sees and manages only their own expenses, and Claude reads the receipts. To show it to someone, share the **preview**: the whole app with nothing saved and no sign-in ([docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md#shareable-preview)). How that privacy is enforced is in [docs/SECURITY.md](docs/SECURITY.md).

There are two environments, **production** (`main` branch) and **QA** (`qa` branch), each with its own data. See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md) for the links and how to release a change.

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
- **Bank statement:** add the card statement pages that back the claim (screenshots, photos, a PDF or a Word file):
  - Claude lists every line on each page and ticks the ones you marked, or the usual claim types if nothing is marked.
  - Every ticked line goes on the report, with or without a receipt.
  - Each charge is paired with its line. A US-dollar receipt gets its CAD amount from its line automatically, and a receipt added after the statement joins the charge its line made, so nothing is counted twice.
  - The app points out every missing receipt, any charge that isn't on the statement, and any amount that differs. A receipt can be attached to a charge that has none.
  - A statement added with the receipts moves to this section by itself.

**Downloads**
| File | Name |
| --- | --- |
| Excel form | `{Customer} PD Expenses {Mon D}-{Mon D} {Year}.xlsx` / `{Customer} Itemized Expenses {Mon D}-{Mon D} {Year}.xlsx` |
| PDF of the form | same name, `.pdf` |
| Receipts PDF (itemized) | `… Receipts.pdf`, two per page, numbered, labelled with date, type, vendor and CAD amount |
| Receipt files (itemized) | `… Receipts.zip`, e.g. `01 2026-04-29 Taxi - Uber - CA$36.93.jpg`; PDF receipts stay PDFs |
| One receipt | from the photo viewer |
| Bank statement (itemized) | `… Bank Statement.pdf`: the statement lines on the claim, each with the report charge it corresponds to (and whether it has a receipt), any report charges not found on the statement, then the statement pages |
| Statement files (itemized) | `… Bank Statement files.zip`: the statements as uploaded. PDFs come back exactly as they were; screenshots and photos come back as pictures. |

The full rules are in [`docs/`](docs): the per diem and itemized generator specs the app implements.

## How it works

- `src/core.js`: all logic, with no UI. Week splitting, per-cell values for each weekly sheet, the `.xlsx` writer, the PDF form renderer, receipt naming, and the receipt-reading prompt. Runs in the browser and in Node.
- **Excel output clones the template XML** instead of rebuilding it: the weekly sheet is copied once per week and only the data cells change, so fonts, fills, borders, merges, column widths, number formats, data validation and formulas stay exactly as in `templates/`. Formula results are written as cached values and the workbook is flagged to recalculate on open. Leftover template text (the sample employee, the author's folder path) is dropped from every generated file.
- **PDF output** is drawn with jsPDF from `src/layouts.json`, a print-layout map (widths, heights, fills, borders, fonts, merges, number formats) extracted from the templates by `tools/extract_layout.py`.
- `src/app.js` and `src/app.css`: the interface (Preact + htm), the same on Claude and on the web. What differs, meaning sign-in, storage, receipt reading and downloads, sits behind a small platform interface: `src/platform-claude.js` and `src/platform-web.js`.
- `build.js` makes both targets, using the settings in `environments.json` (title, QA band):
  - `dist/prod/` and `dist/qa/`: one self-contained page per Claude environment, with the core, the layout map and both templates inlined, and libraries from jsDelivr.
  - `dist/web/`: the website's files, with every library and font served by the site itself, no inline scripts, and an integrity hash on every script and stylesheet.
- Libraries are pinned to the exact versions in `package-lock.json` and integrity-checked: htm 3.1.1 (Preact), JSZip 3.10.2, jsPDF 4.2.1, and pdf.js 6.4.299 (only when a PDF receipt is added).
- `server.js` and `server/`: the web version's server, built on Express and MySQL/MariaDB. It handles accounts, two-step sign-in, sessions, encrypted storage, administration and receipt reading through the Anthropic API.

## Where it runs

**On Claude**, from each environment's Artifact link:
- **Sign-in:** everyone signs in with their Claude account.
- **Saving:** reports and receipts are saved to that person's private area of the app's database (`data/users/<id>/…`), so they open on any device.
- **On the device:** nothing is stored.
- **Opened elsewhere or signed out:** only a sign-in screen shows.

Pages can't open a print dialog inside an Artifact, so the PDFs are the print path. On a phone, Download opens the share sheet, which has Print.

**As a website** ([docs/HOSTINGER.md](docs/HOSTINGER.md)):
- **Accounts:** by invitation from an administrator, with a password plus an authenticator app code at every sign-in.
- **Saving:** reports and receipts are saved to the server's database, encrypted, under that person's account.
- **Administrators:** manage accounts and see the activity log, never anyone's expenses.
- **Install:** it can be added to a phone's home screen.

## Develop

```bash
npm ci               # exact locked versions
npm run audit        # must report 0 vulnerabilities
npm run build        # dist/prod/, dist/qa/ (Claude), dist/preview/ and dist/web/ (website); commit dist/ with your change
npm test             # unit checks, library integrity, sample reports + spreadsheet checks
npm run test:e2e     # Claude version: browser run-through with several people at once (needs a Playwright Chromium)
npm run test:server  # web server security checks against a real MySQL/MariaDB (see test/support/server-harness.js)
npm run test:e2e-web # web version: browser run-through with two-step sign-in
npm start            # run the website locally (set the environment variables in docs/HOSTINGER.md)
```

`npm run test:e2e` covers the privacy guarantees: it checks that people only ever see their own data, even when they bypass the app. The full list is in [docs/SECURITY.md](docs/SECURITY.md#how-its-tested).

CI (`.github/workflows/ci.yml`) runs on every push and pull request to `main` and `qa`, and weekly:
- the audit;
- a check that `dist/` matches the source;
- `npm test` and `npm run test:e2e`;
- the web tests against a MariaDB 10.11 service.

`npm test` runs `test/unit.js` (the rules and safety guards) and `test/integrity.js` (every library hash matches the lockfile). It then builds fictional sample reports and checks three things:
- Everything outside the data cells is exactly the template's.
- Every cell matches the snapshots in `test/golden/`, recorded after the generator had reproduced Evertz's original filled-in workbooks cell for cell.
- LibreOffice (`soffice`) recalculates every workbook with no formula errors and no cached value that disagrees.

It needs Python 3 with `openpyxl`. After an intended change to the output, re-record the snapshots with `python3 test/verify.py --update`.

**Changing a template:** replace the file in `templates/` (keep the layout), run `npm run layouts` to refresh the PDF layout map, then `npm run build` and `npm test`.

## Layout

```
src/               core.js, app.js, app.css, platform-claude.js, platform-web.js, platform-preview.js, shell-claude.html, web/ (page shell, fonts, icon), layouts.json, vendor.json
server.js          the website's entry point (Hostinger: Entry file)
server/            the web server: auth, data, admin, ai, crypto, db, security, setup help
templates/         itemized-expense-claim.xlsx, perdiem-travel-expense.xlsx (the blank Evertz forms)
tools/             extract_layout.py
test/              unit.js, integrity.js, generate.js, verify.py, e2e.js, server.js, e2e-web.js, support/, golden/ (snapshots), fixtures/ (fictional receipts)
.github/           CI workflow, Dependabot, CODEOWNERS
SECURITY.md        how to report a vulnerability
docs/              the per diem and itemized generator specs, ENVIRONMENTS.md, HOSTINGER.md, SECURITY.md
environments.json  prod and QA settings
dist/              built app: prod/ and qa/ (Claude), preview/ (shareable, nothing saved), web/ (website)
```
