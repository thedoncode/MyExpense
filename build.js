// Builds the single-file app for every environment in environments.json:
//   dist/<env>/<Title>.html  the page body for that environment's claude.ai Artifact
// The app only runs inside Claude, where each person signs in and gets a private storage area,
// so there is no standalone build.
// Usage: node build.js            (all environments)
//        node build.js qa         (one environment)
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p));
const envs = JSON.parse(read('environments.json'));
const only = process.argv[2];
if (only && !envs[only]) throw new Error('unknown environment: ' + only);

const src = read('src', 'app.src.html').toString('utf8');
const core = read('src', 'core.js').toString('utf8');
const layouts = read('src', 'layouts.json').toString('utf8').replace(/<\//g, '<\\/');
const tplIt = read('templates', 'itemized-expense-claim.xlsx').toString('base64');
const tplPd = read('templates', 'perdiem-travel-expense.xlsx').toString('base64');

for (const [name, env] of Object.entries(envs)) {
  if (only && name !== only) continue;
  let html = src;
  const rep = (a, b) => { if (!html.includes(a)) throw new Error('placeholder missing: ' + a); html = html.split(a).join(b); };
  const cfg = { name, title: env.title, banner: env.banner || '' };
  rep('__APP_TITLE__', env.title.replace(/[<&]/g, ''));
  rep("/*__ENV__*/{ name: 'prod', title: 'MyExpense', banner: '' }", JSON.stringify(cfg).replace(/<\//g, '<\\/'));
  rep('/*__CORE__*/', core);
  rep('/*__LAYOUTS__*/null', layouts);
  rep("'/*__TPL_IT__*/'", "'" + tplIt + "'");
  rep("'/*__TPL_PD__*/'", "'" + tplPd + "'");
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]); // every inline script must parse

  const dir = path.join(ROOT, 'dist', name);
  fs.mkdirSync(dir, { recursive: true });
  const file = env.title.replace(/\s+/g, '-') + '.html';
  fs.writeFileSync(path.join(dir, file), html);
  for (const m of html.matchAll(/<script src="([^"]+)"([^>]*)>/g)) if (!/integrity="sha384-/.test(m[2])) throw new Error('script without integrity: ' + m[1]);
  console.log('built dist/' + name + '/' + file + ' (' + (html.length / 1024).toFixed(0) + ' KB)');
}
