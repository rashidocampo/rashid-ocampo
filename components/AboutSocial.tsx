import { socialIcons } from "./NavIcons";
import type { Settings } from "@/lib/site";
const items = [
  { name: "Facebook · Official Page", detail: "Rashid Ocampo Official Page", icon: "facebook", key: "socialFacebook" },
  { name: "Facebook · Community", detail: "Rashid Ocampo Profile", icon: "facebook", key: "" },
  { name: "YouTube", detail: "Rashid Ocampo Channel", icon: "youtube", key: "socialYoutube" },
  { name: "TikTok", detail: "@rashidocampotk", icon: "tiktok", key: "socialTiktok" },
  { name: "Instagram", detail: "@ocamporobby", icon: "instagram", key: "socialInstagram" },
  { name: "SlideShare", detail: "Robby Ocampo on SlideShare", icon: "", key: "" },
] as const;
export default function AboutSocial({ settings }: { settings: Settings }) {
 return <section className="mt-12 border-t border-royal/30 pt-12 sm:mt-20 sm:pt-16">
  <div className="mb-8 max-w-2xl"><p className="caps text-royal">Find my work</p><h2 className="font-display mt-3 text-4xl italic">Connect &amp; Follow</h2><p className="mt-3 leading-relaxed">Lectures, articles, educational materials, and community updates across my official platforms.</p></div>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item,i)=>{
    const url=item.key ? settings[item.key as keyof Settings] : "";
    const valid=typeof url==="string" && /^https?:\/\//.test(url);
    const inner=<><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-royal/20 bg-royal/10 text-royal [&>svg]:h-6 [&>svg]:w-6">{item.icon ? socialIcons[item.icon as keyof typeof socialIcons] : <span className="font-display text-xl font-bold">S</span>}</span><span className="min-w-0"><span className="block text-sm font-semibold text-navy-950">{item.name}</span><span className="block break-words text-sm opacity-70">{item.detail}</span></span>{valid&&<span className="ms-auto text-royal" aria-hidden>↗</span>}</>;
    const cls="flex min-h-24 items-center gap-4 rounded-2xl border border-royal/15 bg-paper-2/70 p-4 transition hover:border-royal/40 hover:bg-paper-2";
    return valid?<a key={i} className={cls} href={url} target="_blank" rel="noopener noreferrer">{inner}</a>:<div key={i} className={cls}>{inner}</div>;
  })}</div>
 </section>;
}