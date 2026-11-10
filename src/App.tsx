import React, { useState } from 'react';
import {
  WeddingDetails,
  ItineraryItem,
  MapPin,
  MenuItem,
  GalleryPhoto,
} from './types/wedding.ts';
import {
  getWeddingDetails,
  getItinerary,
  getMapPins,
  getMenuItems,
  getGalleryPhotos,
} from './services/weddingStorage.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { StoryAndSchedule } from './components/StoryAndSchedule.tsx';
import { DiningMenuSection } from './components/DiningMenuSection.tsx';
import { PhotoGallerySection } from './components/PhotoGallerySection.tsx';
import { InteractiveVenueMap } from './components/InteractiveVenueMap.tsx';
import { GuestbookSection } from './components/GuestbookSection.tsx';
import { Footer } from './components/Footer.tsx';
import { RSVPModal } from './components/RSVPModal.tsx';
import { AdminPortalModal } from './components/AdminPortalModal.tsx';

export default function App() {
  const [details, setDetails] = useState<WeddingDetails>(getWeddingDetails());
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(getItinerary());
  const [pins, setPins] = useState<MapPin[]>(getMapPins());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItems());
  const [photos, setPhotos] = useState<GalleryPhoto[]>(getGalleryPhotos());

  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const handleDataChanged = () => {
    setDataRefreshKey((prev) => prev + 1);
  };

  const handleDetailsUpdated = (newDetails: WeddingDetails) => {
    setDetails(newDetails);
    setDataRefreshKey((prev) => prev + 1);
  };

  const handleItineraryUpdated = (newItinerary: ItineraryItem[]) => {
    setItinerary(newItinerary);
  };

  const handlePinsUpdated = (newPins: MapPin[]) => {
    setPins(newPins);
  };

  const handleMenuUpdated = (newMenu: MenuItem[]) => {
    setMenuItems(newMenu);
  };

  const handlePhotosUpdated = (newPhotos: GalleryPhoto[]) => {
    setPhotos(newPhotos);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#FAD7D5] selection:text-mood-wine">
      {/* 3-Zone Navigation mit Thomas & Katharina */}
      <Navbar
        details={details}
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hauptinhalt */}
      <main className="flex-1">
        {/* Hero Section mit Live-Countdown zum 18.08.2028 und .ics Kalender-Export */}
        <HeroSection
          details={details}
          onOpenRSVP={() => setIsRSVPOpen(true)}
        />

        {/* Unsere Geschichte & Ablaufplan */}
        <StoryAndSchedule
          details={details}
          itinerary={itinerary}
        />

        {/* Festliches Hochzeitsmenü & Weine */}
        <DiningMenuSection
          menuItems={menuItems}
          onOpenRSVP={() => setIsRSVPOpen(true)}
        />

        {/* Fotogalerie mit Lightbox & Gäste-Upload */}
        <PhotoGallerySection
          photos={photos}
          onPhotosUpdated={handleDataChanged}
        />

        {/* Interaktive Karte mit Schlossgut Hohenstein & Übernachtungen */}
        <InteractiveVenueMap
          details={details}
          pins={pins}
        />

        {/* Hochzeits-Gästebuch mit Toast-Reaktionen */}
        <GuestbookSection
          key={`guestbook-${dataRefreshKey}`}
          onMessageSubmitted={handleDataChanged}
        />
      </main>

      {/* Footer */}
      <Footer
        details={details}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRSVP={() => setIsRSVPOpen(true)}
      />

      {/* RSVP Rückmeldungs-Modal */}
      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
        details={details}
        onRSVPSubmitted={handleDataChanged}
      />

      {/* Brautpaar- & Planungs-Portal (Ablaufplan, Location, Speisekarte, Bilder & RSVPs bearbeiten) */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        details={details}
        itinerary={itinerary}
        pins={pins}
        menuItems={menuItems}
        photos={photos}
        onDetailsUpdated={handleDetailsUpdated}
        onItineraryUpdated={handleItineraryUpdated}
        onPinsUpdated={handlePinsUpdated}
        onMenuUpdated={handleMenuUpdated}
        onPhotosUpdated={handlePhotosUpdated}
        onDataChanged={handleDataChanged}
      />
    </div>
  );
}
