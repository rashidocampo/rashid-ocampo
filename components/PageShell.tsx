import Ribbons from "./Ribbons";

export default function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="hero-bg relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 -right-[10%] w-[80%] text-sky/30" data-parallax="0.2" aria-hidden>
          <Ribbons className="ribbon-drift h-full w-full" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          {eyebrow && <p dir="auto" className="text-sm font-medium tracking-[0.35em] text-sky">{eyebrow}</p>}
          <h1 dir="auto" className="mt-2 text-6xl leading-none sm:text-7xl">{title}</h1>
        </div>
      </section>
      <section className="bg-gradient-to-br from-paper via-white to-[#e6e9f0] pb-32 pt-12 text-navy-900">
        <div className="mx-auto max-w-6xl px-5 text-xl leading-relaxed sm:px-8">{children}</div>
      </section>
    </>
  );
}
