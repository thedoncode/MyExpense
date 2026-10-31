// Reads a receipt with Claude through the Anthropic API. The API key stays on the server.
const core = require('../src/core.js');

function err(code, status) { const e = new Error(code); e.code = code; e.status = status; return e; }

// Pulls the JSON object out of Claude's reply (it may be wrapped in a code fence)
function parseReply(text) {
  const s = String(text || '');
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b <= a) throw err('ai_error');
  return JSON.parse(s.slice(a, b + 1));
}

// kind "receipt" reads one receipt (or its PDF); kind "statement" lists every row on one statement page.
// Either way the prompt is fixed here, never taken from the request.
async function readReceipt(ai, { pdf, image, today, kind }) {
  const statement = kind === 'statement';
  const content = [];
  if (pdf && !statement) content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdf.toString('base64') } });
  else content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image.toString('base64') } });
  content.push({ type: 'text', text: statement ? core.STATEMENT_PROMPT(today) : core.AI_PROMPT(today) });
  let res;
  try {
    res = await fetch(ai.base + '/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': ai.key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: ai.model, max_tokens: statement ? 6000 : 2000, messages: [{ role: 'user', content }] }),
      signal: AbortSignal.timeout(ai.timeoutMs),
      redirect: 'error',
    });
  } catch (e) { throw err('ai_error'); }
  if (res.status === 429 || res.status === 529) throw err('rate_limited', res.status);
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}));
    const msg = JSON.stringify(body).toLowerCase();
    throw err(/image|pdf|document/.test(msg) ? 'image_rejected' : 'ai_error', 400);
  }
  if (!res.ok) throw err('ai_error', res.status);
  const data = await res.json();
  const text = (data.content || []).filter(b => b && b.type === 'text').map(b => b.text).join('\n');
  let json;
  try { json = parseReply(text); } catch (e) { return statement ? { kind: 'unreadable', card: '', rows: [] } : { kind: 'unreadable', transactions: [] }; }
  if (statement) return core.normalizeStatement(json);
  const out = core.normalizeAi(json);
  out.kind = ['receipt', 'statement', 'unreadable'].includes(out.kind) ? out.kind : null;
  return out;
}

module.exports = { readReceipt, parseReply };
