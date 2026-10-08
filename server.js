const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const WEBHOOK = process.env.LEAD_WEBHOOK_URL || '';
const root = __dirname;

app.use(express.json({ limit: '256kb' }));

function fullLead(body) {
  const a = body && typeof body.answers === 'object' && body.answers ? body.answers : {};
  const src = body && typeof body.attribution === 'object' && body.attribution ? body.attribution : {};
  const clean = (v) => String(v == null ? '' : v).replace(/[\x00-\x1f]/g, ' ').trim();
  const fields = [
    ['Name', a.name], ['Email', a.email], ['WhatsApp / Telegram', a.messaging],
    ['1. Who are you asking about?', a.relationship],
    ['2. Main health situation or goal', a.situation],
    ['3. How long has this been relevant?', a.timing],
    ['4. Biggest concern or challenge', a.challenge],
    ['5. What are you hoping to understand or improve?', a.goal],
    ['6. Current care, treatments or approaches', a.currentCare],
    ['7. Country / city', a.country],
    ['Follow-up preferences', Array.isArray(a.intents) ? a.intents.map(v => ({
      'help-now': 'Help now', 'country-alert': 'Country availability alerts',
      'keep-posted': 'Educational updates'
    }[v] || v)).join(', ') : a.intents],
    ['Flow First Brief opt-in', a.flowFirstBrief === true ? 'Yes' : 'No'],
    ['Source', src.utm_source || src.source || 'Direct / unknown'],
    ['Campaign', src.utm_campaign || src.campaign || 'None']
  ];
  if (body && body.type === 'contact') {
    return ['New Think Flow First contact form message',
      ...Object.entries(a).map(([k, v]) => clean(k) + ': ' + clean(v)),
      'Source: ' + clean(src.utm_source || src.source || 'Direct / unknown')].join('\n');
  }
  return ['New Think Flow First questionnaire', ...fields.map(([label, value]) =>
    label + ':\n' + clean(value === undefined || value === '' ? 'Not provided' : value)
  )].join('\n\n');
}

function splitTelegramMessage(message, maxLength = 3500) {
  const chunks = [];
  let remaining = message;
  while (remaining.length > maxLength) {
    let at = remaining.lastIndexOf('\n\n', maxLength);
    if (at < maxLength / 2) at = remaining.lastIndexOf('\n', maxLength);
    if (at < maxLength / 2) at = maxLength;
    chunks.push(remaining.slice(0, at));
    remaining = remaining.slice(at).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

app.post('/api/lead', async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const parts = splitTelegramMessage(fullLead(req.body));
      for (let i = 0; i < parts.length; i++) {
        const text = parts.length > 1 ? 'Part ' + (i + 1) + '/' + parts.length + '\n\n' + parts[i] : parts[i];
        const response = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
          signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) throw new Error('Telegram returned HTTP ' + response.status);
      }
      return res.json({ ok: true });
    } catch (error) {
      console.error('[TFF Telegram delivery failed]', error.message);
      return res.status(502).json({ ok: false, error: 'Notification delivery failed' });
    }
  }
  if (WEBHOOK) {
    try {
      const response = await fetch(WEBHOOK, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req.body), signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error('Webhook returned HTTP ' + response.status);
      return res.json({ ok: true });
    } catch (error) {
      console.error('[TFF lead webhook error]', error.message);
      return res.status(502).json({ ok: false });
    }
  }
  console.log('[TFF staging enquiry received - notification not configured]');
  return res.status(503).json({ ok: false, error: 'Notification not configured' });
});

// Publish the V3 website from the repository root, not the older public/ prototype.
for (const file of ['app.js', 'styles.css', 'education.html', 'history.html', 'frameworks.html']) {
  app.get('/' + file, (_req, res) => res.sendFile(path.join(root, file)));
}
app.use('/education', express.static(path.join(root, 'education'), { index: false }));
app.get('/responder', (_req, res) => res.sendFile(path.join(root, 'responder.html')));
app.get('/responder.html', (_req, res) => res.sendFile(path.join(root, 'responder.html')));

// The client-side router reads the URL to select each page and entry door.
const routes = ['/', '/start', '/what-is-flow-first', '/why-flow-matters', '/raho',
  '/about', '/contact', '/stroke', '/heart', '/parkinsons', '/prevention',
  '/stemcells', '/longevity', '/before-you-travel', '/recovery'];
for (const route of routes) {
  app.get(route, (_req, res) => res.sendFile(path.join(root, 'index.html')));
}
app.use((_req, res) => res.status(404).send('Page not found'));

app.listen(PORT, () => console.log(`Think Flow First V3 listening on ${PORT}`));
