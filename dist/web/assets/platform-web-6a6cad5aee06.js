// MyExpense on the web: talks to the MyExpense server (server/). Sign-in is email + password, then a
// code from an authenticator app. Reports and receipts are stored on the server under the signed-in
// person's account only. Implements the same interface as platform-claude.js.
(function () {
'use strict';

/* ---------- environment (filled in by the server) ---------- */
let env = null;
try { const m = document.querySelector('meta[name="myexpense-env"]'); if (m) env = JSON.parse(m.getAttribute('content')); } catch (e) { env = null; }

/* ---------- API ---------- */
async function api(method, url, body, opts) {
  const headers = { 'X-MyExpense': '1' };
  let payload;
  if (body instanceof Blob) { headers['Content-Type'] = body.type; payload = body; }
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  Object.assign(headers, opts && opts.headers);
  let res;
  try { res = await fetch(url, { method, headers, body: payload, credentials: 'same-origin', cache: 'no-store', redirect: 'error' }); }
  catch (e) { throw Object.assign(new Error('MyExpense couldn’t reach the server. Check your connection.'), { status: 0, code: 'offline' }); }
  if (opts && opts.raw && res.ok) return res;
  if (res.status === 204) return null;
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw Object.assign(new Error(j.message || j.code || 'HTTP ' + res.status), { status: res.status, code: j.code || 'http_' + res.status, info: j });
  }
  return res.json();
}

// What's going on with sign-in, kept in memory only
const W = { kit: null, ai: false, idleMs: 30 * 60000, link: null, notice: null, codes: null, email: '', lastActive: Date.now(), lastPing: 0 };

class WebStore {
  constructor() { this.q = new Map(); }
  serial(key, fn) { const next = (this.q.get(key) || Promise.resolve()).catch(() => {}).then(fn); this.q.set(key, next); return next; }
  listReports() { return api('GET', '/api/reports'); }
  saveReport(r) { const body = JSON.parse(JSON.stringify(r)); return this.serial('r' + r.id, () => api('PUT', '/api/reports/' + encodeURIComponent(r.id), body)); }
  deleteReport(id) { return this.serial('r' + id, () => api('DELETE', '/api/reports/' + encodeURIComponent(id))); }
  async putImage(id, blob, meta, orig) {
    const u = '/api/receipts/' + encodeURIComponent(id);
    await api('PUT', u, new Blob([blob], { type: 'image/jpeg' }), { headers: { 'X-Image-Width': String(meta.w), 'X-Image-Height': String(meta.h) } });
    if (orig) await api('PUT', u + '/original', new Blob([orig.blob], { type: 'application/pdf' }), { headers: { 'X-File-Name': encodeURIComponent(orig.name || 'receipt.pdf') } });
  }
  async getImage(id) {
    try {
      const res = await api('GET', '/api/receipts/' + encodeURIComponent(id), undefined, { raw: true });
      return { blob: new Blob([await res.arrayBuffer()], { type: 'image/jpeg' }), w: Number(res.headers.get('X-Image-Width')) || 1, h: Number(res.headers.get('X-Image-Height')) || 1 };
    } catch (e) { if (e.status === 404) return null; throw e; }
  }
  async getOriginal(id) {
    try {
      const res = await api('GET', '/api/receipts/' + encodeURIComponent(id) + '/original', undefined, { raw: true });
      let name = 'receipt.pdf'; try { name = decodeURIComponent(res.headers.get('X-File-Name') || name); } catch (e) { /* keep */ }
      return { blob: new Blob([await res.arrayBuffer()], { type: 'application/pdf' }), type: 'application/pdf', name };
    } catch (e) { if (e.status === 404) return null; throw e; }
  }
  deleteImage(id) { return api('DELETE', '/api/receipts/' + encodeURIComponent(id)); }
  getSettings() { return api('GET', '/api/settings'); }
  saveSettings(s) { const body = JSON.parse(JSON.stringify(s)); return this.serial('settings', () => api('PUT', '/api/settings', body)); }
  deleteAll() { return api('DELETE', '/api/me/data'); }
}

/* ---------- sign-in state ---------- */
let Svc = null, emit = () => {};
function route(s) {
  W.ai = !!s.ai;
  if (s.idleMinutes) W.idleMs = s.idleMinutes * 60000;
  W.email = s.email || W.email;
  if (s.stage === 'full') { Svc.user = s.user; Svc.store = new WebStore(); Svc.access = 'ok'; W.notice = null; W.lastActive = Date.now(); }
  else if (s.stage === 'totp') Svc.access = 'totp';
  else if (s.stage === 'enroll') Svc.access = 'enroll';
  else if (s.setup === 'open') Svc.access = 'setup';
  else if (s.setup === 'locked') Svc.access = 'setup-locked';
  else Svc.access = 'signin';
}
async function refresh() {
  const s = await api('GET', '/api/session');
  route(s); emit();
}
function signedOut(notice) { W.notice = notice; W.codes = null; if (W.kit) W.kit.lostAccess('signin'); else { Svc.access = 'signin'; emit(); } }

// Keep the session alive while someone is using the page; end it on screen when they stop
['pointerdown', 'keydown', 'input', 'wheel', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { W.lastActive = Date.now(); }, { passive: true, capture: true }));
setInterval(() => {
  if (!Svc || Svc.access !== 'ok') return;
  const now = Date.now();
  if (now - W.lastActive > W.idleMs - 15000) { api('POST', '/api/auth/logout').catch(() => {}); signedOut('idle'); return; }
  if (W.lastActive > W.lastPing && now - W.lastPing > 60000) {
    W.lastPing = now;
    api('POST', '/api/session/active').catch(e => { if (e.status === 401) signedOut('ended'); });
  }
}, 15000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !Svc || Svc.access !== 'ok') return;
  if (Date.now() - W.lastActive > W.idleMs - 15000) { api('POST', '/api/auth/logout').catch(() => {}); signedOut('idle'); }
});

