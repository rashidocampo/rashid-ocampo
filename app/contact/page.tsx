import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/data";
export const metadata: Metadata = { title: "Get in Touch", description: "Islamic inquiries, speaking invitations, and web development collaborations." };
export default async function ContactPage() {
  const s = await getSettings();
  const subjects = (s.contactSubjects || "").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,20);
  return <main className="relative isolate overflow-hidden bg-gradient-to-b from-paper via-[#faf5e9] to-[#d5e9df]">
    <div className="wrap relative z-10 grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
      <section className="space-y-7"><p className="text-sm font-semibold uppercase tracking-[.3em] text-royal">Contact</p>
        <h1 className="font-display text-5xl italic text-navy-900 sm:text-6xl">{s.contactHeading || "Get in Touch"}</h1>
        <p className="max-w-xl text-lg leading-relaxed text-navy-800">{s.contactIntro}</p>
        <div className="space-y-4 border-t border-royal/20 pt-6">
          {s.contactPublicEmail && <p><strong>Email</strong><span className="block break-all">{s.contactPublicEmail}</span></p>}
          {s.contactTelegram && <p><strong>Telegram</strong><span className="block">{s.contactTelegram}</span></p>}
          {s.contactWhatsapp && <p><strong>WhatsApp</strong><span className="block">{s.contactWhatsapp}</span></p>}
          {s.contactResponseTime && <p><strong>Response Time</strong><span className="block">{s.contactResponseTime}</span></p>}
        </div>
      </section><ContactForm subjects={subjects.length ? subjects : ["General Inquiry","Islamic Question","Lecture Invitation","Web Development & Project Collaboration","Website Development Request","Project Quotation","Other"]}/>
    </div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#477e70]/20 to-transparent" />
  </main>;
}
