'use client';

import { useEffect, useState } from 'react';

interface Booking {
  id: string;
  booking_status: string;
  event_date: string;
  guest_count: number;
  created_at: string;
  clients: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    event_type: string;
  };
  events: {
    event_name: string;
  };
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        setError('Errore nel caricamento delle prenotazioni');
      }
    } catch (err) {
      setError('Errore di connessione');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = bookings.length;
  const totalGuests = bookings.reduce((sum, b) => sum + (b.guest_count || 0), 0);
  const pendingBookings = bookings.filter(b => b.booking_status === 'pending').length;

  return (
    <div className="min-h-screen bg-white">
      {/* ADMIN HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-xl font-light tracking-widest">ADMIN DASHBOARD</h1>
          <a href="/" className="text-sm hover:text-gray-600 transition">← Back to Site</a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="border-t border-gray-300 pt-8">
            <p className="text-5xl font-light text-gray-900 mb-4">{totalBookings}</p>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Prenotazioni Totali</p>
          </div>
          <div className="border-t border-gray-300 pt-8">
            <p className="text-5xl font-light text-gray-900 mb-4">{pendingBookings}</p>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-600">In Sospeso</p>
          </div>
          <div className="border-t border-gray-300 pt-8">
            <p className="text-5xl font-light text-gray-900 mb-4">{totalGuests}</p>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Ospiti Totali</p>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div>
          <h2 className="text-3xl font-light mb-8">Tutte le Prenotazioni</h2>

          {loading && (
            <p className="text-center text-gray-600 py-12">Caricamento prenotazioni...</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <p className="text-center text-gray-600 py-12">Nessuna prenotazione ancora</p>
          )}

          {!loading && bookings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Cliente</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Email</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Telefono</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Tipo Evento</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Data Evento</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Ospiti</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Status</th>
                    <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Data Prenotazione</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4 text-sm">
                        {booking.clients.first_name} {booking.clients.last_name}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <a href={`mailto:${booking.clients.email}`} className="hover:underline">
                          {booking.clients.email}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <a href={`tel:${booking.clients.phone}`} className="hover:underline">
                          {booking.clients.phone}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {booking.clients.event_type === 'matrimonio' && 'Matrimonio'}
                        {booking.clients.event_type === 'corporate' && 'Corporate'}
                        {booking.clients.event_type === 'enogastronomico' && 'Degustazione'}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {new Date(booking.event_date).toLocaleDateString('it-IT')}
                      </td>
                      <td className="py-4 px-4 text-sm font-light text-gray-900">
                        {booking.guest_count}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-light ${
                          booking.booking_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {booking.booking_status === 'pending' ? 'In Sospeso' : 'Confermata'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(booking.created_at).toLocaleDateString('it-IT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>&copy; 2025 Essenze di Natura Admin Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
