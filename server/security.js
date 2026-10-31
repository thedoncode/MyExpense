// Request-level protections: security headers, same-site checks, rate limits, cookies.

// The page loads nothing from other sites and runs no inline script, so the policy can be strict.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "object-src 'none'",
].join('; ');

function headers(cfg) {
  const hsts = cfg.origin.startsWith('https://');
  return (req, res, next) => {
    res.setHeader('Content-Security-Policy', CSP);
    if (hsts) res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=()');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    next();
  };
}

// API requests must come from this site's own pages: anything that changes data must carry this
// site's Origin, and every API request must carry the X-MyExpense header, which another site can't
// add without the browser first asking this server (it never says yes). The session cookie is also
// SameSite=Strict, so other sites can't send it at all.
function sameSite(cfg) {
  return (req, res, next) => {
    if (!req.path.startsWith('/api/')) return next();
    const safe = req.method === 'GET' || req.method === 'HEAD';
    const fetchSite = req.headers['sec-fetch-site'];
    if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') return res.status(403).json({ code: 'cross_site' });
    if (!safe) {
      if (req.headers.origin !== cfg.origin) return res.status(403).json({ code: 'cross_site' });
    }
    if (req.headers['x-myexpense'] !== '1') return res.status(403).json({ code: 'cross_site' });
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    next();
  };
}

// Fixed-window counters kept in memory (one server process).
class Limiter {
  constructor(max, windowMs) { this.max = max; this.windowMs = windowMs; this.m = new Map(); }
  hit(key, n = 1) {
    const now = Date.now();
    let e = this.m.get(key);
    if (!e || e.reset <= now) { e = { n: 0, reset: now + this.windowMs }; this.m.set(key, e); }
    e.n += n;
    if (this.m.size > 50000) this.sweep(now);
    return e.n <= this.max;
  }
  blocked(key) { const e = this.m.get(key); return !!(e && e.reset > Date.now() && e.n >= this.max); }
  clear(key) { this.m.delete(key); }
  sweep(now = Date.now()) { for (const [k, e] of this.m) if (e.reset <= now) this.m.delete(k); }
}

function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k && !(k in out)) out[k] = v;
  }
  return out;
}

module.exports = { CSP, headers, sameSite, Limiter, parseCookies };
