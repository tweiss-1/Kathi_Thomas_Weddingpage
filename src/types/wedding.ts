export interface WeddingDetails {
  brideName: string;
  groomName: string;
  date: string;
  time: string;
  targetTimestamp: number;
  venueName: string;
  venueSubline: string;
  venueAddress: string;
  venueCoordinates: [number, number];
  cityState: string;
  welcomeMessage: string;
  dressCode: string;
  dressCodeImageUrl?: string;
  dressCodeNote?: string;
  heroMediaType?: 'image' | 'video';
  heroMediaUrl?: string;
  venueMediaType?: 'image' | 'video';
  venueMediaUrl?: string;
  rsvpDeadline: string;
  hotelInfo?: string;
  shuttleInfo?: string;
  brunchInfo?: string;
}

export type AttendanceStatus = 'attending' | 'declined';

export interface RSVPRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: AttendanceStatus;
  guestCount: number;
  plusOneName?: string;
  primaryMeal: string;
  plusOneMeal?: string;
  dietaryRestrictions: string[];
  dietaryDetails?: string;
  attendingWelcomeDinner: boolean;
  attendingSundayBrunch: boolean;
  songRequest?: string;
  personalNote?: string;
  tableNumber?: string;
  confirmed: boolean;
  submittedAt: string;
  lastReminderSent?: string;
}

export interface GuestbookMessage {
  id: string;
  author: string;
  relationship: string;
  message: string;
  reactions: {
    hearts: number;
    champagne: number;
  };
  avatarColor: string;
  createdAt: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: 'brautpaar' | 'location' | 'trauung' | 'feier' | 'details';
  caption: string;
  mediaType?: 'image' | 'video';
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
}

export interface MenuItem {
  id: string;
  course: 'aperitif' | 'vorspeise' | 'hauptgang' | 'dessert' | 'drinks';
  title: string;
  subtitle?: string;
  description: string;
  dietary: string[];
  winePairing?: string;
  signatureTag?: string;
}

export interface MapPin {
  id: string;
  title: string;
  category: 'ceremony' | 'reception' | 'hotel' | 'parking' | 'brunch';
  coordinates: [number, number];
  address: string;
  time?: string;
  description: string;
  badge: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
}
