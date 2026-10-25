// MyExpense on Claude: sign-in is the Claude account, storage is the artifact's database with
// per-person private areas, receipts are read by Claude, downloads go through Claude's save dialog.
// The same interface is implemented for the web version in platform-web.js.
(function () {
'use strict';
function b64ToBytes(b64) { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function bytesToB64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }

// Every report and receipt lives in the signed-in person's private area of this app's database,
// data/users/<their id>/. The platform enforces that privacy on the server: nobody else can read or
// write it, including the app's owner.
class PrivateStore {
  constructor(db, id) {
    const root = db.doc('data/users/' + id + '/app');
    this.reports = root.collection('reports'); this.images = root.collection('images'); this.chunks = root.collection('chunks');
    this.settingsDoc = db.doc('data/users/' + id + '/settings');
    this.q = new Map();
  }
  serial(key, fn) { const next = (this.q.get(key) || Promise.resolve()).catch(() => {}).then(fn); this.q.set(key, next); return next; }
  async listReports() { const s = await this.reports.get(); return s.docs.filter(d => d.exists).map(d => d.data()); }
  saveReport(r) { const body = JSON.parse(JSON.stringify(r)); return this.serial('r' + r.id, () => this.reports.doc(r.id).set(body)); }
  deleteReport(id) { return this.serial('r' + id, () => this.reports.doc(id).delete()); }
  async putChunks(prefix, blob) {
    const b64 = bytesToB64(new Uint8Array(await blob.arrayBuffer()));
    const N = 180000, n = Math.ceil(b64.length / N);
    for (let k = 0; k < n; k++) await this.chunks.doc(prefix + '.' + k).set({ d: b64.slice(k * N, (k + 1) * N) });
    return n;
  }
  async getChunks(prefix, n, type) {
    const parts = await Promise.all(Array.from({ length: n }, (_, k) => this.chunks.doc(prefix + '.' + k).get()));
    if (parts.some(p => !p.exists)) return null;
    return new Blob([b64ToBytes(parts.map(p => p.data().d).join(''))], { type });
  }
  async putImage(id, blob, meta, orig) {
    const n = await this.putChunks(id, blob);
    const on = orig ? await this.putChunks(id + '.o', orig.blob) : 0;
    await this.images.doc(id).set({ n, w: meta.w, h: meta.h, type: 'image/jpeg', size: blob.size, on, otype: orig ? orig.type : null, oname: orig ? orig.name : null });
  }
  async getOriginal(id) {
    const m = await this.images.doc(id).get();
    if (!m.exists || !m.data().on) return null;
    const meta = m.data();
    const blob = await this.getChunks(id + '.o', meta.on, meta.otype || 'application/octet-stream');
    return blob ? { blob, type: meta.otype, name: meta.oname } : null;
  }
  async getImage(id) {
    const m = await this.images.doc(id).get();
    if (!m.exists) return null;
    const meta = m.data();
    const blob = await this.getChunks(id, meta.n, meta.type || 'image/jpeg');
    return blob ? { blob, w: meta.w, h: meta.h } : null;
  }
  async deleteImage(id) {
    const m = await this.images.doc(id).get();
    const n = m.exists ? m.data().n : 0, on = m.exists ? (m.data().on || 0) : 0;
    for (let k = 0; k < n; k++) await this.chunks.doc(id + '.' + k).delete();
    for (let k = 0; k < on; k++) await this.chunks.doc(id + '.o.' + k).delete();
    await this.images.doc(id).delete();
  }
  async getSettings() { const s = await this.settingsDoc.get(); return s.exists ? s.data() : {}; }
  saveSettings(s) { const body = JSON.parse(JSON.stringify(s)); return this.serial('settings', () => this.settingsDoc.set(body)); }
  // Erase everything this person has stored
  async deleteAll() {
    for (const r of await this.listReports()) await this.reports.doc(r.id).delete();
    let snap;
    do { snap = await this.images.limit(50).get(); for (const d of snap.docs) await this.deleteImage(d.id); } while (snap.size === 50);
    do { snap = await this.chunks.limit(10).get(); for (const d of snap.docs) await this.chunks.doc(d.id).delete(); } while (snap.size === 10);
    await this.settingsDoc.delete();
  }
}

// Someone who can open the page but isn't allowed to save (or whose access was removed) is stopped
// at the first refused write.
const ACCESS_ERRORS = ['invalid_argument', 'revoked', 'not_granted', 'capability_disabled', 'capability_removed'];
const inViewer = () => !!(window.claude && typeof window.claude.use === 'function');

window.MyExpensePlatform = {
  name: 'claude',
  env: null, // set per environment by the build

  async init(Svc) {
    Svc.sample = null; Svc.aiImages = null; Svc.downloads = null;
    if (!inViewer()) { Svc.access = 'outside'; return; }
    const use = (n) => window.claude.use(n).catch(() => null);
    const [db, user, sample, downloads] = await Promise.all([use('db'), use('user'), use('sample'), use('downloads')]);
    Svc.downloads = downloads;
    if (sample) {
      Svc.sample = sample;
      try { const lim = await sample.limits(); Svc.aiImages = lim && lim.images ? lim.images : null; } catch (e) { Svc.aiImages = null; }
    }
    if (!db || !user) { Svc.access = 'signed-out'; return; }
    const id = await user.id();
    if (!id) { Svc.access = 'signed-out'; return; }
    Svc.store = new PrivateStore(db, id); await Svc.store.getSettings(); Svc.access = 'ok';
  },

  aiAvailable(Svc) { return !!(Svc.sample && Svc.aiImages); },
  async readReceipt(Svc, { blobs, prompt }) {
    const max = (Svc.aiImages && Svc.aiImages.maxCount) || 1;
    return Svc.sample.json(prompt, { images: blobs.slice(0, max), modelTier: 'default' });
  },
  // Returns true when receipt reading has just been switched off for this session
  aiFailed(Svc, e) {
    if (e && e.code === 'not_granted') { Svc.sample = null; return true; }
    return false;
  },

  // access | signin | toolarge | quota | bad | retry
  classify(e, what) {
    const code = e && e.code;
    if (ACCESS_ERRORS.includes(code)) {
      if (code === 'invalid_argument' && what && JSON.stringify(what).length > 240000) return 'toolarge';
      return 'access';
    }
    if (code === 'quota_exceeded') return 'quota';
    return 'retry';
  },

  async saveFile(Svc, filename, blob, toast) {
    if (Svc.downloads) {
      try { await Svc.downloads.save({ filename, data: blob }); return true; }
      catch (e) {
        if (e && e.code === 'declined') return false;
        if (e && e.code === 'rate_limited') { toast('A save is already open. Finish it, then try again.'); return false; }
        toast('That file couldn’t be saved here (' + ((e && e.code) || 'error') + ').'); return false;
      }
    }
    if (!inViewer()) {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000); return true;
    }
    toast('Downloads aren’t available in this view. Open MyExpense in Claude to save files.');
    return false;
  },

  // Screens and text that differ between Claude and the web version
  ui(kit) {
    const { html, Icon, Svc } = kit;
    // Shown instead of the app whenever this viewer can't have a private, saved area of their own.
    function Gate() {
      const k = Svc.access;
      const copy = {
        outside: ['Open MyExpense from its Claude link', 'Each person’s expenses are tied to their own Claude account and kept private to them, so MyExpense only works from its link on claude.ai while you’re signed in.'],
        'signed-out': ['Sign in to use MyExpense', 'Your expense reports are tied to your Claude account. Sign in to claude.ai, then open this link again.'],
        'no-access': ['You can’t save expenses here yet', 'You can open this page, but your access doesn’t let you add expenses. Ask the person who shared MyExpense with you for access that lets you use it. Nothing you entered was saved.'],
        error: ['Your reports couldn’t be loaded', 'MyExpense couldn’t reach your saved reports. Check your connection, then reload the page.'],
      }[k];
      if (!copy) return html`<div class="wrap"><div class="list"><div class="skel"></div><div class="skel"></div></div></div>`;
      return html`<div class="wrap"><div class="gate">
        <span class="gate-icon"><${Icon} n="lock" size=${26} /></span>
        <h1>${copy[0]}</h1>
        <p class="muted">${copy[1]}</p>
        <p class="faint small">MyExpense never shows one person’s expenses to anyone else, including the person who shared it.</p>
      </div></div>`;
    }
    return {
      Gate,
      HeaderRight: null,
      privacy: (aiOn) => [
        'Your reports and receipt photos are stored for your Claude account only. No one else who uses MyExpense can see them, including the person who shared it. Nothing is kept on this device.',
        aiOn ? 'When you add a receipt, the photo is sent to Claude to read the details.' : 'Receipt reading by Claude isn’t available here, so you’ll type in the details from each photo.',
      ],
    };
  },
};
})();
