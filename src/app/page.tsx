'use client';

import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import { validateField, formatPhoneNumber } from '@/lib/validateForm';
import { FormError } from '@/components/FormValidation';

const HERO_SLIDES = [
  {
    image: '/images/masseria-entrata-new.png',
    title: 'Masseria Sant\'Elmo',
    subtitle: 'Benvenuti nella nostra dimora'
  },
  {
    image: '/images/cupola-rendering-new.png',
    title: 'Nel Vesuvio',
    subtitle: 'Cupola geodetica con vista panoramica'
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
  const [selectedImageData, setSelectedImageData] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoData, setSelectedVideoData] = useState<any>(null);
  const [lunaModalOpen, setLunaModalOpen] = useState(false);
  const [lunaMinified, setLunaMinified] = useState(true);
  const [whatsappOpen, setWhatsappOpen] = useState(true);

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
    const { name, value } = e.target;

    // Apply phone masking
    const finalValue = name === 'phone' ? formatPhoneNumber(value) : value;

    setFormData({
      ...formData,
      [name]: finalValue
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched({ ...touched, [name]: true });

    // Validate field
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowConfirmation(true);
        setFormData({ first_name: '', last_name: '', email: '', phone: '', event_date: '', guest_count: '', event_type: 'matrimonio', notes: '' });
        setErrors({});
        setTouched({});
        setTimeout(() => setShowConfirmation(false), 5000);
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Errore durante l\'invio. Riprova.' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: 'Errore di connessione. Riprova più tardi.' });
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

      {/* HERO CTAs */}
      <section data-cta-section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-panna border-b border-oro-vintage/20">
        <div className="max-w-sm mx-auto flex flex-col items-center justify-center gap-6">
          {/* LUNA Avatar Preview */}
          <button
            onClick={() => {
              setLunaMinified(false);
              setLunaModalOpen(true);
            }}
            className="relative w-40 h-56 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition transform hover:scale-105 border-3 border-oro-vintage/40 flex-shrink-0"
          >
            <img
              src="/images/luna-avatar.jpg"
              alt="LUNA Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%)';
              }}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition duration-300 flex items-center justify-center">
              <span className="text-5xl opacity-0 hover:opacity-100 transition">▶</span>
            </div>
          </button>

          {/* LUNA Button - Below Image */}
          <button onClick={() => {
            setLunaMinified(false);
            setLunaModalOpen(true);
          }} className="flex items-center gap-3 px-8 py-4 bg-oro-vintage text-nero rounded-full font-semibold hover:scale-110 hover:shadow-lg transition duration-300 border-2 border-oro-vintage/50">
            <span className="text-2xl">✨</span>
            <span>Chiedi a LUNA</span>
          </button>
        </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {(([
              {
                image: '/images/masseria-main.jpg',
                title: 'Masseria',
                description: 'Una Masseria moderna, un\'ambiente elegante ma al tempo stesso familiare, un luogo creato per chi cerca un\'atmosfera tranquilla in natura, buon cibo, design e bellezza.'
              },
              {
                image: '/images/masseria-vesuvio-dome.jpg',
                title: 'Cupola Geodetica',
                description: 'Uno spazio unico in pieno contatto con la natura, con vista panoramica sul Vesuvio. Perfetta per cene esclusive e momenti indimenticabili.'
              },
              {
                image: '/images/architettura-rustica.jpg',
                title: 'Architettura Rustica',
                description: 'Pietra dorata e legno scuro. La Masseria incarna l\'eleganza autentica dell\'architettura meridionale, dove ogni dettaglio raconta la tradizione costruttiva vesuviana.'
              },
              {
                video: '/videos/cupola-allestita.mp4',
                title: 'Cupola Geodetica Allestita',
                description: 'Tour esclusivo della cupola geodetica e dei suoi allestimenti per eventi indimenticabili.'
              },
            ] as const)).map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  gallerySection.isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: gallerySection.isVisible ? `${index * 80}ms` : '0ms',
                }}
              >
                {'image' in item ? (
                  <div
                    onClick={() => {
                      setSelectedImage(item.image);
                      setSelectedImageData(item);
                    }}
                    className={`group relative h-72 bg-cover bg-center cursor-pointer overflow-hidden transition-all duration-500 transform hover:scale-105 mb-6`}
                    style={{
                      backgroundImage: `url("${item.image}")`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-white text-2xl font-light">↗</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSelectedVideo(item.video);
                      setSelectedVideoData(item);
                    }}
                    className={`group relative h-72 bg-black cursor-pointer overflow-hidden transition-all duration-500 transform hover:scale-105 mb-6 flex items-center justify-center`}
                  >
                    <video src={item.video} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-white text-5xl font-light">▶</span>
                    </div>
                  </div>
                )}
                <div className="px-2 text-center">
                  <h3 className="text-xl font-light text-verde-salvia mb-3" style={{fontFamily: 'var(--font-playfair)'}}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-verde-salvia-dark/70 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => {
            setSelectedImage(null);
            setSelectedImageData(null);
          }}
        >
          <div className="relative max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Gallery" className="w-full h-auto" />
            {selectedImageData && (
              <div className="bg-nero p-10 text-center">
                <h3 className="text-3xl md:text-4xl font-light text-white drop-shadow-lg mb-4" style={{fontFamily: 'var(--font-playfair)', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                  {selectedImageData.title}
                </h3>
                <p className="text-base text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>
                  {selectedImageData.description}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedImage(null);
                setSelectedImageData(null);
              }}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition text-3xl font-light"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => {
            setSelectedVideo(null);
            setSelectedVideoData(null);
          }}
        >
          <div className="relative max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-nero rounded-lg overflow-hidden" style={{aspectRatio: '16/9'}}>
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
            {selectedVideoData && (
              <div className="bg-nero p-10 text-center">
                <h3 className="text-3xl md:text-4xl font-light text-white drop-shadow-lg mb-4" style={{fontFamily: 'var(--font-playfair)', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
                  {selectedVideoData.title}
                </h3>
                <p className="text-base text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>
                  {selectedVideoData.description}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedVideo(null);
                setSelectedVideoData(null);
              }}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition text-3xl font-light z-10"
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

      {/* BOOKING FORM SECTION */}
      <section id="booking" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-panna">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-6 font-light">Prenota</p>
            <h2 className="text-4xl md:text-5xl font-light text-verde-salvia mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
              Richiedi il tuo preventivo
            </h2>
            <p className="text-sm text-verde-salvia-dark/70 font-light">
              Risponderemo entro 24 ore con un'offerta personalizzata per il tuo evento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-panna-dark/5 p-8 rounded-lg">
            {/* Error banner se c'è errore submit */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-light">
                  ⚠️ {errors.submit}
                </p>
              </div>
            )}

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Nome"
                  className={`w-full bg-transparent border-b pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition ${
                    touched.first_name && errors.first_name ? 'border-red-500' : 'border-verde-salvia/30'
                  }`}
                  required
                />
                <FormError error={errors.first_name} touched={touched.first_name} />
              </div>

              <div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Cognome"
                  className={`w-full bg-transparent border-b pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition ${
                    touched.last_name && errors.last_name ? 'border-red-500' : 'border-verde-salvia/30'
                  }`}
                  required
                />
                <FormError error={errors.last_name} touched={touched.last_name} />
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`w-full bg-transparent border-b pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition ${
                  touched.email && errors.email ? 'border-red-500' : 'border-verde-salvia/30'
                }`}
                required
              />
              <FormError error={errors.email} touched={touched.email} />
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Telefono (es. 373 123 4567)"
                className={`w-full bg-transparent border-b pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition ${
                  touched.phone && errors.phone ? 'border-red-500' : 'border-verde-salvia/30'
                }`}
                required
              />
              <FormError error={errors.phone} touched={touched.phone} />
            </div>

            {/* Event Date + Guest Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full bg-transparent border-b pb-3 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition ${
                    touched.event_date && errors.event_date ? 'border-red-500' : 'border-verde-salvia/30'
                  }`}
                  required
                />
                <FormError error={errors.event_date} touched={touched.event_date} />
              </div>

              <div>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Numero ospiti"
                  min="1"
                  max="400"
                  className={`w-full bg-transparent border-b pb-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition ${
                    touched.guest_count && errors.guest_count ? 'border-red-500' : 'border-verde-salvia/30'
                  }`}
                  required
                />
                <FormError error={errors.guest_count} touched={touched.guest_count} />
              </div>
            </div>

            {/* Event Type */}
            <div>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full bg-transparent border-b border-verde-salvia/30 pb-3 text-sm font-light text-verde-salvia-dark focus:outline-none focus:border-verde-salvia transition"
                required
              >
                <option value="matrimonio">Matrimonio</option>
                <option value="corporate">Corporate</option>
                <option value="degustazione">Degustazione</option>
                <option value="wellness">Wellness & Yoga</option>
                <option value="photoshoot">Photoshoot</option>
                <option value="team">Team Building</option>
              </select>
            </div>

            {/* Notes (optional) */}
            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Note aggiuntive (opzionale)"
                rows={4}
                className="w-full bg-transparent border border-verde-salvia/30 rounded p-3 text-sm font-light text-verde-salvia-dark placeholder:text-verde-salvia/40 focus:outline-none focus:border-verde-salvia transition resize-none"
              />
              <FormError error={errors.notes} touched={touched.notes} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-verde-salvia text-panna py-4 text-sm font-light hover:bg-verde-salvia-dark transition duration-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.values(errors).some(e => e !== '')}
            >
              Invia Richiesta
            </button>
          </form>
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

      {/* WHATSAPP POPUP - BOTTOM RIGHT */}
      {whatsappOpen && (
        <button
          onClick={() => {
            window.open('https://wa.me/393737902538', '_blank');
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#1fb85c] rounded-full shadow-2xl transition transform hover:scale-125 active:scale-95"
          title="Contattaci su WhatsApp"
        >
          {/* Official WhatsApp Logo */}
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.2-5.002 5.885-5.002 9.748 0 5.143 4.19 9.333 9.333 9.333 1.987 0 3.846-.579 5.431-1.671l.04-.024 4.29.429.429-4.29.024-.04a9.332 9.332 0 001.671-5.431c0-5.143-4.19-9.333-9.333-9.333"/>
          </svg>
        </button>
      )}

      {/* LUNA MINIFIED CHAT BUBBLE */}
      {lunaMinified && !lunaModalOpen && (
        <div className="fixed bottom-24 right-6 z-40">
          <button
            onClick={() => {
              setLunaMinified(false);
              setLunaModalOpen(true);
            }}
            className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-oro-vintage to-oro-vintage/80 hover:scale-110 rounded-full shadow-lg transition transform duration-300"
          >
            <span className="text-3xl">✨</span>
          </button>
          <div className="absolute right-20 bottom-0 bg-nero text-panna p-4 rounded-2xl shadow-xl whitespace-nowrap text-sm font-light opacity-0 hover:opacity-100 transition pointer-events-none">
            Chat con LUNA
          </div>
        </div>
      )}

      {/* LUNA MODAL - FULL SCREEN */}
      {lunaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          {/* Close Button - FIXED for mobile visibility */}
          <button
            onClick={() => {
              setLunaModalOpen(false);
              setLunaMinified(true);
            }}
            className="fixed top-4 right-4 z-50 w-14 h-14 flex items-center justify-center bg-oro-vintage text-nero rounded-full hover:bg-oro-vintage/90 transition font-bold text-2xl shadow-lg hover:scale-110"
          >
            ✕
          </button>

          <div className="relative w-full max-w-2xl bg-nero rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Luna Video */}
            <div className="relative w-full bg-nero flex items-center justify-center p-4 sm:p-6" style={{aspectRatio: '16/9'}}>
              <div className="w-full max-w-sm bg-nero rounded-xl overflow-hidden shadow-2xl" style={{aspectRatio: '9/16'}}>
                <video
                  src="/videos/prova-video-720p.mp4"
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                  poster="/images/luna-avatar.jpg"
                />
              </div>
            </div>

            {/* Luna Info - IMPROVED COLORS + MOBILE RESPONSIVE */}
            <div className="p-6 sm:p-8 text-center bg-nero">
              <h3 className="text-3xl sm:text-4xl font-light text-white mb-3 sm:mb-4 drop-shadow-lg" style={{fontFamily: 'var(--font-playfair)', textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>Benvenuto da LUNA</h3>
              <p className="text-sm sm:text-base text-white font-light leading-relaxed mb-6 sm:mb-8 drop-shadow-lg" style={{textShadow: '0 2px 6px rgba(0,0,0,0.9)'}}>Il tuo Avatar Virtuale - Assistente 24/7 per esperienze straordinarie</p>

              {/* CTA Button - Navigate to /luna page */}
              <a
                href="/luna"
                onClick={(e) => {
                  e.preventDefault();
                  setLunaModalOpen(false);
                  setLunaMinified(true);
                  window.location.href = '/luna';
                }}
                className="w-full sm:w-auto inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-nero rounded-full font-semibold hover:scale-105 hover:shadow-lg transition duration-300 text-sm sm:text-base"
              >
                ✨ Vai a Chiedi a LUNA
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
