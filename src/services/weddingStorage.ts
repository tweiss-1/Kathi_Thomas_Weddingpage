import {
  RSVPRecord,
  GuestbookMessage,
  WeddingDetails,
  GalleryPhoto,
  MenuItem,
  ItineraryItem,
  MapPin,
} from '../types/wedding.ts';
import {
  INITIAL_WEDDING_DETAILS,
  INITIAL_RSVPS,
  INITIAL_GUESTBOOK_MESSAGES,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_MENU_ITEMS,
  INITIAL_ITINERARY,
  INITIAL_MAP_PINS,
} from '../data/initialData.ts';

const STORAGE_KEYS = {
  DETAILS: 'wedding_details_de_v5',
  RSVPS: 'wedding_rsvps_de_v2',
  GUESTBOOK: 'wedding_guestbook_de_v2',
  GALLERY: 'wedding_gallery_de_v4',
  MENU: 'wedding_menu_de_v2',
  ITINERARY: 'wedding_itinerary_de_v2',
  MAP_PINS: 'wedding_pins_de_v4',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
}

// Wedding Details
export function getWeddingDetails(): WeddingDetails {
  const stored = getStored<WeddingDetails | null>(STORAGE_KEYS.DETAILS, null);
  if (!stored) {
    // Check if v4 had custom edits, and migrate them while updating the dresscode image if it was the old image
    const v4 = getStored<Partial<WeddingDetails> | null>('wedding_details_de_v4', null);
    if (v4) {
      const migrated: WeddingDetails = {
        ...INITIAL_WEDDING_DETAILS,
        ...v4,
        venueAddress: v4.venueAddress && v4.venueAddress.includes('Ottersbach 1') 
          ? INITIAL_WEDDING_DETAILS.venueAddress 
          : (v4.venueAddress || INITIAL_WEDDING_DETAILS.venueAddress),
        dressCodeImageUrl: (v4.dressCodeImageUrl && !v4.dressCodeImageUrl.includes('dresscode_old_money_1794250590684'))
          ? v4.dressCodeImageUrl
          : INITIAL_WEDDING_DETAILS.dressCodeImageUrl,
      };
      setStored(STORAGE_KEYS.DETAILS, migrated);
      return migrated;
    }
    return INITIAL_WEDDING_DETAILS;
  }
  return {
    ...INITIAL_WEDDING_DETAILS,
    ...stored,
  };
}

export function saveWeddingDetails(details: WeddingDetails): void {
  setStored(STORAGE_KEYS.DETAILS, details);
}

// Itinerary / Ablaufplan
export function getItinerary(): ItineraryItem[] {
  return getStored<ItineraryItem[]>(STORAGE_KEYS.ITINERARY, INITIAL_ITINERARY);
}

export function saveItinerary(items: ItineraryItem[]): void {
  setStored(STORAGE_KEYS.ITINERARY, items);
}

// Map Pins / Location-Punkte
export function getMapPins(): MapPin[] {
  return getStored<MapPin[]>(STORAGE_KEYS.MAP_PINS, INITIAL_MAP_PINS);
}

export function saveMapPins(pins: MapPin[]): void {
  setStored(STORAGE_KEYS.MAP_PINS, pins);
}

// Menu Items / Speisekarte
export function getMenuItems(): MenuItem[] {
  return getStored<MenuItem[]>(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
}

export function saveMenuItems(items: MenuItem[]): void {
  setStored(STORAGE_KEYS.MENU, items);
}

// Gallery / Bilder
export function getGalleryPhotos(): GalleryPhoto[] {
  return getStored<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_PHOTOS);
}

export function saveGalleryPhotos(photos: GalleryPhoto[]): void {
  setStored(STORAGE_KEYS.GALLERY, photos);
}

export function addGalleryPhoto(photo: Omit<GalleryPhoto, 'id'>): GalleryPhoto[] {
  const current = getGalleryPhotos();
  const newPhoto: GalleryPhoto = {
    ...photo,
    id: `photo-${Date.now()}`,
  };
  const updated = [newPhoto, ...current];
  setStored(STORAGE_KEYS.GALLERY, updated);
  return updated;
}

