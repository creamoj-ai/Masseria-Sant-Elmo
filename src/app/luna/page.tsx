'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Luna() {
  const [selectedLanguage, setSelectedLanguage] = useState('it');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const languages = ['🇮🇹 Italiano', '🇬🇧 English', '🇪🇸 Español', '🇫🇷 Français', '🇩🇪 Deutsch', '🇯🇵 日本語'];

  return (
    <div className="min-h-screen bg-panna text-verde-salvia-dark">
      {/* HERO SECTION */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-verde-salvia/5 to-panna">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-6 animate-pulse">✨</div>
          <h1 className="text-5xl md:text-6xl font-light leading-tight text-verde-salvia mb-6" style={{fontFamily: 'var(--font-playfair)'}}>
            Benvenuto da LUNA
          </h1>
          <p className="text-xl font-light text-verde-salvia-dark/70 mb-8">
            Il tuo Avatar Virtuale - Assistente 24/7 per esperienze straordinarie
          </p>

          {/* Language Selector */}
          <div className="flex flex-wrap gap-3 justify-center">
            {languages.map((lang, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedLanguage(lang.split(' ')[1])}
                className={`px-4 py-2 text-sm font-light rounded-lg transition-all duration-300 ${
                  selectedLanguage === lang.split(' ')[1]
                    ? 'bg-verde-salvia text-panna'
                    : 'bg-panna-dark/10 text-verde-salvia hover:bg-panna-dark/20'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LUNA VIDEO HEYGEN SECTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Assistenza Virtuale</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
              Conosci LUNA
            </h2>
            <p className="text-lg font-light text-verde-salvia-dark/70 max-w-2xl mx-auto">
              L'avatar virtuale di Essenze di Natura. Disponibile 24/7, in 175+ lingue, per accompagnarti prima, durante e dopo il tuo soggiorno.
            </p>
          </div>

          {/* Video Container - Portrait */}
          <div className="relative w-full flex justify-center mb-12">
            <div className="w-full max-w-sm bg-gradient-to-b from-nero to-verde-salvia/10 rounded-xl overflow-hidden shadow-2xl" style={{aspectRatio: '9/16'}}>
              <video
                src="/videos/luna-video.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster="/images/masseria-main.jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-oro-vintage/30 rounded-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-light text-verde-salvia mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Multilingue</h3>
              <p className="text-sm text-verde-salvia-dark/60 font-light">175+ lingue con lip-sync perfetto per ospiti da tutto il mondo</p>
            </div>
            <div className="p-6 border border-oro-vintage/30 rounded-lg">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-light text-verde-salvia mb-2" style={{fontFamily: 'var(--font-playfair)'}}>24/7</h3>
              <p className="text-sm text-verde-salvia-dark/60 font-light">Assistenza costante, sempre disponibile senza pause</p>
            </div>
            <div className="p-6 border border-oro-vintage/30 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-light text-verde-salvia mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Personalizzato</h3>
              <p className="text-sm text-verde-salvia-dark/60 font-light">Video benvenuto con il tuo nome e preferenze</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRE-ARRIVO EXPERIENCE */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-verde-salvia/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Marketing Experience</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
              Video Personalizzato di Benvenuto
            </h2>
            <p className="text-lg font-light text-verde-salvia-dark/70">
              Invece di una semplice email, ricevi un video dove LUNA ti accoglie per nome, ti mostra la cupola geodetica e ti invita a scoprire i campi di lavanda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border-l-4 border-oro-vintage">
                <h3 className="text-lg font-light text-verde-salvia mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Accoglienza Personalizzata</h3>
                <p className="text-sm text-verde-salvia-dark/70 font-light">LUNA chiama per nome, mostra le foto più belle della Masseria e racconta la storia del tuo evento.</p>
              </div>
              <div className="p-6 bg-white rounded-lg border-l-4 border-oro-vintage">
                <h3 className="text-lg font-light text-verde-salvia mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Social Media Content</h3>
                <p className="text-sm text-verde-salvia-dark/70 font-light">Video quotidiani per Instagram Reels e TikTok: la storia della Masseria, i benefici della lavanda, momenti esclusivi.</p>
              </div>
              <div className="p-6 bg-white rounded-lg border-l-4 border-oro-vintage">
                <h3 className="text-lg font-light text-verde-salvia mb-2" style={{fontFamily: 'var(--font-playfair)'}}>Anticipazione</h3>
                <p className="text-sm text-verde-salvia-dark/70 font-light">Crea un'atmosfera di attesa magica prima dell'arrivo, aumentando l'entusiasmo e l'engagement.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-verde-salvia/10 to-oro-vintage/10 rounded-xl p-8 text-center">
              <div className="text-6xl mb-6">🎬</div>
              <p className="text-sm text-verde-salvia-dark/70 font-light leading-relaxed">
                Ogni ospite riceve un video personalizzato via email 7 giorni prima dell'arrivo. LUNA parla la sua lingua, conosce il tipo di evento, e lo/la prepara a un'esperienza indimenticabile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIGITAL CONCIERGE & ONBOARDING */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Accoglienza Virtuale</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
              Digital Concierge
            </h2>
            <p className="text-lg font-light text-verde-salvia-dark/70">
              QR code in camera, zone reception, e nel tuo smartphone. LUNA accoglie e spiega tutto come una vera concierge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-verde-salvia/5 to-transparent p-8 rounded-lg border border-verde-salvia/20">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-lg font-light text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>QR Code Ubiqui</h3>
              <ul className="space-y-3 text-sm font-light text-verde-salvia-dark/70">
                <li>✓ In camera: "Come uso il climatizzatore?"</li>
                <li>✓ In reception: "Quali tour escursionistici consigli?"</li>
                <li>✓ In giardino: "Storia della cupola geodetica"</li>
                <li>✓ In cucina: "Ingredienti locali della cena"</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-oro-vintage/5 to-transparent p-8 rounded-lg border border-oro-vintage/20">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-lg font-light text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>Video Onboarding</h3>
              <ul className="space-y-3 text-sm font-light text-verde-salvia-dark/70">
                <li>✓ Come funzionano i servizi della Masseria</li>
                <li>✓ Orari colazione, cena, zone relax</li>
                <li>✓ Percorsi trekking intorno al Vesuvio</li>
                <li>✓ Raccolta della lavanda (experience)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ VIDEO PILLOLE */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-verde-salvia/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Informazioni Utili</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
              FAQ Video - Il Libro della Casa in Movimento
            </h2>
            <p className="text-lg font-light text-verde-salvia-dark/70">
              Brevi pillole video che rispondono alle 20 domande più frequenti. Meno chiamate alla reception, più tempo per te.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Come uso la macchina del caffè?',
                a: 'LUNA ti mostra passo dopo passo come preparare il tuo caffè perfetto con la macchina Nespresso in camera. Meno di 2 minuti.'
              },
              {
                q: 'Orari della colazione e della cena',
                a: 'Video che spiega gli orari esatti, location, e come prenotare il servizio in camera o in giardino.'
              },
              {
                q: 'Percorsi trekking intorno a Sant\'Anastasia',
                a: 'LUNA mostra 3 percorsi diversi (facile, medio, difficile) con mappe e tempo stimato.'
              },
              {
                q: 'Come funziona la raccolta della lavanda?',
                a: 'Esperienza immersiva: quando, dove, cosa portare, e come trasformarla in olio essenziale.'
              },
              {
                q: 'Servizi spa e wellness disponibili',
                a: 'Tutti i trattamenti, prezzi, e come prenotare. LUNA mostra anche le foto dei servizi.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-oro-vintage/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-panna-dark/5 transition-all duration-300"
                >
                  <h3 className="text-lg font-light text-verde-salvia text-left">{faq.q}</h3>
                  <span className="text-2xl text-oro-vintage transition-transform duration-300" style={{transform: expandedFaq === idx ? 'rotate(180deg)' : 'rotate(0)'}}>
                    ▼
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-panna-dark/5 border-t border-oro-vintage/30">
                    <p className="text-sm text-verde-salvia-dark/70 font-light mb-4">{faq.a}</p>
                    <button className="text-sm text-verde-salvia font-light hover:text-oro-vintage transition">
                      ▶ Guarda il video
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE AVATAR - COMING SOON */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🚀</div>
          <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Prossimamente</p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight text-verde-salvia mb-6" style={{fontFamily: 'var(--font-playfair)'}}>
            Avatar Interattivo Live
          </h2>
          <p className="text-lg font-light text-verde-salvia-dark/70 max-w-2xl mx-auto mb-8">
            LUNA a disposizione sul nostro sito web. Fai una domanda vocale (es. "A che ora chiude la piscina?") e l'avatar risponde in tempo reale, 24/7, nella tua lingua.
          </p>
          <div className="inline-block px-12 py-4 bg-verde-salvia/10 text-verde-salvia font-light rounded-lg text-sm">
            Feature in arrivo a Giugno 2026
          </div>
        </div>
      </section>

      {/* BACK CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-verde-salvia/5">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-verde-salvia-dark/70 font-light mb-6">
            Domande? LUNA è qui per te. O contatta il nostro team:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="tel:+393737902538" className="px-8 py-3 bg-verde-salvia text-panna font-light text-sm hover:bg-verde-salvia-dark transition rounded-lg">
              ☎ +39 373 790 2538
            </a>
            <a href="mailto:info@essenzedinaturaevents.it" className="px-8 py-3 bg-oro-vintage text-verde-salvia font-light text-sm hover:bg-oro-vintage/90 transition rounded-lg">
              ✉ info@essenzedinaturaevents.it
            </a>
          </div>
          <Link href="/" className="text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
            ← Torna alla home
          </Link>
        </div>
      </section>
    </div>
  );
}
