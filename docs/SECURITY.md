# Security and privacy

MyExpense handles personal information: names, trips, card details on receipts. This page covers who can see what, what enforces it, and how to set up sharing so it stays that way.

## Who can see what

| | Their own reports and receipts | Anyone else's |
| --- | --- | --- |
| A person using MyExpense | Read, change, delete | Nothing. Their reads come back empty and their writes are refused. |
| The person who shared MyExpense (the owner) | Read, change, delete their own | Nothing |
| Claude, working in the owner's sessions | Only the owner's | Nothing |
| Someone who can only view the page | None stored | Nothing |
| Someone not signed in to Claude | None stored | Nothing. The app shows a sign-in screen. |

## What enforces it

- **Sign-in is the Claude account.** MyExpense only runs inside its claude.ai link. Outside Claude, or signed out, it shows a sign-in screen and offers nothing else.
- **Each person gets a private area, enforced by the server.** Everything a person saves goes to `data/users/<their id>/` in the app's database. The platform makes that area private to the person: no one else can read or write it, the owner included. That isn't up to the app's code.
- **Everything else is locked to the owner.** The access rules are declared when the app is published:
  ```json
  { "db": { "rules": [
      { "path": "", "read": "owner", "write": "owner" },
      { "path": "data/users/{self}", "read": "interact", "write": "interact" }
  ] }, "user": {}, "sample": { "images": true }, "downloads": true }
  ```
  So outside their own area, nobody but the owner can read or write anything. A person's own area needs "can use" access (Contributor or higher); view-only access can't store anything. The app declares nothing else: no shared live updates, no comments, no connected apps, no self-publishing.
- **Nothing is kept on the device.** No browser storage is used: no IndexedDB, localStorage or cookies. The next person on a shared computer finds nothing. Files land on a device only when someone downloads them.
- **Losing access stops the app.** If a save is refused because access was removed or never granted, the app drops everything it was holding and shows the access screen.

## Setting up sharing

This is the part that depends on you.

- **People who file expenses: Contributor ("can use").** They can use the app and save their own expenses, but can't change the app. On a Claude Team or Enterprise plan, share with your organization or with each person at this level.
- **Editors: only people you'd trust with everyone's data.** An Editor can publish a new version of the app. A malicious version could read each person's own data while that person has it open. Keep Editors to the one or two people who maintain the app.
- **On a personal Claude plan**, other people can only save data if they're invited as Editors. So every user could change the app, which is the risk above. For a team handling personal information, run MyExpense from a Team or Enterprise plan.
- **No public link.** Share with named people or with your organization. Anyone outside it who opens a public link gets view-only access, so they can't store or see anything. But there's no reason to hand it out.
- **QA is separate.** It has its own database, so test data never mixes with real data. Share QA only with testers.

## The code itself

- **Pinned, integrity-checked libraries.** Every library (Preact/htm, JSZip, jsPDF, pdf.js) is pinned to an exact version and loaded with a Subresource Integrity hash. The browser refuses any copy that differs by a single byte. `build.js` fails if any script tag lacks a hash.
- **Untrusted files are handled defensively.**
  - **PDFs** are opened with pdf.js 3.11.174 with `isEvalSupported: false` and XFA off. `isEvalSupported: false` is the setting that closes CVE-2024-4367.
  - **Word files** are only unzipped to take out their pictures.
  - **Uploads** over 25 MB are refused.
- **Receipt reading by Claude is validated.** Claude only fills in fields; dates, amounts and categories are checked before use, and the person confirms each one. The photo goes to Claude under the person's own account. It has no tools and can't reach anyone's data.
- **No injected markup or formulas.** The interface never builds HTML from saved text. Excel files write names, vendors and other text as plain text, never as formulas. Only numeric sums are written as formulas.

## Deleting data

- Anyone can delete a report (with its receipts) from the report screen.
- **Your details → Delete all my data** erases every report, receipt and setting that person has stored.

## Limits to know about

- **Whoever controls the code controls the app.** That's the owner and any Editors. This is why Editor access must stay tight.
- **Storage is shared.** The app's database holds up to 25,000 documents across everyone; a receipt uses about three. Ask people to delete reports once they've been submitted and paid.
- **Downloaded files are ordinary files.** They're as private as the device and folder they're saved to.
- **Hosting.** Data is stored by Anthropic as part of claude.ai.

## How it's tested

`npm run test:e2e` runs the built app in a browser against a stand-in server. The server enforces the same rules and ties each browser to one signed-in person, so a page can't pretend to be someone else. It checks that:

- outside Claude or signed out, there's only a sign-in screen;
- nothing is written to the device;
- two people using the app at once see only their own reports;
- reading, writing or deleting another person's data directly, bypassing the app, returns nothing or is refused;
- writing outside your own area is refused;
- a view-only visitor's first save is refused and nothing of theirs is stored;
- QA and production data are separate;
- "Delete all my data" removes everything for that person and leaves everyone else's alone;
- every library script carries an integrity hash.

## Reporting a problem

If you find a way to see someone else's data, stop using the app and tell the app's owner directly, not in a public issue.
