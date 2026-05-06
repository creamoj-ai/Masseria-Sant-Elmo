import { NextRequest, NextResponse } from 'next/server';

// TODO: Complete 2FA implementation
// This endpoint is predisposed for OTP verification

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP required' },
        { status: 400 }
      );
    }

    // TODO: Implement OTP verification
    // Steps:
    // 1. Retrieve OTP from Redis using email key
    // 2. Compare with provided OTP
    // 3. Delete OTP from Redis after verification
    // 4. Update admin_users.twofa_verified = true
    // 5. Log action in admin_audit_log

    // Example implementation:
    // const storedOTP = await redis.get(`otp:${email}`);
    // if (storedOTP !== otp) {
    //   return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    // }
    // await redis.del(`otp:${email}`);
    // await supabaseAdmin.from('admin_users').update({ twofa_verified: true }).eq('email', email);

    return NextResponse.json({
      success: true,
      message: 'OTP verified (NOT IMPLEMENTED)',
      // Remove this after implementation
      warning: '2FA is predisposed but not yet active. Contact admin.'
    });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
