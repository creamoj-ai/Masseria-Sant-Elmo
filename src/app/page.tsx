'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#4A6741]">Essenze di Natura</div>
            <div className="hidden md:flex gap-8">
              <a href="#location" className="text-[#2C2C2C] hover:text-[#4A6741] transition">Location</a>
              <a href="#servizi" className="text-[#2C2C2C] hover:text-[#4A6741] transition">Servizi</a>
              <a href="#booking" className="text-[#2C2C2C] hover:text-[#4A6741] transition">Prenotazioni</a>
              <a href="#contatti" className="text-[#2C2C2C] hover:text-[#4A6741] transition">Contatti</a>
            </div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#4A6741]"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="h-screen bg-gradient-to-b from-[#4A6741] to-[#2C2C2C] text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml')] bg-cover"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif">
            Essenze di Natura
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#F5F1E8] font-light">
            Matrimoni, Cerimonie & Corporate Events
            <br />
            <span className="text-[#C9A876]">Nel cuore del Parco Nazionale del Vesuvio</span>
          </p>
          <div className="flex gap-4 justify-center mt-12">
            <button className="bg-[#C9A876] text-[#2C2C2C] px-8 py-4 rounded-lg font-semibold hover:bg-[#B89860] transition">
              Scopri di più
            </button>
            <button className="border-2 border-[#C9A876] text-[#C9A876] px-8 py-4 rounded-lg font-semibold hover:bg-[#C9A876] hover:text-[#2C2C2C] transition">
              Prenota Ora
            </button>
          </div>
        </div>
      </section>

      {/* LOCATION SECTION */}
      <section id="location" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#4A6741] text-center mb-12">La Nostra Location</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-[#2C2C2C] mb-4">
                Masseria Sant'Elmo è una location esclusiva immersa nel Parco Nazionale del Vesuvio, 
                a soli 30km da Napoli. La struttura dispone di una cupola geodetica unica di 14x20m 
                con vista panoramica sui Monti Lattari e il Vesuvio.
              </p>
              <p className="text-lg text-[#2C2C2C] mb-4">
                Il nostro campo di lavanda aziendale e l'alambicco per le essenze creano un'atmosfera 
                autentica, ideale per matrimoni, cerimonie, team-building e degustazioni enogastronomiche.
              </p>
              <div className="flex gap-4 mt-8">
                <div>
                  <div className="text-3xl font-bold text-[#C9A876]">375m²</div>
                  <p className="text-sm text-[#4A6741]">Spazio coperto</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#C9A876]">400+</div>
                  <p className="text-sm text-[#4A6741]">Ospiti max</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#C9A876]">48</div>
                  <p className="text-sm text-[#4A6741]">Eventi/anno</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-[#4A6741] to-[#3A5532] h-80 rounded-lg flex items-center justify-center text-[#C9A876] text-center">
              [Immagine panoramica location - Vesuvio + Cupola]
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servizi" className="py-20 bg-[#F5F1E8]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#4A6741] text-center mb-12">I Nostri Servizi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Matrimoni & Cerimonie", price: "€5.000+", desc: "Pacchetto completo chiavi in mano" },
              { title: "Corporate Events", price: "€3.500+", desc: "Team-building, cene aziendali" },
              { title: "Esperienze Enogastronomiche", price: "€50/pp", desc: "Degustazioni con catering partner" },
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-[#4A6741] mb-2">{service.title}</h3>
                <p className="text-[#C9A876] text-lg font-bold mb-4">{service.price}</p>
                <p className="text-[#2C2C2C]">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#4A6741] text-center mb-12">Prenota il Tuo Evento</h2>
          <form className="space-y-6">
            <input 
              type="text" 
              placeholder="Nome completo" 
              className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]"
            />
            <input 
              type="tel" 
              placeholder="Telefono" 
              className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]"
            />
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]"
            />
            <select className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]">
              <option>Seleziona tipo evento</option>
              <option>Matrimonio</option>
              <option>Cerimonia</option>
              <option>Corporate</option>
              <option>Degustazione</option>
            </select>
            <input 
              type="number" 
              placeholder="Numero ospiti" 
              className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]"
            />
            <textarea 
              placeholder="Note" 
              rows={4}
              className="w-full px-4 py-3 border border-[#4A6741] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A876]"
            ></textarea>
            <button 
              type="submit"
              className="w-full bg-[#4A6741] text-white py-4 rounded-lg font-semibold hover:bg-[#3A5532] transition"
            >
              Prenota Ora
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contatti" className="bg-[#2C2C2C] text-[#F5F1E8] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C9A876]">Essenze di Natura</h3>
              <p className="text-sm">Location esclusiva nel Parco del Vesuvio</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contatti</h4>
              <p>📧 creamoj@gmail.com</p>
              <p>📱 +39 373 790 2538</p>
              <p>📍 Via Generale Riccardo De Rosa, 3</p>
              <p>Sant'Anastasia (NA) 80048</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Orari</h4>
              <p>Stagione: Marzo - Ottobre</p>
              <p>Su prenotazione</p>
            </div>
          </div>
          <div className="border-t border-[#4A6741] pt-8 text-center text-sm">
            <p>&copy; 2025 Essenze di Natura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
