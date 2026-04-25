'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  activeBookings: number;
  monthlySales: number;
  newContacts: number;
  lastActivities: Activity[];
}

interface Activity {
  id: string;
  type: 'booking' | 'sale' | 'contact' | 'note';
  description: string;
  timestamp: string;
  user: string;
}

interface ClientTag {
  id: string;
  name: string;
  color: string;
}

interface EssenceStock {
  id: string;
  name: string;
  stock: number;
  maxStock: number;
  price: number;
}

export function AdvancedDashboard() {
  const [activeBookings, setActiveBookings] = useState(12);
  const [monthlySales, setMonthlySales] = useState(2400);
  const [newContacts, setNewContacts] = useState(8);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const clientTags: ClientTag[] = [
    { id: '1', name: 'Amante Lavanda', color: '#B8E6D5' },
    { id: '2', name: 'Business', color: '#D8C5E8' },
    { id: '3', name: 'VIP', color: '#C9A876' },
    { id: '4', name: 'Local', color: '#A8A8A8' },
  ];

  const essenceStock: EssenceStock[] = [
    { id: '1', name: 'Olio Lavanda Premium', stock: 35, maxStock: 50, price: 45 },
    { id: '2', name: 'Olio Eucalipto', stock: 12, maxStock: 30, price: 35 },
    { id: '3', name: 'Olio Rosa Damascena', stock: 8, maxStock: 25, price: 55 },
    { id: '4', name: 'Olio Menta', stock: 42, maxStock: 60, price: 28 },
  ];

  const activities: Activity[] = [
    { id: '1', type: 'booking', description: 'Matrimonio confermato - Marco & Sofia', timestamp: '2 ore fa', user: 'Admin' },
    { id: '2', type: 'sale', description: 'Venduto: 3x Olio Lavanda Premium', timestamp: '4 ore fa', user: 'E-commerce' },
    { id: '3', type: 'contact', description: 'Nuovo contatto: Giovanni Rossi', timestamp: '6 ore fa', user: 'Form' },
    { id: '4', type: 'note', description: 'Stock Olio Eucalipto sotto soglia (12L)', timestamp: '8 ore fa', user: 'Sistema' },
    { id: '5', type: 'booking', description: 'Prenotazione annullata - Corporate Event', timestamp: '1 giorno fa', user: 'Admin' },
  ];

  const auditLog = [
    { timestamp: '14:32', action: 'Admin ha modificato prenotazione #123', user: 'Admin', severity: 'medium' },
    { timestamp: '14:15', action: 'Nuovo ordine creato (#456)', user: 'Sistema', severity: 'low' },
    { timestamp: '13:48', action: 'Admin ha cancellato prenotazione #122', user: 'Admin', severity: 'high' },
    { timestamp: '13:20', action: 'Cliente ha visualizzato pagina booking', user: 'Cliente', severity: 'low' },
  ];

  const maskData = (text: string) => {
    if (!privacyMode) return text;
    return '█'.repeat(text.length);
  };

  const getStockPercentage = (stock: number, maxStock: number) => (stock / maxStock) * 100;
  const getStockColor = (percentage: number) => {
    if (percentage > 70) return '#4A6741'; // Verde Salvia
    if (percentage > 40) return '#C9A876'; // Oro Vintage
    return '#8B8B8B'; // Grigio
  };

  return (
    <div className="space-y-8">
      {/* TOP CONTROLS */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-light">Dashboard Avanzata</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-2"
          >
            {privacyMode ? '🔒' : '👁️'} {privacyMode ? 'Modalità Privacy Attiva' : 'Privacy Mode'}
          </button>
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            📋 Audit Log
          </button>
        </div>
      </div>

      {/* TOP 3 CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">Prenotazioni Attive</p>
          <p className="text-5xl font-light text-gray-900 mb-2">{activeBookings}</p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <span>↑ 12%</span>
            <span className="text-gray-600">vs mese scorso</span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">Vendite Oli (Mese)</p>
          <p className="text-5xl font-light text-gray-900 mb-2">€{maskData(monthlySales.toString())}</p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <span>↑ 8%</span>
            <span className="text-gray-600">vs mese scorso</span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-600 mb-4">Nuovi Contatti CRM</p>
          <p className="text-5xl font-light text-gray-900 mb-2">{newContacts}</p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <span>👥</span>
            <span className="text-gray-600">questa settimana</span>
          </div>
        </div>
      </div>

      {/* AUDIT LOG (if toggled) */}
      {showAuditLog && (
        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
          <h3 className="text-xl font-light mb-6">📋 Attività di Sistema (Audit Log)</h3>
          <div className="space-y-3">
            {auditLog.map((log, i) => (
              <div key={i} className="flex items-start justify-between p-4 bg-white rounded border border-gray-100">
                <div>
                  <p className="font-light text-sm">{log.action}</p>
                  <p className="text-xs text-gray-600 mt-1">Utente: {log.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{log.timestamp}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                    log.severity === 'high' ? 'bg-red-100 text-red-700' :
                    log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {log.severity === 'high' ? '⚠️ Alto' : log.severity === 'medium' ? '⚡ Medio' : '✓ Basso'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: BOOKING CALENDAR & QUICK ACTIONS */}
        <div className="space-y-8">
          {/* BOOKING ENGINE */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-light mb-6">📅 Calendario Prenotazioni</h3>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
                <div key={day} className="text-center text-sm uppercase tracking-widest text-gray-600 font-light py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const dayNum = i + 1;
                const isBooked = Math.random() > 0.6;
                const isFull = Math.random() > 0.8;

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-light cursor-pointer hover:scale-105 transition ${
                      isFull ? 'bg-gray-300 text-gray-700' :
                      isBooked ? 'bg-[#C9A876] text-white' :
                      'bg-[#4A6741] text-white hover:opacity-80'
                    }`}
                  >
                    {dayNum <= 30 ? dayNum : ''}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 text-sm">
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

          {/* QUICK ACTIONS */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-light mb-6">⚡ Azioni Rapide</h3>
            <div className="space-y-3">
              <button className="w-full bg-black text-white px-6 py-3 rounded-lg font-light hover:bg-gray-800 transition">
                + Aggiungi Prenotazione Manuale
              </button>
              <button className="w-full border border-gray-300 px-6 py-3 rounded-lg font-light hover:bg-gray-50 transition">
                📞 Registra Chiamata Cliente
              </button>
              <button className="w-full border border-gray-300 px-6 py-3 rounded-lg font-light hover:bg-gray-50 transition">
                🛍️ Nuovo Ordine Oli
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: CRM & INVENTORY */}
        <div className="space-y-8">
          {/* CRM TAGGING */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-light mb-6">👥 Tagging Clienti</h3>
            <div className="space-y-3">
              {clientTags.map(tag => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: tag.color}}></div>
                    <span className="font-light">{tag.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">12 clienti</span>
                </div>
              ))}
            </div>
          </div>

          {/* INVENTORY */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-light mb-6">📦 Stock Oli Essenziali</h3>
            <div className="space-y-6">
              {essenceStock.map(essence => (
                <div key={essence.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-light text-sm">{essence.name}</span>
                    <span className="text-sm text-gray-600">{essence.stock}L / {essence.maxStock}L</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${getStockPercentage(essence.stock, essence.maxStock)}%`,
                        backgroundColor: getStockColor(getStockPercentage(essence.stock, essence.maxStock))
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">€{essence.price}/L</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 border border-gray-300 px-4 py-2 rounded-lg text-sm font-light hover:bg-gray-50 transition">
              🔔 Ordina Restock
            </button>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES TABLE */}
      <div className="border border-gray-200 rounded-lg p-8">
        <h3 className="text-xl font-light mb-6">📊 Ultime Attività</h3>
        <div className="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-xl">
                  {activity.type === 'booking' && '📅'}
                  {activity.type === 'sale' && '💰'}
                  {activity.type === 'contact' && '👤'}
                  {activity.type === 'note' && '📝'}
                </span>
                <div>
                  <p className="font-light text-sm">{maskData(activity.description)}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.timestamp} • {activity.user}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-light ${
                activity.type === 'booking' ? 'bg-blue-100 text-blue-700' :
                activity.type === 'sale' ? 'bg-green-100 text-green-700' :
                activity.type === 'contact' ? 'bg-purple-100 text-purple-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {activity.type === 'booking' ? 'Prenotazione' :
                 activity.type === 'sale' ? 'Vendita' :
                 activity.type === 'contact' ? 'Contatto' :
                 'Nota'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
