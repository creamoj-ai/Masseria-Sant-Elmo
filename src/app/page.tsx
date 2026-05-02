'use client';

import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import { validateField, validateForm, formatPhoneNumber, isFormValid } from '@/lib/validateForm';
import { FormError, FormSuccess, FormSubmitError, FormSubmitSuccess, FormField } from '@/components/FormValidation';

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

const GALLERY_IMAGES = [
  { image: '/images/masseria-main.jpg', caption: 'Facciata principale - 375m² coperto' },
  { image: '/images/masseria-facade.jpg', caption: 'Architettura elegante - Vista laterale' },
  { image: '/images/masseria-doors.jpg', caption: 'Dettagli artigianali - Porte in legno' },
  { image: '/images/masseria-vesuvio-dome.jpg', caption: 'Cupola geodetica 14x20m - Vista panoramica Vesuvio' },
  { image: '/images/masseria-vesuvio.jpg', caption: 'Campi di lavanda - Atmosfera autentica e natura' },
  { image: '/images/masseria-details.jpg', caption: 'Dettagli costruzione - Pietra naturale' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => prev === null ? null : (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => prev === null ? null : (prev + 1) % GALLERY_IMAGES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Format phone numbers automatically
    let finalValue = value;
    if (name === 'phone') {
      finalValue = formatPhoneNumber(value);
    }

    setFormData({
      ...formData,
      [name]: finalValue
    });

    // Real-time validation on change (if field was already touched)
    if (touchedFields[name]) {
      const error = validateField(name, finalValue);
      setFormErrors({
        ...formErrors,
        [name]: error
      });
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields({
      ...touchedFields,
      [name]: true
    });

    // Validate on blur
    const error = validateField(name, value);
    setFormErrors({
      ...formErrors,
      [name]: error
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark all fields as touched for validation display
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setTouchedFields(allTouched);

    // Validate entire form
    const errors = validateForm(formData);
    setFormErrors(errors);

    // Stop if validation fails
    if (!isFormValid(errors)) {
      setSubmitError('Per favore correggi gli errori prima di inviare.');
      return;
    }

    // Submit form
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || 'Errore durante la prenotazione. Riprova più tardi.');
        setIsSubmitting(false);
        return;
      }

      // Success
      setBookingRef(data.bookingId || 'MASSERIA-' + Date.now());
      setShowConfirmation(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        event_date: '',
        guest_count: '',
        event_type: 'matrimonio',
        notes: ''
      });
      setTouchedFields({});
      setFormErrors({});

      // Hide confirmation after 5 seconds
      setTimeout(() => setShowConfirmation(false), 5000);
    } catch (error) {
      setSubmitError('Impossibile connettersi al server. Riprova più tardi.');
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* CONFIRMATION MESSAGE */}
      <FormSubmitSuccess visible={showConfirmation} bookingRef={bookingRef} />

      {/* MINIMALIST HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xl font-light tracking-widest hover:opacity-70 transition cursor-pointer">ESSENZE DI NATURA</a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-12 text-sm items-center">
            <a href="#location" className="hover:text-gray-600 transition">Location</a>
            <a href="#servizi" className="hover:text-gray-600 transition">Servizi</a>
            <a href="#booking" className="hover:text-gray-600 transition">Prenota</a>
            {/* Desktop Quick Contact */}
            <a href="tel:+393737902538" className="text-gray-600 hover:text-black transition text-lg" title="Chiama">
              📞
            </a>
            <a href="https://wa.me/393737902538" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition text-lg" title="WhatsApp">
              💬
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-6">
            <a href="tel:+393737902538" className="text-gray-600 hover:text-black transition text-lg">
              📞
            </a>
            <button
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden');
                }
              }}
              className="text-3xl text-black hover:text-gray-800 transition cursor-pointer p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div id="mobile-menu" className="hidden md:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-3 flex flex-col">
            <a href="#location" className="text-sm hover:text-gray-600 transition py-2">Location</a>
            <a href="#servizi" className="text-sm hover:text-gray-600 transition py-2">Servizi</a>
            <a href="#booking" className="text-sm hover:text-gray-600 transition py-2">Prenota</a>
            <div className="border-t border-gray-100 pt-3 flex gap-3">
              <a href="https://wa.me/393737902538?text=Ciao!%20Sono%20interessato%20a%20una%20prenotazione." target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                💬 WhatsApp
              </a>
            </div>
          </nav>
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
          <span className="text-white/60 text-sm mb-2">Scorri per scoprire</span>
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
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

      {/* WELCOME SECTION - BELOW CAROUSEL */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
            {HERO_SLIDES[currentSlide].title}
          </h1>
          <div className="h-1 w-16 bg-gray-300 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl font-light text-gray-700 mb-12 tracking-wide">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#booking" className="inline-block bg-black text-white px-12 py-4 text-sm font-light hover:bg-gray-900 hover:shadow-lg transition">
              ✓ Prenota la tua data
            </a>
            <a href="#virtual-tour" className="inline-block bg-gray-100 text-black px-12 py-4 text-sm font-light hover:bg-gray-200 transition">
              🎬 Guarda il tour virtuale
            </a>
          </div>

          {/* Social Proof */}
          <p className="text-gray-600 text-sm mt-12 font-light">
            ✓ Oltre 120 eventi organizzati nel 2024 | ⭐ 4.9/5 valutazione
          </p>
        </div>
      </section>

      {/* GALLERY SECTION - MASONRY LAYOUT */}
      <section id="virtual-tour" ref={gallerySection.ref} className="py-32 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className={`text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light transition-all duration-700 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Gallery</p>
          <h2 className={`text-6xl font-light mb-16 leading-tight transition-all duration-700 delay-100 ${gallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{fontFamily: 'var(--font-playfair)'}}>
            Scopri gli spazi
          </h2>

          {/* Masonry Grid Layout */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {GALLERY_IMAGES.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`group relative cursor-pointer overflow-hidden break-inside-avoid transition-all duration-500 ${
                  gallerySection.isVisible
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
                style={{
                  transitionDelay: gallerySection.isVisible ? `${index * 80}ms` : '0ms',
                }}
              >
                {/* Image */}
                <div
                  className="relative w-full h-auto bg-cover bg-center overflow-hidden"
                  style={{
                    backgroundImage: `url("${item.image}")`,
                    aspectRatio: index % 2 === 0 ? '3/4' : '4/3'
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

                  {/* Caption - appears on hover */}
                  <div className="absolute inset-0 flex flex-col items-end justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-light text-right leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-4xl">+</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox - Enhanced with Navigation */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* Image Container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <img
                src={GALLERY_IMAGES[selectedImageIndex].image}
                alt={GALLERY_IMAGES[selectedImageIndex].caption}
                className="w-full h-auto transition-opacity duration-300"
              />

              {/* Caption Below Image */}
              <div className="bg-black/80 px-8 py-6 text-white text-center border-t border-white/10">
                <p className="text-lg font-light tracking-wide">{GALLERY_IMAGES[selectedImageIndex].caption}</p>
              </div>

              {/* Counter */}
              <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-light">
                {selectedImageIndex + 1} / {GALLERY_IMAGES.length}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-6 left-6 text-white text-4xl hover:opacity-70 transition font-light"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Navigation Arrows */}
            {GALLERY_IMAGES.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev === null ? 0 : (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-16 text-white text-4xl hover:opacity-70 transition font-light hover:scale-125 active:scale-100 z-10"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev === null ? 0 : (prev + 1) % GALLERY_IMAGES.length));
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 translate-x-16 text-white text-4xl hover:opacity-70 transition font-light hover:scale-125 active:scale-100 z-10"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            {/* Keyboard Hint */}
            <div className="mt-6 text-center text-white/60 text-sm font-light">
              <p>Usa frecce ← → o tastiera per navigare • ESC per chiudere</p>
            </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              },
              {
                title: 'Wellness & Yoga',
                price: '€40/pp',
                desc: 'Ritiri rigeneranti nel cuore della natura con lezioni di yoga',
                icon: '🧘'
              },
              {
                title: 'Photoshoots & Content',
                price: '€800+',
                desc: 'Location perfetta per shooting fotografici e creazione contenuti',
                icon: '📸'
              },
              {
                title: 'Team Building',
                price: '€2.500+',
                desc: 'Esperienze coinvolgenti per coesione e motivazione del team',
                icon: '👥'
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

                <div className="pt-4 border-t border-gray-100 group-hover:border-[#C9A876]/30 transition-colors duration-300 flex justify-between items-center">
                  <p className="text-sm font-light text-[#C9A876] group-hover:text-[#B89966] transition-colors duration-300">
                    {service.price}
                  </p>
                  <a
                    href="#booking"
                    className="text-xs font-light text-[#C9A876] hover:text-[#B89966] underline transition-colors"
                  >
                    Richiedi →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary CTA */}
          <div className="mt-16 text-center">
            <a href="#booking" className="inline-block border border-black text-black px-10 py-3 text-sm font-light hover:bg-black hover:text-white transition">
              Visualizza Preventivo
            </a>
          </div>
        </div>
      </section>

      {/* LUNA VIRTUAL ASSISTANT SECTION */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/40">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
              Chiedi a Luna
            </h2>
            <p className="text-lg font-light text-gray-700">
              Domande sul tuo evento? Luna è qui per te.
            </p>
          </div>

          {/* Video Container - Vertical Format */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-sm bg-black rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '9 / 16' }}>
              <video
                src="https://resource2.heygen.ai/video/transcode/cf1f054526f94714ac9d87b4a7c1a651/vFhpKkRD7AG8Gfc8En1fdDkYwcxUOxv8v/720x1280_nocap.mp4"
                controls
                className="w-full h-full object-cover"
                poster="/images/masseria-main.jpg"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#booking"
              className="inline-block bg-black text-white px-12 py-4 text-sm font-light hover:bg-gray-900 hover:shadow-lg transition"
            >
              💬 Chiedi a Luna
            </a>
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

      {/* PARTNER CAROUSEL SECTION - HORIZONTAL SCROLL WITH B&W IMAGES */}
      <section className="py-32 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4 font-light">Partner di Fiducia</p>
            <h2 className="text-6xl font-light leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
              Fornitori eccellenti per il tuo evento
            </h2>
          </div>

          {/* Horizontal Carousel with Overflow */}
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-6 min-w-min">
              {[
                { name: 'Terra e Sapori', category: 'Catering', image: '/images/masseria-main.jpg' },
                { name: 'Flora Vesuviana', category: 'Fiorista', image: '/images/masseria-facade.jpg' },
                { name: 'Lacryma Christi Wine', category: 'Vini Locali', image: '/images/masseria-vesuvio.jpg' },
                { name: 'Vesuvio Photography', category: 'Fotografia', image: '/images/masseria-vesuvio-dome.jpg' },
                { name: 'Sound & Light Prod.', category: 'DJ & Intrattenimento', image: '/images/masseria-doors.jpg' },
                { name: 'Dolci Tradizioni', category: 'Pasticceria', image: '/images/masseria-details.jpg' }
              ].map((partner, i) => (
                <div
                  key={i}
                  className="group relative flex-shrink-0 w-72 h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  {/* B&W Blurred Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${partner.image}")`,
                      filter: 'grayscale(100%) blur(8px)',
                    }}
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>

                  {/* Content - Bottom Positioned */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-light mb-2 group-hover:text-[#C9A876] transition-colors">
                      {partner.name}
                    </h3>
                    <p className="text-sm font-light text-white/80">
                      {partner.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hint for scrolling on mobile */}
          <p className="text-xs text-gray-500 mt-6 font-light text-center md:hidden">← Scorri lateralmente →</p>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" ref={bookingSection.ref} className={`py-32 px-6 lg:px-8 bg-white transition-all duration-700 ${bookingSection.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light">Prenotazioni</p>
          <h2 className="text-6xl font-light mb-16 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
            Inizia il tuo evento
          </h2>

          {/* Urgency Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <p className="text-sm text-amber-800 font-light">
              ⚠️ <strong>Attenzione:</strong> Solo 3 date disponibili per giugno 2025. Prenota ora per garantire la tua data preferita.
            </p>
          </div>

          {/* Submit Error */}
          <FormSubmitError error={submitError} />

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">👤 Nome</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full bg-transparent border-b pb-3 text-lg font-light focus:outline-none transition ${
                    formErrors.first_name && touchedFields.first_name
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 focus:border-black'
                  }`}
                  placeholder="Es: Marco"
                />
                <FormError error={formErrors.first_name} touched={touchedFields.first_name} />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">👤 Cognome</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full bg-transparent border-b pb-3 text-lg font-light focus:outline-none transition ${
                    formErrors.last_name && touchedFields.last_name
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 focus:border-black'
                  }`}
                  placeholder="Es: Rossi"
                />
                <FormError error={formErrors.last_name} touched={touchedFields.last_name} />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">✉️ Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                className={`w-full bg-transparent border-b pb-3 text-lg font-light focus:outline-none transition ${
                  formErrors.email && touchedFields.email
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-black'
                }`}
                placeholder="marco@example.com"
              />
              <FormError error={formErrors.email} touched={touchedFields.email} />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">📞 Telefono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                className={`w-full bg-transparent border-b pb-3 text-lg font-light focus:outline-none transition ${
                  formErrors.phone && touchedFields.phone
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-black'
                }`}
                placeholder="+39 373 123 4567"
              />
              <FormError error={formErrors.phone} touched={touchedFields.phone} />
              {!formErrors.phone && touchedFields.phone && (
                <p className="text-green-600 text-xs mt-2 font-light">✓ Valido</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">📅 Data evento</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  className={`w-full bg-transparent border-b pb-3 text-lg font-light focus:outline-none transition ${
                    formErrors.event_date && touchedFields.event_date
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 focus:border-black'
                  }`}
                />
                <FormError error={formErrors.event_date} touched={touchedFields.event_date} />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">👥 Ospiti</label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  min="1"
                  max="400"
                  className={`w-full bg-transparent border-b pb-3 text-lg font-light focus:outline-none transition ${
                    formErrors.guest_count && touchedFields.guest_count
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 focus:border-black'
                  }`}
                  placeholder="Es: 100"
                />
                <FormError error={formErrors.guest_count} touched={touchedFields.guest_count} />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">🎭 Tipo evento</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition"
              >
                <option value="matrimonio">💒 Matrimonio</option>
                <option value="corporate">🤝 Corporate</option>
                <option value="enogastronomico">🍷 Degustazione</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-gray-500 block mb-4 font-light">💬 Note (facoltativo)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                rows={3}
                className="w-full bg-transparent border-b border-gray-200 pb-3 text-lg font-light focus:outline-none focus:border-black transition resize-none"
                placeholder="Es: Desidero un menu vegetariano..."
              ></textarea>
            </div>

            <div className="pt-12 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid(formErrors) && Object.keys(touchedFields).length === Object.keys(formData).length}
                className="bg-black text-white px-12 py-4 text-sm font-light hover:bg-gray-900 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '⏳ Invio in corso...' : '✓ Invia richiesta'}
              </button>
              <a href="https://wa.me/393737902538?text=Ciao!%20Sono%20interessato%20a%20una%20prenotazione." target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-12 py-4 text-sm font-light hover:bg-green-700 transition text-center rounded">
                💬 Contattaci via WhatsApp
              </a>
            </div>
          </form>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 font-light">✓ Oltre 120 eventi organizzati nel 2024 | ⭐ Valutazione media 4.9/5</p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50/40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-8 font-light">Rimani Connesso</p>
          <h2 className="text-6xl font-light mb-8 leading-tight" style={{fontFamily: 'var(--font-playfair)'}}>
            Esclusiva anticipazioni e offerte stagionali
          </h2>
          {/* Latest version - force rebuild */}
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
