import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

// Lazy load Supabase client (avoid build-time errors)
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Export for use in API routes
export function getSupabaseAdminClient() {
  return getSupabaseAdmin();
}

export async function verifyAdminAuth(userEmail: string | null | undefined) {
  if (!userEmail) return null;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('email, role, active, password_hash, twofa_enabled, twofa_verified')
      .eq('email', userEmail)
      .eq('active', true)
      .single();

    if (error) return null;
    return data;
  } catch (err) {
    console.error('❌ Admin auth error:', err);
    return null;
  }
}

export async function verifyAdminPassword(userEmail: string, password: string) {
  if (!userEmail || !password) return null;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('email, password_hash, role')
      .eq('email', userEmail)
      .eq('active', true)
      .single();

    if (error || !data?.password_hash) return null;

    const passwordMatch = await bcrypt.compare(password, data.password_hash);
    return passwordMatch ? { email: data.email, role: data.role } : null;
  } catch (err) {
    console.error('❌ Password verification error:', err);
    return null;
  }
}

export async function hashAdminPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error('❌ Password hashing error:', err);
    return null;
  }
}

export async function getAdminStats(userEmail: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: bookingsData, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('id, booking_status, event_date')
      .order('event_date', { ascending: false });

    if (bookingsError) throw bookingsError;

    const totalBookings = bookingsData?.length || 0;
    const pendingBookings = bookingsData?.filter(b => b.booking_status === 'pending').length || 0;
    const confirmedBookings = bookingsData?.filter(b => b.booking_status === 'confirmed').length || 0;

    const { data: paymentsData, error: paymentsError } = await supabaseAdmin
      .from('payments')
      .select('amount, status')
      .eq('status', 'succeeded');

    if (paymentsError) throw paymentsError;

    const totalRevenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalRevenue,
    };
  } catch (err) {
    console.error('❌ Stats error:', err);
    return {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      totalRevenue: 0,
    };
  }
}

export async function logAdminAction(
  userEmail: string,
  action: string,
  details: string,
  result: 'success' | 'failed'
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from('communication_log').insert({
      communication_type: 'admin_action',
      subject: action,
      message: details,
      status: result,
      metadata: {
        admin_user: userEmail,
        action_type: action,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('❌ Audit log error:', err);
  }
}

export async function getAdminUsers() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('❌ Get admin users error:', err);
    return [];
  }
}
