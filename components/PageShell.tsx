import SplitText from "./SplitText";

/** Inner-page frame: a soft tinted band with the headline, then the content on paper. */
export default function PageShell({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper-2" data-parallax-root>
        <div className="pattern pointer-events-none absolute -right-[12%] -top-[60%] -z-10 aspect-square w-[40rem] bg-royal opacity-[0.1]" data-parallax="0.2" aria-hidden />
        <div className="wrap py-12 sm:py-16">
          {eyebrow && <p dir="auto" className="caps text-royal" data-hero="0">{eyebrow}</p>}
          <h1 dir="auto" className="display-lg mt-3 max-w-[20ch]" data-hero="1" data-hero-kind="words"><SplitText text={title} /></h1>
          <div className="rule mt-6" data-hero="2" />
        </div>
      </section>
      <div className="wrap pb-20 pt-10 sm:pb-24 sm:pt-14">{children}</div>
    </>
  );
}
