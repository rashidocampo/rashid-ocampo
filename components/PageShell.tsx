import SplitText from "./SplitText";

/** Inner-page frame: an aurora-lit band with the headline rising in, then the content on paper. */
export default function PageShell({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="ink relative isolate overflow-hidden" data-parallax-root>
        <div className="aurora -z-10" data-parallax="0.3" aria-hidden><span /><span /><span /><span /></div>
        <div className="pointer-events-none absolute -right-[20%] top-1/2 -z-10 aspect-square w-[52rem] -translate-y-1/2" data-parallax="0.18" aria-hidden>
          <div className="pattern spin-slow h-full w-full bg-gold opacity-[0.12]" />
        </div>
        <div className="wrap pb-14 pt-32 sm:pb-20 sm:pt-40" data-parallax="-0.12" data-parallax-min="1024">
          <h1 dir="auto" className="display-lg max-w-[18ch]" data-hero="0" data-hero-kind="letters"><SplitText text={title} /></h1>
          {eyebrow && <p dir="auto" className="sentence mt-5 text-base text-white/75" data-hero="2">{eyebrow}</p>}
        </div>
        <div className="rule" />
      </section>
      <div className="paper">
        <div className="wrap pb-24 pt-12 sm:pb-32 sm:pt-16">{children}</div>
      </div>
    </>
  );
}
