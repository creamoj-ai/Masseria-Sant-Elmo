'use client';

import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

const HERO_SLIDES = [
  {
    image: '/images/masseria-main.jpg',
    title: 'Masseria Sant\'Elmo',
    subtitle: 'Nel cuore del Parco Nazionale del Vesuvio'
  },
  {
    image: '/images/masseria-vesuvio-dome.jpg',
    title: 'Spazi esclusivi',
    subtitle: 'Cupola geodetica 14x20m con vista panoramica'
  },
  {
    image: '/images/masseria-vesuvio.jpg',
    title: 'Esperienze uniche',
    subtitle: 'Campi di lavanda e natura incontaminata'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  // Scroll animations
  const locationSection = useScrollAnimation();
  const gallerySection = useScrollAnimation();
  const servicesSection = useScrollAnimation();
  const aboutSection = useScrollAnimation();
  const testimonialsSection = useScrollAnimation();
  const bookingSection = useScrollAnimation();

  // Auto-advance hero carousel
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

      {/* HERO CAROUSEL */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides Container */}
        <div className="relative w-full h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: index === currentSlide ? 1 : 0 }}
              data-no-transition
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url("${slide.image}")` }}
              >
                <div className="absolute inset-0 bg-black/25"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-3xl mx-auto px-6">
            <h1 className="text-6xl md:text-8xl font-light mb-6 leading-tight tracking-tight" style={{fontFamily: 'var(--font-playfair)'}}>
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <div className="h-1 w-16 bg-white/80 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl font-light mb-12 tracking-wide">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <a href="#booking" className="inline-block bg-white text-black px-12 py-4 text-sm font-light hover:bg-gray-200 transition">
              Scopri di più
            </a>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:opacity-70 transition text-3xl"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:opacity-70 transition text-3xl"
        >
          ›
        </button>
      </section>

      {/* GALLERY SECTION */}
      <section ref={gallerySection.ref} className="py-32 px-6 lg:px-8 bg-gray-50/40">
        <div className="max-w-7xl mx-auto">
          <p className={`text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light transition-all duration-700 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Gallery</p>
          <h2 className={`text-6xl font-light mb-16 leading-tight transition-all duration-700 delay-100 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{fontFamily: 'var(--font-playfair)'}}>
            Scopri gli spazi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '/images/masseria-main.jpg', // Facciata principale
              '/images/masseria-facade.jpg', // Vista architettura
              '/images/masseria-doors.jpg', // Dettagli porte
              '/images/masseria-vesuvio-dome.jpg', // Cupola geodetica
              '/images/masseria-vesuvio.jpg', // Campo lavanda + Vesuvio
              '/images/masseria-details.jpg', // Dettagli costruzione
            ].map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`group relative h-64 bg-cover bg-center cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  gallerySection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  backgroundImage: `url("${image}")`,
                  transitionDelay: gallerySection.isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-3xl">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-auto" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Full view"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:opacity-70 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* LOCATION SECTION */}
      <section id="location" ref={locationSection.ref} className={`py-32 px-6 lg:px-8 bg-white transition-all duration-700 ${locationSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-16 font-light">La Location</p>

          <div className="grid md:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <h2 className="text-6xl font-light mb-12 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
                Un piccolo paradiso nel cuore della natura
              </h2>
              <p className="text-lg font-light text-gray-700 mb-8 leading-relaxed">
                Masseria Sant'Elmo è una location esclusiva immersa nel Parco Nazionale del Vesuvio, a soli 30km da Napoli.
              </p>
              <p className="text-lg font-light text-gray-700 leading-relaxed">
                La struttura dispone di una cupola geodetica di 14x20m con vista panoramica. Il nostro campo di lavanda e l'alambicco creano un'atmosfera autentica.
              </p>
            </div>
            <div className="h-96 bg-cover bg-center rounded-lg shadow-lg"
              style={{backgroundImage: 'url("/images/masseria-vesuvio.jpg")'}}
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

      {/* SERVICES SECTION - UPDATED ELEGANT DESIGN */}
      <section id="servizi" ref={servicesSection.ref} className={`py-32 px-6 lg:px-8 bg-white transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-24">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-6 font-light">Servizi</p>
            <h2 className="text-6xl font-light leading-tight max-w-3xl" style={{fontFamily: 'var(--font-playfair)'}}>
              Esperienze straordinarie personalizzate
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Matrimoni & Cerimonie',
                price: '€5.000+',
                desc: 'Il giorno più importante circondati dalla natura del Vesuvio',
                icon: '✨'
              },
              {
                title: 'Corporate Events',
                price: '€3.500+',
                desc: 'Team-building e rigenerazione nel cuore della natura',
                icon: '🌿'
              },
              {
                title: 'Degustazioni',
                price: '€50/pp',
                desc: 'Viaggio sensoriale tra lavanda e cucina locale',
                icon: '🌾'
              }
            ].map((service, i) => (
              <div
                key={i}
                className={`group relative bg-white border border-gray-100 hover:border-gray-300 px-8 py-12 transition-all duration-500 cursor-pointer ${
                  servicesSection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: servicesSection.isVisible ? `${i * 100}ms` : '0ms',
                }}
              >
                {/* Subtle top border accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A876] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="text-5xl mb-6 transition-transform duration-500 group-hover:scale-110 origin-left">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-light mb-4 group-hover:text-[#C9A876] transition-colors duration-300" style={{fontFamily: 'var(--font-playfair)'}}>
                  {service.title}
                </h3>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 font-light">
                  {service.desc}
                </p>

                <div className="pt-4 border-t border-gray-100 group-hover:border-[#C9A876]/30 transition-colors duration-300">
                  <p className="text-sm font-light text-[#C9A876] group-hover:text-[#B89966] transition-colors duration-300">
                    {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section ref={aboutSection.ref} className={`py-32 px-6 lg:px-8 transition-all duration-700 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="h-96 bg-cover bg-center order-2 md:order-1 rounded-lg shadow-lg"
              style={{backgroundImage: 'url("/images/masseria-facade.jpg")'}}
            ></div>
            <div className="order-1 md:order-2">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light">Esperienza</p>
              <h2 className="text-6xl font-light mb-12 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
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

      {/* TESTIMONIALS SECTION */}
      <section ref={testimonialsSection.ref} className={`py-32 px-6 lg:px-8 bg-gray-50/40 transition-all duration-700 ${testimonialsSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <p className={`text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light transition-all duration-700 ${testimonialsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Testimonianze</p>
          <h2 className={`text-6xl font-light mb-16 leading-tight transition-all duration-700 delay-100 ${testimonialsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{fontFamily: 'var(--font-playfair)'}}>
            Storie di momenti indimenticabili
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
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
                text: 'Team building indimenticabile nel cuore della natura. I nostri collaboratori ancora ne parlano.',
                rating: 5
              },
              {
                name: 'Famiglia Bianchi',
                event: 'Degustazione Luglio 2024',
                text: 'Esperienza sensoriale incredibile. La lavanda, i profumi, la cucina locale... semplicemente sublime.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-[#C9A876] transform hover:-translate-y-2 ${
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
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" ref={bookingSection.ref} className={`py-32 px-6 lg:px-8 bg-white transition-all duration-700 ${bookingSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light">Prenotazioni</p>
          <h2 className="text-6xl font-light mb-16 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
            Inizia il tuo evento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Nome</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Cognome</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Telefono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Data evento</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Ospiti</label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Tipo evento</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
              >
                <option value="matrimonio">Matrimonio</option>
                <option value="corporate">Corporate</option>
                <option value="enogastronomico">Degustazione</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">Note (facoltativo)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition resize-none"
              ></textarea>
            </div>

            <div className="pt-12">
              <button
                type="submit"
                className="bg-black text-white px-12 py-4 text-sm font-light hover:bg-gray-900 hover:shadow-lg transition"
              >
                Invia richiesta
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50/40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light">Rimani Connesso</p>
          <h2 className="text-6xl font-light mb-8 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
            Esclusiva anticipazioni e offerte stagionali
          </h2>
          <p className="text-lg font-light text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto">
            Ricevi preview in anteprima degli eventi, consigli culinari dal nostro team e offerte speciali riservate ai nostri iscritti.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Newsletter iscrizione: coming soon'); }}>
            <input
              type="email"
              placeholder="Inserisci la tua email"
              className="flex-1 bg-transparent border-b border-gray-200 pb-3 text-sm font-light focus:outline-none focus:border-black transition"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 text-sm font-light hover:bg-gray-900 transition whitespace-nowrap"
            >
              Iscriviti
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6">Non condividiamo mai la tua email. Puoi annullare l'iscrizione in qualsiasi momento.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4 font-light">Essenze di Natura</p>
              <p className="text-sm text-gray-600 font-light">Masseria Sant'Elmo, Parco Nazionale del Vesuvio</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4 font-light">Contatti</p>
              <p className="text-sm text-gray-600 font-light hover:text-gray-900 transition">☎ +39 373 790 2538</p>
              <p className="text-sm text-gray-600 font-light hover:text-gray-900 transition">✉ info@essenzedinaturaevents.it</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4 font-light">Stagione</p>
              <p className="text-sm text-gray-600 font-light">Marzo — Ottobre</p>
              <p className="text-sm text-gray-600 font-light">Su prenotazione</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-500 font-light">
            <p>&copy; 2025 Essenze di Natura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