export function deleteGalleryPhoto(id: string): GalleryPhoto[] {
  const current = getGalleryPhotos();
  const updated = current.filter((p) => p.id !== id);
  setStored(STORAGE_KEYS.GALLERY, updated);
  return updated;
}

// RSVPs
export function getRSVPs(): RSVPRecord[] {
  return getStored<RSVPRecord[]>(STORAGE_KEYS.RSVPS, INITIAL_RSVPS);
}

export function saveRSVP(record: Omit<RSVPRecord, 'id' | 'submittedAt'> & { id?: string }): RSVPRecord {
  const current = getRSVPs();
  const id = record.id || `rsvp-${Date.now()}`;
  const now = new Date().toISOString();
  
  const newRecord: RSVPRecord = {
    ...record,
    id,
    submittedAt: now,
  };

  const existingIndex = current.findIndex(
    (r) => r.id === id || (r.email.toLowerCase() === record.email.toLowerCase() && record.email.trim() !== '')
  );
  let updatedList: RSVPRecord[];

  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = { ...updatedList[existingIndex], ...newRecord };
  } else {
    updatedList = [newRecord, ...current];
  }

  setStored(STORAGE_KEYS.RSVPS, updatedList);
  return newRecord;
}

export function updateRSVP(id: string, updates: Partial<RSVPRecord>): RSVPRecord[] {
  const current = getRSVPs();
  const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
  setStored(STORAGE_KEYS.RSVPS, updated);
  return updated;
}

export function deleteRSVP(id: string): RSVPRecord[] {
  const current = getRSVPs();
  const updated = current.filter((r) => r.id !== id);
  setStored(STORAGE_KEYS.RSVPS, updated);
  return updated;
}

export interface RSVPAnalytics {
  totalResponses: number;
  totalGuestsAttending: number;
  totalGuestsDeclined: number;
  welcomeDinnerHeadcount: number;
  sundayBrunchHeadcount: number;
  dietaryBreakdown: Record<string, number>;
  mealBreakdown: Record<string, number>;
  unassignedTableCount: number;
}

export function calculateRSVPAnalytics(rsvps: RSVPRecord[]): RSVPAnalytics {
  let totalGuestsAttending = 0;
  let totalGuestsDeclined = 0;
  let welcomeDinnerHeadcount = 0;
  let sundayBrunchHeadcount = 0;
  const dietaryBreakdown: Record<string, number> = {};
  const mealBreakdown: Record<string, number> = {};
  let unassignedTableCount = 0;

  for (const r of rsvps) {
    if (r.status === 'attending') {
      const partySize = r.guestCount || (r.plusOneName ? 2 : 1);
      totalGuestsAttending += partySize;

      if (!r.tableNumber || r.tableNumber.trim() === '') {
        unassignedTableCount += 1;
      }

      if (r.attendingWelcomeDinner) {
        welcomeDinnerHeadcount += partySize;
      }
      if (r.attendingSundayBrunch) {
        sundayBrunchHeadcount += partySize;
      }

      // Meal counts
      if (r.primaryMeal && r.primaryMeal !== 'None' && r.primaryMeal !== 'Keine') {
        mealBreakdown[r.primaryMeal] = (mealBreakdown[r.primaryMeal] || 0) + 1;
      }
      if (r.plusOneMeal && r.plusOneMeal !== 'None' && r.plusOneMeal !== 'Keine') {
        mealBreakdown[r.plusOneMeal] = (mealBreakdown[r.plusOneMeal] || 0) + 1;
      }

      // Dietary
      if (r.dietaryRestrictions && r.dietaryRestrictions.length > 0) {
        for (const diet of r.dietaryRestrictions) {
          dietaryBreakdown[diet] = (dietaryBreakdown[diet] || 0) + 1;
        }
      }
      if (r.dietaryDetails && r.dietaryDetails.trim() !== '') {
        dietaryBreakdown['Besonderer Hinweis'] = (dietaryBreakdown['Besonderer Hinweis'] || 0) + 1;
      }
    } else {
      totalGuestsDeclined += 1;
    }
  }

  return {
    totalResponses: rsvps.length,
    totalGuestsAttending,
    totalGuestsDeclined,
    welcomeDinnerHeadcount,
    sundayBrunchHeadcount,
    dietaryBreakdown,
    mealBreakdown,
    unassignedTableCount,
  };
}

