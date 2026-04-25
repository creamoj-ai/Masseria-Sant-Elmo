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
    <div className="min-h-screen bg-white text-gray-800">
      <style>{`
        .wavy-image {
          clip-path: polygon(
            0% 5%, 1% 4.5%, 2% 4%, 3% 3.8%, 4% 3.5%, 5% 3%, 6% 3%, 7% 3.2%, 8% 3.5%, 9% 4%, 10% 4.5%,
            15% 6%, 20% 7%, 25% 7.5%, 30% 7.8%, 35% 7.5%, 40% 7%, 45% 6.5%, 50% 6%, 55% 6.5%, 60% 7%,
            65% 7.5%, 70% 7.8%, 75% 7.5%, 80% 7%, 85% 6%, 90% 4.5%, 91% 4%, 92% 3.8%, 93% 3.5%, 94% 3%,
            95% 3%, 96% 3.2%, 97% 3.5%, 98% 4%, 99% 4.5%, 100% 5%,
            100% 95%, 99% 95.5%, 98% 96%, 97% 96.2%, 96% 96.5%, 95% 97%, 94% 97%, 93% 96.8%, 92% 96.5%,
            91% 96%, 90% 95.5%, 85% 94%, 80% 93%, 75% 92.5%, 70% 92.2%, 65% 92.5%, 60% 93%, 55% 93.5%,
            50% 94%, 45% 93.5%, 40% 93%, 35% 92.5%, 30% 92.2%, 25% 92.5%, 20% 93%, 15% 94%, 10% 95.5%,
            9% 96%, 8% 96.5%, 7% 96.8%, 6% 97%, 5% 97%, 4% 96.5%, 3% 96.2%, 2% 96%, 1% 95.5%, 0% 95%
          );
        }

        .accent-circle {
          position: absolute;
          border-radius: 50%;
          z-index: 1;
        }
      `}
      </style>

      {/* PURPLE HEADER */}
      <header className="sticky top-0 z-50 bg-[#6B5B7F] text-white h-16 flex items-center px-4">
        <div className="max-w-full w-full mx-auto flex justify-between items-center">
          <div className="text-xs text-gray-300">09:26</div>
          <div className="text-xl font-bold">KIMIRA</div>
          <div className="flex gap-4 items-center">
            <button className="text-2xl">🛒</button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl">☰</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* HERO SECTION */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-center mb-4 leading-tight">
            Un piccolo paradiso nel<br />cuore del Parco<br />Nazionale del Vesuvio
          </h1>

          <p className="text-center text-gray-700 mb-4 text-sm leading-relaxed">
            Benvenuti in un angolo di tranquillità. Scopri il luogo perfetto per rilassarti e rigenerarti.
          </p>

          <p className="text-center text-gray-600 text-sm leading-relaxed mb-8">
            Visita la nostra Azienda Agrituristica e Produttiva: ti offriamo comfort ed ospitalità, coltiviamo lavanda, produciamo oli essenziali.
          </p>

          {/* WAVY IMAGE WITH ACCENT CIRCLES */}
          <div className="relative flex justify-center mb-8">
            <div
              className="wavy-image w-64 h-60 bg-cover bg-center shadow-lg"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop")'}}
            />
            {/* Mint accent circle */}
            <div className="accent-circle w-12 h-12 bg-[#B8E6D5] top-20 right-0"></div>
          </div>
        </section>

        {/* DOT DIVIDER */}
        <div className="flex justify-center gap-1 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#B8E6D5]"></div>
          ))}
        </div>

        {/* ACTIVITIES SECTION 1 */}
        <section className="mb-12">
          <div className="relative flex justify-center mb-8">
            <div
              className="wavy-image w-72 h-96 bg-cover bg-center shadow-lg"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&h=700&fit=crop")'}}
            />
            {/* Purple accent circle */}
            <div className="accent-circle w-16 h-16 bg-[#D8C5E8] -top-4 left-8"></div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Attività di Ospitalità</h2>

          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <p className="text-center text-gray-700 text-sm leading-relaxed">
            Il nostro obiettivo è di rendere ogni evento speciale, pieno di emozioni e ricordi indelebili.
          </p>
        </section>

        {/* EXPERIENCE SECTION */}
        <section className="mb-12">
          <p className="text-center text-gray-700 text-sm leading-relaxed mb-6">
            Immergiti nella magia delle serate uniche organizzate presso la Masseria Sant'Elmo. Nel cuore della natura, circondato dai profumi di lavanda e erbe officinali, vivrai momenti indimenticabili.
          </p>

          <div className="relative flex justify-center mb-8">
            <div
              className="wavy-image w-72 h-96 bg-cover bg-center shadow-lg"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=700&fit=crop")'}}
            />
            {/* Purple accent circle */}
            <div className="accent-circle w-20 h-20 bg-[#D8C5E8] top-1/3 -right-6"></div>
          </div>

          <h3 className="text-2xl font-bold text-center mb-2">La nostra missione è rendere ogni tua cerimonia unica</h3>

          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm leading-relaxed">
            Ogni evento è curato nei minimi dettagli, offrendo esperienze straordinarie e personalizzate.
          </p>
        </section>

        {/* BOOKING FORM SECTION */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2">Prenota il Tuo Evento</h2>

          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Nome"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Cognome"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
              required
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Telefono"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
              <input
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleInputChange}
                placeholder="Ospiti"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
                required
              />
            </div>

            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F]"
            >
              <option value="matrimonio">Matrimonio & Cerimonie</option>
              <option value="corporate">Corporate & Wellness</option>
              <option value="enogastronomico">Degustazione Esperienziale</option>
            </select>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Dettagli dell'evento"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5B7F] resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#6B5B7F] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#5A4A6E] transition"
            >
              Invia Richiesta
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#6B5B7F] text-white py-8 px-4 rounded-t-3xl -mx-4">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
              <div>
                <h4 className="font-bold mb-2">Essenze di Natura</h4>
                <p className="text-gray-300 text-xs">Masseria Sant'Elmo</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Contatti</h4>
                <p className="text-gray-300 text-xs">☎ +39 373 790 2538</p>
              </div>
            </div>

            <div className="border-t border-[#8B7BA8] pt-4 text-center text-xs text-gray-300">
              <p>&copy; 2025 Essenze di Natura</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}