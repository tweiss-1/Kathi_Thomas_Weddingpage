import React, { useState } from 'react';
import { Sparkles, Heart, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { WeddingDetails, ItineraryItem } from '../types/wedding.ts';

interface StoryAndScheduleProps {
  details: WeddingDetails;
  itinerary: ItineraryItem[];
}

export const StoryAndSchedule: React.FC<StoryAndScheduleProps> = ({
  details,
  itinerary,
}) => {
  const [showDresscodeZoom, setShowDresscodeZoom] = useState(false);
  return (
    <div className="bg-[#FAF8F5] text-stone-900 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section 1: Unsere Geschichte */}
        <section id="story" className="scroll-mt-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-3">
              Unsere Reise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-wedding font-normal tracking-tight text-stone-900">
              Wie aus zwei Wegen einer wurde
            </h2>
            <div className="w-16 h-0.5 bg-mood-champagne mx-auto mt-4 mb-6" />
            <p className="text-stone-700 text-base sm:text-lg font-light leading-relaxed">
              Von unserem ersten gemeinsamen Sommer bis hin zu unzähligen Bergwanderungen und gemütlichen Abenden – hier ist ein kleiner Einblick in unsere Geschichte.
            </p>
          </div>

          {/* Monogram Highlight Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#C7BC86]/50 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 mb-14">
            <div className="w-full md:w-56 lg:w-64 aspect-3/4 rounded-2xl overflow-hidden shadow-md shrink-0 border border-stone-200 bg-stone-100">
              <img
                src="/src/assets/images/Anagram.jpeg"
                alt="Katharina & Thomas Monogramm K&T"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block">
                {details.groomName} & {details.brideName}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-stone-900">
                Unser persönliches Hochzeits-Monogramm
              </h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Mit unserem Monogramm „K & T“ verbinden wir unsere Initialen und den Beginn eines gemeinsamen Lebensweges voller Vertrauen, Liebe und Verbundenheit.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start text-xs text-mood-wine font-medium">
                <span>18. August 2028</span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span>{details.venueName}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-xs hover:border-mood-wine/40 transition-all group">
              <div className="w-10 h-10 rounded-full bg-mood-blush/40 flex items-center justify-center text-mood-wine mb-6 group-hover:bg-mood-wine group-hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-xs text-stone-500 mb-2">Sommer 2021 · Das Kennenlernen</div>
              <h3 className="text-xl font-serif-wedding font-semibold text-stone-900 mb-3">
                01. Ein sonniger Nachmittag
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Es brauchte nur ein spontanes Treffen in den Weinbergen und einen gemeinsamen Kaffee. Aus einem kurzen Kennenlernen wurden Stunden voller tiefgründiger Gespräche und ansteckendem Lachen.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-xs hover:border-mood-wine/40 transition-all group">
              <div className="w-10 h-10 rounded-full bg-mood-blush/40 flex items-center justify-center text-mood-wine mb-6 group-hover:bg-mood-wine group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs text-stone-500 mb-2">Herbst 2025 · Der Antrag</div>
              <h3 className="text-xl font-serif-wedding font-semibold text-stone-900 mb-3">
                02. Das große JA
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Bei Sonnenuntergang auf unserem liebsten Aussichtspunkt stellte Thomas die Frage aller Fragen. Mit Freudentränen und einem festen Umarmen begann die Vorfreude auf diesen Tag.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200/90 shadow-xs hover:border-mood-wine/40 transition-all group">
              <div className="w-10 h-10 rounded-full bg-mood-blush/40 flex items-center justify-center text-mood-wine mb-6 group-hover:bg-mood-wine group-hover:text-white transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs text-stone-500 mb-2">18. August 2028 · Unser Versprechen</div>
              <h3 className="text-xl font-serif-wedding font-semibold text-stone-900 mb-3">
                03. Für immer & gemeinsam
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Nun dürfen wir vor all unseren Freunden und unserer Familie unser Eheversprechen ablegen. Wir können es kaum erwarten, diesen Tag mit euch unvergesslich zu machen!
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Ablaufplan */}
        <section id="schedule" className="scroll-mt-24 pt-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-3">
              Tagesablauf
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-wedding font-normal tracking-tight text-stone-900">
              Der Ablauf unseres Hochzeitstages
            </h2>
            <div className="w-16 h-0.5 bg-mood-champagne mx-auto mt-4 mb-6" />
            <p className="text-stone-700 text-base sm:text-lg font-light">
              {details.date} · {details.venueName}
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Spine */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-[#C7BC86]/50 -translate-x-1/2 hidden sm:block" />

            <div className="space-y-8 sm:space-y-12">
              {itinerary.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    } gap-6 sm:gap-12`}
                  >
                    {/* Content Box */}
                    <div className="w-full sm:w-[calc(50%-2rem)] bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-semibold text-mood-wine tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-mood-olive" />
                          {item.time}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-mood-olive" />
                          {item.location}
                        </span>
                      </div>

                      <h4 className="text-lg font-serif-wedding font-semibold text-stone-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Timeline Center Node */}
                    <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-mood-wine items-center justify-center shadow-xs z-10 top-7">
                      <div className="w-2 h-2 rounded-full bg-mood-wine" />
                    </div>

                    <div className="hidden sm:block w-[calc(50%-2rem)]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Dresscode & Style-Guide (Old Money Aesthetic) */}
          <div className="mt-20 max-w-5xl mx-auto bg-white border border-[#C7BC86]/50 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Dresscode Moodboard Visual (Image or Video) */}
              <div 
                className="lg:col-span-6 relative bg-stone-100 min-h-[380px] lg:min-h-[460px] overflow-hidden group cursor-pointer"
                onClick={() => {
                  const mediaUrl = details.dressCodeImageUrl || '/src/assets/images/dresscode_old_money_collage_1794251480085.jpg';
                  if (!mediaUrl.endsWith('.mp4') && !mediaUrl.endsWith('.webm')) {
                    setShowDresscodeZoom(true);
                  }
                }}
                title="Klicken zum Vergrößern der Moodboard-Collage"
              >
                {details.dressCodeImageUrl && (details.dressCodeImageUrl.endsWith('.mp4') || details.dressCodeImageUrl.endsWith('.webm')) ? (
                  <video
                    src={details.dressCodeImageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={details.dressCodeImageUrl || '/src/assets/images/dresscode_old_money_collage_1794251480085.jpg'}
                    alt="Dresscode Moodboard Old Money Style mit Hochzeitsfarben"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                )}
                
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-mood-wine shadow-xs border border-stone-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-mood-wine animate-pulse" />
                  <span>Style-Inspiration · Old Money</span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-white/95 text-stone-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                    🔍 Mood-Collage vergrößern
                  </span>
                </div>
              </div>

              {/* Right Column: Dresscode Details & Swatches */}
              <div className="lg:col-span-6 p-7 sm:p-9 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block">
                      Garderobe & Farben
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDresscodeZoom(true)}
                      className="text-[11px] font-semibold text-mood-wine hover:underline cursor-pointer"
                    >
                      Collage vergrößern ↗
                    </button>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-stone-900 mb-2">
                    {details.dressCode}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mb-6">
                    {details.dressCodeNote || 'Wir freuen uns auf festliche Garderobe im sommerlichen "Old Money"-Stil, harmonisch abgestimmt auf unsere Hochzeitsfarben.'}
                  </p>

                  {/* Moodboard Color Swatches */}
                  <div className="space-y-2 mb-6 bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-700">
                        Unsere definierte Farbpalette:
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">5 Akzenttöne</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-1">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#6F0E21] border-2 border-white shadow-xs ring-1 ring-stone-200" title="#6F0E21" />
                        <span className="text-[10px] text-stone-800 font-semibold">Bordeaux</span>
                        <span className="text-[9px] text-stone-500 font-mono">#6F0E21</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#726C32] border-2 border-white shadow-xs ring-1 ring-stone-200" title="#726C32" />
                        <span className="text-[10px] text-stone-800 font-semibold">Oliv</span>
                        <span className="text-[9px] text-stone-500 font-mono">#726C32</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#C7BC86] border-2 border-white shadow-xs ring-1 ring-stone-200" title="#C7BC86" />
                        <span className="text-[10px] text-stone-800 font-semibold">Gold</span>
                        <span className="text-[9px] text-stone-500 font-mono">#C7BC86</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#FAD7D5] border-2 border-white shadow-xs ring-1 ring-stone-200" title="#FAD7D5" />
                        <span className="text-[10px] text-stone-800 font-semibold">Blush</span>
                        <span className="text-[9px] text-stone-500 font-mono">#FAD7D5</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#83563F] border-2 border-white shadow-xs ring-1 ring-stone-200" title="#83563F" />
                        <span className="text-[10px] text-stone-800 font-semibold">Kastanie</span>
                        <span className="text-[9px] text-stone-500 font-mono">#83563F</span>
                      </div>
                    </div>
                  </div>

                  {/* Attire Bullet points for Damen & Herren */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-stone-100 pt-4">
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                      <span className="font-semibold text-mood-wine block mb-1">Für die Damen</span>
                      <p className="text-stone-600 font-light leading-relaxed">
                        Fließende Seiden- oder Satinkleider, elegante Midis oder Hosenanzüge in zartem Blush, warmem Champagner oder Oliv.
                      </p>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                      <span className="font-semibold text-mood-wine block mb-1">Für die Herren</span>
                      <p className="text-stone-600 font-light leading-relaxed">
                        Sommerliche Leinen- oder Feintuch-Anzüge in Sand, Olive oder Navy, bordeauxfarbene Einstecktücher & edle Loafer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unplugged Note */}
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-light flex items-center justify-between">
                  <span><strong>Unplugged Zeremonie:</strong> Handys bitte stumm in den Taschen lassen.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fullscreen Zoom Modal for Dresscode Collage */}
          {showDresscodeZoom && (
            <div 
              className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn"
              onClick={() => setShowDresscodeZoom(false)}
            >
              <div 
                className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 px-2 border-b border-stone-100">
                  <div>
                    <h4 className="text-base font-serif-wedding font-semibold text-stone-900">
                      Old Money Dresscode & Hochzeitsfarben Mood-Collage
                    </h4>
                    <p className="text-xs text-stone-500">
                      Thomas & Katharina · Schloss Ottersbach · 18.08.2028
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDresscodeZoom(false)}
                    className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                  >
                    ✕ Schließen
                  </button>
                </div>

                <div className="mt-3 overflow-auto max-h-[75vh] rounded-2xl">
                  <img
                    src={details.dressCodeImageUrl || '/src/assets/images/dresscode_old_money_collage_1794251480085.jpg'}
                    alt="Old Money Moodboard Collage Grossansicht"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
