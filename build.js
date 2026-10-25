// Builds MyExpense for both places it runs. One codebase, two targets:
//   dist/<env>/<Title>.html  the single-file page for that environment's claude.ai Artifact
//                            (environments.json: prod and qa), with libraries from jsDelivr
//   dist/web/                the web version the MyExpense server (server/) serves, for example on
//                            Hostinger. Everything is self-hosted, there are no inline scripts (so the
//                            Content-Security-Policy can forbid them), and every script and stylesheet
//                            carries an integrity hash. The server fills in the environment.
// Usage: node build.js            (everything)
//        node build.js qa         (one Claude environment, or "web")
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p));
const text = (...p) => read(...p).toString('utf8');
const envs = JSON.parse(text('environments.json'));
const only = process.argv[2];
if (only && only !== 'web' && !envs[only]) throw new Error('unknown target: ' + only);

const core = text('src', 'core.js');
const css = text('src', 'app.css');
const appSrc = text('src', 'app.js');
const layouts = text('src', 'layouts.json').replace(/<\//g, '<\\/');
const vendor = JSON.parse(text('src', 'vendor.json'));
const tplIt = read('templates', 'itemized-expense-claim.xlsx').toString('base64');
const tplPd = read('templates', 'perdiem-travel-expense.xlsx').toString('base64');
const sri = (buf) => 'sha384-' + crypto.createHash('sha384').update(buf).digest('base64');
const short = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 12);

