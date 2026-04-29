'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    event_date: '',
    guest_count: '',
    event_type: 'matrimonio',
    notes: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowConfirmation(true);
        setFormData({ first_name: '', last_name: '', email: '', phone: '', event_date: '', guest_count: '', event_type: 'matrimonio', notes: '' });
        setTimeout(() => setShowConfirmation(false), 5000);
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* CONFIRMATION MESSAGE */}
      {showConfirmation && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-6 px-6 text-center animate-pulse">
          <h3 className="text-2xl font-light mb-2">✓ Prenotazione Inviata!</h3>
          <p className="font-light">Grazie per la prenotazione. Ti contatteremo entro 24 ore per confermare.</p>
        </div>
      )}

      {/* MINIMALIST HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-xl font-light tracking-widest">ESSENZE DI NATURA</h1>
          <nav className="hidden md:flex gap-12 text-sm">
            <a href="#location" className="hover:text-gray-600 transition">Location</a>
            <a href="#servizi" className="hover:text-gray-600 transition">Servizi</a>
            <a href="#booking" className="hover:text-gray-600 transition">Prenota</a>
          </nav>
          <button className="md:hidden">☰</button>
        </div>
      </header>

      {/* HERO SECTION - FULL WIDTH IMAGE */}
      <section className="h-screen bg-cover bg-center relative flex items-center justify-center"
        style={{backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop")'}}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-light mb-8 leading-tight tracking-tight">
            Masseria Sant'Elmo
          </h1>
          <p className="text-xl font-light mb-12 tracking-wide">
            Nel cuore del Parco Nazionale del Vesuvio
          </p>
          <a href="#booking" className="inline-block bg-black text-white px-12 py-4 rounded-full text-sm font-light hover:bg-gray-800 transition">
            Scopri di più
          </a>
        </div>
      </section>

      {/* LOCATION SECTION */}
      <section id="location" className="py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-16">La Location</p>

          <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <h2 className="text-5xl font-light mb-12 leading-tight">
                Un piccolo paradiso nel cuore della natura
              </h2>
              <p className="text-lg font-light text-gray-700 mb-8 leading-relaxed">
                Masseria Sant'Elmo è una location esclusiva immersa nel Parco Nazionale del Vesuvio, a soli 30km da Napoli.
              </p>
              <p className="text-lg font-light text-gray-700 leading-relaxed">
                La struttura dispone di una cupola geodetica di 14x20m con vista panoramica. Il nostro campo di lavanda e l'alambicco creano un'atmosfera autentica.
              </p>
            </div>
            <div className="h-96 bg-cover bg-center"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=700&fit=crop")'}}
            ></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div>
              <p className="text-5xl font-light text-gray-900 mb-4">375m²</p>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Spazio coperto</p>
            </div>
            <div>
              <p className="text-5xl font-light text-gray-900 mb-4">400+</p>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Ospiti massimi</p>
            </div>
            <div>
              <p className="text-5xl font-light text-gray-900 mb-4">Mar-Ott</p>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-600">Stagione</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-light mb-8 text-gray-900">Servizi & Amenità</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <span className="text-lg">🌳</span>
                <p className="text-sm text-gray-700">Giardino privato e spazio esterno</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🍳</span>
                <p className="text-sm text-gray-700">Cucina attrezzata e area catering</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📡</span>
                <p className="text-sm text-gray-700">Wi-Fi e connessione stabile</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🔊</span>
                <p className="text-sm text-gray-700">Impianto audio e illuminazione scenica</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🚗</span>
                <p className="text-sm text-gray-700">Parcheggio privato ampio</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🏛️</span>
                <p className="text-sm text-gray-700">Cupola geodetica 14x20m panoramica</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servizi" className="py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-16">Servizi</p>

          <h2 className="text-5xl font-light mb-32 leading-tight max-w-2xl">
            Esperienze straordinarie personalizzate
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Matrimoni & Cerimonie',
                price: '€5.000+',
                desc: 'Il giorno più importante circondati dalla natura del Vesuvio'
              },
              {
                title: 'Corporate Events',
                price: '€3.500+',
                desc: 'Team-building e rigenerazione nel cuore della natura'
              },
              {
                title: 'Degustazioni',
                price: '€50/pp',
                desc: 'Viaggio sensoriale tra lavanda e cucina locale'
              }
            ].map((service, i) => (
              <div key={i} className="border-t border-gray-300 pt-12">
                <h3 className="text-2xl font-light mb-4">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">{service.desc}</p>
                <p className="text-sm font-light">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="h-96 bg-cover bg-center order-2 md:order-1"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=700&fit=crop")'}}
            ></div>
            <div className="order-1 md:order-2">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-8">Esperienza</p>
              <h2 className="text-5xl font-light mb-12 leading-tight">
                Ogni dettaglio è curato con passione
              </h2>
              <p className="text-lg font-light text-gray-700 mb-8 leading-relaxed">
                Immergiti nella magia delle serate uniche organizzate presso la Masseria Sant'Elmo. Nel cuore della natura, vivrai momenti indimenticabili in un'atmosfera incantevole.
              </p>
              <p className="text-lg font-light text-gray-700 leading-relaxed">
                Il nostro team di esperti eventi sarà al tuo fianco per realizzare ogni dettaglio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-32 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-8">Prenotazioni</p>
          <h2 className="text-5xl font-light mb-16 leading-tight">
            Inizia il tuo evento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Nome</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Cognome</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Telefono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Data evento</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Ospiti</label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Tipo evento</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
              >
                <option value="matrimonio">Matrimonio</option>
                <option value="corporate">Corporate</option>
                <option value="enogastronomico">Degustazione</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-gray-600 block mb-3">Note (facoltativo)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-lg font-light focus:outline-none focus:border-black transition resize-none"
              ></textarea>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                className="bg-black text-white px-12 py-4 rounded-full text-sm font-light hover:bg-gray-800 transition"
              >
                Invia richiesta
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-8">Rimani Connesso</p>
          <h2 className="text-5xl font-light mb-8 leading-tight">
            Esclusiva anticipazioni e offerte stagionali
          </h2>
          <p className="text-lg font-light text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto">
            Ricevi preview in anteprima degli eventi, consigli culinari dal nostro team e offerte speciali riservate ai nostri iscritti.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Newsletter iscrizione: coming soon'); }}>
            <input
              type="email"
              placeholder="Inserisci la tua email"
              className="flex-1 bg-transparent border-b border-gray-300 pb-3 text-sm font-light focus:outline-none focus:border-black transition"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-light hover:bg-gray-800 transition whitespace-nowrap"
            >
              Iscriviti
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6">Non condividiamo mai la tua email. Puoi annullare l'iscrizione in qualsiasi momento.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-4">Essenze di Natura</p>
              <p className="text-sm text-gray-700">Masseria Sant'Elmo, Parco Nazionale del Vesuvio</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-4">Contatti</p>
              <p className="text-sm text-gray-700">☎ +39 373 790 2538</p>
              <p className="text-sm text-gray-700">✉ info@essenzedinaturaevents.it</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-4">Stagione</p>
              <p className="text-sm text-gray-700">Marzo — Ottobre</p>
              <p className="text-sm text-gray-700">Su prenotazione</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-600">
            <p>&copy; 2025 Essenze di Natura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
