'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/lib/useAuth';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { authorized, user } = useAuth();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push('/auth/login');
  };

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
            <a href="#gallery" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Spazi
            </a>
            <Link href="/prezzi" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Prezzi
            </Link>
            <Link href="/luna" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              ✨ Chiedi a LUNA
            </Link>
            <a href="#booking" onClick={() => setMenuOpen(false)} className="block text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
              Prenota
            </a>
          </nav>

          {/* Admin Link - Solo se autorizzato */}
          {authorized && (
            <div className="border-t border-oro-vintage/20 pt-6 mt-6">
              <p className="text-xs uppercase tracking-widest text-verde-salvia/60 font-light mb-4">Admin</p>
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-light text-oro-vintage hover:text-verde-salvia transition bg-oro-vintage/10 hover:bg-oro-vintage/20 px-4 py-2 rounded-lg"
              >
                🔑 Admin Dashboard
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="border-t border-oro-vintage/20 pt-6">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-oro-vintage/10 hover:bg-oro-vintage/20 text-verde-salvia rounded-lg text-sm font-light transition"
            >
              Esci
            </button>
          </div>

          {/* Info */}
          <div className="space-y-4">
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

          <nav className="hidden md:flex gap-12 text-xs sm:text-sm items-center">
            <a href="#gallery" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              Spazi
            </a>
            <Link href="/prezzi" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              Prezzi
            </Link>
            <Link href="/luna" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              ✨ Chiedi a LUNA
            </Link>
            <a href="#booking" className="text-verde-salvia hover:text-oro-vintage transition font-light">
              Prenota
            </a>
            {authorized && (
              <Link href="/admin" className="ml-4 px-3 py-2 bg-oro-vintage/10 hover:bg-oro-vintage/20 text-oro-vintage hover:text-verde-salvia rounded text-xs transition font-light">
                🔑 Admin
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
