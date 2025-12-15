import { supabase } from './_supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { applyCors, handleOptions } from './_cors.js';

const ENC_KEY_B64 = process.env.ACCESS_CODE_ENCRYPTION_KEY || null;

function encryptCode(plain) {
  if (!ENC_KEY_B64) return null;
  const key = Buffer.from(ENC_KEY_B64, 'base64');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    enc: Buffer.concat([iv, tag, ciphertext]).toString('base64'),
    iv: iv.toString('base64')
  };
}

export default async function codesHandler(req, res) {
  if (handleOptions(req, res)) return;

  // health shortcut
  if (req.method === 'GET' && req.query && (req.query.health === '1' || req.query._health === '1')) {
    applyCors(res);
    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('assigned_codes').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    applyCors(res);
    return res.json({ data });
  }

  if (req.method === 'POST') {
    applyCors(res);
    try {
      const body = req.body || {};
      const plain = String(body.plainCode || '').trim();
      const metadata = body.metadata || {};
      if (!plain) return res.status(400).json({ error: 'plainCode required' });

      const hash = bcrypt.hashSync(plain, 10);
      const encryption = encryptCode(plain);

      const payload = {
        user_id: metadata.userId || null,
        code: null,
        code_hash: hash,
        is_hashed: true,
        is_encrypted: !!encryption,
        code_encrypted: encryption ? encryption.enc : null,
        code_enc_iv: encryption ? encryption.iv : null,
        expires_at: body.expiresAt || null,
        metadata: metadata
      };

      const { data, error } = await supabase.from('assigned_codes').insert(payload).select('*').single();
      if (error) {
        if (error.code && (error.code === '23505' || String(error.message).includes('duplicate'))) {
          return res.status(409).json({ error: 'code exists' });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.json({ data, plainCode: plain });
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const q = req.query || {};
      const code = q.code || '';
      if (!code) return res.status(400).json({ error: 'code query required' });

      const all = await supabase.from('assigned_codes').select('*');
      for (const r of all.data || []) {
        if (r.code_hash && bcrypt.compareSync(code, r.code_hash)) {
          await supabase.from('assigned_codes').delete().match({ id: r.id });
          return res.json({ ok: true });
        }
      }
      return res.status(404).json({ error: 'not found' });
    } catch (err) {
      return res.status(500).json({ error: String(err) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
