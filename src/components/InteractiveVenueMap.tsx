import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin as MapPinIcon, Navigation, Car, Hotel, Coffee } from 'lucide-react';
import { WeddingDetails, MapPin } from '../types/wedding.ts';

interface InteractiveVenueMapProps {
  details: WeddingDetails;
  pins: MapPin[];
}

export const InteractiveVenueMap: React.FC<InteractiveVenueMapProps> = ({
  details,
  pins,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [selectedPinId, setSelectedPinId] = useState<string>(pins[0]?.id || 'pin-estate');

  useEffect(() => {
    if (!mapContainerRef.current || pins.length === 0) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const defaultCoords = details.venueCoordinates || [50.0261, 8.1189];
    const map = L.map(mapContainerRef.current, {
      center: defaultCoords,
      zoom: 14,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const createCustomIcon = (category: string, isSelected: boolean) => {
      let iconColor = '#ffffff';
      let bgColor = '#6F0E21'; // Wine
      let symbol = '💍';

      if (category === 'ceremony' || category === 'reception') {
        bgColor = '#6F0E21'; // Wine
        symbol = '💍';
      } else if (category === 'hotel') {
        bgColor = '#726C32'; // Olive
        symbol = '🏨';
      } else if (category === 'parking') {
        bgColor = '#83563F'; // Chestnut
        symbol = '🚗';
      } else if (category === 'brunch') {
        bgColor = '#C7BC86'; // Champagne Gold
        iconColor = '#6F0E21';
        symbol = '☕';
      }

      const ringClass = isSelected ? 'border-2 border-mood-wine ring-4 ring-[#FAD7D5]' : 'border-2 border-white shadow-md';

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="${ringClass}" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background-color: ${bgColor};
            color: ${iconColor};
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span>${symbol}</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
      });
    };

    const newMarkers: { [key: string]: L.Marker } = {};

    pins.forEach((pin) => {
      const marker = L.marker(pin.coordinates, {
        icon: createCustomIcon(pin.category, pin.id === selectedPinId),
        title: pin.title,
      }).addTo(map);

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${pin.title}, ${pin.address}`
      )}`;

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px; min-width: 220px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #6F0E21; font-weight: 700; margin-bottom: 2px;">
            ${pin.badge}
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #1c1917; margin-bottom: 4px;">
            ${pin.title}
          </div>
          <div style="font-size: 12px; color: #78716c; margin-bottom: 4px;">
            ${pin.address}
          </div>
          ${pin.time ? `<div style="font-size: 11px; color: #44403c; margin-bottom: 8px;"><strong>Zeit:</strong> ${pin.time}</div>` : ''}
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            color: #ffffff;
            background-color: #6F0E21;
            padding: 5px 10px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 4px;
          ">
            Route in Google Maps planen ↗
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-map-popup' });

      marker.on('click', () => {
        setSelectedPinId(pin.id);
      });

      newMarkers[pin.id] = marker;
    });

    markersRef.current = newMarkers;

    if (newMarkers[selectedPinId]) {
      newMarkers[selectedPinId].openPopup();
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [details.venueCoordinates, pins]);

  const handleSelectPin = (pin: MapPin) => {
    setSelectedPinId(pin.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(pin.coordinates, 15, { duration: 1.2 });
      if (markersRef.current[pin.id]) {
        markersRef.current[pin.id].openPopup();
      }
    }
  };

  const selectedPin = pins.find((p) => p.id === selectedPinId) || pins[0];
  const googleMapsDirectionsUrl = selectedPin
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPin.address)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(details.venueAddress)}`;

  const venueIsVideo = details.venueMediaType === 'video' || (details.venueMediaUrl && (details.venueMediaUrl.endsWith('.mp4') || details.venueMediaUrl.endsWith('.webm')));
  const venueMediaUrl = details.venueMediaUrl || '/src/assets/images/Schloss_Ottersbach.mp4';

  return (
    <section id="venue" className="scroll-mt-24 py-20 lg:py-28 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-mood-wine block mb-3">
            Anfahrt & Übernachtung
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-wedding font-normal tracking-tight text-stone-900">
            Location & Interaktive Karte
          </h2>
          <div className="w-16 h-0.5 bg-mood-champagne mx-auto mt-4 mb-6" />
          <p className="text-stone-700 text-base sm:text-lg font-light leading-relaxed">
            Eingebettet in die idyllischen Weinberge der Südsteiermark. Hier findet ihr alle wichtigen Punkte für Trauung, Feier, Parken und Hotels auf einen Blick.
          </p>
        </div>

        {/* Venue Estate Banner (Image or MP4 Video) */}
        <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm mb-12 h-64 sm:h-80 md:h-96 bg-stone-900">
          {venueIsVideo ? (
            <video
              src={venueMediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <img
              src={venueMediaUrl}
              alt={details.venueName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a060d]/90 via-[#2a060d]/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <span className="text-xs uppercase tracking-widest text-[#FAD7D5] font-semibold mb-1">
              {details.venueSubline}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif-wedding font-semibold">
              {details.venueName}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 font-light mt-1 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-[#C7BC86] shrink-0" />
              {details.venueAddress}
            </p>
          </div>
        </div>

        {/* Interactive Map & Selector Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Location List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
                Wichtige Orte der Hochzeit
              </span>
              <span className="text-xs text-stone-400">Klicken zum Fokussieren</span>
            </div>

            <div className="space-y-3">
              {pins.map((pin) => {
                const isSelected = pin.id === selectedPinId;
                return (
                  <div
                    key={pin.id}
                    onClick={() => handleSelectPin(pin)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-mood-blush/20 border-mood-wine shadow-xs ring-1 ring-mood-wine/30'
                        : 'bg-white border-stone-200 hover:border-mood-champagne hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-mood-wine">
                        {pin.badge}
                      </span>
                      {pin.time && (
                        <span className="text-[11px] text-stone-500 font-medium">
                          {pin.time.split('·')[0]}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-serif-wedding font-semibold text-stone-900 mb-1">
                      {pin.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-1 mb-2 font-light">
                      {pin.address}
                    </p>

                    <p className="text-xs text-stone-500 font-light line-clamp-2">
                      {pin.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold tracking-wider uppercase text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors shadow-xs"
              >
                <Navigation className="w-4 h-4 text-[#C7BC86]" />
                <span>Route in Google Maps öffnen ↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Leaflet Map */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-stone-100">
              <div
                ref={mapContainerRef}
                className="w-full h-[450px] sm:h-[530px]"
                style={{ minHeight: '450px' }}
              />

              <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full text-[11px] font-medium text-stone-700 shadow-xs border border-stone-200 pointer-events-none">
                Interaktive Karte · Zoomen & Verschieben
              </div>
            </div>

            {/* Travel Assistance Strip */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                  <Hotel className="w-4 h-4 text-mood-wine" />
                  <span>Zimmerkontingent</span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {details.hotelInfo || 'Zimmerkontingent unter "THOMAS-KATHARINA" im Partnerhotel reserviert.'}
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                  <Car className="w-4 h-4 text-mood-wine" />
                  <span>Shuttle & Parken</span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {details.shuttleInfo || 'Kostenlose Parkplätze vor Ort & Shuttle-Transfer ab Partnerhotel.'}
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs mb-1">
                  <Coffee className="w-4 h-4 text-mood-wine" />
                  <span>Sonntagsbrunch</span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {details.brunchInfo || 'Gemütlicher Abschiedsbrunch am Sonntag ab 10:30 Uhr.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
