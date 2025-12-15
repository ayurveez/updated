#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const handler = require('../api/codes_decrypt').handler;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_SECRET = process.env.ADMIN_DECRYPT_SECRET;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_SECRET) {
  console.error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ADMIN_DECRYPT_SECRET');
  process.exit(1);
}

// Find a recent encrypted row and call handler
(async () => {
  const sup = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await sup.from('assigned_codes').select('*').is('is_encrypted', true).order('created_at', { ascending: false }).limit(1).single();
  if (!data) { console.error('No encrypted rows found'); process.exit(1); }

  const req = { method: 'POST', headers: { 'x-admin-secret': ADMIN_SECRET }, body: { id: data.id } };
  const res = {
    status: function (code) { this._status = code; return this; },
    json: function (obj) { console.log('res.json', obj); },
    setHeader: function () {},
    end: function () {}
  };

  await handler(req, res);
})();
