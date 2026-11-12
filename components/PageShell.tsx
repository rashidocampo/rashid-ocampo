/** Inner-page frame: the headline, a line of meta beneath it, a gilded rule, then the content. */
export default function PageShell({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="paper">
      <div className="wrap pb-24 pt-14 sm:pb-32 sm:pt-20">
        <header className="max-w-[52rem]">
          <h1 dir="auto" className="display-lg">{title}</h1>
          {eyebrow && <p dir="auto" className="sentence muted mt-4 text-base">{eyebrow}</p>}
        </header>
        <div className="rule mb-10 mt-8 sm:mb-14" />
        {children}
      </div>
    </div>
  );
}
