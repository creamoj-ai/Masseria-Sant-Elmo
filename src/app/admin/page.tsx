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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const confirmedBookings = bookings.filter(b => b.booking_status !== 'pending').length;
  const estimatedRevenue = totalBookings * 5000;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Prenotazioni', icon: '📅' },
    { id: 'clients', label: 'Clienti', icon: '👥' },
    { id: 'payments', label: 'Pagamenti', icon: '💳' },
    { id: 'analytics', label: 'Analitiche', icon: '📈' },
    { id: 'settings', label: 'Impostazioni', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 flex flex-col border-r border-gray-800`}>
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          {sidebarOpen ? (
            <h2 className="text-xl font-light tracking-widest">ADMIN</h2>
          ) : (
            <span className="text-2xl">🎯</span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-light">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* TOGGLE SIDEBAR */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-4 p-3 rounded-lg hover:bg-gray-900 transition text-gray-400 hover:text-white"
        >
          {sidebarOpen ? '←' : '→'}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white">
          <h1 className="text-2xl font-light tracking-widest">
            {navigationItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">👤 Admin</span>
            <a href="/" className="text-sm text-gray-600 hover:text-black transition">← Torna al sito</a>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-auto p-8">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* STATS GRID */}
              <div className="grid md:grid-cols-4 gap-6">
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
                <div className="border-t border-gray-300 pt-8">
                  <p className="text-5xl font-light text-gray-900 mb-4">€{estimatedRevenue.toLocaleString()}</p>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Ricavi Stimati</p>
                </div>
              </div>

              {/* RECENT BOOKINGS */}
              <div>
                <h2 className="text-3xl font-light mb-8">Prenotazioni Recenti</h2>
                {bookings.slice(0, 5).length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="border-b border-gray-100 pb-6 flex justify-between items-center hover:bg-gray-50 p-4 rounded transition">
                        <div>
                          <p className="font-light text-lg">{booking.clients.first_name} {booking.clients.last_name}</p>
                          <p className="text-sm text-gray-600">{new Date(booking.event_date).toLocaleDateString('it-IT')} • {booking.guest_count} ospiti</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-light ${
                          booking.booking_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {booking.booking_status === 'pending' ? 'In Sospeso' : 'Confermata'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Nessuna prenotazione</p>
                )}
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-3xl font-light mb-8">Gestione Prenotazioni</h2>
              {loading ? (
                <p className="text-gray-600">Caricamento...</p>
              ) : bookings.length === 0 ? (
                <p className="text-gray-600">Nessuna prenotazione</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Cliente</th>
                        <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Email</th>
                        <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Data Evento</th>
                        <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Ospiti</th>
                        <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Tipo</th>
                        <th className="text-left py-4 px-4 text-sm uppercase tracking-[0.1em] text-gray-600 font-light">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-4 px-4 text-sm font-light">{booking.clients.first_name} {booking.clients.last_name}</td>
                          <td className="py-4 px-4 text-sm"><a href={`mailto:${booking.clients.email}`} className="text-blue-600 hover:underline">{booking.clients.email}</a></td>
                          <td className="py-4 px-4 text-sm">{new Date(booking.event_date).toLocaleDateString('it-IT')}</td>
                          <td className="py-4 px-4 text-sm font-light">{booking.guest_count}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {booking.clients.event_type === 'matrimonio' && 'Matrimonio'}
                            {booking.clients.event_type === 'corporate' && 'Corporate'}
                            {booking.clients.event_type === 'enogastronomico' && 'Degustazione'}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-light ${
                              booking.booking_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {booking.booking_status === 'pending' ? 'Sospeso' : 'Confermata'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CLIENTS TAB */}
          {activeTab === 'clients' && (
            <div>
              <h2 className="text-3xl font-light mb-8">Gestione Clienti</h2>
              <p className="text-gray-600 mb-8">Totale clienti: <span className="font-bold text-black">{new Set(bookings.map(b => b.clients.email)).size}</span></p>
              {bookings.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {Array.from(new Map(bookings.map(b => [b.clients.email, b])).values()).map((booking) => (
                    <div key={booking.clients.email} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                      <h3 className="text-xl font-light mb-4">{booking.clients.first_name} {booking.clients.last_name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>📧 <a href={`mailto:${booking.clients.email}`} className="text-blue-600 hover:underline">{booking.clients.email}</a></p>
                        <p>☎️ <a href={`tel:${booking.clients.phone}`} className="text-blue-600 hover:underline">{booking.clients.phone}</a></p>
                        <p>🎉 {booking.clients.event_type === 'matrimonio' && 'Matrimonio'}
                           {booking.clients.event_type === 'corporate' && 'Corporate'}
                           {booking.clients.event_type === 'enogastronomico' && 'Degustazione'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Nessun cliente</p>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div>
              <h2 className="text-3xl font-light mb-8">Gestione Pagamenti</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="border-t border-gray-300 pt-8">
                  <p className="text-5xl font-light text-gray-900 mb-4">€0</p>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Pagamenti Ricevuti</p>
                </div>
                <div className="border-t border-gray-300 pt-8">
                  <p className="text-5xl font-light text-gray-900 mb-4">€{(pendingBookings * 1000).toLocaleString()}</p>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Depositi in Sospeso</p>
                </div>
                <div className="border-t border-gray-300 pt-8">
                  <p className="text-5xl font-light text-gray-900 mb-4">0%</p>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Pagamenti Completati</p>
                </div>
              </div>
              <p className="text-gray-600">La gestione dei pagamenti sarà integrata con Stripe</p>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-3xl font-light mb-8">Analitiche</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-light mb-4">Prenotazioni per Tipo</h3>
                  <div className="space-y-4">
                    {['matrimonio', 'corporate', 'enogastronomico'].map((type) => {
                      const count = bookings.filter(b => b.clients.event_type === type).length;
                      const percentage = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0;
                      return (
                        <div key={type}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm uppercase tracking-widest">{type === 'matrimonio' && 'Matrimoni'}{type === 'corporate' && 'Corporate'}{type === 'enogastronomico' && 'Degustazioni'}</span>
                            <span className="font-light">{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-full bg-black rounded-full" style={{width: `${percentage}%`}}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-light mb-4">Media Ospiti per Evento</h3>
                  <p className="text-5xl font-light text-gray-900 mb-4">
                    {totalBookings > 0 ? Math.round(totalGuests / totalBookings) : 0}
                  </p>
                  <p className="text-sm text-gray-600">ospiti per prenotazione</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-light mb-8">Impostazioni</h2>
              <div className="space-y-8">
                <div className="border-t border-gray-300 pt-8">
                  <h3 className="text-xl font-light mb-4">Impostazioni Generali</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm uppercase tracking-[0.2em] text-gray-600 block mb-2">Nome Venue</label>
                      <input type="text" value="Masseria Sant'Elmo" className="w-full border-b border-gray-300 pb-2 font-light focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm uppercase tracking-[0.2em] text-gray-600 block mb-2">Email Contatti</label>
                      <input type="email" value="info@essenzedinaturaevents.it" className="w-full border-b border-gray-300 pb-2 font-light focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm uppercase tracking-[0.2em] text-gray-600 block mb-2">Telefono</label>
                      <input type="tel" value="+39 373 790 2538" className="w-full border-b border-gray-300 pb-2 font-light focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-8">
                  <h3 className="text-xl font-light mb-4">Integrazioni</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded">
                      <span className="font-light">Stripe</span>
                      <span className="text-sm text-green-600">✓ Connesso</span>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded">
                      <span className="font-light">Supabase</span>
                      <span className="text-sm text-green-600">✓ Connesso</span>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded">
                      <span className="font-light">Email (SMTP)</span>
                      <span className="text-sm text-yellow-600">⚠ Configurazione richiesta</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-8">
                  <button className="bg-black text-white px-8 py-3 rounded-lg font-light hover:bg-gray-800 transition">
                    Salva Impostazioni
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
