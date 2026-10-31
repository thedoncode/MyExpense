# Security and privacy

MyExpense handles personal information: names, trips, card details on receipts. It runs in two ways, from one codebase:
- **On Claude**, as a claude.ai Artifact, where sign-in and storage are Claude's (the first half of this page);
- **As a website** on your own hosting, such as Hostinger, with its own accounts, two-step sign-in and an encrypted database ([The web version](#the-web-version)).

For each, this page covers who can see what and what enforces it, the threats considered and the control for each, and the settings an enterprise deployment needs. [Code and supply chain](#code-and-supply-chain) applies to both.

To report a problem, see [SECURITY.md](../SECURITY.md) at the repo root.

# On Claude

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
- **Card numbers aren't kept in full.** Claude is asked for only the last four digits, and any run of eight or more digits is masked to `••1234` before it's saved, in receipts and in statement rows alike. Receipt photos and statement pages are kept as taken, because they're needed for the claim.

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

- **Locked dependencies.** Versions are pinned exactly and locked in `package-lock.json`. In the browser: htm 3.1.1, JSZip 3.10.2, jsPDF 4.2.1, pdf.js 6.4.299. On the web server: Express 5.2.1, mysql2 3.24.5 and qrcode 1.5.4, and nothing else; encryption, password hashing and two-step codes use Node's built-in crypto. CI installs with `npm ci`.
- **Zero known vulnerabilities.** `npm audit` must report nothing, on every push and pull request and weekly, because new advisories appear for old versions.
- **Integrity on every script.** The build fails if any script tag lacks an integrity hash. The integrity test fails if a hash, URL or version disagrees with the lockfile, or if the web version's own copy of a library differs by a byte from the locked package.
- **The committed build matches the source.** CI rebuilds and fails if `dist/` differs from what's committed, so what's published is what was reviewed.
- **Behavioural tests on every change:**
  - unit checks on the rules and the safety guards, including the two-step code test vectors from RFC 6238;
  - spreadsheet checks (template fidelity, snapshots, LibreOffice recalculation with zero formula errors);
  - the multi-person privacy run-through in a real browser, for the Claude version;
  - the web server's security checks against a real MariaDB database, and a browser run-through of the web version (see [How the web version is tested](#how-the-web-version-is-tested)).
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

# The web version

## Who can see what

| | Their own reports and receipts | Anyone else's |
| --- | --- | --- |
| A person with an account | Read, change, delete | Nothing. Asking for someone else's report or receipt by id returns "not found", and writing to the same id only ever touches their own. |
| An administrator | Their own, like anyone | Nothing. Administrators see names, emails, roles, last sign-in and the activity log. No endpoint returns anyone's expenses. |
| Someone with only a password | None | Nothing until they enter the code from the account's authenticator app |
| Someone without an account | None | Nothing. There's no sign-up: accounts are by invitation only. |
| Whoever runs the hosting | Encrypted data only, without `DATA_KEY` | Holding both the database and `DATA_KEY` (the hosting account owner) is what it takes to read stored data. Keep that to as few people as possible. |

## What enforces it

- **Two-step sign-in for everyone.** A password (at least 12 characters, checked against common choices, hashed with scrypt) and then a 6-digit code from an authenticator app (TOTP, RFC 6238). Nobody gets at any data until both are done, including on a new account: inviting someone only lets them choose a password and set up the app. Each code works once. Ten one-time recovery codes cover a lost phone.
- **Lockout.** Five wrong passwords or codes in a row lock the account for 15 minutes. Many failures from one address slow that address down too. A wrong password and an unknown email get the same answer, in the same time, so accounts can't be discovered.
- **Sessions.** A random 256-bit token in a cookie that scripts can't read (`__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`). Only its hash is stored. A new token is issued at each step of signing in and when the password changes. A session ends after 30 minutes without activity or 12 hours in all. The page also clears itself from the screen when its session ends. Signing out, changing your password, being reset or being turned off ends the sessions at once.
- **Every query is scoped to the signed-in person.** Their id comes from their session on the server, never from the request, and every read, write and delete of reports, receipts and details includes it.
- **Encrypted at rest.** Reports, receipt photos and PDFs, personal details and two-step secrets are encrypted with AES-256-GCM using `DATA_KEY`, which lives in the hosting settings, not in the database. Each value is bound to its owner and record, so a value copied into another person's row won't open. Passwords, session tokens, invite and reset links, and recovery codes are stored only as hashes.
- **Requests from other sites are refused.** Changes must carry this site's own `Origin`. Every API call needs a custom header that other sites can't send. Cross-site fetches are refused even for reads.
- **A strict Content-Security-Policy.** The page loads only scripts from its own site, each with an integrity hash; no inline script runs. It can't be framed, and its fonts and libraries are served by the site itself, so no request goes to any other site. The server also sends `Strict-Transport-Security`, `nosniff`, `no-referrer` and `no-store` on the API.
- **Stored data is validated.** Reports and details go through the same validation as on Claude, on the server, before they're stored. Uploads must really be JPEG photos (up to 8 MB) or PDF originals (up to 7 MB). Each person has a storage limit.
- **Receipt reading keeps the key on the server.** The server sends Claude the person's own stored receipt with a fixed prompt. Nothing from the request is passed on, so it can't be used to send Claude anything else. Each person has a daily limit, and Claude's answer is validated before it's returned, with card numbers masked to the last four digits.
- **Invite and reset links** are one-time, expire (3 days and 24 hours), and carry their token after `#`. Browsers never send that part to a server, so it stays out of logs, and the page removes it from the address bar at once.
- **An activity log** records sign-ins, failed attempts, lockouts, two-step changes, invites, resets and account changes, with the time and address. It never records expenses, and it's kept for 400 days.
- **Nothing is kept on the device** apart from the session cookie: no local storage, no IndexedDB.
- **Unconfigured means closed.** Until every required setting is present and valid, the server shows only a page naming the missing settings, never their values, and stores nothing. It refuses an `APP_ORIGIN` that isn't https, and a `DATA_KEY` that isn't 32 random bytes.

## Threat model (web version)

| Threat | Control |
| --- | --- |
| A user reads or changes another user's expenses | All queries are scoped by the session's user id. Values are bound to their owner, so they won't open in another row. Tested by one person requesting, overwriting and deleting another's records by id, and by copying a record between rows in the database. |
| An administrator snoops | No administration endpoint returns expenses. Tested by searching the administration responses for report contents. |
| A stolen or guessed password | The authenticator code is required as well. Lockout after 5 failures. Slow, salted scrypt hashes. |
| A stolen code | Codes last 30 seconds and work once. |
| Session theft or fixation | The cookie can't be read by scripts and isn't sent cross-site. A new token at each sign-in step. Short idle and absolute timeouts. |
| Cross-site request forgery | `SameSite=Strict`, an `Origin` check and a custom header on every API call. |
| Script injection | A strict CSP with no inline scripts. The interface never builds HTML from saved text. Uploads are only ever served back as downloads. |
| A database leak or a stolen backup | Expenses, receipts, details and two-step secrets are encrypted, with the key kept outside the database. Passwords and tokens are hashed. |
| A leaked `DATA_KEY` | Change it: the server re-encrypts everything with the new key. ([HOSTINGER.md](HOSTINGER.md#changing-data_key)) |
| A leaver keeps access | An administrator turns the account off, which ends its sessions at once. |
| A lost phone or forgotten password | Recovery codes; an administrator's one-time reset link; for a locked-out sole administrator, a reset link written to the hosting log. |
| Someone claims a fresh install | Setup needs `SETUP_TOKEN` from the hosting settings and only works while there are no accounts. Without the token, setup is closed. |
| Abuse of receipt reading | A fixed prompt, only the person's own stored files, per-minute and daily limits. Set a spend limit on the API key in the Anthropic Console. |
| A tampered library | Libraries are served by the site itself, byte-identical to the locked packages and integrity-checked, under a CSP that allows only this site. |

## Limits to know about (web version)

- **Whoever controls the hosting account controls the data.** The hosting account holds both the database and `DATA_KEY`. Protect it with two-step sign-in on Hostinger and on GitHub, and keep access to one or two people.
- **Rate limits live in the server's memory.** They reset when Hostinger restarts the app. Account lockouts are stored in the database and survive a restart.
- **Invites and resets are links you send yourself.** MyExpense doesn't send email.
- **Receipt images go to Anthropic** for reading, under your API account's terms, when `ANTHROPIC_API_KEY` is set.

## Enterprise checklist (web version)

- [ ] Turn on two-step sign-in for the Hostinger account and the GitHub account, and limit who can use each.
- [ ] Give each website its own database, `DATA_KEY` and API key. Keep each `DATA_KEY` in a password manager.
- [ ] Remove `SETUP_TOKEN` once the first administrator exists. Keep at least two administrators.
- [ ] Use https only. Don't set `APP_ORIGIN` to an http address.
- [ ] Set a spend limit on the Anthropic API key.
- [ ] Turn accounts off the day someone leaves, and review **Activity** regularly.
- [ ] Protect `main` and `qa` on GitHub (see [the GitHub checklist](#enterprise-deployment-checklist)). Hostinger deploys whatever is pushed to them.

## How the web version is tested

- `npm run test:server` runs a real server against a real MariaDB database (in CI, MariaDB 10.11 with 4 MB packets, like shared hosting), with a stand-in for the Anthropic API. It checks:
  - the headers;
  - other sites' requests;
  - setup;
  - two-step sign-in, including no reuse of codes or recovery codes;
  - lockout and slow-down;
  - session cookie flags, rotation and expiry;
  - isolation between people, including by id and by copying encrypted rows;
  - encryption at rest;
  - validation and storage limits;
  - receipt reading (a fixed prompt, the key never exposed, the daily limit);
  - administration (turning off, reset links, the audit log);
  - deleting data;
  - administrator recovery;
  - changing `DATA_KEY`;
  - the setup page.
- `npm run test:e2e-web` drives the web version in a browser:
  - setting up the first administrator with two-step sign-in;
  - inviting two people;
  - both using it at once, including calling the API directly;
  - receipts read and downloaded;
  - signing out and back in;
  - a session ending;
  - a turned-off account.

  It also checks that there are no Content-Security-Policy violations or page errors.
- Both run in CI on every push and pull request.

