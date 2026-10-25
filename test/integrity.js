// Every library the app loads must be (1) from jsDelivr's npm mirror, (2) the exact version in
// package-lock.json, and (3) carry an integrity hash that matches that file byte for byte.
// Run: node test/integrity.js   (after npm ci and npm run build)
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8'));
const files = [path.join(ROOT, 'src', 'app.src.html')];
for (const env of fs.readdirSync(path.join(ROOT, 'dist'))) for (const f of fs.readdirSync(path.join(ROOT, 'dist', env))) files.push(path.join(ROOT, 'dist', env, f));

let failed = 0, checked = 0;
const fail = (m) => { failed++; console.log('  FAIL ' + m); };
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  const refs = [];
  for (const m of html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)>/g)) {
    const attrs = m[1] + m[3];
    const sri = /integrity="([^"]+)"/.exec(attrs);
    if (!/crossorigin="anonymous"/.test(attrs)) fail(rel + ': ' + m[2] + ' lacks crossorigin="anonymous"');
    refs.push([m[2], sri && sri[1]]);
  }
  for (const m of html.matchAll(/\['(https:\/\/[^']+)',\s*'(sha384-[^']+)'\]/g)) refs.push([m[1], m[2]]); // loaded on demand
  for (const m of html.matchAll(/https:\/\/(?!cdn\.jsdelivr\.net\/npm\/|fonts\.googleapis\.com|fonts\.gstatic\.com)[a-z0-9.-]+\.[a-z]{2,}\/[^\s"'<>)]*\.m?js\b/gi)) fail(rel + ': script from an unapproved host: ' + m[0]);
  for (const [url, sri] of refs) {
    checked++;
    const u = /^https:\/\/cdn\.jsdelivr\.net\/npm\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\/(.+)$/.exec(url);
    if (!u) { fail(rel + ': not a pinned jsDelivr npm URL: ' + url); continue; }
    const [, name, version, sub] = u;
    const locked = lock.packages && lock.packages['node_modules/' + name];
    if (!locked) { fail(rel + ': ' + name + ' is not in package-lock.json'); continue; }
    if (locked.version !== version) fail(rel + ': ' + name + '@' + version + ' but package-lock.json has ' + locked.version);
    if (!sri) { fail(rel + ': ' + url + ' has no integrity hash'); continue; }
    const local = path.join(ROOT, 'node_modules', name, sub);
    if (!fs.existsSync(local)) { fail(rel + ': ' + local + ' missing; run npm ci'); continue; }
    const hash = 'sha384-' + crypto.createHash('sha384').update(fs.readFileSync(local)).digest('base64');
    if (hash !== sri) fail(rel + ': integrity mismatch for ' + url + '\n         page: ' + sri + '\n         file: ' + hash);
  }
}
console.log(failed ? 'FAIL (' + failed + ')' : 'PASS (' + checked + ' library references across ' + files.length + ' files match package-lock.json byte for byte)');
process.exit(failed ? 1 : 0);
