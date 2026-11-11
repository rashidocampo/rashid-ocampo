import { Star8 } from "./Icons";

export default function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="hero-bg relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-1/2 -mt-48 h-96 w-96 text-sky/15" data-parallax="0.25" aria-hidden>
          <Star8 className="spin-slow h-full w-full" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-sm font-medium tracking-[0.35em] text-sky">{eyebrow}</p>
          <h1 dir="auto" className="mt-2 text-6xl leading-none sm:text-7xl">{title}</h1>
        </div>
      </section>
      <section className="bg-gradient-to-br from-paper via-white to-[#e6e9f0] pb-32 pt-12 text-navy-900">
        <div className="mx-auto max-w-6xl px-5 text-xl leading-relaxed sm:px-8">{children}</div>
      </section>
    </>
  );
}
