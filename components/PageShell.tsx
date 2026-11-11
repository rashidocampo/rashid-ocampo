export default function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-sm font-medium tracking-[0.35em] text-sky">{eyebrow}</p>
          <h1 className="mt-2 text-5xl font-medium italic tracking-tight sm:text-6xl">{title}</h1>
        </div>
      </section>
      <section className="bg-gradient-to-br from-paper via-white to-[#e6e9f0] pb-32 pt-12 text-navy-900">
        <div className="mx-auto max-w-6xl px-5 text-xl leading-relaxed sm:px-8">{children}</div>
      </section>
    </>
  );
}
