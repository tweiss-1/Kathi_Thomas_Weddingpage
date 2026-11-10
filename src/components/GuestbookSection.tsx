import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestbookMessage } from '../types/wedding.ts';
import {
  getGuestbookMessages,
  addGuestbookMessage,
  reactToGuestbookMessage,
} from '../services/weddingStorage.ts';

interface GuestbookSectionProps {
  onMessageSubmitted?: () => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ onMessageSubmitted }) => {
  const [messages, setMessages] = useState<GuestbookMessage[]>(getGuestbookMessages());
  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !messageText.trim()) return;

    setIsSubmitting(true);

    const newMsg = addGuestbookMessage(author, relationship, messageText);
    setMessages([newMsg, ...messages]);

    // Celebratory micro-confetti in moodboard colors
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6F0E21', '#726C32', '#C7BC86', '#FAD7D5', '#83563F'],
    });

    setAuthor('');
    setRelationship('');
    setMessageText('');
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 5000);

    if (onMessageSubmitted) onMessageSubmitted();
  };

  const handleReact = (id: string, type: 'hearts' | 'champagne') => {
    const updated = reactToGuestbookMessage(id, type);
    setMessages(updated);
  };

  const relationshipSuggestions = [
    'Trauzeuge / Trauzeugin',
    'Familie der Braut',
    'Familie des Bräutigams',
    'Schulfreund / Studienfreund',
    'Arbeitskollege / Arbeitskollegin',
    'Hochzeitsgast',
  ];

  return (
    <section id="guestbook" className="scroll-mt-24 py-20 lg:py-28 bg-[#FAF8F5] border-t border-[#C7BC86]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-3">
            Wünsche & Erinnerungen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-wedding font-normal tracking-tight text-stone-900">
            Das Hochzeits-Gästebuch
          </h2>
          <div className="w-16 h-0.5 bg-mood-champagne mx-auto mt-4 mb-6" />
          <p className="text-stone-700 text-base sm:text-lg font-light leading-relaxed">
            Hinterlasst uns ein paar liebe Worte, weise Ratschläge für die Ehe oder eure liebste Erinnerung mit uns. Eure Einträge werden als ewiges Andenken in unser Hochzeitsbuch gebunden.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form: Eintrag hinterlassen */}
          <div className="lg:col-span-5 bg-white p-7 sm:p-9 rounded-3xl border border-stone-200/90 shadow-sm sticky top-28">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-mood-wine" />
              <h3 className="text-xl font-serif-wedding font-semibold text-stone-900">
                Gästebuch-Eintrag verfassen
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-light mb-6">
              Teilt eure Glückwünsche oder einen Toast mit Thomas & Katharina.
            </p>

            {submittedSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vielen Dank! Eure Nachricht wurde erfolgreich in unser Gästebuch eingetragen.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Euer Name / Eure Namen *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="z.B. Jonas & Laura"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Beziehung zum Brautpaar
                </label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="z.B. Trauzeugin von Katharina"
                  list="relationship-options"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 bg-stone-50/50"
                />
                <datalist id="relationship-options">
                  {relationshipSuggestions.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Eure Glückwünsche oder Anekdote *
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Schreibt eure lieben Worte, Ratschläge für die Zukunft oder eine gemeinsame Erinnerung hier..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40 bg-stone-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#FAD7D5]" />
                <span>Eintrag veröffentlichen</span>
              </button>
            </form>
          </div>

          {/* Right Message Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
                Wünsche unserer Gäste ({messages.length})
              </span>
              <span className="text-xs text-stone-400">Tippt auf ❤️ oder 🥂 zum Anstoßen</span>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                  <p className="text-stone-500 text-sm">Seid die Ersten, die sich im Gästebuch verewigen!</p>
                </div>
              ) : (
                messages.map((item) => {
                  const initials = item.author
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('');

                  return (
                    <div
                      key={item.id}
                      className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs hover:border-[#C7BC86] transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Author Info */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold uppercase ${item.avatarColor}`}
                            >
                              {initials}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                                {item.author}
                              </h4>
                              <div className="text-xs text-stone-500 font-light flex items-center gap-1.5">
                                <span>{item.relationship}</span>
                                <span aria-hidden="true">·</span>
                                <span>{item.createdAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Prose */}
                        <p className="text-sm text-stone-700 font-light leading-relaxed mb-4">
                          „{item.message}“
                        </p>
                      </div>

                      {/* Reactions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                        <button
                          onClick={() => handleReact(item.id, 'hearts')}
                          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-stone-50 hover:bg-mood-blush/40 hover:text-mood-wine text-stone-600 transition-colors border border-stone-200 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 text-mood-wine fill-mood-wine" />
                          <span className="tabular-nums">{item.reactions.hearts}</span>
                        </button>

                        <button
                          onClick={() => handleReact(item.id, 'champagne')}
                          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-stone-50 hover:bg-[#C7BC86]/20 hover:text-amber-900 text-stone-600 transition-colors border border-stone-200 cursor-pointer"
                        >
                          <span>🥂</span>
                          <span className="tabular-nums">{item.reactions.champagne}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
