'use client';

import { FormEvent, useState } from 'react';
import SiteFooter from '@/components/premium/SiteFooter';
import SiteHeader from '@/components/premium/SiteHeader';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setNotice('');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(), email: form.email.trim().toLowerCase(), message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      setNotice('Message abhi send nahi ho paya. Please thodi der baad try karein.');
      return;
    }
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return <main className="min-h-screen bg-[#faf8f4]">
    <SiteHeader />
    <section className="contact-page page-width">
      <div className="contact-intro"><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Talk to <em>our team.</em></h1><p>Race listing, website ya runner community ke baare mein sawal hai? Message bhejiye; team admin inbox me dekhegi.</p><div className="contact-email"><span>Email us directly</span><a href="mailto:marathonsaathi@gmail.com">marathonsaathi@gmail.com</a></div></div>
      <form onSubmit={submit} className="contact-form">
        <label>Your name<input required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" /></label>
        <label>Email address<input required type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
        <label>How can we help?<textarea required minLength={10} maxLength={3000} rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your message…" /></label>
        <p className="contact-privacy">Your details are sent securely to MarathonSaathi’s admin inbox and are used to reply to your message.</p>
        <button disabled={sending || sent} type="submit">{sending ? 'Sending…' : sent ? 'Message sent' : 'Send message'} <span aria-hidden="true">→</span></button>
        {notice && <p role="alert" className="contact-notice">{notice}</p>}
        {sent && <p role="status" className="contact-success">Thanks, {form.name || 'runner'}! Your message has been sent to our team.</p>}
      </form>
    </section>
    <SiteFooter />
  </main>;
}
