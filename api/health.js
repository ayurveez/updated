const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.set(CORS_HEADERS).status(204).end();
  }
  res.set(CORS_HEADERS).status(200).json({ ok: true });
}