function filled(src, pairs) {
  let out = src;
  for (const [a, b] of pairs) {
    if (!out.includes(a)) throw new Error('placeholder missing: ' + a);
    out = out.split(a).join(b);
  }
  return out;
}
const appFor = (env, pdfjs) => filled(appSrc, [
  ...(env ? [["/*__ENV__*/{ name: 'prod', title: 'MyExpense', banner: '' }", JSON.stringify(env).replace(/<\//g, '<\\/')]] : []),
  ['/*__LAYOUTS__*/null', layouts],
  ['/*__PDFJS__*/null', JSON.stringify(pdfjs)],
  ["'/*__TPL_IT__*/'", "'" + tplIt + "'"],
  ["'/*__TPL_PD__*/'", "'" + tplPd + "'"],
]);

/* ---------- Claude: one self-contained page per environment ---------- */
const shell = text('src', 'shell-claude.html');
const platClaude = text('src', 'platform-claude.js');
for (const [name, env] of Object.entries(envs)) {
  if (only && name !== only) continue;
  const cfg = { name, title: env.title, banner: env.banner || '' };
  const html = filled(shell, [
    ['__APP_TITLE__', env.title.replace(/[<&]/g, '')],
    ['/*__CSS__*/', css],
    ['/*__CORE__*/', core],
    ['/*__PLATFORM__*/', platClaude],
    ['/*__APP__*/', appFor(cfg, vendor.pdfjs)],
  ]);
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]); // every inline script must parse
  for (const m of html.matchAll(/<script src="([^"]+)"([^>]*)>/g)) if (!/integrity="sha384-/.test(m[2])) throw new Error('script without integrity: ' + m[1]);
  const dir = path.join(ROOT, 'dist', name);
  fs.mkdirSync(dir, { recursive: true });
  const file = env.title.replace(/\s+/g, '-') + '.html';
  fs.writeFileSync(path.join(dir, file), html);
  console.log('built dist/' + name + '/' + file + ' (' + (html.length / 1024).toFixed(0) + ' KB)');
}

/* ---------- Web: static files for the MyExpense server ---------- */
if (!only || only === 'web') {
  const out = path.join(ROOT, 'dist', 'web');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, 'assets', 'fonts'), { recursive: true });
  const put = (rel, buf) => { const f = path.join(out, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf); return '/' + rel.split(path.sep).join('/'); };
  // Libraries: copied byte for byte from node_modules (installed with npm ci from package-lock.json),
  // under their package name and version so test/integrity.js can check each one against the lockfile.
  const lock = JSON.parse(text('package-lock.json'));
  const lib = (pkg, sub) => {
    const version = lock.packages['node_modules/' + pkg].version;
    const buf = read('node_modules', pkg, sub);
    return [put(path.join('assets', 'vendor', pkg + '@' + version, sub), buf), sri(buf)];
  };
  const fromCdn = (u) => { const m = /^https:\/\/cdn\.jsdelivr\.net\/npm\/((?:@[^/]+\/)?[^@/]+)@[^/]+\/(.+)$/.exec(u); return lib(m[1], m[2]); };
  const scripts = [];
  for (const m of shell.matchAll(/<script src="([^"]+)"/g)) scripts.push(fromCdn(m[1]));
  const pdfjs = { lib: fromCdn(vendor.pdfjs.lib[0]), worker: fromCdn(vendor.pdfjs.worker[0]) };
  // Our own files, named by content so they can be cached for good
  const own = (name, ext, body) => { const buf = Buffer.from(body); return [put(path.join('assets', name + '-' + short(buf) + '.' + ext), buf), sri(buf)]; };
  scripts.push(own('core', 'js', core));
  scripts.push(own('platform-web', 'js', text('src', 'platform-web.js')));
  const app = appFor(null, pdfjs);
  new Function(app);
  scripts.push(own('app', 'js', app));
  const fontCss = text('src', 'web', 'fonts.css');
  for (const m of fontCss.matchAll(/url\(fonts\/([^)]+)\)/g)) {
    const f = m[1];
    const pkg = f.startsWith('archivo') ? '@fontsource-variable/archivo' : f.startsWith('atkinson') ? '@fontsource/atkinson-hyperlegible' : '@fontsource/ibm-plex-mono';
    fs.copyFileSync(path.join(ROOT, 'node_modules', pkg, 'files', f), path.join(out, 'assets', 'fonts', f));
  }
  const fonts = own('fonts', 'css', fontCss);
  const appCss = own('app', 'css', css);
  const iconBuf = read('src', 'web', 'icon.svg');
  const icon = put(path.join('assets', 'icon-' + short(iconBuf) + '.svg'), iconBuf);
  put('manifest.webmanifest', filled(text('src', 'web', 'manifest.webmanifest'), [['__ICON__', icon]]));
  const html = filled(text('src', 'web', 'shell.html'), [
    ['/__ICON__', icon],
    ['/__FONTS_CSS__', fonts[0]], ['__FONTS_CSS_SRI__', fonts[1]],
    ['/__APP_CSS__', appCss[0]], ['__APP_CSS_SRI__', appCss[1]],
    ['__SCRIPTS__', scripts.map(([src, h]) => '<script src="' + src + '" integrity="' + h + '"></script>').join('\n')],
  ]);
  if (/<script>|<script(?![^>]*\bsrc=)[^>]*>|\son[a-z]+=|<style/i.test(html)) throw new Error('the web page must not have inline scripts, handlers or styles');
  put('index.html', html);
  // Shown by the server instead of the app until its settings are complete
  const helpJs = own('setup-help', 'js', text('src', 'web', 'setup-help.js'));
  const help = filled(text('src', 'web', 'setup-help.html'), [
    ['/__ICON__', icon],
    ['/__FONTS_CSS__', fonts[0]], ['__FONTS_CSS_SRI__', fonts[1]],
    ['/__APP_CSS__', appCss[0]], ['__APP_CSS_SRI__', appCss[1]],
    ['/__SETUP_JS__', helpJs[0]], ['__SETUP_JS_SRI__', helpJs[1]],
  ]);
  if (/<script>|<script(?![^>]*\bsrc=)[^>]*>|\son[a-z]+=|<style/i.test(help)) throw new Error('the setup help page must not have inline scripts, handlers or styles');
  put('setup-help.html', help);
  console.log('built dist/web/ (' + fs.readdirSync(path.join(out, 'assets')).length + ' asset entries)');
}
