import { supabase } from './_supabase.js';
import bcrypt from 'bcryptjs';
import { applyCors, handleOptions } from './_cors.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ error: 'code required' });

    const { data, error } = await supabase.from('assigned_codes').select('*');
    if (error) return res.status(500).json({ error: error.message });

    for (const r of data || []) {
      if (r.is_hashed && r.code_hash && bcrypt.compareSync(String(code), r.code_hash)) {
        return res.json({ ok: true, row: r });
      }
      if (!r.is_hashed && r.code && String(code) === String(r.code)) return res.json({ ok: true, row: r });
    }

    return res.status(200).json({ ok: false });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
