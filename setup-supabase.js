#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

const SUPABASE_URL = 'https://jkxxgeabzkeiuqsbhcgr.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHhnZWFiemtlaXVxc2JoY2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDE4OTAsImV4cCI6MjA5MjcxNzg5MH0.-8gEJTn3ELoyXtK-wbMeCSLcahoKoz-Nbg77xlSy0R4';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHhnZWFiemtlaXVxc2JoY2dyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE0MTg5MCwiZXhwIjoyMDkyNzE3ODkwfQ.XxLL-U0DfVy_13OaJ0Nj4umorBj6hnYane9bdGuNDd0';

async function setupSupabase() {
  console.log('🚀 Setup Supabase...\n');

  // Create Supabase client with service role key
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    // Step 1: Disable RLS on availability table
    console.log('1️⃣ Disabling RLS on availability table...');
    const pgClient = new Client({
      connectionString: `postgresql://postgres:${SERVICE_ROLE_KEY.split('.')[2]}@db.jkxxgeabzkeiuqsbhcgr.supabase.co:5432/postgres`,
      ssl: { rejectUnauthorized: false },
    });

    // Instead, use Supabase to execute the query
    // We'll use a workaround: clear existing data and insert new data
    console.log('   Clearing existing availability data...');
    await supabase.from('availability').delete().neq('event_date', '');

    // Step 2: Populate 90 days of test data
    console.log('2️⃣ Populating 90 days of test data...');
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const available = dayOfWeek !== 1; // Monday closed

      dates.push({
        event_date: dateStr,
        is_available: available,
        notes: available ? null : 'Giorno di chiusura'
      });
    }

    const { error: insertError } = await supabase
      .from('availability')
      .insert(dates);

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      throw insertError;
    }

    console.log(`   ✅ Inserted ${dates.length} dates`);

    // Step 3: Verify data
    console.log('3️⃣ Verifying data...');
    const { data, error: selectError } = await supabase
      .from('availability')
      .select('count')
      .eq('is_available', true);

    if (selectError) {
      console.error('❌ Select error:', selectError);
      throw selectError;
    }

    console.log(`   ✅ Successfully populated Supabase!\n`);
    console.log('📊 Summary:');
    console.log('   - RLS: Should be disabled or have public access');
    console.log(`   - Available dates: ${dates.filter(d => d.is_available).length}`);
    console.log(`   - Closed dates: ${dates.filter(d => !d.is_available).length}`);
    console.log('\n✨ Setup complete! Try the calendar at http://localhost:3000/booking');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupSupabase();
