#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:TuM2jGe6R64JgKix@db.jkxxgeabzkeiuqsbhcgr.supabase.co:5432/postgres';

const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

async function createSchema() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('\n📋 Running schema...');
    await client.query(schema);
    console.log('✅ Schema created successfully!');

    console.log('\n📊 Verifying tables...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n✅ Tables created:');
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Done!');
  }
}

createSchema();