const ERR = {
  bad_login: 'That email and password don’t match an account.',
  bad_code: 'That code didn’t work. Check the code in your authenticator app and try again.',
  bad_token: 'That setup token isn’t right. Copy it again from the hosting settings.',
  bad_email: 'Enter a valid email address.',
  bad_name: 'Enter your name.',
  disabled: 'This account is turned off. Ask your MyExpense administrator.',
  link_invalid: 'This link has expired or was already used. Ask your MyExpense administrator for a new one.',
  account_exists: 'There’s already an account for this email. Sign in instead.',
  setup_done: 'MyExpense is already set up. Sign in instead.',
  setup_off: 'Setup is turned off on the server.',
  bad_password: 'Your current password isn’t right.',
  offline: 'MyExpense couldn’t reach the server. Check your connection.',
  signin: 'Your sign-in expired. Start again.',
};
const errText = (e) => (e && e.code === 'locked' ? 'Too many tries. Wait ' + ((e.info && e.info.minutes) || 15) + ' minutes, then try again.'
  : e && e.code === 'weak_password' ? (e.message || 'Choose a longer password.') : (e && ERR[e.code]) || 'Something went wrong. Try again.');

window.MyExpensePlatform = {
  name: 'web',
  env,

  async init(svc, ENV, emitFn) {
    Svc = svc; emit = emitFn;
    // Invite and reset links carry their one-time token after # so it never reaches a server log.
    // It's taken out of the address bar straight away.
    const m = /^#(invite|reset)=([A-Za-z0-9_-]{20,100})$/.exec(location.hash || '');
    if (m) { W.link = { kind: m[1], token: m[2] }; history.replaceState(null, '', location.pathname); }
    if (W.link) {
      try { const l = await api('POST', '/api/links/check', { token: W.link.token }); W.link.email = l.email; W.link.kind = l.kind; Svc.access = 'link'; await api('GET', '/api/session').then(s => { W.ai = !!s.ai; }); return; }
      catch (e) { W.link = null; if (e.status === 404 || e.status === 429) W.notice = e.status === 429 ? 'slow' : 'link'; else throw e; }
    }
    route(await api('GET', '/api/session'));
  },

  aiAvailable() { return W.ai; },
  readReceipt(svc, { imageId, today }) { return api('POST', '/api/receipts/' + encodeURIComponent(imageId) + '/read', { today }); },
  aiFailed(svc, e) { if (e && e.code === 'ai_off') { W.ai = false; return true; } return false; },

  classify(e) {
    const st = e && e.status;
    if (st === 401) { W.notice = 'ended'; return 'signin'; }
    if (st === 403) return 'access';
    if (st === 413) return 'toolarge';
    if (st === 507) return 'quota';
    if (st === 400) return 'bad';
    return 'retry';
  },

  async saveFile(svc, filename, blob) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
    return true;
  },

  ui(kit) {
    W.kit = kit; Svc = kit.Svc; emit = kit.emit;
    const { html, useState, useEffect, useRef, Icon, toast, askConfirm, Field, ENV } = kit;
    const title = ENV.title;

    /* ---------- small pieces ---------- */
    function Pw({ id, value, onValue, auto, label, hint }) {
      return html`<${Field} id=${id} label=${label} hint=${hint}><input id=${id} class="inp" type="password" value=${value} maxlength="128" autocomplete=${auto} onInput=${e => onValue(e.target.value)} /><//>`;
    }
    function Text({ id, value, onValue, auto, label, type, hint, max }) {
      return html`<${Field} id=${id} label=${label} hint=${hint}><input id=${id} class="inp" type=${type || 'text'} value=${value} maxlength=${max || 254} autocomplete=${auto || 'off'} autocapitalize=${type === 'email' ? 'none' : 'words'} spellcheck="false" onInput=${e => onValue(e.target.value)} /><//>`;
    }
    function Code({ value, onValue, recovery }) {
      return recovery
        ? html`<${Field} id="code" label="Recovery code"><input id="code" class="inp otp" style="letter-spacing:.12em;font-size:18px" value=${value} maxlength="24" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX" onInput=${e => onValue(e.target.value)} /><//>`
        : html`<${Field} id="code" label="6-digit code"><input id="code" class="inp otp" value=${value} inputmode="numeric" pattern="[0-9 ]*" maxlength="7" autocomplete="one-time-code" placeholder="000000" onInput=${e => onValue(e.target.value.replace(/[^\d]/g, ''))} /><//>`;
    }
    const Err = ({ e }) => (e ? html`<div class="notice bad" role="alert">${e}</div>` : null);
    function useBusy() {
      const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
      const run = async (fn) => { if (busy) return; setBusy(true); setErr(''); try { await fn(); } catch (e) { setErr(errText(e)); if (e && e.status === 401 && e.code === 'signin') await refresh().catch(() => {}); } setBusy(false); };
      return { busy, err, setErr, run };
    }
    const Shell = ({ heading, children, icon }) => html`<div class="wrap"><div class="gate">
      <span class="gate-icon"><${Icon} n=${icon || 'lock'} size=${26} /></span>
      <h1>${heading}</h1>
      ${children}
    </div></div>`;
    const footnote = html`<p class="faint small">Your expenses are private to your account. Nobody else who uses MyExpense can see them, including its administrators.</p>`;
    function startOver() { api('POST', '/api/auth/logout').catch(() => {}).then(() => { W.notice = null; return refresh(); }).catch(() => { Svc.access = 'error'; emit(); }); }
    const confirmMismatch = (a, b) => (a !== b ? 'The two passwords don’t match.' : null);

    /* ---------- the screens before you're in ---------- */
    function SignIn() {
      const [email, setEmail] = useState(W.email || ''); const [pw, setPw] = useState('');
      const b = useBusy();
      const note = { idle: 'You were signed out because MyExpense wasn’t used for a while. Sign in again to keep going.', ended: 'Your session ended. Sign in again to keep going.',
        signedout: 'You’re signed out.', link: ERR.link_invalid, slow: 'Too many tries. Wait a few minutes, then try again.' }[W.notice];
      const submit = (e) => { e.preventDefault(); b.run(async () => { const r = await api('POST', '/api/auth/login', { email: email.trim(), password: pw }); W.email = email.trim(); W.notice = null; setPw(''); route({ stage: r.stage, ai: W.ai, email: W.email }); emit(); }); };
      return html`<${Shell} heading=${'Sign in to ' + title}>
        ${note && html`<div class="notice">${note}</div>`}
        <form class="gate-form" onSubmit=${submit}>
          <${Text} id="email" label="Email" type="email" auto="username" value=${email} onValue=${setEmail} />
          <${Pw} id="password" label="Password" auto="current-password" value=${pw} onValue=${setPw} />
          <${Err} e=${b.err} />
          <button class="btn primary" type="submit" disabled=${b.busy || !email || !pw}>${b.busy ? 'Signing in…' : 'Continue'}</button>
        </form>
        <p class="faint small">Forgot your password or lost your phone? Ask your MyExpense administrator for a reset link. Don’t have an account? Ask them for an invite.</p>
      <//>`;
    }
    function TwoStep() {
      const [code, setCode] = useState(''); const [rec, setRec] = useState(false);
      const b = useBusy();
      const submit = (e) => {
        e.preventDefault();
        b.run(async () => {
          const r = await api('POST', '/api/auth/totp', rec ? { recovery: code } : { code });
          if (r.recoveryLeft !== null && r.recoveryLeft !== undefined) toast('Recovery code used. ' + r.recoveryLeft + ' left' + (r.recoveryLeft <= 3 ? ': make new ones under Account.' : '.'));
          await refresh();
        });
      };
      return html`<${Shell} heading="Enter your code">
        <p class="muted">Open your authenticator app and enter the 6-digit code for ${title}${W.email ? ' (' + W.email + ')' : ''}.</p>
        <form class="gate-form" onSubmit=${submit}>
          <${Code} value=${code} onValue=${setCode} recovery=${rec} />
          <${Err} e=${b.err} />
          <button class="btn primary" type="submit" disabled=${b.busy || (rec ? code.replace(/[^A-Za-z0-9]/g, '').length < 16 : code.length !== 6)}>${b.busy ? 'Checking…' : 'Sign in'}</button>
        </form>
        <div class="row-btns">
          <button class="linkbtn" type="button" onClick=${() => { setRec(!rec); setCode(''); b.setErr(''); }}>${rec ? 'Use the code from my app' : 'Use a recovery code instead'}</button>
          <button class="linkbtn" type="button" onClick=${startOver}>Start over</button>
        </div>
      <//>`;
    }
    function Enroll() {
      const [info, setInfo] = useState(null); const [code, setCode] = useState('');
      const b = useBusy();
      useEffect(() => { b.run(async () => setInfo(await api('POST', '/api/auth/totp/setup'))); }, []);
      const submit = (e) => { e.preventDefault(); b.run(async () => { const r = await api('POST', '/api/auth/totp/enable', { code }); W.codes = r.codes; Svc.access = 'codes'; emit(); }); };
      return html`<${Shell} heading="Set up two-step sign-in">
        <p class="muted">Each time you sign in, ${title} asks for your password and a code from an authenticator app on your phone, so a stolen password alone can’t get into your expenses.</p>
        <ol class="small" style="margin:0;padding-left:20px;display:grid;gap:6px">
          <li>Install an authenticator app if you don’t have one: Microsoft Authenticator, Google Authenticator, 1Password or similar.</li>
          <li>In the app, add an account and scan this code. On this phone? Copy the setup key into the app instead.</li>
          <li>Enter the 6-digit code the app shows.</li>
        </ol>
        ${info ? html`<img class="qr" src=${info.qr} alt="QR code for your authenticator app" />
          <div style="display:grid;gap:4px"><span class="caps muted">Setup key</span><span class="secret">${info.secret}</span></div>`
          : !b.err && html`<div class="skel" style="width:200px;height:200px"></div>`}
        <form class="gate-form" onSubmit=${submit}>
          <${Code} value=${code} onValue=${setCode} />
          <${Err} e=${b.err} />
          <button class="btn primary" type="submit" disabled=${b.busy || !info || code.length !== 6}>${b.busy && info ? 'Checking…' : 'Turn on two-step sign-in'}</button>
        </form>
        <button class="linkbtn" type="button" onClick=${startOver}>Start over</button>
      <//>`;
    }
    function CodesList({ codes }) {
      const text = 'MyExpense recovery codes\n' + title + '\n\nEach code works once, if you can’t use your authenticator app.\n\n' + codes.join('\n') + '\n';
      return html`<div class="codes" aria-label="Recovery codes">${codes.map(c => html`<span>${c}</span>`)}</div>
        <div class="row-btns">
          <button class="btn sm" type="button" onClick=${() => window.MyExpensePlatform.saveFile(null, 'MyExpense recovery codes.txt', new Blob([text], { type: 'text/plain' }))}><${Icon} n="download" size=${16} />Download</button>
          <button class="btn sm" type="button" onClick=${() => navigator.clipboard.writeText(codes.join('\n')).then(() => toast('Copied.'), () => toast('Couldn’t copy. Select the codes instead.'))}>Copy</button>
        </div>`;
    }
    function Codes() {
      const [ok, setOk] = useState(false);
      const codes = W.codes || [];
      return html`<${Shell} heading="Save your recovery codes" icon="check">
        <p class="muted">Two-step sign-in is on. If you lose your phone, each of these codes gets you in once. Keep them somewhere safe, like a password manager. You won’t see them again.</p>
        <${CodesList} codes=${codes} />
        <label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" checked=${ok} onChange=${e => setOk(e.target.checked)} />I’ve saved these codes</label>
        <button class="btn primary" type="button" disabled=${!ok} onClick=${() => { W.codes = null; refresh().catch(() => { Svc.access = 'error'; emit(); }); }}>Go to my expenses</button>
      <//>`;
    }
    function NewPassword({ email, kind, onDone }) {
      const [name, setName] = useState(''); const [pw, setPw] = useState(''); const [pw2, setPw2] = useState(''); const [token, setToken] = useState('');
      const b = useBusy();
      const setup = kind === 'setup';
      const needName = kind === 'invite' || setup;
      const [mail, setMail] = useState(email || '');
      const submit = (e) => {
        e.preventDefault();
        const mm = confirmMismatch(pw, pw2); if (mm) { b.setErr(mm); return; }
        b.run(async () => {
          if (setup) await api('POST', '/api/setup', { token: token.trim(), email: mail.trim(), name: name.trim(), password: pw });
          else await api('POST', '/api/links/accept', { token: W.link.token, name: name.trim(), password: pw });
          W.link = null; setPw(''); setPw2(''); onDone();
        });
      };
      const heading = setup ? 'Set up ' + title : kind === 'invite' ? 'Welcome to ' + title : 'Choose a new password';
      return html`<${Shell} heading=${heading}>
        <p class="muted">${setup ? 'Create the first administrator account. You’ll invite everyone else from inside the app.'
          : kind === 'invite' ? 'You’ve been invited to keep your expense reports here. Choose a password, then set up two-step sign-in.'
          : 'Your administrator reset your sign-in. Choose a new password, then set up two-step sign-in again.'}</p>
        <form class="gate-form" onSubmit=${submit}>
          ${setup && html`<${Pw} id="token" label="Setup token" hint="The SETUP_TOKEN from the hosting settings" auto="off" value=${token} onValue=${setToken} />`}
          ${setup ? html`<${Text} id="email" label="Your email" type="email" auto="username" value=${mail} onValue=${setMail} />`
            : html`<div style="display:grid;gap:2px"><span class="lbl">Email</span><span>${email}</span><input type="email" autocomplete="username" value=${email} readonly hidden /></div>`}
          ${needName && html`<${Text} id="name" label="Your name" auto="name" max="80" value=${name} onValue=${setName} />`}
          <${Pw} id="password" label="New password" hint="At least 12 characters. A few unrelated words works well." auto="new-password" value=${pw} onValue=${setPw} />
          <${Pw} id="password2" label="Type it again" auto="new-password" value=${pw2} onValue=${setPw2} />
          <${Err} e=${b.err} />
          <button class="btn primary" type="submit" disabled=${b.busy || !pw || !pw2 || (needName && !name.trim()) || (setup && (!token || !mail))}>${b.busy ? 'Saving…' : 'Continue'}</button>
        </form>
        ${!setup && html`<button class="linkbtn" type="button" onClick=${() => { W.link = null; refresh().catch(() => {}); }}>I already have an account</button>`}
      <//>`;
    }
    function Message({ heading, text, retry }) {
      return html`<${Shell} heading=${heading}>
        <p class="muted">${text}</p>
        ${retry && html`<button class="btn" type="button" onClick=${retry}>${retry === startOver ? 'Sign in again' : 'Try again'}</button>`}
        ${footnote}
      <//>`;
    }

    function Gate() {
      const k = Svc.access;
      if (k === 'signin') return html`<${SignIn} />`;
      if (k === 'totp') return html`<${TwoStep} />`;
      if (k === 'enroll') return html`<${Enroll} />`;
      if (k === 'codes') return html`<${Codes} />`;
      if (k === 'link') return html`<${NewPassword} email=${W.link.email} kind=${W.link.kind} onDone=${() => refresh()} />`;
      if (k === 'setup') return html`<${NewPassword} kind="setup" onDone=${() => refresh()} />`;
      if (k === 'setup-locked') return html`<${Message} heading=${'Finish setting up ' + title} text="To create the first administrator account, add a SETUP_TOKEN in the hosting settings (see docs/HOSTINGER.md), restart the app, then reload this page." retry=${() => refresh().catch(() => {})} />`;
      if (k === 'no-access') return html`<${Message} heading="You can’t do that here" text="Your account isn’t allowed to do that, or your access changed. Nothing you entered was saved. Sign in again, or ask your MyExpense administrator." retry=${startOver} />`;
      if (k === 'error') return html`<${Message} heading="MyExpense couldn’t load" text="MyExpense couldn’t reach the server. Check your connection, then try again." retry=${() => kit.initServices()} />`;
      return html`<div class="wrap"><div class="list"><div class="skel"></div><div class="skel"></div></div></div>`;
    }

    /* ---------- account and administration (signed in) ---------- */
    const when = (t) => (t ? new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'never');
    function Sheet({ label, onClose, children, wide }) {
      return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) onClose(); }}>
        <div class="sheet" role="dialog" aria-label=${label} style=${wide ? 'width:min(720px,100%)' : ''}>
          <div class="sheet-h"><h2>${label}</h2><button type="button" class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div>
          ${children}
        </div></div>`;
    }
    function ChangePassword({ onDone }) {
      const [cur, setCur] = useState(''); const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
      const b = useBusy();
      const submit = (e) => { e.preventDefault(); const mm = confirmMismatch(pw, pw2); if (mm) { b.setErr(mm); return; } b.run(async () => { await api('POST', '/api/me/password', { current: cur, password: pw }); toast('Password changed. You’re signed out everywhere else.'); onDone(); }); };
      return html`<form class="gate-form" onSubmit=${submit}>
        <input type="email" autocomplete="username" value=${(Svc.user && Svc.user.email) || ''} readonly hidden />
        <${Pw} id="cur" label="Current password" auto="current-password" value=${cur} onValue=${setCur} />
        <${Pw} id="new" label="New password" hint="At least 12 characters." auto="new-password" value=${pw} onValue=${setPw} />
        <${Pw} id="new2" label="Type it again" auto="new-password" value=${pw2} onValue=${setPw2} />
        <${Err} e=${b.err} />
        <div class="row-btns"><button class="btn primary" type="submit" disabled=${b.busy || !cur || !pw || !pw2}>Change password</button><button class="btn ghost" type="button" onClick=${onDone}>Cancel</button></div>
      </form>`;
    }
    function NewCodes({ onDone }) {
      const [pw, setPw] = useState(''); const [codes, setCodes] = useState(null);
      const b = useBusy();
      if (codes) return html`<div style="display:grid;gap:10px"><p class="small muted">Your old recovery codes no longer work. Save these somewhere safe.</p><${CodesList} codes=${codes} /><button class="btn" type="button" onClick=${onDone}>Done</button></div>`;
      const submit = (e) => { e.preventDefault(); b.run(async () => { const r = await api('POST', '/api/me/recovery-codes', { password: pw }); setCodes(r.codes); }); };
      return html`<form class="gate-form" onSubmit=${submit}>
        <p class="small muted">New codes replace all your old ones. Enter your password to continue.</p>
        <input type="email" autocomplete="username" value=${(Svc.user && Svc.user.email) || ''} readonly hidden />
        <${Pw} id="pwc" label="Password" auto="current-password" value=${pw} onValue=${setPw} />
        <${Err} e=${b.err} />
        <div class="row-btns"><button class="btn primary" type="submit" disabled=${b.busy || !pw}>Make new codes</button><button class="btn ghost" type="button" onClick=${onDone}>Cancel</button></div>
      </form>`;
    }
    function Account({ onClose, openAdmin }) {
      const [mode, setMode] = useState(null);
      const [me, setMe] = useState(null);
      useEffect(() => { api('GET', '/api/me').then(setMe, () => {}); }, [mode]);
      const u = Svc.user || {};
      async function signOut(everywhere) {
        if (everywhere && !(await askConfirm({ title: 'Sign out everywhere?', body: 'You’ll be signed out on every phone and computer, including this one.', yes: 'Sign out everywhere' }))) return;
        try { await api('POST', everywhere ? '/api/me/signout-everywhere' : '/api/auth/logout'); } catch (e) { /* signed out locally either way */ }
        onClose(); signedOut('signedout');
      }
      return html`<${Sheet} label="Account" onClose=${onClose}>
        <div style="display:grid;gap:2px"><b>${u.name || u.email}</b><span class="muted small">${u.email}${u.role === 'admin' ? ' · Administrator' : ''}</span></div>
        ${mode === 'password' ? html`<${ChangePassword} onDone=${() => setMode(null)} />`
          : mode === 'codes' ? html`<${NewCodes} onDone=${() => setMode(null)} />`
          : html`<div style="display:grid;gap:8px">
            ${u.role === 'admin' && html`<button class="btn" type="button" onClick=${openAdmin}><${Icon} n="user" size=${18} />Manage people</button>`}
            <button class="btn" type="button" onClick=${() => setMode('password')}>Change password</button>
            <button class="btn" type="button" onClick=${() => setMode('codes')}>New recovery codes${me ? ' (' + me.recoveryLeft + ' left)' : ''}</button>
            <button class="btn" type="button" onClick=${() => signOut(false)}>Sign out</button>
            <button class="btn ghost" type="button" onClick=${() => signOut(true)}>Sign out everywhere</button>
          </div>`}
        <p class="faint small">You’re signed out after ${Math.round(W.idleMs / 60000)} minutes without activity.</p>
      <//>`;
    }

    const EVENTS = { setup: 'Set up MyExpense', signin: 'Signed in', signin_failed: 'Sign-in failed', signin_refused: 'Sign-in refused', account_locked: 'Locked after too many tries', signout: 'Signed out', signout_everywhere: 'Signed out everywhere',
      two_step_on: 'Turned on two-step sign-in', recovery_codes_new: 'Made new recovery codes', password_changed: 'Changed password', invite_created: 'Invited', invite_cancelled: 'Cancelled an invite', invite_used: 'Accepted invite',
      reset_created: 'Sent a sign-in reset', reset_used: 'Reset their sign-in', user_disabled: 'Turned off account', user_enabled: 'Turned on account', role_changed: 'Changed role', user_deleted: 'Deleted account', data_deleted: 'Deleted all their data' };
    function LinkBox({ link, text }) {
      return html`<div class="linkbox"><span class="small">${text}</span><code>${link}</code>
        <div class="row-btns"><button class="btn sm" type="button" onClick=${() => navigator.clipboard.writeText(link).then(() => toast('Link copied.'), () => toast('Couldn’t copy. Select the link instead.'))}>Copy link</button></div></div>`;
    }
    function Admin({ onClose }) {
      const [data, setData] = useState(null); const [log, setLog] = useState(null); const [tab, setTab] = useState('people');
      const [email, setEmail] = useState(''); const [role, setRole] = useState('user'); const [made, setMade] = useState(null);
      const b = useBusy();
      const load = () => api('GET', '/api/admin/users').then(setData, e => b.setErr(errText(e)));
      useEffect(() => { load(); }, []);
      useEffect(() => { if (tab === 'activity' && !log) api('GET', '/api/admin/audit').then(setLog, e => b.setErr(errText(e))); }, [tab]);
      const invite = (e) => { e.preventDefault(); b.run(async () => { const r = await api('POST', '/api/admin/invites', { email: email.trim(), role }); setMade({ link: r.link, text: 'Send this invite link to ' + email.trim() + ' yourself (email or chat). It works once, for 3 days.' }); setEmail(''); setRole('user'); await load(); }); };
      const act = (fn) => b.run(async () => { await fn(); await load(); });
      async function reset(u) {
        if (!(await askConfirm({ title: 'Reset sign-in for ' + u.email + '?', body: 'They’re signed out everywhere now. The link lets them choose a new password and set up two-step sign-in again. Their expenses are kept.', yes: 'Make reset link' }))) return;
        act(async () => { const r = await api('POST', '/api/admin/users/' + u.id + '/reset'); setMade({ link: r.link, text: 'Send this reset link to ' + u.email + ' yourself. It works once, for 24 hours.' }); });
      }
      async function del(u) {
        if (!(await askConfirm({ title: 'Delete ' + u.email + '?', body: 'Their account and every report and receipt they stored are erased for good. To stop them signing in but keep their data, turn the account off instead.', yes: 'Delete account', danger: true }))) return;
        act(() => api('DELETE', '/api/admin/users/' + u.id));
      }
      const more = () => { const last = log && log[log.length - 1]; if (last) api('GET', '/api/admin/audit?before=' + last.id).then(x => setLog([...log, ...x]), () => {}); };
      return html`<${Sheet} label="Manage people" onClose=${onClose} wide=${true}>
        <div class="seg" role="group" aria-label="Show">
          <button type="button" aria-pressed=${tab === 'people'} onClick=${() => setTab('people')}>People</button>
          <button type="button" aria-pressed=${tab === 'activity'} onClick=${() => setTab('activity')}>Activity</button>
        </div>
        <p class="faint small">Administrators manage accounts only. Nobody, including administrators, can see anyone else’s expenses.</p>
        <${Err} e=${b.err} />
        ${made && html`<${LinkBox} link=${made.link} text=${made.text} />`}
        ${tab === 'people' ? html`
          <form class="gate-form" onSubmit=${invite}>
            <div class="fields">
              <${Text} id="inv-email" label="Invite someone" type="email" value=${email} onValue=${setEmail} />
              <${Field} id="inv-role" label="Role"><select id="inv-role" class="inp" value=${role} onChange=${e => setRole(e.target.value)}><option value="user">Can use MyExpense</option><option value="admin">Administrator</option></select><//>
            </div>
            <button class="btn primary" type="submit" disabled=${b.busy || !email.trim()}>Make invite link</button>
          </form>
          ${!data ? html`<div class="skel"></div>` : html`<div>
            ${data.users.map(u => html`<div class="urow" key=${'u' + u.id}>
              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${u.name || u.email}</b>
                ${u.role === 'admin' && html`<span class="chip info">Administrator</span>`}
                ${u.status === 'disabled' ? html`<span class="chip bad">Turned off</span>` : u.locked ? html`<span class="chip warn">Locked for now</span>` : !u.twoStep ? html`<span class="chip warn">Setting up</span>` : html`<span class="chip ok">Active</span>`}
                ${u.id === data.me && html`<span class="faint small">you</span>`}</div>
              <span class="muted small">${u.email} · last signed in ${when(u.lastSignIn)}</span>
              ${u.id !== data.me ? html`<div class="acts">
                ${u.status === 'active' && u.locked && html`<button class="btn sm" type="button" onClick=${() => act(() => api('POST', '/api/admin/users/' + u.id + '/enable'))}>Unlock</button>`}
                ${u.status === 'active' && html`<button class="btn sm" type="button" onClick=${() => reset(u)}>Reset sign-in</button>`}
                ${u.status === 'active' ? html`<button class="btn sm" type="button" onClick=${() => act(() => api('POST', '/api/admin/users/' + u.id + '/disable'))}>Turn off</button>`
                  : html`<button class="btn sm" type="button" onClick=${() => act(() => api('POST', '/api/admin/users/' + u.id + '/enable'))}>Turn on</button>`}
                <button class="btn sm" type="button" onClick=${() => act(() => api('POST', '/api/admin/users/' + u.id + '/role', { role: u.role === 'admin' ? 'user' : 'admin' }))}>${u.role === 'admin' ? 'Remove administrator' : 'Make administrator'}</button>
                <button class="btn sm ghost danger" type="button" onClick=${() => del(u)}>Delete</button>
              </div>` : html`<div class="acts"><button class="btn sm" type="button" onClick=${() => reset(u)}>Reset my sign-in</button></div>`}
            </div>`)}
            ${data.invites.length > 0 && html`<div style="display:grid;gap:4px;margin-top:8px"><span class="caps muted">Invites not yet accepted</span>
              ${data.invites.map(i => html`<div class="urow" key=${'i' + i.id}><span>${i.email}${i.role === 'admin' ? ' · Administrator' : ''}</span><span class="muted small">Expires ${when(i.expiresAt)}</span>
                <div class="acts"><button class="btn sm" type="button" onClick=${() => act(() => api('DELETE', '/api/admin/invites/' + i.id))}>Cancel invite</button></div></div>`)}</div>`}
          </div>`}`
        : html`<div class="audit">${!log ? html`<div class="skel"></div>` : log.length === 0 ? html`<p class="muted small">No activity yet.</p>` : log.map(a => html`<div class="row" key=${'a' + a.id}>
            <span class="muted mono" style="font-size:12px">${when(a.at)}</span>
            <span>${a.actor || a.subject || 'Someone'}: ${EVENTS[a.event] || a.event}${a.subject && a.subject !== a.actor && a.actor ? ' ' + a.subject : ''}${a.detail ? ' (' + a.detail + ')' : ''}<span class="faint"> · ${a.ip}</span></span></div>`)}
            ${log && log.length >= 100 && log.length % 100 === 0 && html`<button class="btn sm" type="button" onClick=${more} style="margin-top:8px">Show older</button>`}</div>`}
      <//>`;
    }

    function HeaderRight() {
      const [open, setOpen] = useState(null);
      useEffect(() => { if (Svc.access !== 'ok') setOpen(null); });
      if (Svc.access !== 'ok' || !Svc.user) return null;
      const u = Svc.user;
      return html`<button class="btn sm acct-btn" type="button" onClick=${() => setOpen('account')} aria-label="Account"><${Icon} n="lock" size=${16} />${(u.name || u.email).split(/[\s@]/)[0]}</button>
        ${open === 'account' && html`<${Account} onClose=${() => setOpen(null)} openAdmin=${() => setOpen('admin')} />`}
        ${open === 'admin' && html`<${Admin} onClose=${() => setOpen(null)} />`}`;
    }

    return {
      Gate,
      HeaderRight,
      privacy: (aiOn) => [
        'Your reports and receipt photos are stored encrypted on your organization’s MyExpense server, under your account only. Nobody else who uses MyExpense can see them, including its administrators. Nothing is kept on this device.',
        aiOn ? 'When you add a receipt, the photo is sent to Claude (Anthropic’s AI) to read the details.' : 'Receipt reading isn’t turned on here, so you’ll type in the details from each photo.',
      ],
    };
  },
};
})();
