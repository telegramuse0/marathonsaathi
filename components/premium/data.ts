import type { IconName } from './Icon';

export type Marathon = { name: string; date: string; city: string; distance: string; status: string };
export const marathons: Marathon[] = [
  { name: 'Delhi Marathon', date: '12 Oct 2026', city: 'New Delhi', distance: 'Multiple distances', status: 'Featured' },
  { name: 'Mumbai Marathon', date: '20 Nov 2026', city: 'Mumbai', distance: 'Half & full marathon', status: 'Coming up' },
  { name: 'Kolkata Marathon', date: '15 Dec 2026', city: 'Kolkata', distance: 'Multiple distances', status: 'Open' },
];

export type Shortcut = { title: string; description: string; icon: IconName; href: string; tone: string };
export const shortcuts: Shortcut[] = [
  { title: 'Discover events', description: 'Find your next start line', icon: 'calendar', href: '#events', tone: 'orange' },
  { title: 'Track results', description: 'Celebrate every finish', icon: 'trophy', href: '#results', tone: 'blue' },
  { title: 'Event photos', description: 'Relive race day', icon: 'camera', href: '#photos', tone: 'green' },
  { title: 'Runner’s Store', description: 'Gear up for the miles', icon: 'bag', href: '#store', tone: 'sand' },
  { title: 'Join community', description: 'Run farther, together', icon: 'users', href: '#community', tone: 'lavender' },
];
