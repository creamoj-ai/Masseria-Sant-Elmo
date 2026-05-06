'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface AdvancedDashboardProps {
  stats?: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
  };
  bookings?: any[];
}

export function AdvancedDashboard({ stats, bookings = [] }: AdvancedDashboardProps) {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const maskData = (text: string) => privacyMode ? '█'.repeat(text.length) : text;

  const handleBookingAction = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || '',
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error updating booking');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error updating booking');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* TOP STATS */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-light">Statistiche Dashboard</h1>
        <button
          onClick={() => setPrivacyMode(!privacyMode)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          {privacyMode ? '🔒' : '👁️'} Privacy
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
          <p className="text-4xl font-light text-gray-900">{stats?.totalBookings || 0}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-4xl font-light text-yellow-600">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Confirmed</p>
          <p className="text-4xl font-light text-green-600">{stats?.confirmedBookings || 0}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Revenue</p>
          <p className="text-4xl font-light text-blue-600">€{maskData((stats?.totalRevenue || 0).toString())}</p>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-light">Prenotazioni Recenti</h3>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No bookings yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Data</th>
                  <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Ospiti</th>
                  <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Note</th>
                  <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{booking.event_date}</td>
                    <td className="px-6 py-4 text-sm">{booking.guest_count}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded ${
                        booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.notes?.substring(0, 30) || '-'}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {booking.booking_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'confirmed')}
                            disabled={updatingId === booking.id}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {booking.booking_status === 'confirmed' && (
                        <button
                          onClick={() => handleBookingAction(booking.id, 'completed')}
                          disabled={updatingId === booking.id}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          ✓ Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
