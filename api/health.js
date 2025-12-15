const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const applyCors = (res) => {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
};

export default function handler(req, res) {
  try {
    // Handle preflight
    if (req.method === 'OPTIONS') {
      applyCors(res);
      return res.status(204).end();
    }
    applyCors(res);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ ok: true, route: '/api/health' });
  } catch (err) {
    console.error('Health handler error:', err);
    try { return res.status(500).json({ ok: false, error: String(err) }); } catch { /* ignore */ }
  }
}
