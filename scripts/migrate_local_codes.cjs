#!/usr/bin/env node
/**
 * Usage: node scripts/migrate_local_codes.cjs ./local_codes.json
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/migrate_local_codes.cjs ./local_codes.json');
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment before running.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

(async function main() {
  try {
    const raw = fs.readFileSync(path.resolve(file), 'utf8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) throw new Error('Expected JSON array');

    for (const it of items) {
      const plain = String(it.code || it.codePlain || it.plainCode || '');
      if (!plain) {
        console.warn('Skipping item without code:', it);
        continue;
      }

      const meta = Object.assign({}, it);
      delete meta.code; delete meta.plainCode; delete meta.codePlain;

      const payload = {
        user_id: meta.userId || null,
        code: null,
        code_hash: bcrypt.hashSync(plain, 10),
        is_hashed: true,
        expires_at: meta.expiresAt || null,
        metadata: meta
      };

      const { data, error } = await supabase.from('assigned_codes').insert(payload).select('*').single();
      if (error) console.error('Insert error for', plain, error.message || error);
      else console.log('Inserted:', data.id, '(masked)');
    }

    console.log('Migration complete. Verify rows in Supabase dashboard.');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  }
})();
