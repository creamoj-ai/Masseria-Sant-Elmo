'use client';

import Link from 'next/link';

export default function Prezzi() {
  return (
    <div className="min-h-screen bg-panna text-verde-salvia-dark">
      {/* HERO SECTION */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-verde-salvia/5 to-panna">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Investimento</p>
          <h1 className="text-5xl md:text-6xl font-light leading-tight text-verde-salvia mb-6" style={{fontFamily: 'var(--font-playfair)'}}>
            Scopri il prezzo del tuo evento
          </h1>
          <p className="text-lg font-light text-verde-salvia-dark/70 max-w-2xl mx-auto">
            Ogni matrimonio è unico. Il prezzo personalizzato dipende dai dettagli che immaginiamo insieme.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                category: 'Matrimoni Intimi',
                price: '€3.500',
                guests: '20-30 ospiti',
                icon: '💍',
                features: ['Cerimonia', 'Ricevimento', 'Spazi interni']
              },
              {
                category: 'Matrimoni Eleganti',
                price: '€6.000',
                guests: '40-70 ospiti',
                icon: '✨',
                features: ['Cerimonia', 'Cocktail', 'Cena elegante']
              },
              {
                category: '3-Day Experience',
                price: '€12.000+',
                guests: 'Weekend',
                icon: '👑',
                features: ['Cena benvenuto', 'Cerimonia', 'Festa + brunch']
              },
              {
                category: 'Corporate',
                price: '€2.500',
                guests: 'Team-building',
                icon: '🌿',
                features: ['Workshop', 'Team lunch', 'Attività outdoor']
              },
              {
                category: 'Degustazione Wine',
                price: '€1.500',
                guests: 'Piccoli gruppi',
                icon: '🍷',
                features: ['Vini locali', 'Piatti gourmet', 'Guida sommelier']
              },
              {
                category: 'Workshop & Yoga',
                price: '€800',
                guests: 'Fino a 20',
                icon: '🧘',
                features: ['Lezioni', 'Pranzo bio', 'Spazi dedicati']
              },
              {
                category: 'Photoshoot',
                price: '€500',
                guests: 'Su misura',
                icon: '📸',
                features: ['Locations esclusive', 'Golden hour', 'Editing']
              },
              {
                category: 'Custom Event',
                price: 'Su richiesta',
                guests: 'Personalizzato',
                icon: '💫',
                features: ['Consulenza', 'Design unico', 'White-glove service']
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group border border-oro-vintage/30 hover:border-oro-vintage/80 p-8 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-light text-verde-salvia mb-3" style={{fontFamily: 'var(--font-playfair)'}}>
                  {item.category}
                </h3>
                <p className="text-3xl font-light text-oro-vintage mb-4">{item.price}</p>
                <p className="text-sm text-verde-salvia/70 font-light mb-6">{item.guests}</p>

                <ul className="space-y-2 mb-8">
                  {item.features.map((feature, i) => (
                    <li key={i} className="text-xs text-verde-salvia-dark/60 font-light">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#booking"
                  className="block text-center px-6 py-2 bg-verde-salvia/10 text-verde-salvia font-light text-sm hover:bg-verde-salvia/20 transition-all duration-300 rounded"
                >
                  Richiedi preventivo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM SECTION */}
      <section id="booking" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna-dark/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
              Richiedi il tuo preventivo
            </h2>
            <p className="text-sm text-verde-salvia-dark/70 font-light">
              Risponderemo entro 24 ore con un'offerta personalizzata per il tuo evento.
            </p>
          </div>

          <form className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <input
                type="text"
                placeholder="Nome"
                className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition"
                required
              />
              <input
                type="text"
                placeholder="Cognome"
                className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition"
              required
            />

            <input
              type="tel"
              placeholder="Telefono"
              className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <input
                type="date"
                className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                required
              />
              <select className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition">
                <option value="matrimonio">Matrimonio</option>
                <option value="corporate">Corporate</option>
                <option value="degustazione">Degustazione</option>
                <option value="wellness">Wellness & Yoga</option>
                <option value="photoshoot">Photoshoot</option>
                <option value="team">Team Building</option>
              </select>
            </div>

            <textarea
              placeholder="Aggiungi dettagli sul tuo evento..."
              className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition resize-none"
              rows={4}
            />

            <button
              type="submit"
              className="w-full bg-verde-salvia text-panna py-3 text-sm font-light hover:bg-verde-salvia-dark transition duration-300 rounded"
            >
              Invia Richiesta
            </button>
          </form>
        </div>
      </section>

      {/* CTA BACK */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <Link href="/" className="text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
          ← Torna alla home
        </Link>
      </section>
    </div>
  );
}
