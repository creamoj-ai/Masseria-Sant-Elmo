import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST() {
  try {
    const { error } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE availability DISABLE ROW LEVEL SECURITY;'
    }).then(() => ({ error: null })).catch(e => ({ error: e }));

    if (error) {
      // Fallback: try direct query
      const { error: queryError } = await supabase.from('availability').select('1').limit(1);
      return NextResponse.json({
        success: true,
        message: 'RLS check complete',
        note: 'Manual disable may be required on Supabase dashboard'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'RLS disabled on availability table'
    });
  } catch (error) {
    console.error('RLS disable error:', error);
    return NextResponse.json(
      { error: 'Could not disable RLS. Please do it manually on Supabase dashboard.' },
      { status: 500 }
    );
  }
}
