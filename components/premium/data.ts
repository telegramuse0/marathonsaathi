import type { IconName } from './Icon';

export type Marathon = {
  id?: number;
  name: string;
  description?: string;
  date: string;
  eventDate?: string;
  city: string;
  state?: string;
  distance: string;
  status: string;
  registrationUrl?: string;
  imageUrl?: string;
  photosUrl?: string;
  resultsUrl?: string;
  schedule?: string;
  organizer?: string;
  entryFee?: string;
  registrationCloses?: string;
  isFeatured?: boolean;
};
export const marathons: Marathon[] = [
  { name: 'Delhi Marathon', date: '12 Oct 2026', city: 'New Delhi', distance: 'Multiple distances', status: 'Featured' },
  { name: 'Mumbai Marathon', date: '20 Nov 2026', city: 'Mumbai', distance: 'Half & full marathon', status: 'Coming up' },
  { name: 'Kolkata Marathon', date: '15 Dec 2026', city: 'Kolkata', distance: 'Multiple distances', status: 'Open' },
];

export type Shortcut = { title: string; description: string; icon: IconName; href: string; tone: string };
export const shortcuts: Shortcut[] = [
  { title: 'Find a race', description: 'Browse every event', icon: 'calendar', href: '/events', tone: 'orange' },
  { title: 'Runner’s gear', description: 'Explore our picks', icon: 'bag', href: '/#store', tone: 'green' },
];
