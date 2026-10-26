# Environments

MyExpense has two environments, production and QA. Each runs in two places, both built from this repo: as a claude.ai Artifact, and as a website on Hostinger ([HOSTINGER.md](HOSTINGER.md)). The branch decides what each one runs.

| | Production | QA |
| --- | --- | --- |
| Branch | `main` | `qa` |
| App (claude.ai Artifact) | https://claude.ai/artifact/Hx6y2N1JsE6MaqoAhVJSW1 | https://claude.ai/artifact/NVoETTZKp8hEuGwybEEbA4 |
| Build | `dist/prod/MyExpense.html` | `dist/qa/MyExpense-QA.html` |
| Website (Hostinger) | Deploys `main` with `APP_ENV=prod` | Deploys `qa` with `APP_ENV=qa` |
| Website build | `dist/web/` | `dist/web/` (the server sets the title and band) |
| Looks like | MyExpense | MyExpense with a yellow "QA environment · test data only" band and a QA tag |
| Saved reports and receipts | Production's own database | QA's own database, completely separate |

Each Artifact, and each website, has its own database, so nothing created in QA ever shows up in production, and the other way round. The Claude and website versions don't share data either. The Excel and PDF files QA produces are identical in format to production's; that is what QA is for.

Settings per environment live in [`environments.json`](../environments.json).

## Shareable preview

A third Artifact, the **preview** (https://claude.ai/artifact/FYpPZcmBNChmCE9G5KfUW7), is for showing MyExpense to people. It's the whole app, opening on two marked examples. It has no sign-in and saves nothing anywhere: what a visitor enters lasts until they close or reload the page. Receipt reading and downloads work when the visitor opens it in Claude and allows them. It's built from the same source into `dist/preview/MyExpense-Preview.html` (`src/platform-preview.js` keeps everything in memory) and published with only the `sample` and `downloads` capabilities, so it has no database at all. Share it from its Share menu. Republish it after a release, the same way as the others.

## Releasing a change

`main` and `qa` are protected: changes reach them only through pull requests whose CI check ("Audit, build and test") has passed. Nobody, admins included, can push directly, force-push or delete them.

1. **Branch from `qa`** and make the change on a feature branch.
2. **Build and test locally.**
   ```bash
   npm ci
   npm run build      # builds dist/prod and dist/qa (commit dist/ with the change)
   npm test           # unit, integrity, template fidelity, snapshots, LibreOffice recalculation
   npm run test:e2e   # browser run-through with several people, including the QA build
   npm run test:server && npm run test:e2e-web   # the website version (needs MySQL/MariaDB)
   ```
3. **Open a pull request into `qa`.** CI runs the audit, checks `dist/` matches the source, and runs every test. Merge when it's green.
4. **Publish to QA.** Merging into `qa` redeploys the QA website by itself. Update the QA Artifact with `dist/qa/MyExpense-QA.html`, keeping its access rules: in a Claude session, ask Claude to republish it to the QA link above.
5. **Check it in QA** on a phone: a per diem and an itemized report, a receipt photo, and every download.
6. **Promote.** Open a pull request from `qa` into `main`. When CI is green, merge it. That redeploys the production website. Then update the production Artifact with `dist/prod/MyExpense.html`.

Never publish a QA build to the production link. The yellow band and the "MyExpense QA" title are there to make that mistake obvious.

## Access

Both Artifacts start private to their owner. Share each one from its Share menu: production with everyone who files expenses, QA only with the people testing. Give people Contributor ("can use") access, and Editor only to the people who maintain the app. [SECURITY.md](SECURITY.md#setting-up-sharing) explains why.

Both Artifacts must be published with the access rules in [SECURITY.md](SECURITY.md#what-enforces-it). They keep each person's data private.
