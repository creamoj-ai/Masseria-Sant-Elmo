import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminAuth } from '@/lib/adminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await verifyAdminAuth(userEmail);
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('id, event_date, guest_count, booking_status, notes, client_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, bookings: data || [] });
  } catch (error) {
    console.error('❌ Bookings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await verifyAdminAuth(userEmail);
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { bookingId, status, eventDate, notes } = body;

    const updateData: any = {};
    if (status) updateData.booking_status = status;
    if (eventDate) updateData.event_date = eventDate;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select();

    if (error) throw error;

    // Log action
    await supabaseAdmin.from('communication_log').insert({
      communication_type: 'admin_action',
      subject: `Booking ${status} by ${userEmail}`,
      message: `Admin ${userEmail} changed booking ${bookingId} to ${status}`,
      status: 'admin_action',
      metadata: { admin: userEmail, booking_id: bookingId, action: status },
    });

    return NextResponse.json({ success: true, booking: data?.[0] });
  } catch (error) {
    console.error('❌ Update booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
