// Shared application types for MarathonSaathi.
// Keep optional fields optional so older localStorage events continue to work.

export type MarathonDistance =
  | '5K'
  | '10K'
  | 'Half Marathon'
  | 'Full Marathon'
  | string;

export interface Marathon {
  id: number;
  name: string;
  city: string;
  state: string;
  date: string;

  // Supports both the current comma-separated format and future multi-select data.
  distance: string | string[];

  registrationUrl?: string;
  organizer: string;
  badge: string;
  rating: number;

  // Event banner / home image.
  // bannerImage is used on the individual event details page.
  // image/imageUrl are kept for compatibility with older events.
  bannerImage?: string;
  image?: string;
  imageUrl?: string;
  photoUrl?: string;

  // Runner-facing event information.
  about?: string;
  venue?: string;
  entryFee?: string;
  schedule?: string;
  awards?: string;
  runnerBenefits?: string;

  // Optional organizer contact/social information.
  organizerEmail?: string;
  organizerPhone?: string;
  organizerWebsite?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;

  // Optional metadata for future moderation/workflows.
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResultLinkItem {
  id: number;

  // New format: results/photos belong to a specific event.
  eventId?: number;

  // Kept for compatibility with older saved result entries.
  eventName?: string;

  resultsUrl?: string;
  photosUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizerSubmission {
  id: number;
  name: string;
  organizer: string;
  email: string;
  contact: string;
  city: string;
  state: string;
  date: string;

  // Supports the current simple form and future multi-select distances.
  distance: string | string[];

  socialLink?: string;
  bannerImage?: string;

  about?: string;
  venue?: string;
  entryFee?: string;
  schedule?: string;
  awards?: string;
  runnerBenefits?: string;

  // Documents should be handled separately and are intentionally not
  // displayed on the public event details page.
  docFile?: File | null;

  status?: 'pending' | 'approved' | 'rejected' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export const MARATHON_STORAGE_KEYS = {
  events: 'marathon_saathi_list',
  results: 'marathon_saathi_results_links',
  organizerSubmissions: 'marathon_saathi_organizer_submissions',
  contactMessages: 'marathon_saathi_contact_messages',
} as const;
