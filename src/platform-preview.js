// MyExpense preview: the full app for anyone with the link, with nothing saved anywhere. Reports and
// receipt photos live only in this page's memory and are gone when it's closed or reloaded, so there's
// no sign-in and nobody's data to protect. Receipt reading and downloads use Claude's when the page is
// opened in Claude and the viewer allows them. Implements the same interface as platform-claude.js.
(function () {
'use strict';

class MemoryStore {
  constructor(seed) { this.reports = new Map(seed.map(r => [r.id, r])); this.images = new Map(); this.settings = {}; }
  async listReports() { return [...this.reports.values()].map(r => JSON.parse(JSON.stringify(r))); }
  async saveReport(r) { this.reports.set(r.id, JSON.parse(JSON.stringify(r))); }
  async deleteReport(id) { this.reports.delete(id); }
  async putImage(id, blob, meta, orig) { this.images.set(id, { blob, w: meta.w, h: meta.h, orig: orig || null }); }
  async getImage(id) { const m = this.images.get(id); return m ? { blob: m.blob, w: m.w, h: m.h } : null; }
  async getOriginal(id) { const m = this.images.get(id); return m && m.orig ? { blob: m.orig.blob, type: m.orig.type, name: m.orig.name } : null; }
  async deleteImage(id) { this.images.delete(id); }
  async getSettings() { return { ...this.settings }; }
  async saveSettings(s) { this.settings = { ...s }; }
  async deleteAll() { this.reports.clear(); this.images.clear(); this.settings = {}; }
}

// Fictional examples, so the preview opens on something to look at
const now = Date.now();
let n = 0;
const ch = (date, category, amount, extra) => ({ id: 'ex' + (++n), date, category, amount, currency: 'CAD', cad: null, vendor: '', approved: false, imageId: null, ai: null, checked: true, ...extra });
const EXAMPLES = [
  { id: 'example-itemized', type: 'itemized', name: 'Alex Morgan', customer: 'Contoso LA (example)', manager: 'Jordan Lee', location: 'Los Angeles, CA', createdAt: now - 2000, updatedAt: now - 1000,
    charges: [ch('2026-04-29', 'taxi', 41.20, { vendor: 'Uber', payment: 'Visa ••4412' }), ch('2026-04-30', 'airfare', 60.00, { vendor: 'Air Canada' }),
      ch('2026-05-01', 'parking', 31.50, { vendor: 'Hotel garage', approved: true }), ch('2026-05-10', 'rental', 980.25, { vendor: 'Budget' }),
      ch('2026-05-10', 'fuel', 72.15, { vendor: 'Shell' }), ch('2026-05-10', 'taxi', 26.85, { vendor: 'Lyft', currency: 'USD', cad: 36.93 })] },
  { id: 'example-perdiem', type: 'perdiem', name: 'Alex Morgan', customer: 'Acme Broadcasting (example)', start: '2026-01-19', end: '2026-01-24', partialMode: 'some', partialDays: ['2026-01-19'], createdAt: now - 4000, updatedAt: now - 3000 },
];

const inClaude = () => !!(window.claude && typeof window.claude.use === 'function');

window.MyExpensePlatform = {
  name: 'preview',
  env: { name: 'preview', title: 'MyExpense', banner: 'Preview · nothing you enter is saved' },

  async init(Svc) {
    Svc.sample = null; Svc.aiImages = null; Svc.downloads = null;
    Svc.store = new MemoryStore(EXAMPLES);
    Svc.access = 'ok';
    if (!inClaude()) return;
    const use = (k) => window.claude.use(k).catch(() => null);
    const [sample, downloads] = await Promise.all([use('sample'), use('downloads')]);
    Svc.downloads = downloads;
    if (sample) {
      try { const lim = await sample.limits(); if (lim && lim.images) { Svc.sample = sample; Svc.aiImages = lim.images; } } catch (e) { /* reading stays off */ }
    }
  },

  aiAvailable(Svc) { return !!(Svc.sample && Svc.aiImages); },
  async readReceipt(Svc, { blobs, prompt }) {
    const max = (Svc.aiImages && Svc.aiImages.maxCount) || 1;
    return Svc.sample.json(prompt, { images: blobs.slice(0, max), modelTier: 'default' });
  },
  aiFailed(Svc, e) { if (e && e.code === 'not_granted') { Svc.sample = null; return true; } return false; },
  classify() { return 'retry'; },

  async saveFile(Svc, filename, blob, toast) {
    if (Svc.downloads) {
      try { await Svc.downloads.save({ filename, data: blob }); return true; }
      catch (e) {
        if (e && e.code === 'declined') return false;
        toast('That file couldn’t be saved here (' + ((e && e.code) || 'error') + ').'); return false;
      }
    }
    if (!inClaude()) {
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000); return true;
    }
    toast('Downloads aren’t available in this view. Allow downloads for this page, then try again.');
    return false;
  },

  ui(kit) {
    const { html, Svc } = kit;
    function Gate() {
      if (Svc.access === 'error') return html`<div class="wrap"><div class="gate"><h1>MyExpense couldn’t start</h1><p class="muted">Reload the page to try again.</p></div></div>`;
      return html`<div class="wrap"><div class="list"><div class="skel"></div><div class="skel"></div></div></div>`;
    }
    return {
      Gate,
      HeaderRight: null,
      words: { pill: 'Preview: nothing you enter is saved', pillIcon: 'alert', saved: 'Kept until you close the page', empty: 'Start a per diem or itemized report above. In this preview, reports last until you close or reload the page.' },
      privacy: (aiOn) => [
        'This is a preview. Nothing you enter is saved, on this device or anywhere else: closing or reloading the page clears it. Download anything you want to keep.',
        aiOn ? 'When you add a receipt, the photo is sent to Claude to read the details.' : 'Receipt reading by Claude isn’t on in this view, so you’ll type in the details from each photo.',
      ],
    };
  },
};
})();
