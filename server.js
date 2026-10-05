const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const WEBHOOK = process.env.LEAD_WEBHOOK_URL || '';

app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/responder', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'responder.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Think Flow First site listening on ${PORT}`);
});
