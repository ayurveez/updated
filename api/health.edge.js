export default function (req) {
  try {
    return new Response(JSON.stringify({ ok: true, route: '/api/health.edge' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
