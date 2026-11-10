import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowDown } from 'lucide-react';
import { WeddingDetails } from '../types/wedding.ts';

interface HeroSectionProps {
  details: WeddingDetails;
  onOpenRSVP: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ details, onOpenRSVP }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = details.targetTimestamp - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [details.targetTimestamp]);

  // Generate German iCalendar (.ics) file
  const downloadCalendarFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Thomas und Katharina Hochzeit//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Hochzeit von ${details.groomName} & ${details.brideName}`,
      `DESCRIPTION:Wir feiern die Hochzeit von ${details.groomName} und ${details.brideName} auf ${details.venueName}.`,
      `LOCATION:${details.venueAddress}`,
      'DTSTART:20280818T123000Z', // 14:30 CEST is 12:30 UTC
      'DTEND:20280819T030000Z',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Thomas-und-Katharina-Hochzeit.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVideo = details.heroMediaType === 'video' || (details.heroMediaUrl && details.heroMediaUrl.endsWith('.mp4'));
  const mediaUrl = details.heroMediaUrl || '/src/assets/images/Brautpaar.jpg';

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-stone-900 text-stone-100">
      {/* Background Hero Media with Thomas & Katharina (Image or MP4 Video) */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center filter brightness-85"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Thomas und Katharina"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90"
          />
        )}
        {/* Scrim with Wine and Earth tints */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a060d]/90 via-[#2a060d]/45 to-[#1c1809]/30" />
      </div>

      {/* Top spacing */}
      <div className="relative z-10 pt-16 sm:pt-20" />

      {/* Centerpiece Headline */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#FAD7D5] mb-4 sm:mb-6">
          Wir heiraten und laden euch herzlich ein
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-wedding font-normal tracking-tight text-white mb-6 drop-shadow-md leading-none">
          {details.groomName} <span className="font-serif italic font-light text-[#C7BC86]">&</span> {details.brideName}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm sm:text-base text-stone-200 font-light mb-10">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#C7BC86]" />
            {details.date}
          </span>
          <span aria-hidden="true" className="text-stone-400">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#C7BC86]" />
            {details.time}
          </span>
          <span aria-hidden="true" className="text-stone-400">·</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#C7BC86]" />
            {details.cityState}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onOpenRSVP}
            className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-mood-wine hover:bg-mood-wine/90 transition-all rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer border border-[#C7BC86]/50"
          >
            Zur Rückmeldung (RSVP)
          </button>

          <button
            onClick={downloadCalendarFile}
            className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-medium tracking-wide text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 transition-all rounded-full flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#C7BC86]" />
            Termin im Kalender speichern (.ics)
          </button>
        </div>
      </div>

      {/* Countdown Strip */}
      <div className="relative z-10 border-t border-[#C7BC86]/30 bg-[#2a060d]/80 backdrop-blur-md py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-[#FAD7D5] font-semibold">Countdown bis zur Hochzeit</p>
            <p className="text-sm text-stone-200 font-light">Wir freuen uns auf den 18. August 2028 mit euch</p>
          </div>

          {/* Numbers */}
          <div className="flex items-center gap-3 sm:gap-6 text-center">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-white tabular-nums">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C7BC86]">Tage</span>
            </div>
            <span className="text-[#C7BC86] font-serif text-lg">:</span>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-white tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C7BC86]">Stunden</span>
            </div>
            <span className="text-[#C7BC86] font-serif text-lg">:</span>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-white tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C7BC86]">Minuten</span>
            </div>
            <span className="text-[#C7BC86] font-serif text-lg">:</span>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif-wedding font-semibold text-white tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C7BC86]">Sekunden</span>
            </div>
          </div>

          <a
            href="#story"
            className="hidden md:flex items-center gap-2 text-xs text-stone-300 hover:text-white transition-colors"
          >
            <span>Mehr erfahren</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#C7BC86] animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
