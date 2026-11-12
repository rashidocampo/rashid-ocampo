/** The site mark: an R whose bowl rises to a pointed arch. */
export default function Logo({ className = "h-8 w-6" }: { className?: string }) {
  return (
    <svg viewBox="8 1 28 42" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M11 41V16c0-6 6-9 11-13 5 4 10 7 10 15 0 6-4 9-10 9H11" stroke="currentColor" strokeWidth="3.4" />
      <path d="M21 27l12 14" stroke="currentColor" strokeWidth="3.4" />
    </svg>
  );
}
