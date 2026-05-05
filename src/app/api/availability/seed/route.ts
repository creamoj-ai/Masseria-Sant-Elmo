import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST() {
  try {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 390; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      const available = dayOfWeek !== 1;

      dates.push({
        event_date: dateStr,
        is_available: available,
        notes: available ? undefined : 'Giorno di chiusura'
      });
    }

    const { error } = await supabase
      .from('availability')
      .upsert(dates, { onConflict: 'event_date' });

    if (error) throw error;
    return NextResponse.json({ success: true, count: dates.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