// German CSV Export for Catering & Wedding Coordinator
export function exportRSVPsToCSV(rsvps: RSVPRecord[]): void {
  const headers = [
    'Gast Name',
    'E-Mail',
    'Telefon',
    'Status',
    'Anzahl Personen',
    'Name Begleitung',
    'Hauptgang Gast',
    'Hauptgang Begleitung',
    'Allergien & Ernährung',
    'Details Ernährung',
    'Vorabend-Empfang',
    'Sonntagsbrunch',
    'Tischnummer',
    'Musikwunsch',
    'Persönliche Nachricht',
    'Rückmeldedatum',
  ];

  const escapeCSV = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = rsvps.map((r) => [
    escapeCSV(r.fullName),
    escapeCSV(r.email),
    escapeCSV(r.phone),
    escapeCSV(r.status === 'attending' ? 'Zusage' : 'Absage'),
    r.guestCount,
    escapeCSV(r.plusOneName || '-'),
    escapeCSV(r.primaryMeal || '-'),
    escapeCSV(r.plusOneMeal || '-'),
    escapeCSV((r.dietaryRestrictions || []).join('; ') || 'Keine'),
    escapeCSV(r.dietaryDetails || ''),
    escapeCSV(r.attendingWelcomeDinner ? 'Ja' : 'Nein'),
    escapeCSV(r.attendingSundayBrunch ? 'Ja' : 'Nein'),
    escapeCSV(r.tableNumber || 'Noch offen'),
    escapeCSV(r.songRequest || ''),
    escapeCSV(r.personalNote || ''),
    escapeCSV(new Date(r.submittedAt).toLocaleDateString('de-DE')),
  ]);

  const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Hochzeit_RSVP_Gaesteliste_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Guestbook
export function getGuestbookMessages(): GuestbookMessage[] {
  return getStored<GuestbookMessage[]>(STORAGE_KEYS.GUESTBOOK, INITIAL_GUESTBOOK_MESSAGES);
}

export function addGuestbookMessage(
  author: string,
  relationship: string,
  message: string
): GuestbookMessage {
  const current = getGuestbookMessages();
  const colors = [
    'bg-mood-blush text-mood-wine',
    'bg-amber-100 text-amber-900',
    'bg-emerald-100 text-emerald-900',
    'bg-stone-200 text-stone-800',
  ];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newMessage: GuestbookMessage = {
    id: `gb-${Date.now()}`,
    author: author.trim(),
    relationship: relationship.trim() || 'Hochzeitsgast',
    message: message.trim(),
    reactions: { hearts: 1, champagne: 0 },
    avatarColor,
    createdAt: 'Gerade eben',
  };

  const updated = [newMessage, ...current];
  setStored(STORAGE_KEYS.GUESTBOOK, updated);
  return newMessage;
}

export function reactToGuestbookMessage(id: string, type: 'hearts' | 'champagne'): GuestbookMessage[] {
  const current = getGuestbookMessages();
  const updated = current.map((m) => {
    if (m.id === id) {
      return {
        ...m,
        reactions: {
          ...m.reactions,
          [type]: (m.reactions[type] || 0) + 1,
        },
      };
    }
    return m;
  });
  setStored(STORAGE_KEYS.GUESTBOOK, updated);
  return updated;
}

export function deleteGuestbookMessage(id: string): GuestbookMessage[] {
  const current = getGuestbookMessages();
  const updated = current.filter((m) => m.id !== id);
  setStored(STORAGE_KEYS.GUESTBOOK, updated);
  return updated;
}

// Reset everything to seed data
export function resetToSeedData(): void {
  setStored(STORAGE_KEYS.DETAILS, INITIAL_WEDDING_DETAILS);
  setStored(STORAGE_KEYS.RSVPS, INITIAL_RSVPS);
  setStored(STORAGE_KEYS.GUESTBOOK, INITIAL_GUESTBOOK_MESSAGES);
  setStored(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_PHOTOS);
  setStored(STORAGE_KEYS.MENU, INITIAL_MENU_ITEMS);
  setStored(STORAGE_KEYS.ITINERARY, INITIAL_ITINERARY);
  setStored(STORAGE_KEYS.MAP_PINS, INITIAL_MAP_PINS);
}
