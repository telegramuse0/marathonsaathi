'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SiteFooter from '@/components/premium/SiteFooter';
import AdminFeedbackPanel from '@/components/premium/AdminFeedbackPanel';
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

type MarathonRow = { id: number; name: string; description: string | null; venue: string | null; location_details: string | null; date: string; registration_link: string | null; image: string | null; status: string | null; distance: string | null; organizer: string | null; fee: string | null; schedule: string | null; photos_url: string | null; results_url: string | null; awards: string | null; runner_benefits: string | null };

const rowToEvent = (row: MarathonRow): AdminMarathon => {
  const venue = row.venue || '';
  const parts = venue.split(',').map((part) => part.trim());
  return {
    id: Number(row.id), name: row.name || '', city: parts[0] || venue || '', state: parts.slice(1).join(', '),
    date: row.date || '', distance: row.distance || '', registrationUrl: row.registration_link || '',
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
      alert('This event already has official links. Edit that event’s links instead.');
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
      name: '', city: '', state: '', date: '', distance: '', registrationUrl: '',
      organizer: '', badge: '', bannerImage: '', about: '', venue: '',
      entryFee: '', schedule: '', photosUrl: '', resultsUrl: '', awards: '', runnerBenefits: '',
    });
    setCustomDistance('');
    setEditingEventId(null);
    setShowAddEvent(false);
  };

  const handleEventFormChange = (
    field: keyof typeof eventForm,
    value: string
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
            Exit Admin ↗
          </Link>
        </div>

        {authLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Checking admin session…</div>
        ) : !isAdminAuth ? (
          /* LOGIN */
          <form
            onSubmit={handleAdminLogin}
            className="space-y-5 max-w-sm mx-auto py-10"
          >
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🔐</div>
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
              {authSubmitting ? 'Signing in…' : 'Login Admin'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">

            {/* ADMIN STATUS */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                🔒
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
              <a href="#admin-feedback" className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Runner Feedback</a>
            </nav>

            <AdminFeedbackPanel />

            {/* RUNNER'S STORE PRODUCT MANAGEMENT */}
            <section id="admin-products" className="scroll-mt-24 space-y-5 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-[#0F172A] uppercase tracking-wider">🛍️ Runner’s Store — Products ({products.length})</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Products yahan add/edit karein. Active products public store par dikhaye ja sakte hain.</p>
                </div>
                {editingProductId !== null && <button type="button" onClick={resetProductForm} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold">Cancel edit</button>}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <h5 className="font-black text-sm">{editingProductId !== null ? '✏️ Edit Product' : '➕ Add New Product'}</h5>
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
                <button disabled={productSaving} type="submit" className="bg-[#FF5500] disabled:opacity-60 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-xs">{productSaving ? 'Saving…' : editingProductId !== null ? 'Save Product Changes' : 'Add Product'}</button>
              </form>

              <div className="space-y-3">
                {productsLoading ? <p className="text-xs text-slate-500">Loading products…</p> : products.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">Abhi products nahi hain. Upar form se pehla product add karein.</p> : products.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row gap-4 sm:items-center rounded-xl border border-slate-200 bg-white p-4">
                    {product.image_url ? <img src={product.image_url} alt={product.name} className="h-20 w-20 rounded-lg object-cover border border-slate-100" /> : <div className="h-20 w-20 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">👟</div>}
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-xs">{product.name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{product.is_active ? 'Active' : 'Hidden'}</span></div><p className="text-[10px] text-slate-500 mt-1">{product.category}{product.price !== null ? ` • ₹${Number(product.price).toLocaleString('en-IN')}` : ''}</p><p className="text-[10px] text-slate-500 mt-1 break-all">Amazon: {product.amazon_url || 'Not set'} • Flipkart: {product.flipkart_url || 'Not set'}</p></div>
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
                    🏃 Manage Marathon Events ({marathons.length})
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
                  {showAddEvent ? '✕ Close Form' : '➕ Add New Event'}
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
                        ? '✏️ Edit Marathon Event'
                        : '➕ Add New Marathon Event'}
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Distance *
                      </label>
                      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-3">
                        {COMMON_DISTANCES.map((distanceOption) => {
                          const selected = eventForm.distance.split(',').map((value) => value.trim()).filter(Boolean);
                          return <label key={distanceOption} className="flex items-center gap-2 text-xs text-slate-700">
                            <input type="checkbox" checked={selected.includes(distanceOption)} onChange={(e) => {
                              const next = e.target.checked ? [...selected, distanceOption] : selected.filter((value) => value !== distanceOption);
                              handleEventFormChange('distance', next.join(', '));
                            }} />
                            {distanceOption}
                          </label>;
                        })}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input value={customDistance} onChange={(e) => setCustomDistance(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const value = customDistance.trim(); const current = eventForm.distance.split(',').map((item) => item.trim()).filter(Boolean); if (value && !current.includes(value)) handleEventFormChange('distance', [...current, value].join(', ')); setCustomDistance(''); } }} placeholder="Custom distance, e.g. 8K" className="min-w-0 flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500" />
                        <button type="button" onClick={() => { const value = customDistance.trim(); const current = eventForm.distance.split(',').map((item) => item.trim()).filter(Boolean); if (value && !current.includes(value)) handleEventFormChange('distance', [...current, value].join(', ')); setCustomDistance(''); }} className="shrink-0 rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-bold text-white">Add distance</button>
                      </div>
                      {eventForm.distance.split(',').map((value) => value.trim()).filter((value) => value && !COMMON_DISTANCES.includes(value)).map((value) => <label key={value} className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs text-slate-700"><input type="checkbox" checked onChange={() => handleEventFormChange('distance', eventForm.distance.split(',').map((item) => item.trim()).filter((item) => item && item !== value).join(', '))} />{value}</label>)}
                      <p className="text-[10px] text-slate-400 mt-1">Multiple distances select karein ya apna custom distance add karein.</p>
                      </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Badge
                      </label>
                      <select
                        value={eventForm.badge}
                        onChange={(e) => handleEventFormChange('badge', e.target.value)}
                        className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                      >
                        <option value="">Select badge</option>
                        <option value="New">New</option>
                        <option value="Popular">Popular</option>
                        <option value="Featured">Featured</option>
                        <option value="Bronze Label">Bronze Label</option>
                        <option value="Gold Label">Gold Label</option>
                        <option value="Platinum Label">Platinum Label</option>
                        <option value="Scenic">Scenic</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                    </div>

                  </div>
                  </div>

                  <div className="rounded-xl border border-orange-100 bg-white/80 p-4 sm:p-5 space-y-3">
                    <div><h6 className="font-black text-xs uppercase tracking-wide text-slate-800">2. Registration &amp; event presentation</h6><p className="mt-1 text-[10px] text-slate-500">Registration link aur event card par dikhne wali image.</p></div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      🌐 Official Registration URL (optional)
                    </label>
                    <input
                      type="url"
                      value={eventForm.registrationUrl}
                      onChange={(e) => handleEventFormChange('registrationUrl', e.target.value)}
                      placeholder="Optional: https://official-event-website.com/"
                      className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  </div>

                  <div className="rounded-xl border border-orange-100 bg-white/80 p-4 sm:p-5 space-y-4">
                    <div><h6 className="font-black text-xs uppercase tracking-wide text-slate-800">3. Event details &amp; results</h6><p className="mt-1 text-[10px] text-slate-500">Optional details help runners decide. Results and photos links will show after race day.</p></div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Event Banner Image
                      </label>
                      <label className="inline-flex items-center bg-orange-600 hover:bg-orange-500 text-white font-black px-4 py-2.5 rounded-xl text-xs cursor-pointer transition">
                        {eventForm.bannerImage ? 'Replace Banner' : 'Upload Event Banner'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            handleEventBannerImageUpload(e.target.files?.[0]);
                            e.currentTarget.value = '';
                          }}
                        />
                      </label>

                      {eventForm.bannerImage && (
                        <img
                          src={eventForm.bannerImage}
                          alt="Event banner preview"
                          className="w-full h-44 object-cover rounded-xl mt-3 border border-slate-200"
                        />
                      )}

                      <p className="text-[10px] text-slate-400 mt-1">
                        This image appears on the event card and its details page. Max 2 MB.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {([
                        ['about', 'About Event', 'What runners should know about the race'],
                        ['venue', 'Venue & Location', 'Venue, route or location details'],
                        ['entryFee', 'Entry Fees', 'Fees by race category'],
                        ['schedule', 'Race Schedule', 'Reporting, start and flag-off timings'],
                        ['awards', 'Awards & Prizes', 'Prize and award details'],
                        ['runnerBenefits', 'Runner Benefits', 'T-shirt, bib, timing, refreshments etc.'],
                      ] as const).map(([field, label, placeholder]) => (
                        <div key={field}>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            {label}
                          </label>
                          <textarea
                            value={eventForm[field]}
                            onChange={(e) =>
                              setEventForm((previous) => ({
                                ...previous,
                                [field]: e.target.value,
                              }))
                            }
                            rows={3}
                            placeholder={placeholder}
                            className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500 resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="bg-[#0F172A] hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl text-xs cursor-pointer transition"
                    >
                      {editingEventId !== null
                        ? 'Save Event Changes'
                        : '➕ Add Marathon Event'}
                    </button>

                    {editingEventId !== null && (
                      <button
                        type="button"
                        onClick={resetEventForm}
                        className="bg-white border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {eventsLoading ? <p className="text-sm text-slate-500">Loading events from Supabase…</p> : marathons.length === 0 ? <p className="text-sm text-slate-500">Supabase table mein abhi koi event nahi hai.</p> : marathons.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div>
                      <strong className="text-xs">{event.name}</strong>
                      <p className="text-[10px] text-slate-500 mt-1">
                        📅 {formatDate(event.date)} &nbsp;•&nbsp; 📍 {event.city}, {event.state}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        🏃 {event.distance} &nbsp;•&nbsp; 🏢 {event.organizer}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEventEdit(event)}
                        className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMarathon(event.id)}
                        className="bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PUBLISH RESULTS & PHOTOS */}
            <section id="admin-results" className="scroll-mt-24 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
              <div>
                <h4 className="font-black text-sm text-[#0F172A] uppercase tracking-wider">
                  🏁 Publish Results & Organizer Photos
                </h4>

                <p className="text-[11px] text-slate-500 mt-1">
                  Select the exact marathon event. Add the links only when the organizer provides them.
                </p>
              </div>

              <form onSubmit={handlePublish} className="space-y-4">

                {/* EVENT SELECT */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Event *
                  </label>

                  <select
                    value={selectedEventId}
                    onChange={(e) => handleSelectEvent(e.target.value)}
                    required
                    className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500"
                  >
                    <option value="">Select a marathon event</option>

                    {availableEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} — {formatDate(event.date)}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedExistingRecord && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                    This event already has a record. Please use the <strong>Edit</strong> button below.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {/* RESULTS URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      🏁 Official Results URL
                    </label>

                    <input
                      type="url"
                      value={resultsUrl}
                      onChange={(e) => setResultsUrl(e.target.value)}
                      placeholder="https://official-results-website.com/..."
                      className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                    />

                    <p className="text-[10px] text-slate-400 mt-1">
                      Optional — add when organizer provides the official result link.
                    </p>
                  </div>

                  {/* PHOTOS URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      📸 Organizer / Photos URL
                    </label>

                    <input
                      type="url"
                      value={photosUrl}
                      onChange={(e) => setPhotosUrl(e.target.value)}
                      placeholder="https://kwikpic.in/... or organizer gallery"
                      className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500"
                    />

                    <p className="text-[10px] text-slate-400 mt-1">
                      Optional — add when the organizer shares the photo gallery.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Rule:</strong>{' '}
                  At least one official link is required. You can publish Results only, Photos only, or both.
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs cursor-pointer transition"
                >
                  Publish Results & Links
                </button>
              </form>
            </section>

            {/* PUBLISHED RECORDS */}
            <section id="admin-published" className="scroll-mt-24 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-sm text-[#0F172A] uppercase tracking-wider">
                    Manage Results & Photo Links
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {resultsLinks.length} event record{resultsLinks.length === 1 ? '' : 's'} saved in Supabase.
                  </p>
                </div>
              </div>

              {resultsLinks.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <h5 className="font-black text-sm">No Results or Photos Published Yet</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Select an event above when an organizer provides the official links.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resultsLinks.map((item) => {
                    const event = getEvent(item.eventId);
                    return (
                      <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        {editingId === item.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Event *</label>
                              <select value={editEventId} onChange={(e) => setEditEventId(e.target.value)} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500">
                                {marathons.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} — {formatDate(candidate.date)}</option>)}
                              </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input type="url" value={editResultsUrl} onChange={(e) => setEditResultsUrl(e.target.value)} placeholder="Official Results URL" className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500" />
                              <input type="url" value={editPhotosUrl} onChange={(e) => setEditPhotosUrl(e.target.value)} placeholder="Organizer / Photos URL" className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-500" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => saveEdit(item.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition">Save Changes</button>
                              <button type="button" onClick={cancelEdit} className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer transition">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">Published</span>
                                {event && <span className="text-[10px] font-semibold text-slate-500">{formatDate(event.date)}</span>}
                              </div>
                              <h5 className="font-black text-sm mt-2">{event?.name || 'Unknown Event'}</h5>
                              {event && <p className="text-[10px] text-slate-500 mt-1">📍 {event.city}, {event.state} &nbsp;•&nbsp; 🏃 {event.distance}</p>}
                              <div className="flex flex-col gap-1 mt-3 text-[10px] text-slate-500 break-all">
                                <span>🏁 Results: {item.resultsUrl || 'Not provided'}</span>
                                <span>📸 Photos: {item.photosUrl || 'Not provided'}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                              <button type="button" onClick={() => startEdit(item)} className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition">✏️ Edit</button>
                              <button type="button" onClick={() => handleDeleteResult(item.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition">🗑️ Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
