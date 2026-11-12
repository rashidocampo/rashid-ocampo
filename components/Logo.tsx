/** The site mark: an R whose bowl rises to a pointed arch, with a leaf growing from its leg. */
export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M11 41V16c0-6 6-9 11-13 5 4 10 7 10 15 0 6-4 9-10 9H11" stroke="currentColor" strokeWidth="3.4" />
      <path d="M21 27l12 14" stroke="currentColor" strokeWidth="3.4" />
      <path className="text-royal" d="M31 30c0-6 3-9 9-9 0 6-3 9-9 9Z" fill="currentColor" />
    </svg>
  );
}
