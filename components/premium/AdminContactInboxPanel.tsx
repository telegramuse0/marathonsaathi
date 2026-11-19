'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ContactMessage = { id: number; name: string; email: string; message: string; created_at: string };

function submittedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminContactInboxPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workingId, setWorkingId] = useState<number | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100);
    if (loadError) setError(loadError.message);
    else { setError(''); setMessages((data || []) as ContactMessage[]); }
    setLoading(false);
  }, []);

  useEffect(() => { void loadMessages(); }, [loadMessages]);

  const removeMessage = async (item: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${item.name}?`)) return;
    setWorkingId(item.id);
    const { error: deleteError } = await supabase.from('contact_messages').delete().eq('id', item.id);
    if (deleteError) setError(deleteError.message);
    else setMessages((current) => current.filter((message) => message.id !== item.id));
    setWorkingId(null);
  };

  return <section id="admin-contact-messages" className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-sm font-black uppercase tracking-wide text-slate-900">Contact messages ({messages.length})</h2><p className="mt-1 text-xs text-slate-500">Messages from the public contact form.</p></div>
      <button type="button" onClick={() => void loadMessages()} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Refresh</button>
    </div>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
    {loading ? <p className="text-sm text-slate-500">Loading messages…</p> : messages.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">No contact messages yet.</p> : <div className="space-y-3">
      {messages.map((item) => <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0"><strong className="text-sm text-slate-900">{item.name}</strong><p className="mt-1 break-all text-xs text-orange-700"><a href={`mailto:${item.email}`}>{item.email}</a></p><p className="mt-1 text-[10px] text-slate-400">{submittedAt(item.created_at)}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.message}</p></div>
          <button disabled={workingId === item.id} type="button" onClick={() => void removeMessage(item)} className="shrink-0 rounded-lg bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">Delete</button>
        </div>
      </article>)}
    </div>}
  </section>;
}

