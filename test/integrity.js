// Every library the app loads must be (1) from jsDelivr's npm mirror, (2) the exact version in
// package-lock.json, and (3) carry an integrity hash that matches that file byte for byte.
// Run: node test/integrity.js   (after npm ci and npm run build)
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8'));
const files = [path.join(ROOT, 'src', 'shell-claude.html'), path.join(ROOT, 'src', 'vendor.json')];
for (const env of fs.readdirSync(path.join(ROOT, 'dist'))) if (env !== 'web') for (const f of fs.readdirSync(path.join(ROOT, 'dist', env))) files.push(path.join(ROOT, 'dist', env, f));

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
  for (const m of html.matchAll(/\[\s*(['"])(https:\/\/[^'"]+)\1,\s*(['"])(sha384-[^'"]+)\3\s*\]/g)) refs.push([m[2], m[4]]); // loaded on demand
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

// The web version serves its own copies: /assets/vendor/<package>@<version>/<file> must be the
// locked version, byte for byte, and every script and stylesheet hash must match the file served.
const WEB = path.join(ROOT, 'dist', 'web');
let webChecked = 0;
if (fs.existsSync(path.join(WEB, 'index.html'))) {
  const html = fs.readFileSync(path.join(WEB, 'index.html'), 'utf8');
  const sha = (f) => 'sha384-' + crypto.createHash('sha384').update(fs.readFileSync(f)).digest('base64');
  const refs = [];
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="(\/assets\/[^"]+\.(?:js|css|mjs))"[^>]*>/g)) {
    const sri = /integrity="([^"]+)"/.exec(m[0]);
    if (!sri) fail('dist/web/index.html: ' + m[1] + ' has no integrity hash');
    refs.push([m[1], sri && sri[1]]);
  }
  if (/<script>|<script(?![^>]*\bsrc=)[^>]*>|\son[a-z]+=|<style|https?:\/\//i.test(html.replace(/<!--[\s\S]*?-->/g, ''))) fail('dist/web/index.html: inline script, handler, style or outside URL');
  for (const f of fs.readdirSync(path.join(WEB, 'assets'))) if (/^app-.*\.js$/.test(f)) {
    const js = fs.readFileSync(path.join(WEB, 'assets', f), 'utf8');
    for (const m of js.matchAll(/\["(\/assets\/vendor\/[^"]+)","(sha384-[^"]+)"\]/g)) refs.push([m[1], m[2]]);
  }
  for (const [url, sri] of refs) {
    webChecked++;
    const file = path.join(WEB, url);
    if (!fs.existsSync(file)) { fail('dist/web: ' + url + ' is missing'); continue; }
    if (sri && sha(file) !== sri) fail('dist/web: integrity mismatch for ' + url);
    const v = /^\/assets\/vendor\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\/(.+)$/.exec(url);
    if (!v) continue;
    const locked = lock.packages && lock.packages['node_modules/' + v[1]];
    if (!locked || locked.version !== v[2]) { fail('dist/web: ' + v[1] + '@' + v[2] + ' is not the locked version'); continue; }
    if (!fs.readFileSync(file).equals(fs.readFileSync(path.join(ROOT, 'node_modules', v[1], v[3])))) fail('dist/web: ' + url + ' differs from the locked package');
  }
  if (webChecked < 9) fail('dist/web: expected at least 9 checked files, found ' + webChecked);
}
console.log(failed ? 'FAIL (' + failed + ')' : 'PASS (' + checked + ' library references across ' + files.length + ' Claude files, and ' + webChecked + ' web files, match package-lock.json byte for byte)');
process.exit(failed ? 1 : 0);
