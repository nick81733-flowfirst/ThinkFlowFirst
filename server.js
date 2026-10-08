const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const WEBHOOK = process.env.LEAD_WEBHOOK_URL || '';
const root = __dirname;

app.use(express.json({ limit: '256kb' }));

function briefLead(body) {
  const a = body && typeof body.answers === 'object' && body.answers ? body.answers : {};
  const src = body && typeof body.attribution === 'object' && body.attribution ? body.attribution : {};
  const safe = (v, n = 140) => String(v == null ? '' : v).replace(/[<>\\x00-\\x1f]/g, ' ').slice(0, n);
  const fields = [
    ['Name', a.name], ['Contact', a.email || a.phone || a.whatsapp],
    ['Country', a.country], ['Enquiry', a.interest || a.topic || a.category || a.reason],
    ['Source', src.utm_source || src.source], ['Campaign', src.utm_campaign || src.campaign]
  ].filter(([, v]) => v && typeof v !== 'object');
  return ['New Think Flow First website enquiry', ...fields.map(([k,v]) => k + ': ' + safe(v)), 'Please follow up through the approved secure workflow. Do not post medical details in this group.'].join('\\n');
}

app.post('/api/lead', async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const response = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: briefLead(req.body), disable_web_page_preview: true }),
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error('Telegram returned HTTP ' + response.status);
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
