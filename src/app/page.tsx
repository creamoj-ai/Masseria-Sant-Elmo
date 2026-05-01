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
    <div className="min-h-screen bg-panna text-verde-salvia-dark">
      {/* CONFIRMATION MESSAGE */}
      {showConfirmation && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-verde-salvia text-panna py-6 px-6 text-center animate-pulse">
          <h3 className="text-2xl font-light mb-2">✓ Prenotazione Inviata!</h3>
          <p className="font-light">Grazie per la prenotazione. Ti contatteremo entro 24 ore per confermare.</p>
        </div>
      )}

      {/* MINIMALIST HEADER */}
      <header className="sticky top-0 z-50 bg-panna border-b border-panna-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
          <h1 className="text-sm sm:text-base md:text-xl font-light tracking-widest text-verde-salvia">ESSENZE DI NATURA</h1>
          <nav className="hidden md:flex gap-8 lg:gap-12 text-xs sm:text-sm">
            <a href="#location" className="text-verde-salvia hover:text-oro-vintage transition">Location</a>
            <a href="#servizi" className="text-verde-salvia hover:text-oro-vintage transition">Servizi</a>
            <a href="#booking" className="text-verde-salvia hover:text-oro-vintage transition">Prenota</a>
          </nav>
          <button className="md:hidden text-verde-salvia">☰</button>
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
            <a href="#booking" className="inline-block bg-panna text-verde-salvia px-8 sm:px-12 py-3 sm:py-4 text-xs sm:text-sm font-light hover:bg-oro-vintage hover:text-panna transition">
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
      <section ref={gallerySection.ref} className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna-dark/10">
        <div className="max-w-7xl mx-auto">
          <p className={`text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-6 sm:mb-8 font-light transition-all duration-700 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Gallery</p>
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-light mb-10 sm:mb-16 leading-tight transition-all duration-700 delay-100 text-verde-salvia ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{fontFamily: 'var(--font-playfair)'}}>
            Scopri gli spazi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className={`group relative h-48 sm:h-64 bg-cover bg-center cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-oro-vintage/10 ${
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
      <section id="location" ref={locationSection.ref} className={`py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna transition-all duration-700 ${locationSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-8 sm:mb-16 font-light">La Location</p>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-16 lg:gap-24 items-center mb-16 sm:mb-32">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 sm:mb-12 leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
                Un piccolo paradiso nel cuore della natura
              </h2>
              <p className="text-base sm:text-lg font-light text-verde-salvia-dark/80 mb-6 sm:mb-8 leading-relaxed">
                Masseria Sant'Elmo è una location esclusiva immersa nel Parco Nazionale del Vesuvio, a soli 30km da Napoli.
              </p>
              <p className="text-base sm:text-lg font-light text-verde-salvia-dark/80 leading-relaxed">
                La struttura dispone di una cupola geodetica di 14x20m con vista panoramica. Il nostro campo di lavanda e l'alambicco creano un'atmosfera autentica.
              </p>
            </div>
            <div className="h-48 sm:h-64 md:h-96 bg-cover bg-center rounded-lg shadow-lg border border-oro-vintage/20"
              style={{backgroundImage: 'url("/images/masseria-vesuvio.jpg")'}}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-20">
            <div>
              <p className="text-4xl sm:text-5xl font-light text-verde-salvia mb-2 sm:mb-4">375m²</p>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-verde-salvia/60">Spazio coperto</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-light text-verde-salvia mb-2 sm:mb-4">400+</p>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-verde-salvia/60">Ospiti massimi</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-light text-verde-salvia mb-2 sm:mb-4">Mar-Ott</p>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-verde-salvia/60">Stagione</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-light mb-6 sm:mb-8 text-verde-salvia">Servizi & Amenità</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-verde-salvia/5 hover:bg-verde-salvia/10 transition">
                <span className="text-lg sm:text-xl flex-shrink-0">🌳</span>
                <p className="text-xs sm:text-sm text-verde-salvia-dark/80">Giardino privato e spazio esterno</p>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-verde-salvia/5 hover:bg-verde-salvia/10 transition">
                <span className="text-lg sm:text-xl flex-shrink-0">🍳</span>
                <p className="text-xs sm:text-sm text-verde-salvia-dark/80">Cucina attrezzata e area catering</p>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-verde-salvia/5 hover:bg-verde-salvia/10 transition">
                <span className="text-lg sm:text-xl flex-shrink-0">📡</span>
                <p className="text-xs sm:text-sm text-verde-salvia-dark/80">Wi-Fi e connessione stabile</p>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-verde-salvia/5 hover:bg-verde-salvia/10 transition">
                <span className="text-lg sm:text-xl flex-shrink-0">🔊</span>
                <p className="text-xs sm:text-sm text-verde-salvia-dark/80">Impianto audio e illuminazione scenica</p>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-verde-salvia/5 hover:bg-verde-salvia/10 transition">
                <span className="text-lg sm:text-xl flex-shrink-0">🚗</span>
                <p className="text-xs sm:text-sm text-verde-salvia-dark/80">Parcheggio privato ampio</p>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-verde-salvia/5 hover:bg-verde-salvia/10 transition">
                <span className="text-lg sm:text-xl flex-shrink-0">🏛️</span>
                <p className="text-xs sm:text-sm text-verde-salvia-dark/80">Cupola geodetica 14x20m panoramica</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION - UPDATED ELEGANT DESIGN */}
      <section id="servizi" ref={servicesSection.ref} className={`py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna/50 transition-all duration-700 ${servicesSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 sm:mb-24">
            <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-4 sm:mb-6 font-light">Servizi</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight max-w-3xl text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
              Esperienze straordinarie personalizzate
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className={`group relative bg-panna/80 backdrop-blur-sm border border-oro-vintage/20 hover:border-oro-vintage/50 px-6 sm:px-8 py-8 sm:py-12 rounded-lg transition-all duration-500 cursor-pointer ${
                  servicesSection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: servicesSection.isVisible ? `${i * 100}ms` : '0ms',
                }}
              >
                {/* Subtle top border accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oro-vintage to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-lg"></div>

                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-110 origin-left">
                  {service.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-verde-salvia group-hover:text-oro-vintage transition-colors duration-300" style={{fontFamily: 'var(--font-playfair)'}}>
                  {service.title}
                </h3>

                <p className="text-verde-salvia-dark/60 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed group-hover:text-verde-salvia-dark/80 transition-colors duration-300 font-light">
                  {service.desc}
                </p>

                <div className="pt-4 border-t border-oro-vintage/20 group-hover:border-oro-vintage/50 transition-colors duration-300">
                  <p className="text-xs sm:text-sm font-light text-oro-vintage group-hover:text-oro-vintage-dark transition-colors duration-300">
                    {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - NEW LUXURY POSITIONING */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-panna to-panna-dark/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 sm:mb-20">
            <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-4 sm:mb-6 font-light">Investimento nell'esclusività</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight max-w-4xl text-verde-salvia mb-6 sm:mb-8" style={{fontFamily: 'var(--font-playfair)'}}>
              Scopri il prezzo del tuo evento perfetto
            </h2>
            <p className="text-base sm:text-lg font-light text-verde-salvia-dark/70 max-w-2xl">
              Ogni matrimonio, ogni festa aziendale è una storia unica. Ecco i nostri investimenti base — il tuo prezzo personalizzato dipende dai dettagli che immaginiamo insieme.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start">
            {/* Pricing Cards */}
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  category: 'Matrimoni Intimi',
                  price: '€3.500 - €5.000',
                  description: '20-30 ospiti',
                  details: ['Spazio esclusivo', 'Open bar premium', 'Servizio bar e camerieri', 'Setup decorativo'],
                  icon: '💍'
                },
                {
                  category: 'Matrimoni Eleganti',
                  price: '€6.000 - €10.000',
                  description: '40-70 ospiti',
                  details: ['Spazio completo', 'Menu personalizzato chef', 'Catering premium', 'DJ e intrattenimento', 'Coordinamento completo'],
                  icon: '✨'
                },
                {
                  category: '3-Day Wedding Experience',
                  price: '€12.000+',
                  description: 'Wedding weekend esclusivo',
                  details: ['Tutti i servizi matrimonio', 'Cena di benvenuto', 'Colazione e pranzo inclusi', 'Styling e fotografia', 'Coordinamento luxury'],
                  icon: '👑'
                },
                {
                  category: 'Corporate Events',
                  price: '€2.500 - €8.000',
                  description: 'Team-building e riunioni',
                  details: ['Spazi dedicati', 'Catering personalizzato', 'Attività outdoor', 'Wifi e tech support'],
                  icon: '🌿'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-panna border border-oro-vintage/30 hover:border-oro-vintage/60 rounded-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-oro-vintage to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>

                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div>
                      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.icon}</div>
                      <h3 className="text-lg sm:text-xl font-light text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
                        {item.category}
                      </h3>
                      <p className="text-xs sm:text-sm text-verde-salvia/60 font-light mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="mb-6 sm:mb-8 pt-4 border-t border-oro-vintage/20">
                    <p className="text-2xl sm:text-3xl font-light text-oro-vintage mb-2">{item.price}</p>
                  </div>

                  <ul className="space-y-2 sm:space-y-3">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-verde-salvia-dark/70 font-light group-hover:text-verde-salvia-dark/90 transition">
                        <span className="text-oro-vintage mt-1 flex-shrink-0">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Form + Testimonial */}
            <div className="space-y-8 sm:space-y-12">
              {/* Contact Form */}
              <div className="bg-panna-dark/5 border border-oro-vintage/20 rounded-lg p-8 sm:p-10 backdrop-blur-sm">
                <h3 className="text-2xl sm:text-3xl font-light text-verde-salvia mb-6 sm:mb-8" style={{fontFamily: 'var(--font-playfair)'}}>
                  Richiedi il tuo preventivo personalizzato
                </h3>
                <p className="text-sm text-verde-salvia-dark/70 font-light mb-8 leading-relaxed">
                  Contattaci per una consulenza gratuita. Riceverai un preventivo su misura entro 24 ore.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Nome"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-verde-salvia/30 pb-2 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition placeholder:text-verde-salvia/40"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Cognome"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-verde-salvia/30 pb-2 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition placeholder:text-verde-salvia/40"
                        required
                      />
                    </div>
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-verde-salvia/30 pb-2 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition placeholder:text-verde-salvia/40"
                    required
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefono"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-verde-salvia/30 pb-2 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition placeholder:text-verde-salvia/40"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-verde-salvia/30 pb-2 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                      required
                    />
                    <select
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-verde-salvia/30 pb-2 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                    >
                      <option value="matrimonio">Matrimonio</option>
                      <option value="corporate">Corporate</option>
                      <option value="enogastronomico">Degustazione</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-verde-salvia hover:bg-verde-salvia-dark text-panna font-light px-6 py-3 text-sm transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Richiedi Preventivo
                  </button>
                </form>
              </div>

              {/* Social Proof - Testimonial */}
              <div className="bg-panna border-2 border-oro-vintage/30 rounded-lg p-8 sm:p-10">
                <div className="flex gap-4 sm:gap-5 mb-6 sm:mb-8">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-verde-salvia to-verde-salvia-dark rounded-full flex-shrink-0 flex items-center justify-center text-2xl sm:text-3xl">
                    💍
                  </div>
                  <div>
                    <p className="font-light text-verde-salvia text-base sm:text-lg">Marco & Elisa</p>
                    <p className="text-xs sm:text-sm text-verde-salvia/60 font-light">Matrimonio Giugno 2024 | 65 ospiti</p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => <span key={i} className="text-sm">⭐</span>)}
                    </div>
                  </div>
                </div>
                <p className="italic text-verde-salvia-dark/80 text-sm sm:text-base font-light leading-relaxed mb-6">
                  "Un giorno perfetto. La location è semplicemente magica, il team ha curato ogni dettaglio con amore. Non potremmo aver scelto posto migliore."
                </p>
                <div className="pt-6 border-t border-oro-vintage/20">
                  <p className="text-xs sm:text-sm text-verde-salvia/60 font-light">
                    ✓ <strong>100+ coppie felici dal 2023</strong> — La tua storia potrebbe essere la prossima
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section ref={aboutSection.ref} className={`py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna transition-all duration-700 ${aboutSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-16 lg:gap-20 items-center">
            <div className="h-48 sm:h-64 md:h-96 bg-cover bg-center order-2 md:order-1 rounded-lg shadow-lg border border-oro-vintage/20"
              style={{backgroundImage: 'url("/images/masseria-facade.jpg")'}}
            ></div>
            <div className="order-1 md:order-2">
              <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-4 sm:mb-8 font-light">Esperienza</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 sm:mb-12 leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
                Ogni dettaglio è curato con passione
              </h2>
              <p className="text-base sm:text-lg font-light text-verde-salvia-dark/80 mb-6 sm:mb-8 leading-relaxed">
                Immergiti nella magia delle serate uniche organizzate presso la Masseria Sant'Elmo. Nel cuore della natura, vivrai momenti indimenticabili in un'atmosfera incantevole.
              </p>
              <p className="text-base sm:text-lg font-light text-verde-salvia-dark/80 leading-relaxed">
                Il nostro team di esperti eventi sarà al tuo fianco per realizzare ogni dettaglio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section ref={testimonialsSection.ref} className={`py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna-dark/10 transition-all duration-700 ${testimonialsSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          <p className={`text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-6 sm:mb-8 font-light transition-all duration-700 ${testimonialsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Testimonianze</p>
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-light mb-10 sm:mb-16 leading-tight transition-all duration-700 delay-100 text-verde-salvia ${testimonialsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{fontFamily: 'var(--font-playfair)'}}>
            Storie di momenti indimenticabili
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className={`bg-panna rounded-lg p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-oro-vintage transform hover:-translate-y-2 ${
                  testimonialsSection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: testimonialsSection.isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-verde-salvia-dark/80 mb-4 sm:mb-6 italic leading-relaxed text-sm sm:text-base">"{testimonial.text}"</p>
                <div>
                  <p className="font-light text-verde-salvia text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-verde-salvia/60">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" ref={bookingSection.ref} className={`py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna transition-all duration-700 ${bookingSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-4 sm:mb-8 font-light">Prenotazioni</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-8 sm:mb-16 leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
            Inizia il tuo evento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Nome</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Cognome</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                required
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Telefono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Data evento</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Ospiti</label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Tipo evento</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
              >
                <option value="matrimonio">Matrimonio</option>
                <option value="corporate">Corporate</option>
                <option value="enogastronomico">Degustazione</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-verde-salvia/60 block mb-3 sm:mb-4 font-light">Note (facoltativo)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-base sm:text-lg font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition resize-none"
              ></textarea>
            </div>

            <div className="pt-8 sm:pt-12">
              <button
                type="submit"
                className="bg-verde-salvia text-panna px-8 sm:px-12 py-3 sm:py-4 text-xs sm:text-sm font-light hover:bg-verde-salvia-dark hover:shadow-lg transition"
              >
                Invia richiesta
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna-dark/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-4 sm:mb-8 font-light">Rimani Connesso</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 sm:mb-8 leading-tight text-verde-salvia" style={{fontFamily: 'var(--font-playfair)'}}>
            Esclusiva anticipazioni e offerte stagionali
          </h2>
          <p className="text-base sm:text-lg font-light text-verde-salvia-dark/80 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            Ricevi preview in anteprima degli eventi, consigli culinari dal nostro team e offerte speciali riservate ai nostri iscritti.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Newsletter iscrizione: coming soon'); }}>
            <input
              type="email"
              placeholder="Inserisci la tua email"
              className="flex-1 bg-transparent border-b border-verde-salvia/20 pb-2 sm:pb-3 text-xs sm:text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition placeholder:text-verde-salvia/40"
              required
            />
            <button
              type="submit"
              className="bg-verde-salvia text-panna px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-light hover:bg-verde-salvia-dark transition whitespace-nowrap"
            >
              Iscriviti
            </button>
          </form>

          <p className="text-xs text-verde-salvia/60 mt-6">Non condividiamo mai la tua email. Puoi annullare l'iscrizione in qualsiasi momento.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-oro-vintage/20 bg-panna">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-3 sm:mb-4 font-light">Essenze di Natura</p>
              <p className="text-xs sm:text-sm text-verde-salvia-dark/70 font-light">Masseria Sant'Elmo, Parco Nazionale del Vesuvio</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-3 sm:mb-4 font-light">Contatti</p>
              <p className="text-xs sm:text-sm text-verde-salvia-dark/70 font-light hover:text-verde-salvia transition">☎ +39 373 790 2538</p>
              <p className="text-xs sm:text-sm text-verde-salvia-dark/70 font-light hover:text-verde-salvia transition">✉ info@essenzedinaturaevents.it</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-verde-salvia/60 mb-3 sm:mb-4 font-light">Stagione</p>
              <p className="text-xs sm:text-sm text-verde-salvia-dark/70 font-light">Marzo — Ottobre</p>
              <p className="text-xs sm:text-sm text-verde-salvia-dark/70 font-light">Su prenotazione</p>
            </div>
          </div>
          <div className="border-t border-oro-vintage/20 pt-6 sm:pt-8 text-center text-xs text-verde-salvia/60 font-light">
            <p>&copy; 2025 Essenze di Natura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
