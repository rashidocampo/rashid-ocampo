/** The site mark: an R standing inside a mosque arch (mihrab). The arch takes the accent colour, the R the text colour. */
export default function Logo({ className = "h-9 w-[1.9rem]" }: { className?: string }) {
  return (
    <svg viewBox="4 -0.5 40 47" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M7 45V21C7 11 15 6 24 1c9 5 17 10 17 20v24" strokeWidth="2.6" style={{ stroke: "color-mix(in oklab, var(--color-royal) 82%, currentColor)" }} />
      <path d="M17 39V17h7.5a6 6 0 0 1 0 12H17M24 29l7 10" stroke="currentColor" strokeWidth="3.4" />
    </svg>
  );
}
