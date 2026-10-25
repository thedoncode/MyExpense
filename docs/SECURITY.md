# Security and privacy

MyExpense handles personal information: names, trips, card details on receipts. This page covers:
- who can see what, and what enforces it;
- the threats considered and the control for each;
- how the code and its supply chain are kept clean;
- the settings your organization needs for an enterprise deployment.

To report a problem, see [SECURITY.md](../SECURITY.md) at the repo root.

## Who can see what

| | Their own reports and receipts | Anyone else's |
| --- | --- | --- |
| A person using MyExpense | Read, change, delete | Nothing. Their reads come back empty and their writes are refused. |
| The person who shared MyExpense (the owner) | Read, change, delete their own | Nothing |
| Claude, working in the owner's sessions | Only the owner's | Nothing |
| Someone who can only view the page | None stored | Nothing |
| Someone not signed in to Claude | None stored | Nothing. The app shows a sign-in screen. |

## What enforces it

- **Sign-in is the Claude account.** MyExpense only runs inside its claude.ai link. On a Claude Team or Enterprise plan with single sign-on, that means your company's own sign-in, including its multi-factor rules. Outside Claude, or signed out, the app shows a sign-in screen and offers nothing else.
- **Each person gets a private area, enforced by the server.** Everything a person saves goes to `data/users/<their id>/` in the app's database. The platform makes that area private to the person on the server. No one else can read or write it, the owner included, and no app code can change that.
- **Everything else is locked to the owner.** The access rules are declared when the app is published:
  ```json
  { "db": { "rules": [
      { "path": "", "read": "owner", "write": "owner" },
      { "path": "data/users/{self}", "read": "interact", "write": "interact" }
  ] }, "user": {}, "sample": { "images": true }, "downloads": true }
  ```
  So outside their own area, nobody but the owner can read or write anything. A person's own area needs "can use" access (Contributor or higher); view-only access can't store anything. The app declares nothing else: no shared live updates, no comments, no connected apps, no self-publishing.
- **Nothing is kept on the device.** No browser storage is used: no IndexedDB, localStorage or cookies. The next person on a shared computer finds nothing. Files land on a device only when someone downloads them.
- **Losing access stops the app.** If a save is refused because access was removed or never granted, the app drops everything it was holding and shows the access screen. With SCIM provisioning on Claude Enterprise, someone who leaves the company loses their Claude account, and with it MyExpense.
- **Stored data is validated when it's read back.** Every report is checked against the expected shape when it loads: unknown fields dropped, text length-limited, impossible dates and amounts rejected. A damaged or tampered record can't break the app.
- **Card numbers aren't kept in full.** Claude is asked for only the last four digits, and any run of eight or more digits is masked to `••1234` before it's saved. The receipt photo itself is kept as taken, because it's needed for the claim.

## Threat model

| Threat | Control |
| --- | --- |
| A user reads or changes another user's expenses | Server-enforced private area per person; rules lock everything else to the owner. Tested by having one person call the database directly for another's data (`npm run test:e2e`). |
| Someone without an account, or signed out, gets in | Sign-in is required; nothing is shown or stored without a Claude account that has "can use" access. |
| A leaver keeps access | Claude Enterprise SCIM removes their account. Sharing is per person or per organization, never a public link. |
| A shared or lost device exposes data | Nothing is stored on the device; data loads from the account each time. |
| Someone who can edit the app ships a malicious version | Only the owner and named maintainers are Editors. Every change goes through review, CI and QA before production. Main is protected on GitHub (see the checklist below). |
| A tampered library from the CDN | Every library is pinned and carries a Subresource Integrity hash. The browser refuses a copy that differs by one byte. `test/integrity.js` checks each hash against `package-lock.json`. |
| A library with a known vulnerability | `npm audit` runs on every change and weekly in CI, and must report zero issues. Dependabot proposes updates. |
| A malicious receipt file (PDF, Word, image) | pdf.js 6 has no script path and XFA is off. Word files are only unzipped for their pictures. Files over 25 MB and images over 80 megapixels are refused. |
| Prompt injection through a receipt photo | Claude only returns field values, which are validated (dates, amounts, categories, lengths) and confirmed by the person. Claude has no tools and can't reach anyone's data. |
| Script or markup injection through saved text | The interface never builds HTML from saved text. |
| Formula injection in the Excel files | Names, vendors and other text are written as plain text, never as formulas. A unit test feeds `=HYPERLINK(...)` and similar. |
| Path tricks in download names | File names are stripped of path and reserved characters. |
| Storage exhaustion | Uploads are size-limited; people can delete reports and "Delete all my data". See limits below. |

