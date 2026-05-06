#!/usr/bin/env node

const { Client } = require('pg');

const client = new Client({
  host: 'db.jkxxgeabzkeiuqsbhcgr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'TuM2jGe6R64JgKix',
  ssl: { rejectUnauthorized: false }
});

async function disableRLS() {
  try {
    console.log('🔗 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('🔓 Disabling RLS on availability table...');
    await client.query('ALTER TABLE availability DISABLE ROW LEVEL SECURITY;');
    console.log('✅ RLS disabled!');

    await client.end();
    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

disableRLS();
