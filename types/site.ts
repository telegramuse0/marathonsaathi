export type SiteTab =
  | 'home'
  | 'events'
  | 'calendar'
  | 'results'
  | 'submit'
  | 'admin'
  | 'about'
  | 'terms'
  | 'privacy'
  | 'contact';

export interface Marathon {
  id: number;
  name: string;
  city: string;
  state: string;
  date: string;
  distance: string;
  organizer: string;
  badge: string;
  rating: number;
  registrationUrl?: string;
  image?: string;
}

export interface StoreProduct {
  id: number;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  price: number | null;
  amazon_url: string | null;
  flipkart_url: string | null;
  is_active: boolean;
}

export interface ResultLinkItem {
  id: number;
  eventName: string;
  resultsUrl: string;
  photosUrl: string;
}