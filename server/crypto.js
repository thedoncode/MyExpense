// Encryption at rest, password hashing, one-time tokens and two-step sign-in codes (TOTP).
// Only Node's built-in crypto is used.
const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

/* ---------- encryption at rest: AES-256-GCM ----------
   Every stored report, receipt, setting and two-step secret is sealed with DATA_KEY. The "context"
   names the record and its owner (for example "report:42:r123"), and is authenticated with it, so a
   sealed value copied into another person's row, or another record, fails to open.
   Layout: 0x01 | key id (4) | iv (12) | tag (16) | ciphertext */
const keyId = (key) => crypto.createHash('sha256').update(key).digest().subarray(0, 4);

function keyring(current, previous) {
  const keys = [current, previous].filter(Boolean).map(k => ({ k, id: keyId(k) }));
  return {
    seal(plain, context) {
      const iv = crypto.randomBytes(12);
      const c = crypto.createCipheriv('aes-256-gcm', keys[0].k, iv);
      c.setAAD(Buffer.from(context, 'utf8'));
      const body = Buffer.concat([c.update(plain), c.final()]);
      return Buffer.concat([Buffer.from([1]), keys[0].id, iv, c.getAuthTag(), body]);
    },
    open(sealed, context) {
      if (!Buffer.isBuffer(sealed) || sealed.length < 33 || sealed[0] !== 1) throw new Error('not a sealed value');
      const id = sealed.subarray(1, 5);
      const key = keys.find(x => x.id.equals(id));
      if (!key) throw new Error('sealed with an unknown key');
      const d = crypto.createDecipheriv('aes-256-gcm', key.k, sealed.subarray(5, 17));
      d.setAAD(Buffer.from(context, 'utf8'));
      d.setAuthTag(sealed.subarray(17, 33));
      return Buffer.concat([d.update(sealed.subarray(33)), d.final()]);
    },
    sealJSON(obj, context) { return this.seal(Buffer.from(JSON.stringify(obj), 'utf8'), context); },
    openJSON(sealed, context) { return JSON.parse(this.open(sealed, context).toString('utf8')); },
    isCurrent(sealed) { return Buffer.isBuffer(sealed) && sealed.length > 5 && sealed.subarray(1, 5).equals(keys[0].id); },
  };
}

/* ---------- passwords: scrypt ----------
   N=2^14, r=8, p=5 is one of OWASP's recommended scrypt settings (same strength as N=2^17, p=1) and
   needs only 16 MB per hash, which suits shared hosting. Parameters are stored with each hash. */
const PW = { N: 16384, r: 8, p: 5, len: 32 };
async function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const h = await scrypt(String(pw).normalize('NFKC'), salt, PW.len, { N: PW.N, r: PW.r, p: PW.p, maxmem: 64 * 1024 * 1024 });
  return ['scrypt', PW.N, PW.r, PW.p, salt.toString('base64'), h.toString('base64')].join('$');
}
async function verifyPassword(pw, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  if (![N, r, p].every(Number.isInteger) || N > 1 << 20 || r > 32 || p > 32) return false;
  const want = Buffer.from(parts[5], 'base64');
  const h = await scrypt(String(pw).normalize('NFKC'), Buffer.from(parts[4], 'base64'), want.length, { N, r, p, maxmem: 256 * 1024 * 1024 });
  return h.length === want.length && crypto.timingSafeEqual(h, want);
}
const needsRehash = (stored) => !String(stored || '').startsWith(['scrypt', PW.N, PW.r, PW.p].join('$') + '$');

// Rules from NIST SP 800-63B: length matters, composition rules don't. Returns a problem or null.
const COMMON = new Set(['password', 'password1', 'password123', '123456789012', 'qwertyuiop', 'iloveyou', 'letmein', 'welcome', 'changeme', 'administrator', 'myexpense', 'expenses', 'expense123']);
function passwordProblem(pw, email) {
  if (typeof pw !== 'string') return 'Enter a password.';
  if (pw.length < 12) return 'Use at least 12 characters.';
  if (pw.length > 128) return 'Use 128 characters or fewer.';
  const low = pw.toLowerCase();
  if (/^(.)\1+$/.test(pw) || COMMON.has(low) || COMMON.has(low.replace(/[\d!.@#$%^&*]+$/, ''))) return 'That password is too easy to guess. Try a few unrelated words.';
  const local = String(email || '').split('@')[0].toLowerCase();
  if (local.length >= 4 && low.includes(local)) return 'Don’t include your email address in your password.';
  return null;
}

/* ---------- tokens ----------
   Session cookies, invite links and reset links are 256-bit random values. Only their SHA-256 is
   stored, so a copy of the database can't be used to sign in. */
const newToken = () => crypto.randomBytes(32).toString('base64url');
const tokenHash = (t) => crypto.createHash('sha256').update(String(t)).digest();
function sameSecret(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

/* ---------- two-step sign-in: TOTP (RFC 6238, the codes authenticator apps show) ---------- */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function base32(buf) {
  let bits = 0, val = 0, out = '';
  for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}
function unbase32(s) {
  const clean = String(s).toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0, val = 0; const out = [];
  for (const ch of clean) { const i = B32.indexOf(ch); if (i < 0) throw new Error('bad base32'); val = (val << 5) | i; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 255); bits -= 8; } }
  return Buffer.from(out);
}
function totpAt(secret, step) {
  const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(step));
  const h = crypto.createHmac('sha1', secret).update(msg).digest();
  const o = h[h.length - 1] & 15;
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1e6).padStart(6, '0');
}
const stepNow = (now = Date.now()) => Math.floor(now / 30000);
// Accepts the current code or one 30 seconds either side, never a step already used (no replays).
// Returns the matching step, or null.
function checkTotp(secret, code, lastStep, now) {
  const c = String(code || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(c)) return null;
  const s = stepNow(now);
  for (const st of [s - 1, s, s + 1]) {
    if (st <= (lastStep || 0)) continue;
    if (crypto.timingSafeEqual(Buffer.from(totpAt(secret, st)), Buffer.from(c))) return st;
  }
  return null;
}
const newTotpSecret = () => crypto.randomBytes(20);

/* ---------- recovery codes: 16 characters (78 random bits) each, each used once ---------- */
const RC = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'.split(''); // no 0/O, 1/I/L, U
function newRecoveryCodes(n = 10) {
  const codes = [];
  for (let i = 0; i < n; i++) {
    let s = '';
    for (let k = 0; k < 16; k++) s += RC[crypto.randomInt(RC.length)];
    codes.push(s.match(/.{4}/g).join('-'));
  }
  return codes;
}
const recoveryHash = (code) => crypto.createHash('sha256').update('myexpense-recovery:' + String(code).toUpperCase().replace(/[^A-Z0-9]/g, '')).digest();

module.exports = {
  keyring, hashPassword, verifyPassword, needsRehash, passwordProblem,
  newToken, tokenHash, sameSecret,
  base32, unbase32, totpAt, stepNow, checkTotp, newTotpSecret,
  newRecoveryCodes, recoveryHash,
};
