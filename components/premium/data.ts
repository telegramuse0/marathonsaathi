import type { IconName } from './Icon';

export type Marathon = {
  id?: number;
  name: string;
  description?: string;
  date: string;
  eventDate?: string;
  city: string;
  distance: string;
  status: string;
  rating?: number;
  registrationUrl?: string;
  imageUrl?: string;
  photosUrl?: string;
  resultsUrl?: string;
  schedule?: string;
};
export const marathons: Marathon[] = [
  { name: 'Delhi Marathon', date: '12 Oct 2026', city: 'New Delhi', distance: 'Multiple distances', status: 'Featured' },
  { name: 'Mumbai Marathon', date: '20 Nov 2026', city: 'Mumbai', distance: 'Half & full marathon', status: 'Coming up' },
  { name: 'Kolkata Marathon', date: '15 Dec 2026', city: 'Kolkata', distance: 'Multiple distances', status: 'Open' },
];

export type Shortcut = { title: string; description: string; icon: IconName; href: string; tone: string };
export const shortcuts: Shortcut[] = [
  { title: 'Find a race', description: 'Browse every event', icon: 'calendar', href: '/events', tone: 'orange' },
  { title: 'Results & photos', description: 'Relive race day', icon: 'trophy', href: '/results', tone: 'blue' },
  { title: 'Runner’s gear', description: 'Explore our picks', icon: 'bag', href: '/#store', tone: 'green' },
];
