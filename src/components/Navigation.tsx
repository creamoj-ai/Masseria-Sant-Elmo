'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* MENU OVERLAY - SCURO CON BLUR */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* DROPDOWN MENU - CENTRO BIANCO */}
      {menuOpen && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl z-[9999] p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Menu Links */}
          <nav className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 font-light mb-4">Sezioni</p>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Home
            </Link>
            <Link href="/masseria" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Masseria
            </Link>
            <Link href="/masseria/gallery" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Galleria
            </Link>
            <Link href="/cucina" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Cucina
            </Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Shop
            </Link>
            <Link href="/avatar-luna" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Avatar Luna
            </Link>
            <Link href="/contatti" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Contatti
            </Link>
            <Link href="/booking" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Prenota
            </Link>
          </nav>

          {/* Info */}
          <div className="border-t border-oro-vintage/20 pt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-verde-salvia/60 mb-3 font-light">Contatti</p>
              <p className="text-sm font-light text-verde-salvia-dark">+39 373 790 2538</p>
              <p className="text-xs text-verde-salvia/60 font-light mt-1">info@essenzedinaturaevents.it</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-panna border-b border-panna-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-verde-salvia hover:text-oro-vintage transition text-2xl font-light"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <Link href="/" className="text-sm sm:text-base font-light tracking-widest text-verde-salvia hover:text-oro-vintage transition">
            ESSENZE DI NATURA
          </Link>

          <nav className="hidden md:flex gap-12 text-xs sm:text-sm">
            <Link href="/masseria" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              Masseria
            </Link>
            <Link href="/cucina" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              Cucina
            </Link>
            <Link href="/booking" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              Prenota
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
