#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const file = process.argv[2] || path.resolve(process.cwd(), 'db/migrations/001_create_assigned_codes.sql');
const conn = process.argv[3] || process.env.PG_CONN;

if (!conn) {
  console.error('Usage: node scripts/run_migration.cjs [path/to/sql.sql] <PG_CONN> OR set PG_CONN env var');
  process.exit(1);
}

(async function main() {
  try {
    const sql = fs.readFileSync(file, 'utf8');
    const client = new Client({ connectionString: conn });
    await client.connect();
    console.log('Connected to DB. Running migration:', file);
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration executed successfully.');
    await client.end();
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  }
})();
