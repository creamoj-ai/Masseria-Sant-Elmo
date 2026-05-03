'use client';

import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

const HERO_SLIDES = [
  {
    image: '/images/masseria-vesuvio-dome.jpg',
    title: 'Masseria Sant\'Elmo',
    subtitle: 'Cupola geodetica e campi di lavanda'
  },
  {
    image: '/images/masseria-main.jpg',
    title: 'Nel Vesuvio',
    subtitle: '375m² di eleganza'
  },
  {
    image: '/images/masseria-vesuvio.jpg',
    title: 'Esperienze Uniche',
    subtitle: 'Matrimoni, corporate, degustazioni'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const gallerySection = useScrollAnimation();
  const testimonialsSection = useScrollAnimation();
  const [partnersScrollIndex, setPartnersScrollIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-panna text-verde-salvia-dark">
      {showConfirmation && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-verde-salvia text-panna py-6 px-6 text-center animate-pulse">
          <h3 className="text-2xl font-light mb-2">✓ Prenotazione Inviata!</h3>
          <p className="font-light">Ti contatteremo entro 24 ore.</p>
        </div>
      )}


      {/* HERO CAROUSEL */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: index === currentSlide ? 1 : 0 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url("${slide.image}")` }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-3xl mx-auto px-6">
            <h1 className="text-6xl md:text-8xl font-light mb-6 leading-tight tracking-tight" style={{fontFamily: 'var(--font-playfair)'}}>
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <div className="h-1 w-16 bg-white/60 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl font-light tracking-wide">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition text-3xl font-light"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white transition text-3xl font-light"
        >
          ›
        </button>
      </section>

      {/* GALLERY */}
      <section id="gallery" ref={gallerySection.ref} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className={`text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light transition-all duration-700 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Gallery</p>
            <h2 className={`text-5xl md:text-6xl font-light leading-tight text-verde-salvia transition-all duration-700 delay-100 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{fontFamily: 'var(--font-playfair)'}}>
              Scopri gli spazi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '/images/masseria-main.jpg',
              '/images/masseria-facade.jpg',
              '/images/masseria-doors.jpg',
              '/images/masseria-vesuvio-dome.jpg',
              '/images/masseria-vesuvio.jpg',
              '/images/masseria-details.jpg',
            ].map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`group relative h-72 bg-cover bg-center cursor-pointer overflow-hidden transition-all duration-500 transform hover:scale-105 ${
                  gallerySection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  backgroundImage: `url("${image}")`,
                  transitionDelay: gallerySection.isVisible ? `${index * 80}ms` : '0ms',
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-2xl font-light">↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Gallery" className="w-full h-auto" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition text-3xl font-light"
            >
              ✕
            </button>
          </div>
        </div>
      )}


      {/* TESTIMONIALS */}
      <section ref={testimonialsSection.ref} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Testimonianze</p>
            <h2 className="text-5xl md:text-6xl font-light leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
              Momenti indimenticabili
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: 'Marco & Elisa',
                event: 'Matrimonio Giugno 2024',
                text: 'Un giorno perfetto. La location è semplicemente magica, il team ha curato ogni dettaglio con amore.',
                rating: 5
              },
              {
                name: 'Andrea Rossi',
                event: 'Corporate Event Maggio 2024',
                text: 'Team building indimenticabile nel cuore della natura. I collaboratori ancora ne parlano.',
                rating: 5
              },
              {
                name: 'Famiglia Bianchi',
                event: 'Degustazione Luglio 2024',
                text: 'Esperienza sensoriale incredibile. La lavanda, i profumi, la cucina locale... sublime.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  testimonialsSection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: testimonialsSection.isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-verde-salvia-dark/80 mb-6 italic leading-relaxed text-base">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-light text-verde-salvia text-base">{testimonial.name}</p>
                  <p className="text-xs text-verde-salvia/60 font-light mt-1">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-oro-vintage/20">
            <p className="text-center text-verde-salvia-dark/70 font-light">
              ✓ <strong>100+ coppie felici dal 2023</strong>
            </p>
          </div>
        </div>
      </section>

      {/* PARTNER CAROUSEL - AUTO SCROLL */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Partner Esclusivi</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
              Professionisti scelti con cura
            </h2>
          </div>

          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .partners-scroll {
              animation: scroll-left 30s linear infinite;
            }
            .partners-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="overflow-hidden">
            <div className="partners-scroll flex gap-8 w-max">
              {[
                { name: 'Terra e Sapori', icon: '🍽️', desc: 'Catering' },
                { name: 'Flora Vesuviana', icon: '🌸', desc: 'Fiori' },
                { name: 'Lacryma Christi', icon: '🍷', desc: 'Vini' },
                { name: 'Vesuvio Photography', icon: '📷', desc: 'Fotografia' },
                { name: 'Sound & Light', icon: '🎵', desc: 'DJ' },
                { name: 'Dolci Tradizioni', icon: '🎂', desc: 'Pasticceria' },
                // Duplicate for seamless loop
                { name: 'Terra e Sapori', icon: '🍽️', desc: 'Catering' },
                { name: 'Flora Vesuviana', icon: '🌸', desc: 'Fiori' },
                { name: 'Lacryma Christi', icon: '🍷', desc: 'Vini' },
                { name: 'Vesuvio Photography', icon: '📷', desc: 'Fotografia' },
                { name: 'Sound & Light', icon: '🎵', desc: 'DJ' },
                { name: 'Dolci Tradizioni', icon: '🎂', desc: 'Pasticceria' }
              ].map((partner, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg hover:bg-white/50 transition-all duration-300 group flex-shrink-0 w-40"
                >
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{partner.icon}</div>
                  <p className="text-sm font-light text-verde-salvia text-center">{partner.name}</p>
                  <p className="text-xs text-verde-salvia/60 font-light">{partner.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING CTA SECTION */}
      <section id="booking" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-verde-salvia/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Prossimo Passo</p>
          <h2 className="text-5xl md:text-6xl font-light leading-tight text-verde-salvia mb-8" style={{fontFamily: 'var(--font-playfair)'}}>
            Prenota il tuo evento
          </h2>
          <p className="text-lg font-light text-verde-salvia-dark/70 mb-12 max-w-2xl mx-auto">
            Scopri tutti i nostri servizi e prezzi, oppure inizia subito a pianificare con LUNA.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/prezzi"
              className="px-12 py-4 bg-verde-salvia text-panna font-light hover:bg-verde-salvia-dark transition rounded-lg"
            >
              Scopri i prezzi
            </Link>
            <Link
              href="/luna"
              className="px-12 py-4 bg-oro-vintage text-verde-salvia font-light hover:bg-oro-vintage/90 transition rounded-lg"
            >
              Chiedi a LUNA ✨
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna-dark/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Newsletter</p>
          <h2 className="text-5xl md:text-6xl font-light mb-8 leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
            Anticipazioni esclusiva
          </h2>
          <p className="text-lg font-light text-verde-salvia-dark/70 mb-12">
            Preview stagionali e offerte riservate ai nostri iscritti.
          </p>

          <form className="flex gap-4" onSubmit={(e) => { e.preventDefault(); alert('Newsletter coming soon'); }}>
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-verde-salvia text-panna text-sm font-light hover:bg-verde-salvia-dark transition whitespace-nowrap"
            >
              Iscriviti
            </button>
          </form>

          <p className="text-xs text-verde-salvia/60 mt-6 font-light">Non condividiamo mai la tua email.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-oro-vintage/20 bg-panna">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-3 font-light">Essenze di Natura</p>
              <p className="text-sm text-verde-salvia-dark/70 font-light">Masseria Sant'Elmo<br/>Parco Nazionale del Vesuvio</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-3 font-light">Contatti</p>
              <p className="text-sm text-verde-salvia-dark/70 font-light hover:text-verde-salvia transition">☎ +39 373 790 2538</p>
              <p className="text-sm text-verde-salvia-dark/70 font-light hover:text-verde-salvia transition">✉ info@essenzedinaturaevents.it</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-3 font-light">Stagione</p>
              <p className="text-sm text-verde-salvia-dark/70 font-light">Marzo — Ottobre</p>
              <p className="text-sm text-verde-salvia-dark/70 font-light">Su prenotazione</p>
            </div>
          </div>
          <div className="border-t border-oro-vintage/20 pt-8 text-center">
            <p className="text-xs text-verde-salvia/60 font-light">&copy; 2025 Essenze di Natura</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
