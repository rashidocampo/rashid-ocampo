"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
declare global { interface Window { turnstile?: { render: (selector: HTMLElement, options: Record<string, unknown>) => string; reset: (id?: string) => void; remove: (id: string) => void }; } }
export default function ContactForm({ subjects }: { subjects: string[] }) {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const [token, setToken] = useState("");
  const [started, setStarted] = useState(0);
  useEffect(() => { setStarted(Date.now()); }, []);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  useEffect(() => {
    if (!loaded || !key || !window.turnstile) return;
    const el = document.getElementById("contact-turnstile");
    if (!el) return;
    let widget = "";
    try { widget = window.turnstile.render(el, { sitekey: key, callback: (v: unknown) => { setToken(String(v)); setCaptchaError(""); }, "expired-callback": () => { setToken(""); setCaptchaError("Verification expired. Please complete the check again."); }, "error-callback": () => { setToken(""); setCaptchaError("Security verification could not load. Disable content blockers for this site or retry."); } }); }
    catch { setCaptchaError("Security verification failed to initialize. Please reload the page."); }
    return () => { try { if (widget) window.turnstile?.remove(widget); } catch {} };
  }, [loaded, key]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy || !started) return;
    if (!token) { setStatus("Please complete the security verification before sending."); return; }
    setBusy(true); setStatus("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, token, started }) });
      const body = await r.json();
      setStatus(body.message || "Unable to send.");
      if (r.ok) form.reset();
    } catch { setStatus("Connection failed. Please retry."); }
    window.turnstile?.reset(); setToken(""); setBusy(false);
  }
  return <form onSubmit={submit} className="space-y-5 rounded-3xl border border-royal/25 bg-paper-2 p-6 shadow-[0_18px_45px_-35px_rgba(16,31,56,0.3)] sm:p-9">
    <h2 className="font-display border-b border-royal/20 pb-5 text-3xl italic text-navy-900">Send a Message</h2>
    <div><label htmlFor="contact-name" className="mb-1 block font-semibold">Your Name *</label><input id="contact-name" name="name" className="field" required minLength={2} maxLength={100} autoComplete="name" /></div>
    <div><label htmlFor="contact-email" className="mb-1 block font-semibold">Your Email *</label><input id="contact-email" name="email" type="email" className="field" required maxLength={254} autoComplete="email" /></div>
    <div><label htmlFor="contact-subject" className="mb-1 block font-semibold">Subject *</label><select id="contact-subject" name="subject" className="field" required><option value="">Select a subject</option>{subjects.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
    <div><label htmlFor="contact-message" className="mb-1 block font-semibold">Your Message *</label><textarea id="contact-message" name="message" className="field" required minLength={10} maxLength={4000} rows={6} placeholder="Write your message here..." /></div>
    <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {key ? <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={()=>setLoaded(true)} onReady={()=>setLoaded(true)} onError={()=>setCaptchaError("Unable to load CAPTCHA. Please check your connection.")} /><div id="contact-turnstile" />{captchaError && <p role="alert" className="text-sm text-red-700">{captchaError}</p>}</> : <p className="text-sm text-navy-700">Secure submissions are not yet enabled. CAPTCHA setup is pending.</p>}
    <button className="btn btn-accent w-full" disabled={!key || busy}>{busy ? "Sending..." : "Send Message"}</button>
    {status && <p role="status" className="text-sm text-navy-800">{status}</p>}
    <p className="text-xs text-navy-700">Your inquiry is stored in a private dashboard inbox. No email notifications are sent.</p>
  </form>;
}
