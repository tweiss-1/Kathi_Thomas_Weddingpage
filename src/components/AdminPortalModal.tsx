import React, { useState } from 'react';
import {
  X,
  Lock,
  Download,
  Utensils,
  Search,
  Trash2,
  Sparkles,
  RefreshCw,
  MapPin as MapPinIcon,
  Calendar,
  Image as ImageIcon,
  Plus,
  Save,
  Video,
  Shirt,
  Play,
  Film,
} from 'lucide-react';
import {
  RSVPRecord,
  WeddingDetails,
  ItineraryItem,
  MapPin,
  MenuItem,
  GalleryPhoto,
} from '../types/wedding.ts';
import {
  getRSVPs,
  updateRSVP,
  deleteRSVP,
  calculateRSVPAnalytics,
  exportRSVPsToCSV,
  saveWeddingDetails,
  saveItinerary,
  saveMapPins,
  saveMenuItems,
  addGalleryPhoto,
  deleteGalleryPhoto,
  resetToSeedData,
} from '../services/weddingStorage.ts';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: WeddingDetails;
  itinerary: ItineraryItem[];
  pins: MapPin[];
  menuItems: MenuItem[];
  photos: GalleryPhoto[];
  onDetailsUpdated: (newDetails: WeddingDetails) => void;
  onItineraryUpdated: (newItinerary: ItineraryItem[]) => void;
  onPinsUpdated: (newPins: MapPin[]) => void;
  onMenuUpdated: (newMenu: MenuItem[]) => void;
  onPhotosUpdated: (newPhotos: GalleryPhoto[]) => void;
  onDataChanged: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  details,
  itinerary,
  pins,
  menuItems,
  photos,
  onDetailsUpdated,
  onItineraryUpdated,
  onPinsUpdated,
  onMenuUpdated,
  onPhotosUpdated,
  onDataChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'rsvps' | 'media' | 'dresscode' | 'location' | 'schedule' | 'menu' | 'photos' | 'settings'
  >('rsvps');

  // RSVP Management State
  const [rsvps, setRsvps] = useState<RSVPRecord[]>(getRSVPs());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'unassigned'>('all');

  // General Settings State
  const [brideName, setBrideName] = useState(details.brideName);
  const [groomName, setGroomName] = useState(details.groomName);
  const [date, setDate] = useState(details.date);
  const [time, setTime] = useState(details.time);
  const [dressCode, setDressCode] = useState(details.dressCode);
  const [rsvpDeadline, setRsvpDeadline] = useState(details.rsvpDeadline);

  // Video & Hero Media State
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>(details.heroMediaType || 'image');
  const [heroMediaUrl, setHeroMediaUrl] = useState(details.heroMediaUrl || '/src/assets/images/Brautpaar.jpg');
  const [venueMediaType, setVenueMediaType] = useState<'image' | 'video'>(details.venueMediaType || 'video');
  const [venueMediaUrl, setVenueMediaUrl] = useState(details.venueMediaUrl || '/src/assets/images/Schloss_Ottersbach.mp4');

  // Dresscode State
  const [dressCodeImageUrl, setDressCodeImageUrl] = useState(
    details.dressCodeImageUrl || '/src/assets/images/dresscode_old_money_collage_1794251480085.jpg'
  );
  const [dressCodeNote, setDressCodeNote] = useState(
    details.dressCodeNote ||
      'Wir freuen uns auf elegante Garderobe im "Old Money"-Stil, harmonisch abgestimmt auf unsere Hochzeitsfarben: Bordeaux (#6F0E21), Olivgrün (#726C32), Champagnergold (#C7BC86), zartes Puder-Blush (#FAD7D5) und warmes Kastanienbraun (#83563F).'
  );
  const [previewDresscodeZoom, setPreviewDresscodeZoom] = useState(false);

  // Location State
  const [venueName, setVenueName] = useState(details.venueName);
  const [venueSubline, setVenueSubline] = useState(details.venueSubline);
  const [venueAddress, setVenueAddress] = useState(details.venueAddress);
  const [cityState, setCityState] = useState(details.cityState);
  const [hotelInfo, setHotelInfo] = useState(details.hotelInfo || '');
  const [shuttleInfo, setShuttleInfo] = useState(details.shuttleInfo || '');
  const [brunchInfo, setBrunchInfo] = useState(details.brunchInfo || '');
  const [localPins, setLocalPins] = useState<MapPin[]>(pins);

  // Schedule State
  const [localItinerary, setLocalItinerary] = useState<ItineraryItem[]>(itinerary);
  const [newItinTime, setNewItinTime] = useState('');
  const [newItinTitle, setNewItinTitle] = useState('');
  const [newItinLocation, setNewItinLocation] = useState('');
  const [newItinDesc, setNewItinDesc] = useState('');

  // Menu State
  const [localMenu, setLocalMenu] = useState<MenuItem[]>(menuItems);

  // Photos & Video State
  const [localPhotos, setLocalPhotos] = useState<GalleryPhoto[]>(photos);
  const [newPhotoType, setNewPhotoType] = useState<'image' | 'video'>('image');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'brautpaar' | 'location' | 'trauung' | 'feier' | 'details'>('feier');

  // Success Feedback
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234' || pinInput.trim() === '2028') {
      setIsAuthenticated(true);
      setPinError(false);
      setRsvps(getRSVPs());
    } else {
      setPinError(true);
    }
  };

  const analytics = calculateRSVPAnalytics(rsvps);

  // RSVP actions
  const handleUpdateTableNumber = (id: string, tableNumber: string) => {
    const updated = updateRSVP(id, { tableNumber });
    setRsvps(updated);
    onDataChanged();
  };

  const handleDeleteRSVP = (id: string, name: string) => {
    if (window.confirm(`Möchtest du den RSVP-Eintrag für "${name}" wirklich löschen?`)) {
      const updated = deleteRSVP(id);
      setRsvps(updated);
      onDataChanged();
    }
  };

  // Media / Video Save
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails: WeddingDetails = {
      ...details,
      heroMediaType,
      heroMediaUrl,
      venueMediaType,
      venueMediaUrl,
    };
    saveWeddingDetails(updatedDetails);
    onDetailsUpdated(updatedDetails);
    showNotification('Hero- & Video-Einstellungen erfolgreich gespeichert!');
  };

  // Dresscode Save
  const handleSaveDresscode = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails: WeddingDetails = {
      ...details,
      dressCode,
      dressCodeImageUrl,
      dressCodeNote,
    };
    saveWeddingDetails(updatedDetails);
    onDetailsUpdated(updatedDetails);
    showNotification('Dresscode & Style-Guide erfolgreich aktualisiert!');
  };

  // Location Save
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails: WeddingDetails = {
      ...details,
      venueName,
      venueSubline,
      venueAddress,
      cityState,
      hotelInfo,
      shuttleInfo,
      brunchInfo,
    };
    saveWeddingDetails(updatedDetails);
    saveMapPins(localPins);
    onDetailsUpdated(updatedDetails);
    onPinsUpdated(localPins);
    showNotification('Location-Daten & Schloss Ottersbach erfolgreich gespeichert!');
  };

  // Itinerary Actions
  const handleAddItineraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItinTime.trim() || !newItinTitle.trim()) return;

    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      time: newItinTime.trim(),
      title: newItinTitle.trim(),
      location: newItinLocation.trim() || 'Schloss Ottersbach',
      description: newItinDesc.trim(),
    };

    const updated = [...localItinerary, newItem];
    setLocalItinerary(updated);
    saveItinerary(updated);
    onItineraryUpdated(updated);

    setNewItinTime('');
    setNewItinTitle('');
    setNewItinLocation('');
    setNewItinDesc('');
    showNotification('Neuer Programmpunkt hinzugefügt!');
  };

  const handleDeleteItineraryItem = (id: string) => {
    const updated = localItinerary.filter((item) => item.id !== id);
    setLocalItinerary(updated);
    saveItinerary(updated);
    onItineraryUpdated(updated);
    showNotification('Programmpunkt gelöscht.');
  };

  const handleUpdateItineraryField = (id: string, field: keyof ItineraryItem, val: string) => {
    const updated = localItinerary.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    setLocalItinerary(updated);
    saveItinerary(updated);
    onItineraryUpdated(updated);
  };

  // Photos & Video Actions
  const handleAddPhotoManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !newPhotoTitle.trim()) return;

    const isVid = newPhotoType === 'video' || newPhotoUrl.endsWith('.mp4') || newPhotoUrl.endsWith('.webm');

    const newPhoto: Omit<GalleryPhoto, 'id'> = {
      url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim(),
      caption: newPhotoCaption.trim(),
      category: newPhotoCategory,
      mediaType: isVid ? 'video' : 'image',
      aspectRatio: 'landscape',
    };

    const updated = addGalleryPhoto(newPhoto);
    setLocalPhotos(updated);
    onPhotosUpdated(updated);

    setNewPhotoUrl('');
    setNewPhotoTitle('');
    setNewPhotoCaption('');
    showNotification(`Neues ${isVid ? 'Video (MP4)' : 'Bild'} zur Galerie hinzugefügt!`);
  };

  const handleDeletePhoto = (id: string) => {
    const updated = deleteGalleryPhoto(id);
    setLocalPhotos(updated);
    onPhotosUpdated(updated);
    showNotification('Element entfernt.');
  };

  // General Settings Save
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails: WeddingDetails = {
      ...details,
      brideName,
      groomName,
      date,
      time,
      dressCode,
      rsvpDeadline,
    };
    saveWeddingDetails(updatedDetails);
    onDetailsUpdated(updatedDetails);
    showNotification('Brautpaar- & Hochzeitsdaten erfolgreich aktualisiert!');
  };

  const handleResetData = () => {
    if (window.confirm('Möchtest du alle Daten auf die Ausgangswerte zurücksetzen?')) {
      resetToSeedData();
      setRsvps(getRSVPs());
      onDataChanged();
      onClose();
    }
  };

  const filteredRsvps = rsvps.filter((r) => {
    const matchQuery =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.plusOneName && r.plusOneName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchQuery) return false;

    if (statusFilter === 'attending') return r.status === 'attending';
    if (statusFilter === 'declined') return r.status === 'declined';
    if (statusFilter === 'unassigned') return r.status === 'attending' && (!r.tableNumber || r.tableNumber.trim() === '');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full my-6 p-6 sm:p-8 shadow-2xl border border-stone-200 relative flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mood-wine text-[#FAD7D5] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif-wedding font-semibold text-stone-900">
                Brautpaar- & Planungs-Portal
              </h3>
              <p className="text-xs text-stone-500 font-light">
                Verwaltung für Thomas & Katharina: Videos (MP4), Dresscode, Location, Ablauf & RSVPs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Portal schließen"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Security Gate */}
        {!isAuthenticated ? (
          <div className="py-16 max-w-sm mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-mood-blush/40 text-mood-wine flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif-wedding font-semibold text-stone-900">
              Zugang für Thomas & Katharina
            </h4>
            <p className="text-xs text-stone-500 font-light">
              Standard-PIN für die Demo ist <strong className="font-mono text-mood-wine font-bold">1234</strong>
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="4-stellige PIN (1234)"
                className="w-full text-center text-lg tracking-widest font-mono py-2.5 px-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium">Falsche PIN. Bitte 1234 eingeben.</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors cursor-pointer"
              >
                Portal öffnen
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pt-4">
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5 shrink-0">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Antworten</span>
                <span className="text-2xl font-semibold font-serif-wedding text-stone-900 tabular-nums">
                  {analytics.totalResponses}
                </span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 block">Zusagen</span>
                <span className="text-2xl font-semibold font-serif-wedding text-emerald-950 tabular-nums">
                  {analytics.totalGuestsAttending}
                </span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                <span className="text-[10px] uppercase tracking-wider text-rose-800 block">Absagen</span>
                <span className="text-2xl font-semibold font-serif-wedding text-rose-950 tabular-nums">
                  {analytics.totalGuestsDeclined}
                </span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase tracking-wider text-amber-800 block">Vorabend</span>
                <span className="text-2xl font-semibold font-serif-wedding text-amber-950 tabular-nums">
                  {analytics.welcomeDinnerHeadcount}
                </span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase tracking-wider text-amber-800 block">Sonntagsbrunch</span>
                <span className="text-2xl font-semibold font-serif-wedding text-amber-950 tabular-nums">
                  {analytics.sundayBrunchHeadcount}
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Offene Tische</span>
                <span className="text-2xl font-semibold font-serif-wedding text-stone-900 tabular-nums">
                  {analytics.unassignedTableCount}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4 shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveTab('rsvps')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'rsvps'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  Gästeliste ({rsvps.length})
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'media'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Hero & Videos (MP4)</span>
                </button>

                <button
                  onClick={() => setActiveTab('dresscode')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'dresscode'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dresscode & Style</span>
                </button>

                <button
                  onClick={() => setActiveTab('location')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'location'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Location & Schloss</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'schedule'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ablaufplan</span>
                </button>

                <button
                  onClick={() => setActiveTab('menu')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'menu'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Menü</span>
                </button>

                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'photos'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Galerie & Medien</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-mood-wine text-white'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  Basisdaten
                </button>
              </div>

              {/* Action Buttons: CSV Export & Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportRSVPsToCSV(rsvps)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-mood-wine bg-mood-blush/40 hover:bg-mood-blush/60 rounded-lg transition-colors border border-mood-blush cursor-pointer"
                  title="CSV-Gästeliste für Catering herunterladen"
                >
                  <Download className="w-3.5 h-3.5 text-mood-wine" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleResetData}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                  title="Auf Ursprungsdaten zurücksetzen"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification alert */}
            {savedSuccessMsg && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium animate-in fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{savedSuccessMsg}</span>
              </div>
            )}

            {/* TAB 1: Gästeliste */}
            {activeTab === 'rsvps' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Gast oder E-Mail suchen..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-mood-wine/40"
                    />
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    {(['all', 'attending', 'declined', 'unassigned'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md capitalize cursor-pointer ${
                          statusFilter === filter
                            ? 'bg-stone-200 text-stone-900 font-semibold'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {filter === 'all'
                          ? 'Alle'
                          : filter === 'attending'
                          ? 'Zusagen'
                          : filter === 'declined'
                          ? 'Absagen'
                          : 'Ohne Tisch'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto border border-stone-200 rounded-xl bg-white shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-100/80 text-stone-600 uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Gast & Kontakt</th>
                        <th className="py-2.5 px-3 font-semibold">Status</th>
                        <th className="py-2.5 px-3 font-semibold">Personen</th>
                        <th className="py-2.5 px-3 font-semibold">Hauptgang</th>
                        <th className="py-2.5 px-3 font-semibold">Allergien</th>
                        <th className="py-2.5 px-3 font-semibold">Tisch</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredRsvps.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-stone-400">
                            Keine passenden Gäste gefunden.
                          </td>
                        </tr>
                      ) : (
                        filteredRsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-stone-50/60 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-stone-900">{rsvp.fullName}</div>
                              <div className="text-[11px] text-stone-500">{rsvp.email}</div>
                              {rsvp.phone && <div className="text-[10px] text-stone-400">{rsvp.phone}</div>}
                            </td>

                            <td className="py-2.5 px-3">
                              {rsvp.status === 'attending' ? (
                                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Zugesagt
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                  Abgesagt
                                </span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-stone-800">{rsvp.guestCount}</span>
                              {rsvp.plusOneName && (
                                <div className="text-[10px] text-stone-500">+{rsvp.plusOneName}</div>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              {rsvp.status === 'attending' ? (
                                <div>
                                  <div className="font-medium text-stone-800">{rsvp.primaryMeal}</div>
                                  {rsvp.plusOneMeal && (
                                    <div className="text-[10px] text-stone-500">
                                      Begl.: {rsvp.plusOneMeal}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-stone-400">—</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              {rsvp.dietaryRestrictions && rsvp.dietaryRestrictions.length > 0 ? (
                                <div className="text-[11px] text-amber-900 font-medium">
                                  {rsvp.dietaryRestrictions.join(', ')}
                                  {rsvp.dietaryDetails && (
                                    <div className="text-[10px] text-stone-500 italic">
                                      "{rsvp.dietaryDetails}"
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-stone-400">Keine</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3">
                              {rsvp.status === 'attending' ? (
                                <input
                                  type="text"
                                  value={rsvp.tableNumber || ''}
                                  placeholder="z.B. Tisch 1"
                                  onChange={(e) => handleUpdateTableNumber(rsvp.id, e.target.value)}
                                  className="w-24 px-2 py-1 text-xs border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-mood-wine"
                                />
                              ) : (
                                <span className="text-stone-400">—</span>
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleDeleteRSVP(rsvp.id, rsvp.fullName)}
                                className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Gast löschen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: HERO & MEDIEN (VIDEO/FOTO) */}
            {activeTab === 'media' && (
              <form onSubmit={handleSaveMedia} className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-mood-wine flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-600" />
                    <span>Videos (MP4) oder Bilder einbinden</span>
                  </div>
                  <p>
                    Ihr könnt hier festlegen, ob im Titelbereich (Hero) und im Schloss-Bereich ein Foto oder euer MP4-Video (z.B. <strong>Schloss_Ottersbach.mp4</strong>) in Dauerschleife abgespielt wird!
                  </p>
                </div>

                {/* Hero Media Selector */}
                <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">
                        1. Startseiten-Titelbereich (Hero Header)
                      </h4>
                      <p className="text-xs text-stone-500">
                        Hintergrund ganz oben auf der Startseite mit Countdown
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setHeroMediaType('image')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          heroMediaType === 'image' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroMediaType('video')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          heroMediaType === 'video' ? 'bg-white text-mood-wine shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        Video (MP4)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setHeroMediaType('image');
                        setHeroMediaUrl('/src/assets/images/Brautpaar.jpg');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium cursor-pointer"
                    >
                      📷 Brautpaar.jpg (Kuss auf den Stufen)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroMediaType('video');
                        setHeroMediaUrl('/src/assets/images/Schloss_Ottersbach.mp4');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 font-semibold cursor-pointer"
                    >
                      🎥 Schloss_Ottersbach.mp4 (Drohnenvideo)
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Pfad oder URL zum Hero-Medium:
                    </label>
                    <input
                      type="text"
                      value={heroMediaUrl}
                      onChange={(e) => {
                        setHeroMediaUrl(e.target.value);
                        if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                          setHeroMediaType('video');
                        }
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine font-mono"
                    />
                  </div>
                </div>

                {/* Venue Media Selector */}
                <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">
                        2. Schloss Ottersbach Location-Banner
                      </h4>
                      <p className="text-xs text-stone-500">
                        Großes Banner über der interaktiven Karte
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setVenueMediaType('image')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          venueMediaType === 'image' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setVenueMediaType('video')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          venueMediaType === 'video' ? 'bg-white text-mood-wine shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        Video (MP4)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setVenueMediaType('video');
                        setVenueMediaUrl('/src/assets/images/Schloss_Ottersbach.mp4');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 font-semibold cursor-pointer"
                    >
                      🎥 Schloss_Ottersbach.mp4 (Aktuell aktiv)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVenueMediaType('image');
                        setVenueMediaUrl('/src/assets/images/wedding_venue_estate_1794236152128.jpg');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium cursor-pointer"
                    >
                      📷 Schloss-Foto (Abendstimmung)
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Pfad oder URL zum Location-Medium:
                    </label>
                    <input
                      type="text"
                      value={venueMediaUrl}
                      onChange={(e) => {
                        setVenueMediaUrl(e.target.value);
                        if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                          setVenueMediaType('video');
                        }
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Medien-Einstellungen speichern</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: DRESSCODE & OLD MONEY STYLE */}
            {activeTab === 'dresscode' && (
              <form onSubmit={handleSaveDresscode} className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-2">
                  <div className="font-bold text-mood-wine flex items-center gap-1.5 text-sm">
                    <Shirt className="w-4 h-4 text-amber-700" />
                    <span>Dresscode & Style-Guide (Old Money Moodboard-Collage)</span>
                  </div>
                  <p>
                    Hier verwaltet ihr die Dresscode-Empfehlungen und die visuelle Moodboard-Collage für eure Gäste.
                    Wir haben für euch eine exklusive <strong>Old Money Fashion-Collage</strong> mit euren 5 Hochzeitsfarben erstellt!
                  </p>
                </div>

                {/* Preset Fast Selection */}
                <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                    Schnellauswahl Moodboard & Collage:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDressCodeImageUrl('/src/assets/images/dresscode_old_money_collage_1794251480085.jpg')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        dressCodeImageUrl.includes('dresscode_old_money_collage')
                          ? 'border-mood-wine bg-mood-wine/5 ring-1 ring-mood-wine text-stone-900 font-semibold'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold text-mood-wine">
                        <span>🌟</span>
                        <span>Old Money Farb-Collage</span>
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal leading-tight">
                        Mit euren 5 Hochzeitsfarben, Seidenkleidern, Leinenanzügen & Schloss-Vignetten
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDressCodeImageUrl('/src/assets/images/dresscode_old_money_1794250590684.jpg')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        dressCodeImageUrl.includes('dresscode_old_money_1794250590684')
                          ? 'border-mood-wine bg-mood-wine/5 ring-1 ring-mood-wine text-stone-900 font-semibold'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold text-stone-900">
                        <span>🏛️</span>
                        <span>Klassisches Schloss-Ensemble</span>
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal leading-tight">
                        Gäste im Schlosspark in festlicher Kleidung
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDressCodeImageUrl('/src/assets/images/Schloss_Ottersbach.mp4')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        dressCodeImageUrl.includes('Schloss_Ottersbach.mp4')
                          ? 'border-mood-wine bg-mood-wine/5 ring-1 ring-mood-wine text-stone-900 font-semibold'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-bold text-rose-700">
                        <span>🎥</span>
                        <span>Schloss-Video (MP4)</span>
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal leading-tight">
                        Loopendes Drohnenvideo von Schloss Ottersbach
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Titel des Dresscodes
                    </label>
                    <input
                      type="text"
                      value={dressCode}
                      onChange={(e) => setDressCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Bild- oder Video-Pfad / Datei hochladen
                    </label>
                    <input
                      type="text"
                      value={dressCodeImageUrl}
                      onChange={(e) => setDressCodeImageUrl(e.target.value)}
                      placeholder="/src/assets/images/dresscode_old_money_collage_1794251480085.jpg oder MP4-Video"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine font-mono"
                    />

                    {/* Local File Upload Option */}
                    <div className="flex items-center gap-2 pt-1">
                      <label className="px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Eigenes Bild oder MP4-Video vom PC wählen</span>
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setDressCodeImageUrl(event.target.result as string);
                                  showNotification('Neue Dresscode-Datei geladen!');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-stone-400">
                        Unterstützt JPG, PNG, WEBP und MP4
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Hinweistext & Farb-Empfehlungen für die Gäste
                    </label>
                    <textarea
                      rows={3}
                      value={dressCodeNote}
                      onChange={(e) => setDressCodeNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>
                </div>

                {/* Enhanced Live Preview Card */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Live-Vorschau der gewählten Mood-Collage:
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewDresscodeZoom(true)}
                      className="text-xs text-mood-wine hover:underline font-semibold cursor-pointer"
                    >
                      In voller Größe ansehen ↗
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-7 aspect-16/10 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative group">
                      {dressCodeImageUrl.endsWith('.mp4') || dressCodeImageUrl.endsWith('.webm') ? (
                        <video src={dressCodeImageUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      ) : (
                        <img src={dressCodeImageUrl} alt="Dresscode Vorschau" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {dressCodeImageUrl.endsWith('.mp4') ? 'Video (MP4)' : 'Old Money Collage'}
                      </div>
                    </div>

                    <div className="sm:col-span-5 space-y-2 text-xs">
                      <span className="font-semibold text-stone-800 block">Eingebettete Farbpalette:</span>
                      <div className="grid grid-cols-5 gap-1.5">
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-7 h-7 rounded-full bg-[#6F0E21] border border-stone-200 shadow-2xs" />
                          <span className="text-[9px] text-stone-600">Bordeaux</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-7 h-7 rounded-full bg-[#726C32] border border-stone-200 shadow-2xs" />
                          <span className="text-[9px] text-stone-600">Oliv</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-7 h-7 rounded-full bg-[#C7BC86] border border-stone-200 shadow-2xs" />
                          <span className="text-[9px] text-stone-600">Gold</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-7 h-7 rounded-full bg-[#FAD7D5] border border-stone-200 shadow-2xs" />
                          <span className="text-[9px] text-stone-600">Blush</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-7 h-7 rounded-full bg-[#83563F] border border-stone-200 shadow-2xs" />
                          <span className="text-[9px] text-stone-600">Kastanie</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 font-light leading-relaxed pt-1">
                        Diese Farben sind direkt in der Collage visualisiert und leiten die Gäste bei der Kleiderwahl.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lightbox for Admin Portal Preview */}
                {previewDresscodeZoom && (
                  <div
                    className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn"
                    onClick={() => setPreviewDresscodeZoom(false)}
                  >
                    <div
                      className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between pb-3 px-2 border-b border-stone-100">
                        <div>
                          <h4 className="text-base font-serif-wedding font-semibold text-stone-900">
                            Old Money Mood-Collage (Vollbildvorschau)
                          </h4>
                          <p className="text-xs text-stone-500">
                            Farbpalette: #6F0E21 · #726C32 · #C7BC86 · #FAD7D5 · #83563F
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewDresscodeZoom(false)}
                          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                        >
                          ✕ Schließen
                        </button>
                      </div>

                      <div className="mt-3 overflow-auto max-h-[75vh] rounded-2xl">
                        {dressCodeImageUrl.endsWith('.mp4') ? (
                          <video src={dressCodeImageUrl} controls autoPlay loop className="w-full h-auto rounded-xl" />
                        ) : (
                          <img src={dressCodeImageUrl} alt="Collage Grossansicht" className="w-full h-auto object-contain rounded-xl" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Dresscode & Mood-Collage speichern</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: Location & Schloss Ottersbach */}
            {activeTab === 'location' && (
              <form onSubmit={handleSaveLocation} className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700">
                  Hier könnt ihr den Namen der Location, Anschrift, Anfahrt, Zimmerkontingent und Shuttle-Zeiten bearbeiten.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Name der Location
                    </label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Untertitel / Art der Location
                    </label>
                    <input
                      type="text"
                      value={venueSubline}
                      onChange={(e) => setVenueSubline(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Vollständige Adresse (für Navigation & Karte)
                    </label>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Region / Bundesland
                    </label>
                    <input
                      type="text"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Hotel-Zimmerkontingent Hinweis
                    </label>
                    <input
                      type="text"
                      value={hotelInfo}
                      onChange={(e) => setHotelInfo(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Shuttle- & Parkhinweise
                    </label>
                    <input
                      type="text"
                      value={shuttleInfo}
                      onChange={(e) => setShuttleInfo(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Sonntagsbrunch Hinweis
                    </label>
                    <input
                      type="text"
                      value={brunchInfo}
                      onChange={(e) => setBrunchInfo(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Location-Daten speichern</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 5: Ablaufplan anpassen */}
            {activeTab === 'schedule' && (
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700">
                  Hier könnt ihr alle Programmpunkte eures Hochzeitstages anpassen, Zeiten ändern oder neue Abschnitte hinzufügen.
                </div>

                {/* New Item Form */}
                <form onSubmit={handleAddItineraryItem} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mood-wine">
                    <Plus className="w-4 h-4" />
                    <span>Neuen Programmpunkt hinzufügen</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Uhrzeit (z.B. 16:30 Uhr)"
                        value={newItinTime}
                        onChange={(e) => setNewItinTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Titel (z.B. Eröffnung der Tanzfläche)"
                        value={newItinTitle}
                        onChange={(e) => setNewItinTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Ort (z.B. Schlossterrasse)"
                        value={newItinLocation}
                        onChange={(e) => setNewItinLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                      />
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Beschreibung des Programmpunkts..."
                    value={newItinDesc}
                    onChange={(e) => setNewItinDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-mood-wine hover:bg-mood-wine/90 rounded-lg cursor-pointer"
                    >
                      Hinzufügen
                    </button>
                  </div>
                </form>

                {/* Existing Items */}
                <div className="space-y-3">
                  {localItinerary.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleUpdateItineraryField(item.id, 'time', e.target.value)}
                          className="px-2 py-1 text-xs font-bold text-mood-wine border border-stone-200 rounded"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItineraryField(item.id, 'title', e.target.value)}
                          className="px-2 py-1 text-xs font-semibold text-stone-900 border border-stone-200 rounded sm:col-span-2"
                        />
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => handleUpdateItineraryField(item.id, 'location', e.target.value)}
                          placeholder="Ort"
                          className="px-2 py-1 text-xs text-stone-600 border border-stone-200 rounded"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItineraryField(item.id, 'description', e.target.value)}
                          placeholder="Beschreibung"
                          className="px-2 py-1 text-xs text-stone-600 border border-stone-200 rounded sm:col-span-2"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteItineraryItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors self-end sm:self-center cursor-pointer"
                        title="Programmpunkt löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Speisekarte & Menü */}
            {activeTab === 'menu' && (
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700">
                  Hier könnt ihr Gerichte, Vorspeisen, Desserts und Signature-Drinks eures Hochzeitsmenüs verwalten.
                </div>

                <div className="space-y-4">
                  {localMenu.map((dish) => (
                    <div key={dish.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-mood-wine">
                          {dish.subtitle || dish.course}
                        </span>
                        <span className="text-xs text-stone-400">{dish.dietary.join(', ')}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900">{dish.title}</h4>
                      <p className="text-xs text-stone-600 font-light">{dish.description}</p>
                      {dish.winePairing && (
                        <p className="text-xs text-mood-wine font-medium">Weinbegleitung: {dish.winePairing}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: Bilder & MP4-Videos verwalten */}
            {activeTab === 'photos' && (
              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <p className="font-semibold text-mood-wine flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-mood-wine" />
                    <span>Medienverwaltung (Bilder & MP4-Videos)</span>
                  </p>
                  <p>
                    Ihr könnt sowohl <strong>Bilder (.jpg, .png)</strong> als auch <strong>Videos (.mp4)</strong> zur Galerie hinzufügen. Videos werden automatisch als Schleife in der Übersicht und im Vollbild-Modus mit Sound abgespielt.
                  </p>
                </div>

                {/* Add Photo / Video Form */}
                <form onSubmit={handleAddPhotoManual} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mood-wine">
                      <Plus className="w-4 h-4" />
                      <span>Neues Bild oder MP4-Video hinzufügen</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setNewPhotoType('image')}
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded ${
                          newPhotoType === 'image' ? 'bg-stone-900 text-white' : 'text-stone-600'
                        }`}
                      >
                        Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPhotoType('video')}
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded ${
                          newPhotoType === 'video' ? 'bg-mood-wine text-white' : 'text-stone-600'
                        }`}
                      >
                        Video (MP4)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder={
                          newPhotoType === 'video'
                            ? 'Video-Pfad (z.B. /src/assets/images/Schloss_Ottersbach.mp4)'
                            : 'Bild-Pfad (z.B. /src/assets/images/... oder Link)'
                        }
                        value={newPhotoUrl}
                        onChange={(e) => {
                          setNewPhotoUrl(e.target.value);
                          if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                            setNewPhotoType('video');
                          }
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Titel des Eintrags"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={newPhotoCategory}
                      onChange={(e) => setNewPhotoCategory(e.target.value as any)}
                      className="px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                    >
                      <option value="location">Schloss Ottersbach & Park</option>
                      <option value="brautpaar">Thomas & Katharina</option>
                      <option value="trauung">Trauung</option>
                      <option value="feier">Feier & Dinner</option>
                      <option value="details">Details & Drinks</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Beschreibung / Bildunterschrift"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine bg-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-mood-wine hover:bg-mood-wine/90 rounded-lg cursor-pointer"
                    >
                      Speichern
                    </button>
                  </div>
                </form>

                {/* Media Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localPhotos.map((item) => {
                    const isVid = item.mediaType === 'video' || item.url.endsWith('.mp4');
                    return (
                      <div key={item.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs group relative">
                        <div className="aspect-16/10 bg-stone-900 overflow-hidden relative">
                          {isVid ? (
                            <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          )}

                          {isVid && (
                            <div className="absolute top-2 left-2 bg-stone-950/80 px-2 py-0.5 rounded text-[10px] text-white font-bold tracking-wider">
                              MP4
                            </div>
                          )}

                          <button
                            onClick={() => handleDeletePhoto(item.id)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-900/80 hover:bg-rose-900 text-white rounded-full transition-colors cursor-pointer"
                            title="Entfernen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="text-[10px] font-bold text-mood-wine uppercase">{item.category}</div>
                          <div className="text-xs font-semibold text-stone-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{item.caption}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 8: Basis-Daten */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveGeneralSettings} className="flex-1 overflow-y-auto space-y-5 pr-1">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs text-stone-700">
                  Basisdaten eurer Hochzeit: Namen, Datum (18.08.2028), Uhrzeit, Dresscode und Rückmeldefrist.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Name des Bräutigams
                    </label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Name der Braut
                    </label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Hochzeitsdatum
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Uhrzeit der Trauung
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Dresscode
                    </label>
                    <input
                      type="text"
                      value={dressCode}
                      onChange={(e) => setDressCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Rückmeldefrist (RSVP Deadline)
                    </label>
                    <input
                      type="text"
                      value={rsvpDeadline}
                      onChange={(e) => setRsvpDeadline(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-mood-wine"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-mood-wine hover:bg-mood-wine/90 rounded-xl transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Basis-Daten speichern</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
