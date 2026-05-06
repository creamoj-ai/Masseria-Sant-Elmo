import { verifyAdminAuth } from '@/lib/adminAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminData = await verifyAdminAuth(userEmail);

    if (!adminData) {
      return NextResponse.json(
        { error: 'Not an admin user' },
        { status: 403 }
      );
    }

    // Return admin info including password_hash flag (not the actual hash!)
    return NextResponse.json({
      email: adminData.email,
      role: adminData.role,
      password_hash: !!adminData.password_hash,
      twofa_enabled: adminData.twofa_enabled || false,
      twofa_verified: adminData.twofa_verified || false,
    });
  } catch (error) {
    console.error('❌ Admin info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
