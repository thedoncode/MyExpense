# Environments

MyExpense has two environments. Both are built from this repo; the branch decides what each one runs.

| | Production | QA |
| --- | --- | --- |
| Branch | `main` | `qa` |
| App (claude.ai Artifact) | https://claude.ai/artifact/Hx6y2N1JsE6MaqoAhVJSW1 | https://claude.ai/artifact/NVoETTZKp8hEuGwybEEbA4 |
| Build | `dist/prod/MyExpense.html` | `dist/qa/MyExpense-QA.html` |
| Looks like | MyExpense | MyExpense with a yellow "QA environment · test data only" band and a QA tag |
| Saved reports and receipts | Production's own database | QA's own database, completely separate |

Each Artifact has its own database, so nothing created in QA ever shows up in production, and the other way round. The Excel and PDF files QA produces are identical in format to production's; that is what QA is for.

Settings per environment live in [`environments.json`](../environments.json).

## Releasing a change

1. **Work on `qa`.** Commit to the `qa` branch (or merge a feature branch into it).
2. **Build and test.**
   ```bash
   npm run build      # builds dist/prod and dist/qa
   npm test           # template fidelity, snapshots and LibreOffice recalculation
   npm run test:e2e   # browser run-through with several people, including the QA build
   ```
3. **Publish to QA.** Update the QA Artifact with `dist/qa/MyExpense-QA.html`, keeping its access rules. In a Claude session, ask Claude to republish it to the QA link above.
4. **Check it in QA** on a phone: a per diem and an itemized report, a receipt photo, and every download.
5. **Promote.** Merge `qa` into `main`, run `npm run build`, and update the production Artifact with `dist/prod/MyExpense.html`.

Never publish a QA build to the production link. The yellow band and the "MyExpense QA" title are there to make that mistake obvious.

## Access

Both Artifacts start private to their owner. Share each one from its Share menu: production with everyone who files expenses, QA only with the people testing. Give people Contributor ("can use") access, and Editor only to the people who maintain the app. [SECURITY.md](SECURITY.md#setting-up-sharing) explains why.

Both Artifacts must be published with the access rules in [SECURITY.md](SECURITY.md#what-enforces-it). They keep each person's data private.
