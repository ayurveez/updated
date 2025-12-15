#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ENC_KEY_B64 = process.env.ACCESS_CODE_ENCRYPTION_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!ENC_KEY_B64) {
  console.error('Set ACCESS_CODE_ENCRYPTION_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function encrypt(plain) {
  const key = Buffer.from(ENC_KEY_B64, 'base64');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

(async () => {
  const plain = process.argv[2] || 'ADMIN-TEST-01';
  const hash = bcrypt.hashSync(plain, 10);
  const enc = encrypt(plain);
  const payload = {
    user_id: null,
    code: null,
    code_hash: hash,
    is_hashed: true,
    is_encrypted: true,
    code_encrypted: enc,
    code_enc_iv: null,
    metadata: { studentName: 'Test Admin', type: 'PROFF', targetId: 'first-proff' }
  };
  const { data, error } = await supabase.from('assigned_codes').insert(payload).select('*').single();
  if (error) console.error('Insert failed', error);
  else console.log('Inserted', data);
})();
