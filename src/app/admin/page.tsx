'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { AdvancedDashboard } from './dashboard';
import { AdminUsersManager } from '@/components/AdminUsersManager';
import { AdminPasswordModal } from '@/components/AdminPasswordModal';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser?.email) {
          const userEmail = currentUser.email;

          // Fetch admin data including password requirement
          const adminRes = await fetch('/api/admin/info', {
            headers: { 'x-user-email': userEmail },
          });

          console.log('🔐 Admin info response:', adminRes.status);

          if (adminRes.ok) {
            const adminInfo = await adminRes.json();
            console.log('✅ Admin data:', adminInfo);
            setAdminData(adminInfo);

            // Check if password verification already done in this session
            const sessionKey = `admin_password_verified_${userEmail}`;
            const isVerified = sessionStorage.getItem(sessionKey) === 'true';
            setPasswordVerified(isVerified);
          } else {
            const errorText = await adminRes.text();
            console.error('❌ Admin info error:', adminRes.status, errorText);
          }

          // Only fetch dashboard data if password is verified
          const verified = sessionStorage.getItem(`admin_password_verified_${userEmail}`) === 'true';
          if (verified) {
            // Fetch stats with admin auth
            console.log('📡 Fetching stats for:', userEmail);
            const statsRes = await fetch('/api/admin/stats', {
              headers: { 'x-user-email': userEmail },
            });
            console.log('📊 Stats response:', statsRes.status);
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              setStats(statsData.stats);
            } else {
              console.error('Stats error:', await statsRes.text());
            }

            // Fetch bookings with admin auth
            const bookingsRes = await fetch('/api/admin/bookings', {
              headers: { 'x-user-email': userEmail },
            });
            console.log('📅 Bookings response:', bookingsRes.status);
            if (bookingsRes.ok) {
              const bookingsData = await bookingsRes.json();
              setBookings(bookingsData.bookings || []);
            } else {
              console.error('Bookings error:', await bookingsRes.text());
            }

            // Try to fetch admin users (only succeeds for superadmin)
            const usersRes = await fetch('/api/admin/users', {
              headers: { 'x-user-email': userEmail },
            });
            console.log('👥 Users response:', usersRes.status);
            if (usersRes.ok) {
              setRole('superadmin');
            } else if (usersRes.status === 403) {
              setRole('admin');
            }
          }
        }
      } catch (err) {
        console.error('❌ Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">⏳ Loading admin dashboard...</h1>
        </div>
      </div>
    );
  }

  // Show password modal if not verified and user has password set
  if (!passwordVerified && adminData?.password_hash) {
    return (
      <AdminPasswordModal
        userEmail={user?.email}
        onPasswordVerified={() => {
          const sessionKey = `admin_password_verified_${user?.email}`;
          sessionStorage.setItem(sessionKey, 'true');
          setPasswordVerified(true);
          // Reload to fetch data
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-600 mt-2">Benvenuto, {user?.email}</p>
          </div>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
            Role: {role?.toUpperCase()}
          </div>
        </div>

        {/* Main Dashboard with Real Data */}
        <AdvancedDashboard stats={stats} bookings={bookings} />

        {/* Superadmin: Manage Users */}
        {role === 'superadmin' && (
          <div className="mt-12 border-t pt-12">
            <AdminUsersManager userEmail={user?.email} />
          </div>
        )}
      </div>
    </div>
  );
}
