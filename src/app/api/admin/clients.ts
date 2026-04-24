import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*, events(*), bookings(*), payments(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Compute analytics
    const totalClients = clients?.length || 0;
    const totalRevenue = clients?.reduce((sum: number, client: any) => {
      const clientRevenue = client.bookings?.reduce((s: number, b: any) => {
        return s + (b.total_price || 0);
      }, 0) || 0;
      return sum + clientRevenue;
    }, 0) || 0;

    return NextResponse.json({
      clients,
      stats: {
        total_clients: totalClients,
        total_revenue: totalRevenue,
        average_value: totalClients > 0 ? (totalRevenue / totalClients).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error('Admin error:', error);
    return NextResponse.json({ error: 'Errore nel recupero dei dati' }, { status: 500 });
  }
}
