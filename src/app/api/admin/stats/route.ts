import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/adminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get user email from header (passed from middleware/client)
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await verifyAdminAuth(userEmail);
    if (!adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch stats
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('id, booking_status, event_date, guest_count');

    if (bookingsError) throw bookingsError;

    const totalBookings = bookings?.length || 0;
    const pendingBookings = bookings?.filter(b => b.booking_status === 'pending').length || 0;
    const confirmedBookings = bookings?.filter(b => b.booking_status === 'confirmed').length || 0;

    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount, status');

    const totalRevenue = payments?.reduce((sum, p) => p.status === 'succeeded' ? sum + (p.amount || 0) : sum, 0) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        newContacts: pendingBookings, // approx new contacts = pending
      },
    });
  } catch (error) {
    console.error('❌ Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
