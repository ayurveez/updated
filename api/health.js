export default async function handler(req, res) {
  // Simple health check to verify serverless functions are reachable
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ ok: true, route: '/api/health' });
}
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const applyCors = (res) => {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
};

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    applyCors(res);
    return res.status(204).end();
  }
  applyCors(res);
  res.status(200).json({ ok: true });
}
