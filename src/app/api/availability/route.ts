import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ available_dates: [] });
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('availability')
      .select('event_date, is_available')
      .eq('is_available', true)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ available_dates: data?.map(d => d.event_date) || [] });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json({ available_dates: [] });
  }
}
