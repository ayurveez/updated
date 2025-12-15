import { supabase } from './_supabase.js';
import crypto from 'crypto';
import { applyCors, handleOptions } from './_cors.js';

const ENC_KEY_B64 = process.env.ACCESS_CODE_ENCRYPTION_KEY || null;

function decryptCode(encB64) {
  if (!ENC_KEY_B64 || !encB64) return null;
  const key = Buffer.from(ENC_KEY_B64, 'base64');
  const raw = Buffer.from(encB64, 'base64');
  const iv = raw.slice(0, 12);
  const tag = raw.slice(12, 28);
  const ciphertext = raw.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return plain;
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const secret = req.headers['x-admin-secret'] || req.headers['x-admin-secret'.toLowerCase()];
    if (!process.env.ADMIN_DECRYPT_SECRET || !secret || secret !== process.env.ADMIN_DECRYPT_SECRET) return res.status(401).json({ error: 'unauthorized' });

    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id required' });

    const { data, error } = await supabase.from('assigned_codes').select('*').eq('id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'not found' });
    if (!data.is_encrypted || !data.code_encrypted) return res.status(400).json({ error: 'no encrypted code' });

    const plain = decryptCode(data.code_encrypted);
    if (!plain) return res.status(500).json({ error: 'decryption failed' });
    return res.json({ ok: true, plain });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
