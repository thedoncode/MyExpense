# Hosting MyExpense on Hostinger

MyExpense runs as a website on Hostinger's **Node.js web apps**, which come with the Business web hosting plan and the Cloud plans. There are two websites, each with its own database, its own secrets and its own people:

| | Production | QA |
| --- | --- | --- |
| Deploys from branch | `main` | `qa` |
| Address (example) | `https://expenses.example.com` | `https://expenses-qa.example.com` |
| Looks like | MyExpense | MyExpense with the yellow "QA environment · test data only" band |
| Database | its own | its own, completely separate |

Every push to a branch redeploys its website by itself. The Claude versions in [ENVIRONMENTS.md](ENVIRONMENTS.md) keep working alongside: one codebase, two ways to run it.

**What the web version gives you.** People sign in with email, a password and a 6-digit code from an authenticator app. Accounts are by invitation only. Each person sees only their own reports and receipts, which are stored encrypted. Administrators manage accounts but can't see anyone's expenses. [SECURITY.md](SECURITY.md#the-web-version) has the details.

Only the hosting account owner should do the steps below. They involve passwords and secret keys: type or paste them only into Hostinger's own pages, and keep a copy in a password manager.

## 1. Choose the two addresses

Use one address per website, for example `expenses.yourcompany.com` and `expenses-qa.yourcompany.com`. Hostinger needs each subdomain to be its own website, not a folder of an existing one. A free temporary Hostinger subdomain works for QA.

## 2. Create each website (do this twice: production, then QA)

1. In hPanel go to **Websites → Add Website → Node.js web app**.
2. Under **Import your Git repository**, click **Connect with GitHub** (or **Continue with GitHub**). When GitHub asks, install the Hostinger GitHub App for **only** the `MyExpense` repository.
3. Pick the `MyExpense` repository and set:

   | Setting | Production | QA |
   | --- | --- | --- |
   | Branch | `main` | `qa` |
   | Application type | `express` | `express` |
   | Node.js version | 22 | 22 |
   | Root directory | *(empty)* | *(empty)* |
   | Build script | *(empty)*: the built app is already in `dist/` | *(empty)* |
   | Output directory | *(empty)* | *(empty)* |
   | Entry file | `server.js` | `server.js` |
   | Package manager | `npm` | `npm` |

4. Choose the address from step 1 and click **Deploy**.

When the deployment finishes, open the address. You'll see **Finish setting up MyExpense**, listing the settings that are still missing. Nothing can be stored or signed into yet. Keep that page open: it makes the two secrets you need in step 4.

## 3. Create each website's database

1. In the website's dashboard go to **Databases → Management**.
2. Enter a database name (for example `myexpense`) and a database username (for example `myexpense`). For the password, use a long random one from your password manager.
3. Click **Create**. Hostinger adds your account prefix, so the real names look like `u123456789_myexpense`. Note both names.

Use a different database for QA. MyExpense creates its own tables the first time it starts.

## 4. Add the settings

In the website's dashboard open **Environment variables** and add these. Saving redeploys the website.

| Name | Value |
| --- | --- |
| `APP_ENV` | `prod` for production, `qa` for QA |
| `APP_ORIGIN` | The website's exact address, with `https://` and no slash at the end, for example `https://expenses.yourcompany.com` |
| `DB_HOST` | `127.0.0.1` (not `localhost`) |
| `DB_PORT` | `3306` |
| `DB_NAME` | The full database name from step 3, for example `u123456789_myexpense` |
| `DB_USER` | The full database username from step 3 |
| `DB_PASSWORD` | The database password from step 3 |
| `DATA_KEY` | Copy it from the **Finish setting up MyExpense** page. It encrypts everyone's reports and receipts. Use a different one for QA. |
| `SETUP_TOKEN` | Copy it from the same page. It lets you create the first administrator, and you remove it right after (step 5). |
| `ANTHROPIC_API_KEY` | Optional: turns on receipt reading by Claude. See [Receipt reading](#receipt-reading). |

**Save `DATA_KEY` in your password manager as well.** The database only holds encrypted data. A database backup is useless without the key, and so is the key without the backup. If `DATA_KEY` is lost, nobody can read the stored expenses again, Hostinger included.

The setup page makes `DATA_KEY` and `SETUP_TOKEN` in your own browser, so they never pass through the server, Hostinger or anyone helping you. If you'd rather, `node server/tools.js new-key` and `node server/tools.js new-token` make them on your own computer.

Optional settings (the defaults are sensible):

| Name | Default | What it does |
| --- | --- | --- |
| `ANTHROPIC_MODEL` | `claude-sonnet-5-5` | The Claude model that reads receipts |
| `AI_DAILY_LIMIT` | `100` | Receipts each person can have read per day |
| `USER_QUOTA_MB` | `500` | Storage per person |
| `SESSION_IDLE_MINUTES` | `30` | Sign out after this long without activity |
| `SESSION_MAX_HOURS` | `12` | Sign out after this long, however active |
| `AUDIT_RETENTION_DAYS` | `400` | How long the activity log is kept |
| `TRUST_PROXY` | `1` | Hops of Hostinger's proxy to trust for visitors' addresses |
| `DATA_KEY_PREVIOUS` | | Only while changing `DATA_KEY` (below) |
| `RECOVER_ADMIN_EMAIL` | | Only to recover a locked-out administrator (below) |

## 5. Create the first administrator

1. Make sure the website opens over **https**. Hostinger issues the SSL certificate by itself; if it hasn't yet, wait a few minutes. MyExpense won't sign anyone in over plain http.
2. Open the address. You'll see **Set up MyExpense** (or **Set up MyExpense QA**).
3. Enter the `SETUP_TOKEN`, your work email, your name and a password of at least 12 characters. A few unrelated words works well.
4. Set up two-step sign-in. Scan the QR code with an authenticator app (Microsoft Authenticator, Google Authenticator, 1Password or similar), then enter the 6-digit code.
5. **Save the 10 recovery codes** in your password manager. Each one gets you in once if you lose your phone.
6. Go back to **Environment variables** and **delete `SETUP_TOKEN`**. Once an administrator exists the token can't be used anyway, but remove it.

Make a second administrator soon after (step 6), so one person losing their phone can't lock everyone out.

## 6. Invite people

1. Click your name at the top right, then **Manage people**.
2. Enter the person's work email, choose **Can use MyExpense** (or **Administrator**) and click **Make invite link**.
3. Copy the link and send it to them yourself, by email or chat. It works once, for 3 days.

They open the link, choose a password and set up two-step sign-in. From then on they sign in at the website's address.

**Manage people** also lets you:
- **Reset sign-in** for someone who forgot their password or lost their phone. This signs them out everywhere and gives you a one-time link (24 hours) to send them. Their expenses are kept.
- **Turn off** an account when someone leaves. This signs them out at once and stops them signing in. **Delete** erases the account and everything it stored.
- Check **Activity**: sign-ins, failed attempts, lockouts, invites and account changes.

## Releasing changes

Changes go through pull requests into `qa`, then from `qa` into `main` (see [ENVIRONMENTS.md](ENVIRONMENTS.md#releasing-a-change)). Merging into `qa` redeploys the QA website; merging into `main` redeploys production. Each deployment shows under **Deployments** in the website's dashboard, with its log.

Hostinger's vulnerability scanning may open pull requests that update packages. Treat them like any other change: they go through CI and QA first.

## Receipt reading

With `ANTHROPIC_API_KEY` set, MyExpense sends each receipt photo (or the PDF) to Claude through the Anthropic API to fill in the details. The person still checks every charge.

1. In the Anthropic Console (console.anthropic.com), create an API key for MyExpense, one for production and one for QA.
2. Set a monthly spend limit for the workspace the key belongs to.
3. Add the key as `ANTHROPIC_API_KEY`.

The key stays on the server. The page never sees it, and the server only ever sends Claude the person's own stored receipt with a fixed prompt. Without a key, people type the details from each photo, and everything else works the same.

## Backups

Hostinger's backups include the database. Everything sensitive in it is encrypted with `DATA_KEY`, so keep the key in your password manager, separate from the backups. Restoring needs both.

## Changing DATA_KEY

Change it if you think it was exposed.

1. In **Environment variables**, set `DATA_KEY_PREVIOUS` to the current key, and `DATA_KEY` to a new one. To make a new key, remove `DATA_KEY` for a moment and the setup page offers one, or use `node server/tools.js new-key`.
2. Save. As it starts, MyExpense re-encrypts everything with the new key and writes "Re-encrypted … You can now remove DATA_KEY_PREVIOUS" to its log.
3. Delete `DATA_KEY_PREVIOUS` and save again.

## Locked out

- **Lost phone:** sign in with your password and one of your recovery codes. To set up the new phone, ask an administrator to **Reset sign-in** for you (administrators can use **Reset my sign-in**).
- **Forgot password:** another administrator uses **Reset sign-in**.
- **The only administrator, with no recovery codes left:**
  1. Add `RECOVER_ADMIN_EMAIL` with your email and save.
  2. The server writes a one-time reset link (24 hours) to its runtime log in the website's dashboard. Only the hosting account can see it.
  3. Open the link, choose a new password and set up two-step sign-in again.
  4. **Remove `RECOVER_ADMIN_EMAIL`.**

## If something's wrong

| You see | Do this |
| --- | --- |
| **Finish setting up MyExpense** with "these settings are not set" | Add the settings it names (step 4). |
| "can’t open its database (ER_ACCESS_DENIED_ERROR)" | Check `DB_USER` and `DB_PASSWORD`, and that the user is assigned to the database. |
| "can’t open its database (ER_BAD_DB_ERROR)" | Check `DB_NAME`, including the `u123456789_` prefix. |
| "can’t open its database (ECONNREFUSED)" | Set `DB_HOST` to `127.0.0.1`. |
| Signing in seems to work, then you're back at the sign-in screen | `APP_ORIGIN` must match the address in the browser exactly: `https://`, with or without `www`, and no slash at the end. The site must open over https. |
| "Receipt reading isn’t turned on" | Add `ANTHROPIC_API_KEY`, or check the key and the Console's spend limit. |
| "Too many tries" | Wait 15 minutes, or ask an administrator to **Unlock** the account in **Manage people**. |
| **Activity** shows the same address for everyone | Hostinger's proxy count is different from the default: set `TRUST_PROXY` to `2`, save, and check again. Sign-in slow-downs go by address, so this matters. |

The website's runtime log in hPanel explains most problems. It never contains anyone's expenses or passwords.

## How it fits together

- `server.js` starts the server, which listens on the port Hostinger gives it (`PORT`) behind Hostinger's https proxy.
- `server/` holds the API: sign-in and sessions (`auth.js`), each person's data (`data.js`), administration (`admin.js`), receipt reading (`ai.js`), encryption and passwords (`crypto.js`), the database schema (`db.js`) and request protections (`security.js`).
- `dist/web/` is the app the server sends to browsers, built by `npm run build` from the same source as the Claude version. Hostinger deploys it as committed, so there is no build step on the server.
- Sessions, reports and receipts live in MySQL/MariaDB, never in files. Hostinger replaces the app's files on every deployment.
