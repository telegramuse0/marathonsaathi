'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SiteFooter from '@/components/premium/SiteFooter';
import AdminContactInboxPanel from '@/components/premium/AdminContactInboxPanel';
import { supabase } from '@/lib/supabase';

type AdminMarathon = {
  id: number;
  name: string;
  city: string;
  state: string;
  date: string;
  distance: string;
  registrationUrl: string;
  organizer: string;
  badge: string;
  bannerImage?: string;
  about?: string;
  venue?: string;
  entryFee?: string;
  registrationCloses?: string;
  isFeatured?: boolean;
  schedule?: string;
  photosUrl?: string;
  resultsUrl?: string;
  awards?: string;
  runnerBenefits?: string;
};

type AdminResultLink = {
  id: number;
  eventId: number;
  resultsUrl: string;
  photosUrl: string;
};

type StoreProduct = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  price: number | null;
  amazon_url: string | null;
  flipkart_url: string | null;
  is_active: boolean;
  created_at?: string;
};

const emptyProductForm = {
  name: '', description: '', category: 'Running Shoes', image_url: '',
  price: '', amazon_url: '', flipkart_url: '', is_active: true,
};

const MASTER_EVENTS: AdminMarathon[] = [
  {
    id: 1,
    name: 'JBG Kolkata Marathon 2026',
    city: 'Kolkata',
    state: 'West Bengal',
    date: '2026-11-29',
    distance: 'Full, Half, 10K, 5K',
    registrationUrl: 'https://jbgkolkatamarathon.com/',
    organizer: 'NEB Sports',
    badge: 'Featured',
  },
  {
    id: 2,
    name: 'Tata Mumbai Marathon',
    city: 'Mumbai',
    state: 'Maharashtra',
    date: '2027-01-17',
    distance: 'Full, Half, Dream Run',
    registrationUrl: 'https://tatamumbaimarathon.procam.in/',
    organizer: 'Procam International',
    badge: 'Gold Label',
  },
  {
    id: 3,
    name: 'Vedanta Delhi Half Marathon',
    city: 'New Delhi',
    state: 'Delhi',
    date: '2026-10-18',
    distance: 'Half Marathon, 10K',
    registrationUrl: 'https://vedantadelhihalfmarathon.procam.in/',
    organizer: 'Procam International',
    badge: 'Platinum',
  },
  {
    id: 4,
    name: 'Hyderabad Marathon',
    city: 'Hyderabad',
    state: 'Telangana',
    date: '2026-08-30',
    distance: 'Full, Half, 10K',
    registrationUrl: 'https://nmdchyderabadmarathon.com/',
    organizer: 'Hyderabad Runners',
    badge: 'Popular',
  },
  {
    id: 5,
    name: 'Goa River Marathon',
    city: 'Vasco da Gama',
    state: 'Goa',
    date: '2026-12-13',
    distance: 'Full, Half, 10K',
    registrationUrl: 'https://www.skfgoarivermarathon.com/',
    organizer: 'SMRC',
    badge: 'Scenic',
  },
];

const MARATHONS_STORAGE_KEY = 'marathon_saathi_list';

const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
const COMMON_DISTANCES = ['3K', '5K', '6K', '10K', '11K', '12K', '21K', 'Half Marathon', '25K', '42K', 'Full Marathon', '50K', '60K', '75K', '100K', 'Dream Run'];

type MarathonRow = { id: number; name: string; description: string | null; venue: string | null; location_details: string | null; date: string; registration_closes: string | null; is_featured: boolean | null; registration_link: string | null; image: string | null; status: string | null; distance: string | null; organizer: string | null; fee: string | null; schedule: string | null; photos_url: string | null; results_url: string | null; awards: string | null; runner_benefits: string | null };

const rowToEvent = (row: MarathonRow): AdminMarathon => {
  const venue = row.venue || '';
  const parts = venue.split(',').map((part) => part.trim());
  return {
    id: Number(row.id), name: row.name || '', city: parts[0] || venue || '', state: parts.slice(1).join(', '),
    date: row.date || '', distance: row.distance || '', registrationUrl: row.registration_link || '',
    registrationCloses: row.registration_closes || '', isFeatured: Boolean(row.is_featured),
    organizer: row.organizer || '', badge: row.status || 'Upcoming',
    bannerImage: row.image || '', about: row.description || '', venue,
    entryFee: row.fee || '', schedule: row.schedule || '', photosUrl: row.photos_url || '', resultsUrl: row.results_url || '', awards: row.awards || '', runnerBenefits: row.runner_benefits || '',
  };
};

const eventToRow = (event: AdminMarathon) => ({
  name: event.name,
  description: event.about || null,
  venue: [event.city, event.state].filter(Boolean).join(', '),
  location_details: event.venue || null,
  date: event.date,
  registration_closes: event.registrationCloses || null,
  is_featured: Boolean(event.isFeatured),
  registration_link: event.registrationUrl || null,
  image: event.bannerImage || null,
  status: event.badge || 'Upcoming',
  distance: event.distance,
  organizer: event.organizer,
  fee: event.entryFee || null,
  schedule: event.schedule || null,
  photos_url: event.photosUrl || null,
  results_url: event.resultsUrl || null,
  awards: event.awards || null,
  runner_benefits: event.runnerBenefits || null,
});

