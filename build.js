// Builds the single-file app for every environment in environments.json.
//   dist/<env>/<Title>.html  page body for a claude.ai Artifact (the Artifact adds <html>/<head>)
//   dist/<env>/index.html    standalone page for any static host
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
  const cfg = { name, title: env.title, storageKey: env.storageKey, banner: env.banner || '' };
  rep('__APP_TITLE__', env.title.replace(/[<&]/g, ''));
  rep("/*__ENV__*/{ name: 'prod', title: 'MyExpense', storageKey: 'expenseme', banner: '' }", JSON.stringify(cfg).replace(/<\//g, '<\\/'));
  rep('/*__CORE__*/', core);
  rep('/*__LAYOUTS__*/null', layouts);
  rep("'/*__TPL_IT__*/'", "'" + tplIt + "'");
  rep("'/*__TPL_PD__*/'", "'" + tplPd + "'");
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]); // every inline script must parse

  const dir = path.join(ROOT, 'dist', name);
  fs.mkdirSync(dir, { recursive: true });
  const file = env.title.replace(/\s+/g, '-') + '.html';
  fs.writeFileSync(path.join(dir, file), html);
  const cut = html.indexOf('<div id="app"></div>');
  fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
    '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n' +
    html.slice(0, cut) + '</head>\n<body>\n' + html.slice(cut) + '\n</body>\n</html>\n');
  console.log('built dist/' + name + '/' + file + ' and dist/' + name + '/index.html (' + (html.length / 1024).toFixed(0) + ' KB)');
}
