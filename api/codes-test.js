export default async function handler(req, res) {
  // Simple test endpoint for /api/codes debugging
  if (req.method === 'GET' && req.query && (req.query.health === '1' || req.query._health === '1')) {
    return res.json({ ok: true, route: '/api/codes-test' });
  }
  return res.status(200).json({ ok: true, msg: 'codes-test up' });
}
