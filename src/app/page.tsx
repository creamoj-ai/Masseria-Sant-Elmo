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
    <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C2C] font-serif">
      {/* NAVBAR - Minimalist */}
      <nav className="sticky top-0 z-40 bg-[#F9F7F2] border-b border-[#E8E4DC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-light tracking-wide text-[#4A6741]">Essenze di Natura</h1>
          <div className="hidden md:flex gap-12 text-sm uppercase tracking-widest">
            <a href="#esperienza" className="text-[#2C2C2C] hover:text-[#9B8FA8] transition duration-300">Esperienza</a>
            <a href="#essenze" className="text-[#2C2C2C] hover:text-[#9B8FA8] transition duration-300">Essenze</a>
            <a href="#booking" className="text-[#2C2C2C] hover:text-[#9B8FA8] transition duration-300">Prenota</a>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#4A6741] text-xl">☰</button>
        </div>
      </nav>

      {/* HERO SECTION - Minimalist with breathing space */}
      <section className="relative h-screen flex items-center justify-center bg-[#4A6741] text-white overflow-hidden">
        {/* Placeholder for cinematic video or image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A6741] to-[#3A5532] opacity-80"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <p className="text-lg uppercase tracking-[0.3em] text-[#E8E4DC] mb-8 font-light">Masseria Sant'Elmo</p>
          <h1 className="text-7xl md:text-8xl font-light tracking-tight mb-8 leading-tight">
            Profumo di Lavanda,<br />Essenza di Lusso
          </h1>
          <p className="text-xl font-light text-[#E8E4DC] mb-12 leading-relaxed max-w-2xl mx-auto">
            Nel cuore del Parco Nazionale del Vesuvio,<br />
            un'esperienza sensoriale che unisce natura e raffinatezza
          </p>
          <a href="#booking" className="inline-block bg-[#9B8FA8] text-[#F9F7F2] px-12 py-4 text-sm uppercase tracking-widest hover:bg-[#8B7A99] transition duration-300">
            Scopri l'esperienza
          </a>
        </div>
      </section>

      {/* ESPERIENZA SECTION - Sensory storytelling */}
      <section id="esperienza" className="py-32 bg-[#F9F7F2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Image placeholder */}
            <div className="h-96 bg-gradient-to-br from-[#4A6741] to-[#3A5532] rounded-lg flex items-center justify-center text-[#9B8FA8] text-center opacity-50">
              [Immagine zenitale campi di lavanda]
            </div>

            {/* Text - minimal, breathing */}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#9B8FA8] mb-6 font-light">L'Esperienza</p>
              <h2 className="text-5xl font-light text-[#4A6741] mb-8 leading-tight">
                Nella Cupola del Vesuvio
              </h2>
              <p className="text-lg leading-relaxed text-[#2C2C2C] mb-8 font-light">
                Masseria Sant'Elmo abbraccia 375 metri quadri di spazio sotto una cupola geodetica unica, dove la luce filtra naturalmente sui campi di lavanda circostanti. Qui il tempo rallenta.
              </p>
              <p className="text-lg leading-relaxed text-[#2C2C2C] mb-12 font-light">
                Ogni evento diventa un'estensione dell'esperienza sensoriale: il profumo della terra, il sussurro della brezza tra i fiori, l'aroma delicato dei nostri oli essenziali distillati in loco.
              </p>

              <div className="space-y-6">
                <div className="border-l-2 border-[#9B8FA8] pl-6">
                  <p className="text-3xl font-light text-[#4A6741]">400+</p>
                  <p className="text-sm uppercase tracking-widest text-[#9B8FA8]">ospiti massimi</p>
                </div>
                <div className="border-l-2 border-[#9B8FA8] pl-6">
                  <p className="text-3xl font-light text-[#4A6741]">Marzo — Ottobre</p>
                  <p className="text-sm uppercase tracking-widest text-[#9B8FA8]">stagione operativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESSENZE SECTION - Ritual storytelling */}
      <section id="essenze" className="py-32 bg-[#4A6741] text-[#F9F7F2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#9B8FA8] mb-6 font-light">Il Rituale</p>
              <h2 className="text-5xl font-light mb-8 leading-tight">
                Estrazione Lenta
              </h2>
              <p className="text-lg leading-relaxed mb-8 font-light">
                Nel nostro alambicco aziendale, la lavanda incontra l'alchimia: petali freschi si trasformano lentamente in essenze pure, seguendo ritmi naturali, non industriali.
              </p>
              <p className="text-lg leading-relaxed mb-8 font-light">
                Ogni goccia di olio essenziale racconta la storia della terra vulcanica del Vesuvio, del clima mediterraneo, della nostra dedizione al dettaglio.
              </p>
              <p className="text-sm uppercase tracking-widest text-[#9B8FA8] mt-12">
                ✦ Disponibili anche per i tuoi ospiti come ricordo
              </p>
            </div>

            <div className="h-96 bg-[#3A5532] rounded-lg flex items-center justify-center text-[#9B8FA8] text-center opacity-75">
              [Immagine alambicco / processo di distillazione]
            </div>
          </div>
        </div>
      </section>

      {/* SERVIZI SECTION - Minimal grid */}
      <section className="py-32 bg-[#F9F7F2]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9B8FA8] text-center mb-12 font-light">Esperienze</p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Matrimoni & Cerimonie",
                price: "€5.000+",
                desc: "Il giorno più importante sotto la cupola, circondati da campi di lavanda e il Vesuvio all'orizzonte"
              },
              {
                title: "Corporate & Wellness",
                price: "€3.500+",
                desc: "Team-building immersi nella natura, rigenerazione sensoriale, connessione genuina"
              },
              {
                title: "Degustazioni Esperienziali",
                price: "€50/pp",
                desc: "Viaggio sensoriale tra lavanda, essenze e cucina locale con Caffetteria Leopardi"
              },
            ].map((service, i) => (
              <div key={i} className="space-y-6 border-t border-[#E8E4DC] pt-8">
                <h3 className="text-2xl font-light text-[#4A6741]">{service.title}</h3>
                <p className="text-[#9B8FA8] text-xl font-light">{service.price}</p>
                <p className="text-[#2C2C2C] leading-relaxed font-light">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION - Minimal form */}
      <section id="booking" className="py-32 bg-[#F9F7F2]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9B8FA8] mb-4 font-light">Inizia l'Esperienza</p>
            <h2 className="text-5xl font-light text-[#4A6741]">Prenota il Tuo Evento</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Nome"
                className="px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C] placeholder-[#9B8FA8]"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Cognome"
                className="px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C] placeholder-[#9B8FA8]"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C] placeholder-[#9B8FA8]"
              required
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Telefono"
              className="w-full px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C] placeholder-[#9B8FA8]"
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C]"
                required
              />
              <input
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleInputChange}
                placeholder="Numero ospiti"
                className="px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C] placeholder-[#9B8FA8]"
                required
              />
            </div>

            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleInputChange}
              className="w-full px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C]"
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
              placeholder="Dettagli del tuo evento (facoltativo)"
              rows={4}
              className="w-full px-0 py-3 border-b border-[#9B8FA8] bg-transparent focus:outline-none focus:border-[#4A6741] transition text-[#2C2C2C] placeholder-[#9B8FA8] resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#9B8FA8] text-[#F9F7F2] py-4 text-sm uppercase tracking-widest hover:bg-[#8B7A99] transition duration-300 font-light mt-12"
            >
              Invia Richiesta
            </button>
            <p className="text-center text-xs text-[#9B8FA8] font-light">
              Ti contatteremo entro 24 ore per confermare la disponibilità
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER - Minimal */}
      <footer className="bg-[#4A6741] text-[#F9F7F2] py-16 border-t border-[#3A5532]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-light mb-6 text-[#E8E4DC]">Essenze di Natura</h3>
              <p className="text-sm leading-relaxed font-light opacity-80">
                Esperienza sensoriale nel cuore del Parco Nazionale del Vesuvio
              </p>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-widest mb-6 text-[#9B8FA8] font-light">Contatti</h4>
              <div className="space-y-3 text-sm font-light opacity-80">
                <p>✉ creamoj@gmail.com</p>
                <p>☎ +39 373 790 2538</p>
                <p>📍 Via Generale Riccardo De Rosa, 3<br />Sant'Anastasia (NA) 80048</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-widest mb-6 text-[#9B8FA8] font-light">Stagione Operativa</h4>
              <p className="text-sm font-light opacity-80">Marzo — Ottobre<br />Su prenotazione</p>
            </div>
          </div>

          <div className="border-t border-[#3A5532] pt-8 text-center text-xs opacity-60 font-light">
            <p>&copy; 2025 Essenze di Natura. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
