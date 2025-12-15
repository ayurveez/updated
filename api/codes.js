// Minimal handler for testing deployment issues. Replace with real implementation if this works.
export default async function handler(req, res) {
  if (req.method === 'GET' && req.query && (req.query.health === '1' || req.query._health === '1')) {
    return res.json({ ok: true, route: '/api/codes (minimal)' });
  }
  return res.status(200).json({ ok: true, msg: 'codes minimal handler active' });
}
