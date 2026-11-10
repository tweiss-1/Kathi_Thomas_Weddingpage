import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { WeddingDetails } from '../types/wedding.ts';

interface NavbarProps {
  details: WeddingDetails;
  onOpenRSVP: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ details, onOpenRSVP, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Unsere Geschichte', href: '#story' },
    { label: 'Ablauf', href: '#schedule' },
    { label: 'Menü & Weine', href: '#menu' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'Location & Anfahrt', href: '#venue' },
    { label: 'Gästebuch', href: '#guestbook' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#C7BC86]/30 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark in Cormorant Garamond */}
          <a
            href="#"
            className="text-2xl sm:text-3xl font-serif-wedding font-semibold tracking-wide text-mood-wine whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            {details.groomName} <span className="font-serif italic font-light text-mood-olive">&</span> {details.brideName}
          </a>

          {/* Zone 2: 4-6 concise single-line nav links in German */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-mood-wine transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-mood-champagne font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action button + subtle admin lock */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-stone-600 hover:text-mood-wine hover:bg-mood-blush/40 rounded-full transition-colors cursor-pointer"
              title="Brautpaar-Portal & Ablauf-/Location-Verwaltung"
              aria-label="Brautpaar-Portal"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenRSVP}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium tracking-wide uppercase text-white bg-mood-wine hover:bg-mood-wine/90 rounded-full transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              Rückmeldung (RSVP)
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-mood-wine focus:outline-none"
              aria-label="Navigation öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#C7BC86]/40 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-stone-800 hover:text-mood-wine py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRSVP();
              }}
              className="w-full py-3 text-center text-sm font-medium tracking-wide uppercase text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors shadow-xs"
            >
              Jetzt Rückmeldung geben
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-center text-xs text-stone-700 hover:text-mood-wine bg-mood-blush/40 rounded-xl font-medium"
            >
              Brautpaar- & Planungs-Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
