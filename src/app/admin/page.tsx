'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📡 Fetching bookings...');
    fetch('/api/bookings')
      .then(res => {
        console.log('✅ API Response:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📦 Data:', data);
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center text-white p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-light mb-8">🎯 ADMIN DASHBOARD</h1>
        <div className="space-y-4 bg-gray-800 rounded-lg p-8">
          <p className="text-xl">Status: {loading ? '⏳ Loading...' : '✅ Ready'}</p>
          <p className="text-lg">Bookings: {bookings.length}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-white text-black rounded-lg font-light hover:bg-gray-100">
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
