import { NextRequest, NextResponse } from 'next/server';

// TODO: Complete 2FA implementation
// This endpoint is predisposed for SMS OTP sending via Twilio

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone required' },
        { status: 400 }
      );
    }

    // TODO: Implement OTP generation and SMS sending
    // Steps:
    // 1. Generate random 6-digit OTP
    // 2. Store OTP in Redis with 10-minute TTL
    // 3. Send SMS via Twilio using lib/twilio.ts
    // 4. Log action in admin_audit_log

    // Example implementation:
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // await redis.setex(`otp:${email}`, 600, otp);
    // await sendSMS(phone, `Your admin access code: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to phone (NOT IMPLEMENTED)',
      // Remove this after implementation
      warning: '2FA is predisposed but not yet active. Contact admin.'
    });
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