## Code and supply chain

- **Locked dependencies.** Versions are pinned exactly and locked in `package-lock.json`: htm 3.1.1, JSZip 3.10.2, jsPDF 4.2.1, pdf.js 6.4.299. CI installs with `npm ci`.
- **Zero known vulnerabilities.** `npm audit` must report nothing, on every push and pull request and weekly, because new advisories appear for old versions.
- **Integrity on every script.** The build fails if any script tag lacks an integrity hash. The integrity test fails if a hash, URL or version disagrees with the lockfile.
- **The committed build matches the source.** CI rebuilds and fails if `dist/` differs from what's committed, so what's published is what was reviewed.
- **Behavioural tests on every change:**
  - unit checks on the rules and the safety guards;
  - spreadsheet checks (template fidelity, snapshots, LibreOffice recalculation with zero formula errors);
  - the multi-person privacy run-through in a real browser.
- **Least-privilege CI.** The workflow token can only read the repository.
- **Every change is reviewed.** `CODEOWNERS` routes every change to the maintainer. Dependabot keeps npm packages and GitHub Actions current.

## Enterprise deployment checklist

**Claude (claude.ai)**
- [ ] Run MyExpense from a **Claude Enterprise** (or Team) organization, not a personal account. Only then can people be given "can use" (Contributor) access without also being able to edit the app.
- [ ] Turn on **single sign-on** (Team and Enterprise) and **SCIM provisioning** (Enterprise), so sign-in follows company policy and leavers lose access automatically.
- [ ] Share production with the organization or named people at **Contributor**. **Editor** goes only to the one or two maintainers. No public link.
- [ ] Share QA only with testers.
- [ ] Publish both apps with the access rules above (`docs/ENVIRONMENTS.md` has the release steps).
- [ ] On Enterprise, set **custom data retention** to match company policy, and use **audit logs** to review sign-ins and membership changes.

**GitHub (this repository)**
- [ ] Protect `main` and `qa`: require a pull request and require the **CI** check to pass; block force-pushes and deletion.
- [ ] Turn on Dependabot alerts and security updates, secret scanning with push protection, and private vulnerability reporting.
- [ ] Turn on CodeQL code scanning (default setup).
- [ ] Require two-factor sign-in for everyone with write access.
- [ ] Make the repository **private** if your company treats its expense forms as internal.

## Deleting data

- Anyone can delete a report (with its receipts) from the report screen.
- **Your details → Delete all my data** erases every report, receipt and setting that person has stored.

## Limits to know about

- **Whoever controls the code controls the app.** That's the owner and any Editors. Keep that group small and make every change go through review and QA.
- **Storage is shared.** The app's database holds up to 25,000 documents across everyone; a receipt uses about three. Ask people to delete reports once they've been submitted and paid.
- **Downloaded files are ordinary files.** They're as private as the device and folder they're saved to.
- **Hosting.** Data is stored and processed by Anthropic as part of claude.ai under your organization's agreement. Receipt photos are sent to Claude to be read.
- **No in-app audit trail.** Each person's area is theirs to change, so a tamper-proof record of edits would need a separate system.

## How it's tested

- `npm test`: unit checks, library integrity, spreadsheet fidelity and recalculation.
- `npm run test:e2e`: the built app in a browser against a stand-in server. The server enforces the same rules and ties each browser to one signed-in person, so a page can't pretend to be someone else. It checks that:
  - outside Claude or signed out, there's only a sign-in screen;
  - nothing is written to the device;
  - two people using the app at once see only their own reports;
  - reading, writing or deleting another person's data directly, bypassing the app, returns nothing or is refused;
  - writing outside your own area is refused;
  - a view-only visitor's first save is refused and nothing of theirs is stored;
  - files over 25 MB are refused;
  - QA and production data are separate;
  - "Delete all my data" removes everything for that person and leaves everyone else's alone;
  - every library script is integrity-checked.
- Both run in CI on every push and pull request to `main` and `qa`.
