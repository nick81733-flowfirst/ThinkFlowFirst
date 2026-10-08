const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const WEBHOOK = process.env.LEAD_WEBHOOK_URL || '';
const root = __dirname;

app.use(express.json({ limit: '256kb' }));

app.post('/api/lead', async (req, res) => {
  const payload = {
    ...req.body,
    receivedAt: new Date().toISOString(),
    userAgent: req.get('user-agent') || ''
  };

  if (!WEBHOOK) {
    console.log('[TFF staging lead - webhook not configured]', JSON.stringify(payload));
    return res.status(202).json({ ok: true, staging: true });
  }

  try {
    const response = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    return res.json({ ok: true });
  } catch (error) {
    console.error('[TFF lead webhook error]', error);
    return res.status(502).json({ ok: false });
  }
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
