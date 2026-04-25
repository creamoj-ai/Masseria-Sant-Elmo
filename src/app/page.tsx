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
      {/* PURPLE HEADER */}
      <header className="sticky top-0 z-50 bg-[#6B5B7F] text-white h-16 flex items-center px-4">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <div className="text-xs text-gray-300">09:26</div>
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='60' font-size='48' text-anchor='middle' fill='white' font-weight='bold'%3EKIMIRA%3C/text%3E%3C/svg%3E" alt="KIMIRA" className="w-10" />
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-2xl">🛒</button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl">☰</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* HERO SECTION */}
        <section className="mb-16">
          <h1 className="text-4xl font-serif font-bold text-center mb-6 leading-tight">
            Un piccolo paradiso nel cuore del Parco Nazionale del Vesuvio
          </h1>

          <p className="text-center text-gray-700 mb-6 text-sm leading-relaxed">
            Benvenuti in un angolo di tranquillità. Scopri il luogo perfetto per rilassarti e rigenerarti.
          </p>

          <p className="text-center text-gray-600 text-sm leading-relaxed mb-8">
            Visita la nostra Azienda Agrituristica e Produttiva: ti offriamo comfort ed ospitalità, coltiviamo lavanda e altre colture autoctone, produciamo oli essenziali e altri prodotti.
          </p>

          <div className="flex justify-center mb-8">
            <div className="w-64 h-64 bg-cover bg-center rounded-full overflow-hidden shadow-lg"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop")'}}
            >
            </div>
          </div>
        </section>

        {/* DOT DIVIDER */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
          ))}
        </div>

        {/* EXPERIENCE SECTION */}
        <section className="mb-16">
          <p className="text-center text-gray-700 text-sm leading-relaxed mb-6">
            Immergiti nella magia delle serate uniche organizzate presso la Masseria Sant'Elmo. Nel cuore della natura, circondato dai profumi di lavanda e erbe officinali, vivrai momenti indimenticabili in un'atmosfera incantevole.
          </p>

          <p className="text-center text-gray-700 text-sm leading-relaxed mb-8">
            Ogni evento è curato nei minimi dettagli, offrendo esperienze straordinarie e personalizzate per ogni occasione. Che si tratti di una festa intima, un matrimonio da sogno o una celebrazione speciale, il nostro team di esperti eventi e wedding planner sarà al tuo fianco per realizzare tutto.
          </p>

          <div className="flex justify-center">
            <button className="bg-[#D8C5E8] text-gray-800 px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#C8B5D8] transition">
              Scopri di più sui nostri eventi
            </button>
          </div>
        </section>

        {/* ACTIVITIES SECTION */}
        <section className="mb-16">
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <h2 className="text-3xl font-serif font-bold text-center mb-8">Attività di Ospitalità</h2>

          <div className="flex justify-center mb-8">
            <div className="w-72 h-96 bg-cover bg-center rounded-3xl overflow-hidden shadow-lg"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1519671482677-1f37e4c73e27?w=500&h=600&fit=crop")'}}
            >
            </div>
          </div>

          <p className="text-center text-gray-700 text-sm leading-relaxed mb-4 italic">
            Tutte le attività vengono organizzate nei dettagli di ogni occasione. Questo approccio aiuta a sviluppare e valorizzare il momento al meglio.
          </p>

          <h3 className="text-2xl font-serif text-center mb-6">Per ogni occasione</h3>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm leading-relaxed">
            Tutte le attività vengono organizzate con passione e dedizione per renderle indimenticabili.
          </p>
        </section>

        {/* BOOKING SECTION */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-2">Prenota per uno dei nostri eventi esclusivi</h2>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <div className="flex justify-center mb-12">
            <div className="w-72 h-96 bg-cover bg-center rounded-3xl overflow-hidden shadow-lg"
              style={{backgroundImage: 'url("https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=600&fit=crop")'}}
            >
            </div>
          </div>

          <p className="text-center text-gray-700 text-sm leading-relaxed mb-12 italic">
            Vivi l'incanto delle serate tematiche organizzate dalla Masseria Sant'Elmo. Ogni evento è una festa per i sensi, dove la qualità e l'attenzione ai dettagli trasformano ogni momento in un'esperienza indimenticabile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-2xl mb-12">
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
              <option value="altro">Altro</option>
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

        {/* TESTIMONIALS SECTION */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-2">Cosa dicono i nostri clienti</h2>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#B8E6D5]"></div>
            ))}
          </div>

          <div className="space-y-8">
            {[
              {
                name: 'Jane DOE',
                title: 'CEO di MyCompany',
                quote: 'Un evento perfetto! La Masseria Sant\'Elmo ha superato tutte le mie aspettative. Ogni dettaglio è stato curato con passione e professionalità.',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
              },
              {
                name: 'Marco Rossi',
                title: 'Wedding Planner',
                quote: 'Un evento straordinario. Ogni dettaglio è stato curato con passione e professionalità per garantire momenti indimenticabili.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
              },
              {
                name: 'Anna Bianchi',
                title: 'Direttore Corporate Events',
                quote: 'Siamo entusiasti di accoglierti e farti vivere esperienze che rimarranno impresse nel cuore. Un\'esperienza indimenticabile.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <p className="text-gray-700 text-sm italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-xs text-gray-500">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARTNERS SECTION */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-2">I nostri partner di valore</h2>

          <p className="text-center text-gray-600 text-sm mb-8">Siamo in ottima compagnia.</p>

          <div className="space-y-6">
            {[
              {
                name: 'Caffetteria Leopardi',
                desc: 'Catering partner ufficiale',
                image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&h=100&fit=crop'
              },
              {
                name: 'Florist Studio',
                desc: 'Allestimenti floreali',
                image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=100&h=100&fit=crop'
              },
              {
                name: 'DJ Premium Events',
                desc: 'Intrattenimento musicale',
                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
              }
            ].map((partner, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-6 text-center">
                <img src={partner.image} alt={partner.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="font-bold text-gray-900 mb-1">{partner.name}</h4>
                <p className="text-xs text-gray-600">{partner.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#6B5B7F] text-white py-12 px-4 rounded-t-3xl -mx-4">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
              <div>
                <h4 className="font-bold mb-3">Essenze di Natura</h4>
                <p className="text-gray-300 text-xs">Masseria Sant'Elmo</p>
                <p className="text-gray-300 text-xs">Parco Nazionale Vesuvio</p>
              </div>
              <div>
                <h4 className="font-bold mb-3">Contatti</h4>
                <p className="text-gray-300 text-xs">✉ creamoj@gmail.com</p>
                <p className="text-gray-300 text-xs">☎ +39 373 790 2538</p>
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
