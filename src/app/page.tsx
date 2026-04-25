'use client';

import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        alert('Prenotazione inviata! Ti contatteremo presto.');
        setFormData({ first_name: '', last_name: '', email: '', phone: '', event_date: '', guest_count: '', event_type: 'matrimonio', notes: '' });
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2C2C2C]">
      {/* PURPLE HEADER */}
      <header className="sticky top-0 z-50 bg-[#6B5B7F] text-white h-16 flex items-center px-4">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-300">09:26</div>
          <div className="text-2xl font-bold">KIMIRA</div>
          <div className="flex gap-4">
            <button className="text-xl">🛒</button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-xl">☰</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* HERO SECTION */}
        <section className="mb-16">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center text-[#2C2C2C] mb-4">
              Un piccolo paradiso nel cuore del Parco Nazionale del Vesuvio
            </h1>
            <p className="text-center text-gray-700 mb-8">
              Benvenuti in un angolo di tranquillità. Scopri il luogo perfetto per rilassarti e rigenerarti.
            </p>
            <p className="text-center text-gray-600 text-sm mb-8">
              Visita la nostra Azienda Agrituristica e Produttiva: ti offriamo comfort ed ospitalità, coltiviamo lavanda e altre colture autoctone, produciamo oli essenziali e altri prodotti.
            </p>
          </div>

          {/* HERO IMAGE WITH WAVY BORDER */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-sm h-64 bg-gradient-to-br from-[#6B5B7F] to-[#8B7BA8] rounded-full flex items-center justify-center text-white text-center">
              [Immagine Hero - Vesuvio panorama]
            </div>
          </div>
        </section>

        {/* ACTIVITY SECTION 1 */}
        <section className="mb-16">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-[#2C2C2C]">
            Scopri di più sui nostri eventi
          </h2>

          <div className="mb-8 bg-[#D8C5E8] rounded-full py-4 px-6 text-center font-semibold text-[#2C2C2C]">
            Attività di Ospitalità
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative w-72 h-96 bg-[#B8E6D5] rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-[#6B5B7F]">[Immagine attività - allestimento tavola]</div>
            </div>
          </div>

          <p className="text-center text-gray-700 mb-8 text-sm">
            Tutte le attività vengono organizzate nei dettagli di ogni bambino. Questo approccio aiutera a sviluppare le proprie abilità al meglio.
          </p>

          <h3 className="text-2xl font-bold text-center mb-4">Per ogni bambino</h3>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <p className="text-center text-gray-700 text-sm mb-8">
            Tutte le attività vengono organizzate nei dettagli di ogni bambino.
          </p>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-[#2C2C2C]">
            Immergiti nella magia delle serate uniche organizzate presso la Masseria Sant'Elmo
          </h2>

          <p className="text-gray-700 text-sm mb-8">
            Nel cuore della natura, circondato dai profumi di lavanda e erbe officinali, vivrai momenti indimenticabili in un'atmosfera incantevole.
          </p>

          <p className="text-gray-700 text-sm mb-8">
            Ogni evento è curato nei minimi dettagli, offrendo esperienze straordinarie e personalizzate per ogni occasione. Che si tratti di una festa intima, un matrimonio da sogno o una celebrazione speciale, il nostro team di esperti eventi e wedding planner sarà al tuo fianco per realizzare tutto.
          </p>

          <h3 className="text-2xl font-bold text-center mb-8">Prenota per uno dei nostri eventi esclusivi</h3>

          <div className="mb-8 flex justify-center">
            <div className="relative w-72 h-96 bg-[#B8E6D5] rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-[#6B5B7F]">[Immagine bar/catering]</div>
            </div>
          </div>

          <p className="text-center text-gray-700 text-sm mb-8">
            Vivi l'incanto delle serate tematiche organizzate dalla Masseria Sant'Elmo. Ogni evento è una festa per i sensi, dove la qualità e l'attenzione ai dettagli trasformano ogni momento in un'esperienza indimenticabile.
          </p>
        </section>

        {/* SERVICES GRID */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-12">I Nostri Servizi</h2>

          <div className="space-y-12">
            {[
              {
                title: 'Matrimoni & Cerimonie',
                desc: 'Il giorno più importante circondati dalla natura e dal Vesuvio',
                price: '€5.000+',
                color: 'bg-[#D8C5E8]'
              },
              {
                title: 'Corporate & Team-Building',
                desc: 'Rigenerazione sensoriale nel cuore della natura',
                price: '€3.500+',
                color: 'bg-[#B8E6D5]'
              },
              {
                title: 'Degustazioni Esperienziali',
                desc: 'Viaggio sensoriale tra lavanda e cucina locale',
                price: '€50/pp',
                color: 'bg-[#D8C5E8]'
              }
            ].map((service, i) => (
              <div key={i}>
                <div className={`${service.color} rounded-3xl py-6 px-6 text-center mb-4`}>
                  <h3 className="text-xl font-bold text-[#2C2C2C]">{service.title}</h3>
                  <p className="text-[#6B5B7F] font-semibold mt-2">{service.price}</p>
                </div>
                <p className="text-center text-gray-700 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">Prenota il Tuo Evento</h2>
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Nome"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Cognome"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
              required
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Telefono"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
              <input
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleInputChange}
                placeholder="Ospiti"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
            </div>

            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
            >
              <option value="matrimonio">Matrimonio & Cerimonie</option>
              <option value="corporate">Corporate & Wellness</option>
              <option value="enogastronomico">Degustazione Esperienziale</option>
              <option value="altro">Altro</option>
            </select>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Dettagli dell'evento (facoltativo)"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5B7F] resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#6B5B7F] text-white py-4 rounded-lg font-bold hover:bg-[#5A4A6E] transition"
            >
              Invia Richiesta
            </button>

            <p className="text-center text-xs text-gray-600">
              Ti contatteremo entro 24 ore per confermare la disponibilità
            </p>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#6B5B7F] text-white py-12 px-6 rounded-t-3xl -mx-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-6 mb-8 text-sm">
              <div>
                <h4 className="font-bold mb-3">Essenze di Natura</h4>
                <p className="text-gray-300 text-xs">Masseria Sant'Elmo nel Parco del Vesuvio</p>
              </div>
              <div>
                <h4 className="font-bold mb-3">Contatti</h4>
                <p className="text-gray-300 text-xs">✉ creamoj@gmail.com</p>
                <p className="text-gray-300 text-xs">☎ +39 373 790 2538</p>
              </div>
              <div>
                <h4 className="font-bold mb-3">Stagione</h4>
                <p className="text-gray-300 text-xs">Marzo — Ottobre</p>
                <p className="text-gray-300 text-xs">Su prenotazione</p>
              </div>
            </div>

            <div className="border-t border-[#8B7BA8] pt-6 text-center text-xs text-gray-300">
              <p>&copy; 2025 Essenze di Natura. Tutti i diritti riservati.</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