const formatDate = (dateString: string) => {
  if (!dateString) return 'Date not set';

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const toTitleCase = (value: string) => value
  .trim()
  .replace(/\s+/g, ' ')
  .split(' ')
  .map((word) => /^[A-Z0-9]{2,5}$/.test(word) ? word : word.charAt(0).toLocaleUpperCase('en-IN') + word.slice(1).toLocaleLowerCase('en-IN'))
  .join(' ');

const toSentenceCase = (value: string) => {
  const cleaned = value.trim().replace(/\s+/g, ' ');
  return cleaned ? cleaned.charAt(0).toLocaleUpperCase('en-IN') + cleaned.slice(1) : '';
};

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [marathons, setMarathons] = useState<AdminMarathon[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const resultsLinks = useMemo<AdminResultLink[]>(() => marathons
    .filter((event) => event.photosUrl || event.resultsUrl)
    .map((event) => ({ id: event.id, eventId: event.id, resultsUrl: event.resultsUrl || '', photosUrl: event.photosUrl || '' })), [marathons]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSaving, setProductSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);

  const [selectedEventId, setSelectedEventId] = useState('');
  const [resultsUrl, setResultsUrl] = useState('');
  const [photosUrl, setPhotosUrl] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEventId, setEditEventId] = useState('');
  const [editResultsUrl, setEditResultsUrl] = useState('');
  const [editPhotosUrl, setEditPhotosUrl] = useState('');

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const [eventForm, setEventForm] = useState({
    name: '',
    city: '',
    state: '',
    date: '',
    registrationCloses: '',
    isFeatured: false,
    distance: '',
    registrationUrl: '',
    organizer: '',
    badge: '',
    bannerImage: '',
    about: '',
    venue: '',
    entryFee: '',
    schedule: '',
    photosUrl: '',
    resultsUrl: '',
    awards: '',
    runnerBenefits: '',
  });
  const [customDistance, setCustomDistance] = useState('');

  useEffect(() => {
    let active = true;

    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;

      if (!session?.user) {
        setIsAdminAuth(false);
        setAuthLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!active) return;
      setIsAdminAuth(!error && !!data);
      setAuthLoading(false);
    };

    void checkAdminSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Let Supabase finish updating its session before checking the admin allowlist.
      window.setTimeout(() => { void checkAdminSession(); }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const { data, error } = await supabase.from('marathons').select('*').order('date', { ascending: true });
        if (error) throw error;
        if (!cancelled) setMarathons(((data || []) as MarathonRow[]).map(rowToEvent));
      } catch (error) {
        console.error('Could not load marathons from Supabase:', error);
        if (!cancelled) alert('Supabase se events load nahi hue. Table columns aur RLS permissions check karein.');
      } finally {
        if (!cancelled) setEventsLoading(false);
      }

    };
    void loadData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isAdminAuth) return;
    let cancelled = false;
    const loadProducts = async () => {
      setProductsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id,name,description,category,image_url,price,amazon_url,flipkart_url,is_active,created_at')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('Could not load products:', error);
        alert(`Products load nahi hue: ${error.message}`);
      } else {
        setProducts((data || []) as StoreProduct[]);
      }
      setProductsLoading(false);
    };
    void loadProducts();
    return () => { cancelled = true; };
  }, [isAdminAuth]);

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingProductId(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Product name zaroori hai.');
      return;
    }
    if (productForm.price.trim() && (!Number.isFinite(Number(productForm.price)) || Number(productForm.price) < 0)) {
      alert('Price valid positive number hona chahiye.');
      return;
    }
    setProductSaving(true);
    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      category: productForm.category,
      image_url: productForm.image_url.trim(),
      price: productForm.price.trim() ? Number(productForm.price) : null,
      amazon_url: productForm.amazon_url.trim(),
      flipkart_url: productForm.flipkart_url.trim(),
      is_active: productForm.is_active,
    };
    try {
      if (editingProductId !== null) {
        const { data, error } = await supabase.from('products').update(payload).eq('id', editingProductId).select('*').single();
        if (error) throw error;
        setProducts((current) => current.map((item) => item.id === editingProductId ? data as StoreProduct : item));
        alert('Product update ho gaya.');
      } else {
        const { data, error } = await supabase.from('products').insert(payload).select('*').single();
        if (error) throw error;
        setProducts((current) => [data as StoreProduct, ...current]);
        alert('Product Supabase mein save ho gaya.');
      }
      resetProductForm();
    } catch (error) {
      console.error('Product save failed:', error);
      alert(`Product save nahi hua: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProductSaving(false);
    }
  };

  const startProductEdit = (product: StoreProduct) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || '', description: product.description || '', category: product.category || 'Running Accessories',
      image_url: product.image_url || '', price: product.price === null ? '' : String(product.price),
      amazon_url: product.amazon_url || '', flipkart_url: product.flipkart_url || '', is_active: product.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (product: StoreProduct) => {
    if (!window.confirm(`Delete product "${product.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      console.error('Product delete failed:', error);
      alert(`Product delete nahi hua: ${error.message}`);
      return;
    }
    setProducts((current) => current.filter((item) => item.id !== product.id));
  };

  const toggleProductActive = async (product: StoreProduct) => {
    const { data, error } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id).select('*').single();
    if (error) {
      console.error('Product visibility update failed:', error);
      alert(`Product status update nahi hua: ${error.message}`);
      return;
    }
    setProducts((current) => current.map((item) => item.id === product.id ? data as StoreProduct : item));
  };

  const saveMarathons = (updated: AdminMarathon[]) => {
    setMarathons(updated);
    // Keep a local cache for compatibility, but Supabase is the source of truth.
    localStorage.setItem(MARATHONS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPass,
      });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error('Supabase returned no user session.');

      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (adminError || !adminRecord) {
        await supabase.auth.signOut();
        throw new Error('This account is not authorized as a MarathonSaathi admin. Add its user ID to the admin_users table first.');
      }

      setIsAdminAuth(true);
      setAdminPass('');
    } catch (error) {
      console.error('Admin login failed:', error);
      alert(error instanceof Error ? error.message : 'Login failed. Check your email and password.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Admin logout failed:', error);
      alert('Logout failed. Please try again.');
      return;
    }
    setIsAdminAuth(false);
    setAdminEmail('');
    setAdminPass('');
  };

  const selectedExistingRecord = useMemo(() => {
    const eventId = Number(selectedEventId);
    if (!eventId) return null;

    return resultsLinks.find((item) => item.eventId === eventId) || null;
  }, [selectedEventId, resultsLinks]);

  const availableEvents = marathons.filter(
    (event) => !resultsLinks.some((item) => item.eventId === event.id)
  );

  const handleSelectEvent = (value: string) => {
    setSelectedEventId(value);

    const existing = resultsLinks.find((item) => item.eventId === Number(value));

    if (existing) {
      setResultsUrl(existing.resultsUrl);
      setPhotosUrl(existing.photosUrl);
    } else {
      setResultsUrl('');
      setPhotosUrl('');
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventId = Number(selectedEventId);
    const cleanResultsUrl = resultsUrl.trim();
    const cleanPhotosUrl = photosUrl.trim();

    if (!eventId) {
      alert('Please select an event.');
      return;
    }

    if (!cleanResultsUrl && !cleanPhotosUrl) {
      alert('Please provide at least one official Results or Photos URL.');
      return;
    }

    if (resultsLinks.some((item) => item.eventId === eventId)) {
      alert('This event already has a published record. Use Edit below.');
      return;
    }

    const { data, error } = await supabase.from('marathons').update({
      results_url: cleanResultsUrl || null,
      photos_url: cleanPhotosUrl || null,
    }).eq('id', eventId).select('*').single();
    if (error) { alert(`Links save nahi huye: ${error.message}`); return; }
    const saved = rowToEvent(data as MarathonRow);
    setMarathons((current) => current.map((event) => event.id === eventId ? saved : event));

    setSelectedEventId('');
    setResultsUrl('');
    setPhotosUrl('');

    alert('Results & Photos links published successfully.');
  };

  const startEdit = (item: AdminResultLink) => {
    setEditingId(item.id);
    setEditEventId(String(item.eventId));
    setEditResultsUrl(item.resultsUrl);
    setEditPhotosUrl(item.photosUrl);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditEventId('');
    setEditResultsUrl('');
    setEditPhotosUrl('');
  };

  const saveEdit = async (id: number) => {
    const eventId = Number(editEventId);
    const cleanResultsUrl = editResultsUrl.trim();
    const cleanPhotosUrl = editPhotosUrl.trim();

    if (!eventId || (!cleanResultsUrl && !cleanPhotosUrl)) {
      alert('Select an event and provide at least one official URL.');
      return;
    }

    if (resultsLinks.some((item) => item.eventId === eventId && item.eventId !== id)) {
      alert('This event already has official links. Edit that eventâ€™s links instead.');
      return;
    }

    if (eventId !== id) {
      const { error: clearError } = await supabase.from('marathons').update({ results_url: null, photos_url: null }).eq('id', id);
      if (clearError) { alert(`Purane event ke links update nahi huye: ${clearError.message}`); return; }
    }
    const { data, error } = await supabase.from('marathons').update({
      results_url: cleanResultsUrl || null,
      photos_url: cleanPhotosUrl || null,
    }).eq('id', eventId).select('*').single();
    if (error) { alert(`Links update nahi huye: ${error.message}`); return; }
    const saved = rowToEvent(data as MarathonRow);
    setMarathons((current) => current.map((event) => event.id === eventId ? saved : event.id === id && eventId !== id ? { ...event, photosUrl: '', resultsUrl: '' } : event));
    cancelEdit();
    alert('Event links updated successfully.');
  };

  const handleDeleteResult = async (id: number) => {
    if (!window.confirm('Delete this Results & Photos record?')) return;
    const { error } = await supabase.from('marathons').update({ results_url: null, photos_url: null }).eq('id', id);
    if (error) { alert(`Links delete nahi huye: ${error.message}`); return; }
    setMarathons((current) => current.map((event) => event.id === id ? { ...event, photosUrl: '', resultsUrl: '' } : event));
  };

  const handleEventBannerImageUpload = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setEventForm((previous) => ({
        ...previous,
        bannerImage: typeof reader.result === 'string' ? reader.result : '',
      }));
    };

    reader.onerror = () => alert('Could not read the banner image.');
    reader.readAsDataURL(file);
  };

  const resetEventForm = () => {
    setEventForm({
      name: '', city: '', state: '', date: '', registrationCloses: '', isFeatured: false, distance: '', registrationUrl: '',
      organizer: '', badge: '', bannerImage: '', about: '', venue: '',
      entryFee: '', schedule: '', photosUrl: '', resultsUrl: '', awards: '', runnerBenefits: '',
    });
    setCustomDistance('');
    setEditingEventId(null);
    setShowAddEvent(false);
  };

  const handleEventFormChange = (
    field: keyof typeof eventForm,
    value: string | boolean
  ) => {
    setEventForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleAddOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = toTitleCase(eventForm.name);
    const city = toTitleCase(eventForm.city);
    const state = eventForm.state.trim();
    const date = eventForm.date.trim();
    const distance = eventForm.distance.trim();
    const registrationUrl = eventForm.registrationUrl.trim();
    const organizer = toTitleCase(eventForm.organizer);
    const badge = eventForm.badge.trim() || 'Upcoming';

    if (!name || !city || !state || !date || !distance || !organizer) {
      alert('Please fill all required event details. Registration URL can be added later.');
      return;
    }

    if (Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
      alert('Please enter a valid race date.');
      return;
    }
    if (eventForm.registrationCloses && eventForm.registrationCloses > date) {
      alert('Registration closing date race date se pehle ya usi din honi chahiye.');
      return;
    }

    const duplicate = marathons.some(
      (event) =>
        event.id !== editingEventId &&
        event.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      alert('An event with this name already exists.');
      return;
    }

    const event: AdminMarathon = {
      id: editingEventId ?? Date.now(),
      name,
      city,
      state,
      date,
      registrationCloses: eventForm.registrationCloses,
      isFeatured: eventForm.isFeatured,
      distance,
      registrationUrl,
      organizer,
      badge,
      bannerImage: eventForm.bannerImage || '',
      about: toSentenceCase(eventForm.about),
      venue: eventForm.venue.trim(),
      entryFee: eventForm.entryFee.trim(),
      schedule: eventForm.schedule.trim(),
      photosUrl: eventForm.photosUrl.trim(),
      resultsUrl: eventForm.resultsUrl.trim(),
      awards: eventForm.awards.trim(),
      runnerBenefits: eventForm.runnerBenefits.trim(),
    };

    try {
      const payload = eventToRow(event);
      if (editingEventId !== null) {
        const { data, error } = await supabase.from('marathons').update(payload).eq('id', editingEventId).select('*').single();
        if (error) throw error;
        const saved = rowToEvent(data as MarathonRow);
        saveMarathons(marathons.map((item) => item.id === editingEventId ? saved : item));
        alert('Marathon event updated in Supabase.');
      } else {
        const { data, error } = await supabase.from('marathons').insert(payload).select('*').single();
        if (error) throw error;
        const saved = rowToEvent(data as MarathonRow);
        saveMarathons([saved, ...marathons]);
        alert('New marathon event saved to Supabase.');
      }
      resetEventForm();
    } catch (error) {
      console.error('Supabase save failed:', error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      alert(`Event save nahi hua: ${message}`);
    }
  };

  const startEventEdit = (event: AdminMarathon) => {
    setEditingEventId(event.id);
    setShowAddEvent(true);
    setEventForm({
      name: event.name,
      city: event.city,
      state: event.state,
      date: event.date,
      registrationCloses: event.registrationCloses || '',
      isFeatured: Boolean(event.isFeatured),
      distance: event.distance,
      registrationUrl: event.registrationUrl,
      organizer: event.organizer,
      badge: event.badge,
      bannerImage: event.bannerImage || '',
      about: event.about || '',
      venue: event.venue || '',
      entryFee: event.entryFee || '',
      schedule: event.schedule || '',
      photosUrl: event.photosUrl || '',
      resultsUrl: event.resultsUrl || '',
      awards: event.awards || '',
      runnerBenefits: event.runnerBenefits || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMarathon = async (id: number) => {
    const event = marathons.find((item) => item.id === id);
    if (!event) return;

    const message = `Delete "${event.name}" from the marathon list? Any attached timing and photo links will be removed with it.`;

    if (!window.confirm(message)) return;

    void (async () => {
      const { error } = await supabase.from('marathons').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete failed:', error);
        alert('Event delete nahi hua. Supabase RLS permissions check karein.');
        return;
      }
      saveMarathons(marathons.filter((item) => item.id !== id));
    })();
  };

  const getEvent = (eventId: number) =>
    marathons.find((event) => event.id === eventId);

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-4 sm:p-6 lg:p-12"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              MarathonSaathi Admin
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-2">
              Secure Admin Control Panel
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Manage Marathon Events, Race Results & Organizer Photos
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition text-center"
          >
            Exit Admin â†—
          </Link>
        </div>

        {authLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Checking admin sessionâ€¦</div>
        ) : !isAdminAuth ? (
          /* LOGIN */
          <form
            onSubmit={handleAdminLogin}
            className="space-y-5 max-w-sm mx-auto py-10"
          >
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">ğŸ”</div>
              <h3 className="text-lg font-black">Admin Login</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sign in with your authorized Supabase admin account.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                autoComplete="username"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
                placeholder="Enter your Supabase password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full bg-[#FF5500] disabled:opacity-60 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm cursor-pointer transition shadow-lg shadow-orange-500/20"
            >
              {authSubmitting ? 'Signing inâ€¦' : 'Login Admin'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">

            {/* ADMIN STATUS */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                ğŸ”’
              </div>

              <div>
                <p className="text-xs font-black text-emerald-800">
                  Admin Access Active
                </p>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  Event details, race links and products you save here appear on the public website.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="ml-auto bg-white border border-emerald-200 text-emerald-800 font-bold px-3 py-2 rounded-lg text-xs"
              >
                Logout
              </button>
            </div>

            <nav aria-label="Admin sections" className="sticky top-2 z-20 flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
              <a href="#admin-events" className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Events</a>
              <a href="#admin-products" className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Products</a>
              <a href="#admin-contact-messages" className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Contact Messages</a>
            </nav>

            <AdminContactInboxPanel />

            {/* RUNNER'S STORE PRODUCT MANAGEMENT */}
            <section id="admin-products" className="scroll-mt-24 space-y-5 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-[#0F172A] uppercase tracking-wider">ğŸ›ï¸ Runnerâ€™s Store â€” Products ({products.length})</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Products yahan add/edit karein. Active products public store par dikhaye ja sakte hain.</p>
                </div>
                {editingProductId !== null && <button type="button" onClick={resetProductForm} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold">Cancel edit</button>}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <h5 className="font-black text-sm">{editingProductId !== null ? 'âœï¸ Edit Product' : 'â• Add New Product'}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label><input required value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Daily Running Shoes" className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Category *</label><select value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs">{['Running Shoes','GPS Watches','Running Apparel','Hydration Gear','Running Accessories','Marathon Essentials'].map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Price (INR)</label><input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="e.g. 2999" className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Product Image URL</label><input type="url" value={productForm.image_url} onChange={(e) => setProductForm((p) => ({ ...p, image_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs" /></div>
                  <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Description</label><textarea rows={2} value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short product description" className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Amazon Affiliate URL</label><input type="url" value={productForm.amazon_url} onChange={(e) => setProductForm((p) => ({ ...p, amazon_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 mb-1">Flipkart Affiliate URL</label><input type="url" value={productForm.flipkart_url} onChange={(e) => setProductForm((p) => ({ ...p, flipkart_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-3 border border-slate-200 rounded-xl text-xs" /></div>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700"><input type="checkbox" checked={productForm.is_active} onChange={(e) => setProductForm((p) => ({ ...p, is_active: e.target.checked }))} /> Show product in public store</label>
                <button disabled={productSaving} type="submit" className="bg-[#FF5500] disabled:opacity-60 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-xs">{productSaving ? 'Savingâ€¦' : editingProductId !== null ? 'Save Product Changes' : 'Add Product'}</button>
              </form>

              <div className="space-y-3">
                {productsLoading ? <p className="text-xs text-slate-500">Loading productsâ€¦</p> : products.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">Abhi products nahi hain. Upar form se pehla product add karein.</p> : products.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row gap-4 sm:items-center rounded-xl border border-slate-200 bg-white p-4">
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="h-20 w-20 rounded-lg object-cover border border-slate-100" /> : <div className="h-20 w-20 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">ğŸ‘Ÿ</div>}
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-xs">{product.name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{product.is_active ? 'Active' : 'Hidden'}</span></div><p className="text-[10px] text-slate-500 mt-1">{product.category}{product.price !== null ? ` â€¢ â‚¹${Number(product.price).toLocaleString('en-IN')}` : ''}</p><p className="text-[10px] text-slate-500 mt-1 break-all">Amazon: {product.amazon_url || 'Not set'} â€¢ Flipkart: {product.flipkart_url || 'Not set'}</p></div>
                    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => startProductEdit(product)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">Edit</button><button type="button" onClick={() => void toggleProductActive(product)} className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800">{product.is_active ? 'Hide' : 'Show'}</button><button type="button" onClick={() => void handleDeleteProduct(product)} className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700">Delete</button></div>
                  </div>
                ))}
              </div>
            </section>

            {/* MANAGE MARATHON EVENTS */}
            <section id="admin-events" className="scroll-mt-24 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-[#0F172A] uppercase tracking-wider">
                    ğŸƒ Manage Marathon Events ({marathons.length})
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Events Supabase database mein save hote hain aur Home/Browse/Calendar mein share kiye ja sakte hain.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (showAddEvent) {
                      resetEventForm();
                    } else {
                      setShowAddEvent(true);
                      setEditingEventId(null);
                    }
                  }}
                  className="bg-[#FF5500] hover:bg-orange-600 text-white font-black px-4 py-2.5 rounded-xl text-xs cursor-pointer transition"
                >
                  {showAddEvent ? 'âœ• Close Form' : 'â• Add New Event'}
                </button>
              </div>

              {showAddEvent && (
                <form
                  onSubmit={handleAddOrUpdateEvent}
                  className="bg-orange-50 p-5 sm:p-6 rounded-2xl border border-orange-100 space-y-4"
                >
                  <div>
                    <h5 className="font-black text-sm">
                      {editingEventId !== null
                        ? 'âœï¸ Edit Marathon Event'
                        : 'â• Add New Marathon Event'}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-1">
                      This event will become available in Browse Events, Race Calendar and the Results/Photos selector.
                    </p>
                  </div>

                  <div className="rounded-xl border border-orange-100 bg-white/80 p-4 sm:p-5 space-y-3">
                    <div><h6 className="font-black text-xs uppercase tracking-wide text-slate-800">1. Basic event information</h6><p className="mt-1 text-[10px] text-slate-500">Event ka naam, organizer, location aur race date.</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Event Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={eventForm.name}
                        onChange={(e) => handleEventFormChange('name', e.target.value)}
                        placeholder="e.g. Kolkata City Marathon 2027"
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Organizer *
                      </label>
                      <input
                        required
                        type="text"
                        value={eventForm.organizer}
                        onChange={(e) => handleEventFormChange('organizer', e.target.value)}
                        placeholder="Organizer name"
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        City *
                      </label>
                      <input
                        required
                        type="text"
                        value={eventForm.city}
                        onChange={(e) => handleEventFormChange('city', e.target.value)}
                        placeholder="Kolkata"
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        State *
                      </label>
                      <select
                        required
                        value={eventForm.state}
                        onChange={(e) => handleEventFormChange('state', e.target.value)}
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      >
                        <option value="">Select state or union territory</option>
                        {INDIAN_STATES_AND_UTS.map((stateName) => <option key={stateName} value={stateName}>{stateName}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Race Date *
                      </label>
                      <input
                        required
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => handleEventFormChange('date', e.target.value)}
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Registration Closes</label>
                      <input
                        type="date"
                        value={eventForm.registrationCloses}
                        max={eventForm.date || undefined}
                        onChange={(e) => handleEventFormChange('registrationCloses', e.target.value)}
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                      <p className="mt-1 text-[10px] text-slate-400">Race se pehle ki registration deadline set karein.</p>
                    </div>

      6ãİ;¶‰ËkºwµçM˜L_B‹™]™[XXİ[Û‹Y]Z[Ø˜XÚÙÜ›İ[™›[™X\‹YÜ˜YY[
LÍYYËÌNÍL‹ÌLYLÍ
NØ›Ş\ÚYİÎŒ\Lœ™Ø˜JM‹ÌL‹ŒM
_B‹™]™[XXİ[Û‹Y]Z[šİ™\Ø˜XÚÙÜ›İ[™ˆÌÍÍÌ_B‹™]™[XXİ[Û‹\™YÚ\İ\Ø˜XÚÙÜ›İ[™›[™X\‹YÜ˜YY[
LÍYYËÙ™MKÙYY™
NØ›Ş\ÚYİÎŒ\M™Ø˜J‹LNŒKŒŒÊ_B‹™]™[XXİ[Û‹\™YÚ\İ\šİ™\Ø˜XÚÙÜ›İ[™ˆÙŒÌÌB‹™]™[XXİ[ÛœÈ™]™[XXİ[ÛÛZ[‹ZZYÚÜY[™ÎŒM\Ù›Û\Ú^™NŒL\Ø›Ü™\‹\˜Y]\ÎÜB‹˜Y™š[X]KZ[XYÙH[YŞÛØš™XİYš]˜ÛÛZ[ˆZ[\Ü[ÜY[™ÎŒLœBˆØYZ[‹\™\İ[ËØYZ[‹\X›\ÚYÙ\Ü^N››Û™HZ[\Ü[BYYXJX^]ÚYL
^Ë›XZ[‹[˜]ÙØ\ŒNKšX‹XØ\™ÜY[™ÎŒœŒÜKœÚÜİ]YÜšYÙÜšY][\]KXÛÛ[[œÎœ™\X]
ËYœŠ_KœÚÜİ]›XÚ[
ŠÍ
^ÛX\™Ú[‹]ÜK˜ÛÛ[][š]KZ[›™\ÙØ\ŒMÜK˜ÛÛ[][š]KZ[›™\ˆÙ›Û\Ú^™NŒK™›Ûİ\‹[XZ[ÙØ\Œ_BYYXJX^]ÚY
^ËœYÙK]ÚYİÚY˜Ø[ÊL	HHÍœ
_KšXY\‹Z[›™\İÚY˜Ø[ÊL	HHÍ
_KœÚ]KZXY\ÚZYÚÌK˜œ˜[™[ÙÛŞİÚYœÚZYÚœK˜œ˜[™XÛÜHİ›Û™ŞÙ›Û\Ú^™NŒMÜK›Y[K]ÙÙÛ^Ù\Ü^N˜›ØÚßK›XZ[‹[˜]Ù\Ü^N››Û™NÜÜÚ][Û˜XœÛÛ]NİÜ\ÛYŒÜšYÚŒØ˜XÚÙÜ›İ[™ˆÙ™™ÜY[™ÎŒMŒŒØ›Ü™\‹X›İÛNŒ\ÛÛY˜\ŠK[[™JNØ›Ş\ÚYİÎŒLœŒ™Ø˜JM‹ÌL‹ŒJNÙ›^Y\™Xİ[Û˜ÛÛ[[Ø[YÛ‹Z][\Îœİ™]ÚÙØ\ŒK›XZ[‹[˜]‹š\Ë[Ü[Ù\Ü^N™›^K›XZ[‹[˜]˜N››İ
›˜]‹XİJ^ÜY[™ÎŒLÜØ›Ü™\‹X›İÛNŒ\ÛÛYÙŒYYN_K›˜]‹Xİ^Ú\İYKXÛÛ[˜Ù[\ÛX\™Ú[‹]ÜŒLÜB‹š\›Ëš\›ËXÛÛ[ÛZ[‹ZZYÚM\Kš\›ËZ[XYÙ^Ø˜XÚÙÜ›İ[™Z[XYÙN›[™X\‹YÜ˜YY[
LYË™Ø˜JKŒ‹
K™Ø˜JKŒ‹ŒÎJJK[™X\‹YÜ˜YY[
YË™Ø˜JLŒËK
K˜[œÜ\™[MIJK\›
šÎ‹ËÚ[XYÙ\Ë[œÜ\Ú˜ÛÛKÜİËLMMLÍŒKY™™™˜XØOØ]]ÏY›Ü›X]	™š]XÜ›Ü	ÏLLL	œONŠNØ˜XÚÙÜ›İ[™\ÜÚ][ÛMÉHÙ[\ŸB‹š\›ËXÛÜ^ÜY[™ÎŒÛX^]ÚYŒL	_Kš\›È^Ù›Û\Ú^™N˜Û[\
LİËÜ
NÛ]\‹\ÜXÚ[™Î‹LËÜKš\›ËXÛÜOœÙ›Û\Ú^™NŒMÛX^]ÚYŒÍŒKš\›Ë\İ[\İÚYÚZYÚÜšYÚŒÉNİÜINÙ›Û\Ú^™N\Û]\‹\ÜXÚ[™ÎŒ\Kš\›Ë\İ[\Ù›Û\Ú^™NŒNKš\›ËXØ\[ÛÜšYÚŒØ›İÛNŒŒœÙ›Û\Ú^™NKš\›ËXXİ[ÛœŞÙØ\\K˜]ÛÜY[™ÎŒLÜMÙ›Û\Ú^™NŒL\Kš\›Ë[›İ^ÛX\™Ú[‹]ÜŒŒÜB‹šX‹\ÙXİ[ÛİÚY˜Ø[ÊL	HH
_KšX‹XØ\™ÜY[™ÎŒŒœMÜMÜØ›Ü™\‹\˜Y]\ÎKšX‹ZXY[™ÈÙ›Û\Ú^™NŒKšX‹X˜YÙ^ÜY[™ÎÜÙ›Û\Ú^™NÜÛ]\‹\ÜXÚ[™Î‹ÜKšX‹\İ]ŞÙØ\ŒLÛX\™Ú[‹]ÜŒNÜY[™ÎŒMKšX‹\İ]ÙØ\œKšX‹\İ]İ›Û™ŞÙ›Û\Ú^™NŒŒ\KšX‹\İ]Ü[Ù›Û\Ú^™NÛX^]ÚYMKœİ]Y]šY\ÚZYÚŒKšX‹[[šŞÙ›Û\Ú^™NŒÙØ\ŒKšX‹[[šÈİ™ŞİÚYŒŒÚZYÚŒŒKœÚÜİ]YÜšYÙÜšY][\]KXÛÛ[[œÎŒYœˆYœÙØ\ŒœÜY[™Ë]ÜŒLœKœÚÜİ]ÜY[™Î\œÙØ\KœÚÜİ]ZXÛÛİÚYŒÍÚZYÚŒÍÙ›^X˜\Ú\ÎŒÍKœÚÜİ]]^İ›Û™ŞÙ›Û\Ú^™N\KœÚÜİ]]^ÛX[Ù›Û\Ú^™NKœÚÜİ]X\œ›İŞÙ\Ü^N˜›ØÚßB‹™]™[Ë\ÙXİ[ÛÜY[™Ë]ÜœÜY[™ËX›İÛN\KœÙXİ[Û‹ZXY[™ŞØ[YÛ‹Z][\Î™›^\İ\ÙØ\ŒLœKœÙXİ[Û‹ZXY[™ÈÙ›Û\Ú^™NŒÌ\K^[[šŞÙ›Û\Ú^™NŒLİÚ]K\ÜXÙN››İÜ˜\ÛX\™Ú[‹]ÜŒÜK™]™[]ÛÛŞØ[YÛ‹Z][\Î™›^\İ\Ù›^Y\™Xİ[Û˜ÛÛ[[ÙØ\ŒLÜÛX\™Ú[ŒŒMKœÙX\˜ÚX›ŞİÚYŒL	_K™]™[YÜšYÙÜšY][\]KXÛÛ[[œÎŒYœÙØ\ŒLœK™]™[XØ\™Ù\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎŒÎ	HYœÛZ[‹ZZYÚŒMMÜK™]™[X\ÚZYÚŒL	NÛZ[‹ZZYÚŒMMÜK™]™[Z[™›ŞÜY[™ÎŒMLœLœK™]™[[Y]^Ù›^Y\™Xİ[Û˜ÛÛ[[ÙØ\œK™]™[Z[™›ÈŞÙ›Û\Ú^™NŒM\ÛX\™Ú[ŒL\K™]™[X›İÛ^Ù›Û\Ú^™N\K™]™[\İ]\ŞİÜ\ÛY\ÜY[™ÎœÙ›Û\Ú^™NB‹˜ÛÛ[][š]KZ[›™\ÜY[™Ë]ÜŒÜÜY[™ËX›İÛNŒÛZ[‹ZZYÚŒÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎYœÙØ\ŒLœK˜ÛÛ[][š]K[X\šŞİÚYœÚZYÚœÙ›^X˜\Ú\ÎœK˜ÛÛ[][š]KZ[›™\ˆÙ›Û\Ú^™NŒŒœK˜ÛÛ[][š]KZ[›™\ˆÛ[™KZZYÚŒKŸK˜ÛÛ[][š]KZ[›™\‹˜]ÛÙÜšYXÛÛ[[ŒKËLNÛX\™Ú[\B‹˜ÛÛZ[™Ë\ÙXİ[ÛÙÜšY][\]KXÛÛ[[œÎŒYœÜY[™Ë]Ü\ÜY[™ËX›İÛNLÜÙØ\ŒL\K˜ÛÛZ[™ËXØ\™ÛZ[‹ZZYÚŒÜY[™ÎŒN\K˜ÛÛZ[™ËZXÛÛÛX\™Ú[‹X›İÛNŒLÜK˜ÛÛZ[™ËXØ\™ÛZ[‹ZZYÚŒK™›Ûİ\‹[XZ[ÙÜšY][\]KXÛÛ[[œÎŒYœˆYœÙØ\ŒÌM\ÜY[™Ë]ÜŒÍÜÜY[™ËX›İÛNŒÜK™›Ûİ\‹Xœ˜[™ÙÜšYXÛÛ[[ŒKËL_K™›Ûİ\‹XÛÛXİ˜^Ù›Û\Ú^™NŒLÙØ\œK™›Ûİ\‹XÛÛXİ˜Hİ™ŞÙ›^ŒMÜK™›Ûİ\‹X›İÛ^ÛZ[‹ZZYÚNÙ›^]Ü˜\Ü˜\ÙØ\\M\ÜY[™ÎŒLœÙ›Û\Ú^™NK™›Ûİ\‹X›İÛOœÜ[›XÚ[
Š^Ù\Ü^N››Û™_BŸBYYXJX^]ÚYŒÍÌ
^ËšX‹X˜YÙ^Ù\Ü^N››Û™_KšX‹\İ]Ü[ÛX^]ÚY\KšX‹\İ]ŞÙØ\ÜKœÚÜİ]]^ÛX[İÚ]K\ÜXÙN››Ü›X[K™›Ûİ\‹[XZ[ÙÜšY][\]KXÛÛ[[œÎŒYœŸK™›Ûİ\‹Xœ˜[™ÙÜšYXÛÛ[[˜]]ßK™›Ûİ\‹XÛÛXİÙÜšYXÛÛ[[˜]]ßKš\›ËXXİ[ÛœÈ˜]ÛÙ›Û\Ú^™NŒLÜY[™ÎŒLœKœÙXİ[Û‹ZXY[™ÈÙ›Û\Ú^™NŒÜ_BYYXJ™Y™\œË\™YXÙY[[İ[Ûœ™YXÙJ^Ê‹
˜™Y›Ü™K
˜Y\ÜØÜ›ÛX™Z]š[Ü˜]]ÈZ[\Ü[İ˜[œÚ][Û››Û™HZ[\Ü[_BYYXJX^]ÚY
^Ë™]™[XXİ[ÛœŞÙØ\œÛX\™Ú[‹]ÜŒLK™]™[XXİ[ÛÛZ[‹ZZYÚŒÌœÜY[™ÎŒÙ›Û\Ú^™N\K˜Y™š[X]K\ÙXİ[ÛÜY[™Ë]ÜŒÜY[™ËX›İÛNLœK˜Y™š[X]KZXY[™ŞÙØ\\Ø[YÛ‹Z][\Î™›^\İ\Ù›^Y\™Xİ[Û˜ÛÛ[[ÛX\™Ú[‹X›İÛNŒMœK˜Y™š[X]K[›İ^Ù›Û\Ú^™N\K˜Y™š[X]KYÜšYÙÜšY][\]KXÛÛ[[œÎŒYœÙØ\ŒL\K˜Y™š[X]KXØ\™Ù\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎŒÍ‰HYœÛZ[‹ZZYÚŒLÌK˜Y™š[X]KZ[XYÙ^ÚZYÚŒL	NÛZ[‹ZZYÚŒLÌK˜Y™š[X]KZ[™›ŞÜY[™ÎŒLœK˜Y™š[X]KZ[™›ÈŞÙ›Û\Ú^™NŒLÜK˜Y™š[X]KZ[™›ÈÙ›Û\Ú^™N\K˜Y™š[X]KX›İÛ^ÛX\™Ú[‹]ÜŒLÜY[™Ë]Ü\_BYYXJX^]ÚY
^Ëœ›İ]KZ[›Ë˜\˜Ú]™KZ[›ŞÜY[™Ë]ÜÜY[™ËX›İÛNŒŒ\Kœ›İ]KZ[›ÈK˜\˜Ú]™KZ[›È^Ù›Û\Ú^™NŒÍœÛ]\‹\ÜXÚ[™Î‹LK\K˜[Y]™[Ë\ÙXİ[ÛÜY[™Ë]Ü\K™]™[Yš[\œŞÛX\™Ú[‹]ÜŒK˜\˜Ú]™K[\İÙÜšY][\]KXÛÛ[[œÎŒYœÜY[™ËX›İÛNLœK˜\˜Ú]™KXØ\™ÜY[™ÎŒMœK˜\˜Ú]™KXØ\™Ù›Û\Ú^™NŒM\Kœ™\İ[Ë\İÜË\ÙXİ[ÛÜY[™Ë]Ü\ÜY[™ËX›İÛNÙ\Ü^N™ÜšYÙÜšY][\]KXÛÛ[[œÎ˜]]ÈYœÙØ\\LœKœ™\İ[Ë\İÜË\ÙXİ[Û‹^[[šŞÙÜšYXÛÛ[[ŒKËLNÛX\™Ú[ÜKœ™\İ[Ë\İÜËZXÛÛÙØ\ŒKœ™\İ[Ë\İÜËXÛÜHÙ›Û\Ú^™NŒŒ\Kœ™\İ[Ë\İÜËXÛÜHÙ›Û\Ú^™NŒL_BYYXJX^]ÚY
^Âˆš\›Ëš\›ËXÛÛ[ÛZ[‹ZZYÚŒBˆš\›ËXÛÜ^ÜY[™Ë]ÜÍBˆš\›È^Ù›Û\Ú^™N˜Û[\
œLËŒœ
NÛ]\‹\ÜXÚ[™Î‹L‹Û[™KZZYÚŒKŒŸBˆš\›ËXÛÜOœÙ›Û\Ú^™NŒMœÛ[™KZZYÚŒK_Bˆš\›ËY^YXœ›İŞÙ›Û\Ú^™NŒL\Û]\‹\ÜXÚ[™ÎŒKŒÜBˆš\›ËXXİ[ÛœŞÙØ\ŒLBˆš\›ËXXİ[ÛœÈ˜]ÛÛZ[‹ZZYÚÜY[™ÎŒLÜM\Ù›Û\Ú^™NŒLÜBˆš\›Ë[›İ^Ù›Û\Ú^™NŒLœBˆšX‹ZXY[™ÈÙ›Û\Ú^™NŒœBˆšX‹\İ]Ü[‹œÚÜİ]]^ÛX[Ù›Û\Ú^™NŒLBˆœÚÜİ]]^İ›Û™ŞÙ›Û\Ú^™NŒL\Bˆ™]™[Ë\ÙXİ[ÛÜY[™Ë]ÜMBˆœÙXİ[Û‹ZXY[™ÈÙ›Û\Ú^™NŒÍBˆ™^YXœ›İŞÙ›Û\Ú^™NŒL\Bˆ™]™[XØ\™ÙÜšY][\]KXÛÛ[[œÎŒYœÛZ[‹ZZYÚŒBˆ™]™[X\ÚZYÚŒNLÛZ[‹ZZYÚŒNLBˆ™]™[Z[™›ŞÜY[™ÎŒMÜBˆ™]™[[Y]^Ù›^Y\™Xİ[Ûœ›İÎÙ›^]Ü˜\Ü˜\ÙØ\\MÙ›Û\Ú^™NŒL\Bˆ™]™[Z[™›ÈŞÙ›Û\Ú^™NŒN\ÛX\™Ú[ŒLœBˆ™™X]\™YY]™[Ë\ÙXİ[Ûˆ™]™[X\ÚZYÚŒNLBˆ™™X]\™YY]™[Ë\ÙXİ[Ûˆ™]™[Z[™›ŞÜY[™ÎŒMœBˆ™™X]\™YY]™[Ë\ÙXİ[Ûˆ™]™[Z[™›ÈŞÙ›Û\Ú^™NŒŒÛX\™Ú[ŒLœBˆ™]™[XØ\™Y]Z[ŞÙ›Û\Ú^™NŒLBˆœ™XÙ[\™]šY]ÜË\ÙXİ[ÛÜY[™Ë]Ü\ÜY[™ËX›İÛNBˆœ™XÙ[\™]šY]ÜËYÜšYÙÜšY][\]KXÛÛ[[œÎŒYœÙØ\ŒLBˆœ™XÙ[\™]šY]ËXØ\™ÛZ[‹ZZYÚŒÜY[™ÎŒMÜBˆ›YØ[\YÙ^ÜY[™Ë]ÜÜÜY[™ËX›İÛNM\Bˆ›YØ[\YÙHÙ›Û\Ú^™NŒLÜBˆ˜ÛÛXİ\YÙ^ÙÜšY][\]KXÛÛ[[œÎŒYœÙØ\ŒŒÜY[™Ë]ÜÜY[™ËX›İÛNM\Bˆ˜ÛÛXİZ[›ŞÜÜÚ][Ûœİ]XßBˆ˜ÛÛXİY›Ü›^ÜY[™ÎŒN\Bˆ™]™[X›İÛ^Ù›Û\Ú^™NŒLœBˆ™]™[XXİ[ÛœŞÙØ\\ÛX\™Ú[‹]ÜŒMBˆ™]™[XXİ[ÛÛZ[‹ZZYÚœÜY[™ÎŒMÙ›Û\Ú^™NŒLœBˆ˜\˜Ú]™KZ[›È^Ù›Û\Ú^™NBˆ˜[Y]™[Ë\ÙXİ[Ûˆ™]™[XØ\™XÛÛ\]YÜY[™ÎŒLÜBˆ˜[Y]™[Ë\ÙXİ[Ûˆ™]™[[\İXØ\™ÙÜšY][\]KXÛÛ[[œÎZ[›X^
YœŠNÙØ\ŒLœÜY[™ÎŒLÜBˆ™]™[[\İ][XİÚYÚZYÚØ›Ü™\‹\˜Y]\ÎœÙ›Û\Ú^™NŒŒBˆ˜[Y]™[Ë\ÙXİ[Ûˆ™]™[XØ\™XÛÛ\]Y™]™[Z[™›ÈŞÙ›Û\Ú^™NŒN\Bˆ˜\˜Ú]™KZ[›ÈÙ›Û\Ú^™NŒM\Bˆ˜\˜Ú]™KXØ\™ÜY[™ÎŒN\Bˆ˜\˜Ú]™K[Y]^Ù›Û\Ú^™NŒLœBˆ˜\˜Ú]™KXØ\™Ù›Û\Ú^™NŒN\Bˆ˜\˜Ú]™KXØ\™Ù›Û\Ú^™NŒLÜBˆ˜\˜Ú]™KXXİ[ÛœŞÙØ\ŒLBˆ˜\˜Ú]™KXXİ[ÛœÈ™]™[XXİ[ÛÛZ[‹]ÚYŒLBˆ˜Y™š[X]KZXY[™ÈœÙXİ[Û‹ZXY[™È‹˜Y™š[X]KZXY[™ÈÙ›Û\Ú^™NŒÌBˆ˜Y™š[X]K[›İ^Ù›Û\Ú^™NŒL\Bˆ˜Y™š[X]KXØ\™ÙÜšY][\]KXÛÛ[[œÎŒYœÛZ[‹ZZYÚŒBˆ˜Y™š[X]KZ[XYÙ^ÚZYÚŒL\ÛZ[‹ZZYÚŒL\Bˆ˜Y™š[X]KZ[XYÙ^Ù›^X˜\Ú\ÎŒL\Bˆ˜Y™š[X]KZ[™›ŞÜY[™ÎŒMœBˆ˜Y™š[X]KZ[™›ÈŞÙ›Û\Ú^™NŒMœBˆ˜Y™š[X]KZ[™›ÈÙ›Û\Ú^™NŒLœBˆ˜Y™š[X]KX›İÛHİ›Û™ŞÙ›Û\Ú^™NŒMBˆ˜Y™š[X]KX›İÛH^Ù›Û\Ú^™NŒLœBˆ˜Y™š[X]KXXİ[ÛœŞÙØ\\ÛX\™Ú[‹]ÜŒLœBˆ˜Y™š[X]KXXİ[ÛœÈ^ÛZ[‹ZZYÚœÜY[™ËZ[›[™NŒM\Ù›Û\Ú^™NŒLœBˆ˜Y™š[X]KXXİ[Û‹Y\ØX›YÛZ[‹ZZYÚœÙ›Û\Ú^™NŒL\Bˆ^[[šŞÙ›Û\Ú^™NŒLœBˆ˜ÛÛ[][š]KZ[›™\ˆÙ›Û\Ú^™NŒMBŸB