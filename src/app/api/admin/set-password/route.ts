import { verifyAdminAuth, hashAdminPassword, getSupabaseAdminClient } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requesterEmail = request.headers.get('x-user-email');
    const { targetEmail, newPassword } = await request.json();

    if (!requesterEmail || !targetEmail || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify requester is superadmin
    const requester = await verifyAdminAuth(requesterEmail);
    if (requester?.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Only superadmin can set passwords' },
        { status: 403 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await hashAdminPassword(newPassword);
    if (!passwordHash) {
      return NextResponse.json(
        { error: 'Failed to process password' },
        { status: 500 }
      );
    }

    // Update the admin user's password
    const supabaseAdmin = getSupabaseAdminClient();
    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: passwordHash })
      .eq('email', targetEmail)
      .eq('active', true);

    if (error) {
      console.error('❌ Update password error:', error);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Log the action in audit log
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_email: targetEmail,
      action: 'password_set',
      details: {
        set_by: requesterEmail,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Password for ${targetEmail} has been set`
    });
  } catch (error) {
    console.error('❌ Set password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
