import React from 'react';
import { Heart, Lock } from 'lucide-react';
import { WeddingDetails } from '../types/wedding.ts';

interface FooterProps {
  details: WeddingDetails;
  onOpenAdmin: () => void;
  onOpenRSVP: () => void;
}

export const Footer: React.FC<FooterProps> = ({ details, onOpenAdmin, onOpenRSVP }) => {
  return (
    <footer className="bg-[#1f0409] text-stone-300 py-16 border-t border-mood-wine/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Monogram & Title */}
        <div className="space-y-2">
          <h3 className="text-3xl sm:text-4xl font-serif-wedding font-normal text-white tracking-wide">
            {details.groomName} <span className="font-serif italic text-[#C7BC86]">&</span> {details.brideName}
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#FAD7D5]/80">
            {details.date} · {details.cityState}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-300">
          <a href="#story" className="hover:text-white transition-colors">Unsere Geschichte</a>
          <a href="#schedule" className="hover:text-white transition-colors">Ablauf</a>
          <a href="#menu" className="hover:text-white transition-colors">Menü & Weine</a>
          <a href="#gallery" className="hover:text-white transition-colors">Galerie</a>
          <a href="#venue" className="hover:text-white transition-colors">Location & Anfahrt</a>
          <a href="#guestbook" className="hover:text-white transition-colors">Gästebuch</a>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-light max-w-4xl mx-auto">
          <div className="flex items-center gap-1.5">
            <span>Mit Liebe gestaltet für {details.groomName} & {details.brideName}</span>
            <Heart className="w-3.5 h-3.5 text-mood-wine fill-mood-wine inline" />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenRSVP}
              className="text-[#FAD7D5] hover:text-white transition-colors font-medium cursor-pointer"
            >
              Rückmeldung erbeten bis {details.rsvpDeadline}
            </button>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[#C7BC86] hover:text-white transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Brautpaar-Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
