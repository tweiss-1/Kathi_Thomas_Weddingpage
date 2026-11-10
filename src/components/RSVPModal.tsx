import React, { useState } from 'react';
import { X, CheckCircle2, Utensils, Music, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingDetails, RSVPRecord } from '../types/wedding.ts';
import { saveRSVP } from '../services/weddingStorage.ts';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: WeddingDetails;
  onRSVPSubmitted: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  isOpen,
  onClose,
  details,
  onRSVPSubmitted,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [primaryMeal, setPrimaryMeal] = useState('Zartes Weiderind-Filet');
  const [plusOneMeal, setPlusOneMeal] = useState('Kross gebratenes Zanderfilet');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [dietaryDetails, setDietaryDetails] = useState('');
  const [attendingWelcomeDinner, setAttendingWelcomeDinner] = useState(true);
  const [attendingSundayBrunch, setAttendingSundayBrunch] = useState(true);
  const [songRequest, setSongRequest] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RSVPRecord | null>(null);

  // Easter Egg: Absage-Button springt weg, erst nach dem 5. Mal klickbar
  const [declineAttempts, setDeclineAttempts] = useState(0);
  const [buttonOffset, setButtonOffset] = useState<{ x: number; y: number; rotate: number }>({
    x: 0,
    y: 0,
    rotate: 0,
  });
  const [showDeclineHint, setShowDeclineHint] = useState(false);

  const DECLINE_MESSAGES = [
    'Bist du dir wirklich ganz sicher? 🤔 Katharina & Thomas werden dich vermissen!',
    'Aber auf Schloss Ottersbach gibt es so guten steirischen Wein! 🍷',
    'Wer soll denn sonst mit uns die Schlosstanzfläche rocken?! 💃🕺',
    'Vorletzte Chance, es dir anders zu überlegen und doch mitzufeiern... 🥺❤️',
    'Na gut, du hast es 5 Mal versucht... Wenn es wirklich sein muss! 😅',
  ];

  const triggerDeclineDodge = () => {
    if (status === 'declined') return;

    if (declineAttempts < 4) {
      const nextAttempt = declineAttempts + 1;
      setDeclineAttempts(nextAttempt);
      setShowDeclineHint(true);

      const xOffsets = [35, -40, 38, -32];
      const yOffsets = [-20, 22, 16, -18];
      const rots = [6, -8, 7, -5];
      const idx = (nextAttempt - 1) % 4;

      setButtonOffset({
        x: xOffsets[idx],
        y: yOffsets[idx],
        rotate: rots[idx],
      });
    } else if (declineAttempts === 4) {
      setDeclineAttempts(5);
      setShowDeclineHint(true);
      setButtonOffset({ x: 0, y: 0, rotate: 0 });
    }
  };

  const handleDeclineClick = (e: React.MouseEvent) => {
    if (status === 'declined') return;

    if (declineAttempts < 5) {
      e.preventDefault();
      e.stopPropagation();
      triggerDeclineDodge();
    } else {
      setStatus('declined');
      setButtonOffset({ x: 0, y: 0, rotate: 0 });
    }
  };

  if (!isOpen) return null;

  const mealOptions = [
    { id: 'Zartes Weiderind-Filet', label: 'Zartes Weiderind-Filet (Trüffel-Püree, Spätburgunder-Jus, GF)' },
    { id: 'Kross gebratenes Zanderfilet', label: 'Kross gebratenes Zanderfilet (Safran-Risotto, Beurre Blanc, GF)' },
    { id: 'Steinpilz- & Pfifferling-Risotto', label: 'Steinpilz- & Pfifferling-Risotto (Cashew-Parmesan, Vegan & GF)' },
  ];

  const dietaryOptions = [
    'Vegetarisch',
    'Vegan',
    'Glutenfrei',
    'Laktosefrei',
    'Nussallergie',
    'Kein Schweinefleisch',
  ];

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const guestCount = status === 'attending' ? (hasPlusOne ? 2 : 1) : 1;

    const record = saveRSVP({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      guestCount,
      plusOneName: hasPlusOne ? plusOneName.trim() : undefined,
      primaryMeal: status === 'attending' ? primaryMeal : 'Keine',
      plusOneMeal: status === 'attending' && hasPlusOne ? plusOneMeal : undefined,
      dietaryRestrictions: status === 'attending' ? selectedDietary : [],
      dietaryDetails: status === 'attending' ? dietaryDetails.trim() : undefined,
      attendingWelcomeDinner: status === 'attending' ? attendingWelcomeDinner : false,
      attendingSundayBrunch: status === 'attending' ? attendingSundayBrunch : false,
      songRequest: songRequest.trim() || undefined,
      personalNote: personalNote.trim() || undefined,
      confirmed: status === 'attending',
    });

    setSubmittedRecord(record);
    setIsSuccess(true);

    if (status === 'attending') {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6F0E21', '#726C32', '#C7BC86', '#FAD7D5', '#83563F'],
      });
    }

    onRSVPSubmitted();
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setSubmittedRecord(null);
    setDeclineAttempts(0);
    setButtonOffset({ x: 0, y: 0, rotate: 0 });
    setShowDeclineHint(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-6 sm:p-10 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="RSVP Formular schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess && submittedRecord ? (
          <div className="text-center py-6 space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-mood-blush/40 text-mood-wine flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-mood-wine font-semibold block mb-2">
                Rückmeldung gespeichert
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-stone-900">
                {submittedRecord.status === 'attending'
                  ? 'Wir freuen uns riesig auf euch!'
                  : 'Schade, dass es nicht klappt'}
              </h3>
              <p className="text-sm text-stone-600 font-light mt-2 max-w-md mx-auto">
                {submittedRecord.status === 'attending'
                  ? `Vielen Dank, ${submittedRecord.fullName}! Deine Rückmeldung wurde erfolgreich in unserer Gästeliste erfasst.`
                  : `Vielen Dank für deine Rückmeldung, ${submittedRecord.fullName}. Wir stoßen in Gedanken auf dich an.`}
              </p>
            </div>

            {submittedRecord.status === 'attending' && (
              <div className="bg-[#FAF8F5] rounded-2xl p-6 text-left border border-stone-200 text-xs sm:text-sm space-y-3">
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Personenanzahl:</span>
                  <span className="font-semibold text-stone-900">
                    {submittedRecord.guestCount} {submittedRecord.guestCount > 1 ? 'Personen' : 'Person'}
                  </span>
                </div>
                {submittedRecord.plusOneName && (
                  <div className="flex justify-between pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Begleitung:</span>
                    <span className="font-semibold text-stone-900">{submittedRecord.plusOneName}</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Hauptgang Gast:</span>
                  <span className="font-semibold text-stone-900">{submittedRecord.primaryMeal}</span>
                </div>
                {submittedRecord.plusOneMeal && (
                  <div className="flex justify-between pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Hauptgang Begleitung:</span>
                    <span className="font-semibold text-stone-900">{submittedRecord.plusOneMeal}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Teilnahme Events:</span>
                  <span className="font-semibold text-stone-900 text-right">
                    Trauung & Feier
                    {submittedRecord.attendingWelcomeDinner ? ', Vorabend-Empfang' : ''}
                    {submittedRecord.attendingSundayBrunch ? ', Sonntagsbrunch' : ''}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-full transition-colors cursor-pointer shadow-xs"
            >
              Fertig & Zurück zur Website
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-1">
                Rückmeldung erbeten bis {details.rsvpDeadline}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-stone-900">
                Hochzeit Thomas & Katharina
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                Bitte füllt das Formular pro Haushalt bzw. Paar aus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Zusage / Absage Buttons */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Seid ihr dabei? *
                </label>
                <div className="grid grid-cols-2 gap-3 relative py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('attending');
                      setDeclineAttempts(0);
                      setButtonOffset({ x: 0, y: 0, rotate: 0 });
                      setShowDeclineHint(false);
                    }}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                      status === 'attending'
                        ? 'bg-mood-wine text-white border-mood-wine shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-mood-champagne'
                    }`}
                  >
                    <span>Ich sage mit Freude zu</span>
                  </button>

                  {/* Playful Jumping Decline Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={triggerDeclineDodge}
                      onClick={handleDeclineClick}
                      style={{
                        transform:
                          status === 'declined'
                            ? 'none'
                            : `translate(${buttonOffset.x}px, ${buttonOffset.y}px) rotate(${buttonOffset.rotate}deg)`,
                        transition: 'transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s',
                      }}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 border select-none ${
                        status === 'declined'
                          ? 'bg-mood-wine text-white border-mood-wine shadow-xs'
                          : declineAttempts >= 5
                          ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400 font-bold'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-mood-champagne shadow-xs'
                      }`}
                    >
                      <span>
                        {status === 'declined'
                          ? 'Ich muss leider absagen'
                          : declineAttempts >= 5
                          ? '🔓 Ich muss leider absagen (Jetzt klickbar!)'
                          : declineAttempts > 0
                          ? `🏃💨 Absagen (${declineAttempts}/5 Versuche)`
                          : 'Ich muss leider absagen'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Humorous Easter Egg Message & Progress */}
                {showDeclineHint && status !== 'declined' && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50/95 border border-amber-200 text-center animate-in fade-in slide-in-from-top-1 duration-200 shadow-xs">
                    <div className="text-xs font-semibold text-amber-950 flex items-center justify-center gap-1.5">
                      <span>{declineAttempts >= 5 ? '😅' : '🕊️'}</span>
                      <span>
                        {declineAttempts >= 5
                          ? 'Respekt für deine Hartnäckigkeit! Du kannst den Button jetzt anklicken.'
                          : DECLINE_MESSAGES[declineAttempts - 1] || 'Der Button weicht dir aus!'}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <span
                          key={step}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            step <= declineAttempts ? 'w-6 bg-amber-600' : 'w-2.5 bg-amber-200'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-amber-900 font-mono ml-2 font-bold">
                        {declineAttempts}/5 Versuche
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Name & Kontakt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Vollständiger Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="z.B. Maximilian Weber"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    E-Mail-Adresse *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="z.B. max@beispiel.de"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="z.B. 0171 1234567"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                  />
                </div>
              </div>

              {status === 'attending' && (
                <>
                  {/* Plus-One Toggle */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPlusOne}
                        onChange={(e) => setHasPlusOne(e.target.checked)}
                        className="w-4 h-4 text-mood-wine rounded border-stone-300 focus:ring-mood-wine"
                      />
                      <span className="text-xs sm:text-sm font-medium text-stone-800">
                        Ich komme mit Partner/in oder Begleitung (2 Personen)
                      </span>
                    </label>

                    {hasPlusOne && (
                      <div className="mt-3 pl-7">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                          Name der Begleitung *
                        </label>
                        <input
                          type="text"
                          required={hasPlusOne}
                          value={plusOneName}
                          onChange={(e) => setPlusOneName(e.target.value)}
                          placeholder="z.B. Laura Weber"
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                        />
                      </div>
                    )}
                  </div>

                  {/* Meal Choices */}
                  <div className="space-y-4 pt-2 border-t border-stone-100">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-mood-wine" />
                        <span>Hauptgang-Wahl für {fullName || 'Dich'} *</span>
                      </label>
                      <select
                        value={primaryMeal}
                        onChange={(e) => setPrimaryMeal(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 bg-stone-50/50"
                      >
                        {mealOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {hasPlusOne && (
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-mood-wine" />
                          <span>Hauptgang-Wahl für {plusOneName || 'Deine Begleitung'} *</span>
                        </label>
                        <select
                          value={plusOneMeal}
                          onChange={(e) => setPlusOneMeal(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 bg-stone-50/50"
                        >
                          {mealOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Dietary Restrictions */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Unverträglichkeiten & Allergien
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {dietaryOptions.map((diet) => {
                        const checked = selectedDietary.includes(diet);
                        return (
                          <button
                            key={diet}
                            type="button"
                            onClick={() => toggleDietary(diet)}
                            className={`px-3 py-1.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                              checked
                                ? 'bg-mood-blush/40 border-mood-wine text-mood-wine font-semibold'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {checked ? '✓ ' : ''}{diet}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={dietaryDetails}
                      onChange={(e) => setDietaryDetails(e.target.value)}
                      placeholder="Genauere Angaben für die Küche (z.B. Zöliakie, Erdnussallergie)"
                      className="w-full px-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 mt-2"
                    />
                  </div>

                  {/* Weekend Events */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Zusätzliche Events am Wochenende
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={attendingWelcomeDinner}
                          onChange={(e) => setAttendingWelcomeDinner(e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-mood-wine rounded border-stone-300"
                        />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">
                            Donnerstag Vorabend-Sektempfang (17. August · 18:00 Uhr)
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Terrasse am Schlossgut Hohenstein · Kleiner Imbiss & Kennenlernen
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={attendingSundayBrunch}
                          onChange={(e) => setAttendingSundayBrunch(e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-mood-wine rounded border-stone-300"
                        />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">
                            Sonntagsbrunch & Verabschiedung (20. August · ab 10:30 Uhr)
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Gutsterrasse Hohenstein · Frischer Kaffee, Croissants & Mimosa
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Song Request */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-mood-wine" />
                      <span>Musikwunsch für den DJ / Party</span>
                    </label>
                    <input
                      type="text"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      placeholder="z.B. Seeed - Ding oder Earth Wind & Fire - September"
                      className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                    />
                  </div>
                </>
              )}

              {/* Personal Note */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Persönliche Nachricht an Thomas & Katharina
                </label>
                <textarea
                  rows={2}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder={
                    status === 'attending'
                      ? 'Teilt eure Vorfreude oder Glückwünsche...'
                      : 'Hinterlasst uns eine liebe Nachricht...'
                  }
                  className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-full transition-all shadow-xs cursor-pointer"
                >
                  Rückmeldung absenden
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
