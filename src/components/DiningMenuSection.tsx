import React, { useState } from 'react';
import { Wine, Utensils, GlassWater, Sparkles, ChefHat } from 'lucide-react';
import { MenuItem } from '../types/wedding.ts';

interface DiningMenuSectionProps {
  menuItems: MenuItem[];
  onOpenRSVP: () => void;
}

export const DiningMenuSection: React.FC<DiningMenuSectionProps> = ({
  menuItems,
  onOpenRSVP,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const courseFilters = [
    { id: 'all', label: 'Gesamtes Menü' },
    { id: 'aperitif', label: 'Aperitif & Fingerfood' },
    { id: 'hauptgang', label: 'Hauptgänge' },
    { id: 'dessert', label: 'Hochzeitstorte & Dessert' },
    { id: 'drinks', label: 'Signature Drinks' },
  ];

  const filteredItems = selectedCourse === 'all'
    ? menuItems
    : menuItems.filter((item) => item.course === selectedCourse);

  return (
    <section id="menu" className="scroll-mt-24 py-20 lg:py-28 bg-[#FAF8F5] border-y border-[#C7BC86]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-3">
            Kulinarischer Genuss
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-wedding font-normal tracking-tight text-stone-900">
            Das Hochzeitsmenü & Weine
          </h2>
          <div className="w-16 h-0.5 bg-mood-champagne mx-auto mt-4 mb-6" />
          <p className="text-stone-700 text-base sm:text-lg font-light leading-relaxed">
            Unser festliches mehrgängiges Menü vereint feine regionale Spezialitäten mit erlesener Weinbegleitung aus dem Rheingau.
          </p>
        </div>

        {/* Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch">
          <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm group min-h-[300px]">
            <img
              src="/src/assets/images/wedding_dining_course_1794236159784.jpg"
              alt="Festliches Hochzeitsdinner Hauptgang"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a060d]/90 via-[#2a060d]/30 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs uppercase tracking-widest text-[#FAD7D5] font-semibold mb-1">
                Hauptgang-Impression
              </span>
              <h3 className="text-2xl font-serif-wedding font-semibold">
                Feinstes Weiderind & Zanderfilet
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-light mt-1">
                Serviert mit Trüffel-Kartoffelpüree, marktfrischem Gemüse und Spätburgunder-Reduktion.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm group min-h-[300px]">
            <img
              src="/src/assets/images/wedding_cocktails_celebration_1794236153475.jpg"
              alt="Signature Cocktails und Champagner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a060d]/90 via-[#2a060d]/30 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs uppercase tracking-widest text-[#FAD7D5] font-semibold mb-1">
                Bar- & Cocktail-Konzept
              </span>
              <h3 className="text-2xl font-serif-wedding font-semibold">
                Katharina & Thomas Signature Drinks
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-light mt-1">
                Lavendel-Spritz mit Crémant, Thomas' Smoky Bourbon Old Fashioned & Rheingauer Winzersekte.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {courseFilters.map((tab) => {
            const isActive = selectedCourse === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCourse(tab.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-mood-wine text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:text-mood-wine border border-stone-200 hover:border-mood-champagne'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider text-mood-wine font-semibold">
                    {item.subtitle || item.course}
                  </span>
                  {item.signatureTag && (
                    <span className="text-xs text-mood-wine bg-mood-blush/40 border border-mood-blush px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-mood-wine" />
                      {item.signatureTag}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-serif-wedding font-semibold text-stone-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Bottom Wine Pairing & Dietary info */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                {item.winePairing && (
                  <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                    <Wine className="w-3.5 h-3.5 text-mood-wine shrink-0" />
                    <span>Weinbegleitung: {item.winePairing}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                  <span className="font-medium text-stone-700">Ernährung:</span>
                  {item.dietary.map((d, i) => (
                    <React.Fragment key={d}>
                      <span>{d}</span>
                      {i < item.dietary.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Dietary Note & RSVP Jump */}
        <div className="mt-14 max-w-2xl mx-auto text-center bg-white border border-[#C7BC86]/40 p-8 rounded-3xl shadow-xs">
          <ChefHat className="w-8 h-8 text-mood-wine mx-auto mb-3" />
          <h4 className="text-lg font-serif-wedding font-semibold text-stone-900 mb-2">
            Allergien & Spezielle Wünsche
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
            Selbstverständlich bereitet das Küchenteam für alle Gäste mit Nahrungsmittelunverträglichkeiten (z.B. Zöliakie, Laktose, Nussallergie) oder veganer/vegetarischer Ernährung ein individuelles Menü zu. Bitte vermerkt dies einfach in eurer Rückmeldung.
          </p>
          <button
            onClick={onOpenRSVP}
            className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-full transition-colors cursor-pointer shadow-xs"
          >
            Hauptgang-Wunsch bei Rückmeldung angeben
          </button>
        </div>
      </div>
    </section>
  );
};
