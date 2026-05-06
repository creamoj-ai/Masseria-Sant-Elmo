import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, getSupabaseAdminClient } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await verifyAdminAuth(userEmail);
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Only superadmin can view all users
    if (adminUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only superadmin can view users' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, users: data || [] });
  } catch (error) {
    console.error('❌ Get users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await verifyAdminAuth(userEmail);
    if (!adminUser || adminUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only superadmin can add users' }, { status: 403 });
    }

    const { email, role = 'admin' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert({ email, role, active: true })
      .select();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      throw error;
    }

    // Log action
    await supabaseAdmin.from('communication_log').insert({
      communication_type: 'admin_action',
      subject: `Added admin user: ${email}`,
      message: `Superadmin ${userEmail} added ${email} as ${role}`,
      status: 'admin_action',
      metadata: { admin: userEmail, new_user: email, role },
    });

    return NextResponse.json({ success: true, user: data?.[0] });
  } catch (error) {
    console.error('❌ Add user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUser = await verifyAdminAuth(userEmail);
    if (!adminUser || adminUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only superadmin can remove users' }, { status: 403 });
    }

    const { email } = await request.json();

    // Prevent deleting the user themselves
    if (email === userEmail) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    // Prevent deleting last superadmin
    const supabaseAdmin = getSupabaseAdminClient();
    const { data: superadmins, error: countError } = await supabaseAdmin
      .from('admin_users')
      .select('id', { count: 'exact' })
      .eq('role', 'superadmin')
      .eq('active', true);

    if ((superadmins?.length || 0) === 1) {
      const { data: targetUser } = await supabaseAdmin
        .from('admin_users')
        .select('role')
        .eq('email', email)
        .single();

      if (targetUser?.role === 'superadmin') {
        return NextResponse.json({ error: 'Cannot delete last superadmin' }, { status: 400 });
      }
    }

    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ active: false })
      .eq('email', email);

    if (error) throw error;

    // Log action
    await supabaseAdmin.from('communication_log').insert({
      communication_type: 'admin_action',
      subject: `Removed admin user: ${email}`,
      message: `Superadmin ${userEmail} removed ${email}`,
      status: 'admin_action',
      metadata: { admin: userEmail, removed_user: email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
