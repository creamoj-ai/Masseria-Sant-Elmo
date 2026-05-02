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

interface AuditLog {
  timestamp: string;
  action: string;
  user: string;
  severity: 'high' | 'medium' | 'low';
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

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

  const maskData = (text: string) => {
    if (!privacyMode) return text;
    return '█'.repeat(Math.min(text.length, 10));
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
    { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { id: 'payments', label: 'Pagamenti', icon: '💳' },
    { id: 'analytics', label: 'Analitiche', icon: '📈' },
    { id: 'settings', label: 'Impostazioni', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300 flex flex-col border-r border-gray-800`}>
        {/* LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800 gap-3">
          {sidebarOpen ? (
            <>
              <span className="text-3xl">🎯</span>
              <h2 className="text-xl font-light tracking-widest">ADMIN</h2>
            </>
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
                item.id === 'whatsapp'
                  ? activeTab === item.id
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-green-600 text-white hover:bg-green-500'
                  : activeTab === item.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              {item.id === 'whatsapp' ? (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171l-.546-.274L2.766 4.284l1.524 4.57c-.592 1.167-.922 2.515-.922 3.956 0 5.477 4.957 9.99 11.05 9.99 5.529 0 10.304-4.365 10.304-9.79 0-5.516-4.957-10.006-11.05-10.006"/>
                </svg>
              ) : (
                <span className="text-xl">{item.icon}</span>
              )}

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
              {/* PRIVACY & AUDIT CONTROLS */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setPrivacyMode(!privacyMode)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2"
                >
                  {privacyMode ? '🔒' : '👁️'} {privacyMode ? 'Privacy ON' : 'Privacy Mode'}
                </button>
                <button
                  onClick={() => setShowAuditLog(!showAuditLog)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  📋 Audit Log
                </button>
              </div>

              {/* TOP 3 STATS */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">Prenotazioni Attive</p>
                  <p className="text-5xl font-light text-gray-900 mb-2">{totalBookings}</p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>↑ 12%</span>
                    <span className="text-gray-600">vs mese scorso</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">Vendite Oli (Mese)</p>
                  <p className="text-5xl font-light text-gray-900 mb-2">€{maskData('2400')}</p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>↑ 8%</span>
                    <span className="text-gray-600">vs mese scorso</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">Nuovi Contatti CRM</p>
                  <p className="text-5xl font-light text-gray-900 mb-2">{bookings.length}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span>👥</span>
                    <span className="text-gray-600">questa settimana</span>
                  </div>
                </div>
              </div>

              {/* AUDIT LOG */}
              {showAuditLog && (
                <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
                  <h3 className="text-xl font-light mb-6">📋 Attività di Sistema</h3>
                  <div className="space-y-3">
                    {[
                      { timestamp: '14:32', action: 'Admin ha modificato prenotazione #123', user: 'Admin', severity: 'medium' },
                      { timestamp: '14:15', action: 'Nuovo ordine creato (#456)', user: 'Sistema', severity: 'low' },
                      { timestamp: '13:48', action: 'Admin ha cancellato prenotazione #122', user: 'Admin', severity: 'high' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-start justify-between p-4 bg-white rounded border border-gray-100">
                        <div>
                          <p className="font-light text-sm">{maskData(log.action)}</p>
                          <p className="text-xs text-gray-600 mt-1">Utente: {log.user}</p>
                        </div>
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          log.severity === 'high' ? 'bg-red-100 text-red-700' :
                          log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {log.severity === 'high' ? '⚠️ Alto' : log.severity === 'medium' ? '⚡ Medio' : '✓ Basso'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOOKING ENGINE: CALENDAR */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-gray-200 rounded-lg p-8">
                  <h3 className="text-xl font-light mb-6">📅 Calendario Prenotazioni</h3>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
                      <div key={day} className="text-center text-sm uppercase tracking-widest text-gray-600 font-light py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const isBooked = Math.random() > 0.6;
                      const isCancelled = Math.random() > 0.85;
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-light cursor-pointer hover:scale-105 transition ${
                            isCancelled ? 'bg-gray-300 text-gray-700' :
                            isBooked ? 'bg-[#C9A876] text-white' :
                            'bg-[#4A6741] text-white hover:opacity-80'
                          }`}
                        >
                          {i + 1 <= 30 ? i + 1 : ''}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#4A6741] rounded"></div>
                      <span className="text-gray-600">Disponibile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#C9A876] rounded"></div>
                      <span className="text-gray-600">Confermato</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="text-gray-600">Cancellato</span>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS & TAGGING */}
                <div className="space-y-8">
                  <div className="border border-gray-200 rounded-lg p-8">
                    <h3 className="text-xl font-light mb-6">⚡ Azioni Rapide</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-black text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition text-sm">
                        + Aggiungi Prenotazione Manuale
                      </button>
                      <button className="w-full border border-gray-300 px-6 py-3 rounded-lg font-light hover:bg-gray-50 transition text-sm">
                        📞 Registra Chiamata Cliente
                      </button>
                      <button className="w-full border border-gray-300 px-6 py-3 rounded-lg font-light hover:bg-gray-50 transition text-sm">
                        🛍️ Nuovo Ordine Oli
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-8">
                    <h3 className="text-xl font-light mb-6">👥 Tagging Clienti</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Amante Lavanda', color: '#B8E6D5', count: 12 },
                        { name: 'Business', color: '#D8C5E8', count: 8 },
                        { name: 'VIP', color: '#C9A876', count: 5 },
                        { name: 'Local', color: '#A8A8A8', count: 15 },
                      ].map((tag, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 border border-gray-100 rounded-lg cursor-pointer hover:shadow-md transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: tag.color}}></div>
                            <span className="font-light text-sm">{tag.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{tag.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* INVENTORY */}
              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-light mb-6">📦 Stock Oli Essenziali</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { name: 'Olio Lavanda Premium', stock: 35, maxStock: 50, price: 45 },
                    { name: 'Olio Eucalipto', stock: 12, maxStock: 30, price: 35 },
                    { name: 'Olio Rosa Damascena', stock: 8, maxStock: 25, price: 55 },
                    { name: 'Olio Menta', stock: 42, maxStock: 60, price: 28 },
                  ].map((essence, i) => {
                    const percentage = (essence.stock / essence.maxStock) * 100;
                    const stockColor = percentage > 70 ? '#4A6741' : percentage > 40 ? '#C9A876' : '#8B8B8B';
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-light text-sm">{essence.name}</span>
                          <span className="text-sm text-gray-600">{essence.stock}L / {essence.maxStock}L</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{width: `${percentage}%`, backgroundColor: stockColor}}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">€{essence.price}/L</p>
                      </div>
                    );
                  })}
                </div>
                <button className="w-full mt-6 border border-gray-300 px-4 py-2 rounded-lg text-sm font-light hover:bg-gray-50 transition">
                  🔔 Ordina Restock
                </button>
              </div>

              {/* RECENT ACTIVITIES */}
              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-light mb-6">📊 Ultime Attività</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking, i) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-xl">📅</span>
                        <div>
                          <p className="font-light text-sm">{maskData(booking.clients.first_name + ' ' + booking.clients.last_name)}</p>
                          <p className="text-xs text-gray-600 mt-1">{new Date(booking.created_at).toLocaleDateString('it-IT')} • {booking.guest_count} ospiti</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-light ${
                        booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {booking.booking_status === 'pending' ? 'In Sospeso' : 'Confermata'}
                      </span>
                    </div>
                  ))}
                </div>
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
              <p className="text-gray-600">Sistema di gestione pagamenti in configurazione</p>
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

          {/* WHATSAPP TAB */}
          {activeTab === 'whatsapp' && (
            <div className="h-full flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* LEFT SIDEBAR - CONTACTS */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* HEADER */}
                <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-green-50 to-white">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171l-.546-.274L2.766 4.284l1.524 4.57c-.592 1.167-.922 2.515-.922 3.956 0 5.477 4.957 9.99 11.05 9.99 5.529 0 10.304-4.365 10.304-9.79 0-5.516-4.957-10.006-11.05-10.006"/>
                    </svg>
                    <div>
                      <h2 className="text-xl font-light text-gray-900">WhatsApp</h2>
                      <p className="text-xs text-green-600">Clients & Suppliers</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 Cerca contatto..."
                    className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* FILTERS */}
                <div className="p-3 border-b border-gray-200 flex gap-2 bg-gray-50">
                  <button className="flex-1 px-3 py-2 rounded-lg text-xs font-light bg-black text-white transition">
                    Tutti
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg text-xs font-light bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    👤 Clienti
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg text-xs font-light bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    🏪 Fornitori
                  </button>
                </div>

                {/* CONTACTS LIST */}
                <div className="flex-1 overflow-y-auto">
                  {[
                    { name: 'Marco Rossi', phone: '+39 333 1234567', type: 'client', unread: 2, avatar: '👤', lastMsg: 'Confermato!' },
                    { name: 'Caffetteria Leopardi', phone: '+39 392 5555555', type: 'supplier', unread: 1, avatar: '🏪', lastMsg: 'Pronto per lunedì' },
                    { name: 'Sofia Bianchi', phone: '+39 333 9876543', type: 'client', unread: 0, avatar: '👩', lastMsg: 'Grazie!' },
                    { name: 'Florist Studio', phone: '+39 392 6666666', type: 'supplier', unread: 0, avatar: '🌸', lastMsg: 'Nuova collezione' },
                  ].map((contact, i) => (
                    <div key={i} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{contact.avatar}</span>
                          <div>
                            <p className="font-light text-sm text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-500">{contact.phone}</p>
                          </div>
                        </div>
                        {contact.unread > 0 && (
                          <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate flex-1">{contact.lastMsg}</p>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-light ${
                          contact.type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {contact.type === 'client' ? '👤 Cliente' : '🏪 Fornitore'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER STATS */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <p className="text-lg font-light text-gray-900">4</p>
                      <p className="text-xs text-gray-600">Contatti</p>
                    </div>
                    <div>
                      <p className="text-lg font-light text-green-600">3</p>
                      <p className="text-xs text-gray-600">Non letti</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - CHAT */}
              <div className="flex-1 flex flex-col">
                {/* CHAT HEADER */}
                <div className="border-b border-gray-200 p-6 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👤</span>
                    <div>
                      <h3 className="text-lg font-light text-gray-900">Marco Rossi</h3>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <span>🟢</span> Disponibile
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-sm font-light bg-blue-100 text-blue-700">
                      👤 Cliente
                    </span>
                    <button className="p-2 hover:bg-green-100 rounded-lg transition text-lg">☎️</button>
                    <button className="p-2 hover:bg-green-100 rounded-lg transition text-lg">ℹ️</button>
                  </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 rounded-lg bg-gray-200 text-gray-900 rounded-bl-none">
                      <p className="text-sm font-light">Ciao! Vorrei prenotare per sabato</p>
                      <p className="text-xs text-gray-600 mt-1">10:30</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs px-4 py-3 rounded-lg bg-green-500 text-white rounded-br-none">
                      <p className="text-sm font-light">Perfetto! Ti aspettiamo!</p>
                      <p className="text-xs text-green-100 mt-1">10:35 ✓✓</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-3 rounded-lg bg-gray-200 text-gray-900 rounded-bl-none">
                      <p className="text-sm font-light">Confermato per sabato! 🎉</p>
                      <p className="text-xs text-gray-600 mt-1">10:40</p>
                    </div>
                  </div>
                </div>

                {/* INPUT AREA */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex gap-3">
                    <button className="px-3 py-2 text-xl hover:bg-gray-100 rounded-lg transition">
                      😊
                    </button>
                    <input
                      type="text"
                      placeholder="Scrivi un messaggio..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-light hover:bg-green-600 transition">
                      📤 Invia
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Usa Enter per inviare</p>
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
                      <span className="font-light">Supabase</span>
                      <span className="text-sm text-green-600">✓ Connesso</span>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded">
                      <span className="font-light">Twilio SMS</span>
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
