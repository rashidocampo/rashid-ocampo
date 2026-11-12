/** The site mark from the design: a pointed arch with a sprout growing inside it. */
export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M6 40V20C6 12 13 8 20 3c7 5 14 9 14 17v20" stroke="currentColor" strokeWidth="2.6" />
      <path d="M3 40h34" stroke="currentColor" strokeWidth="2.6" />
      <g className="text-royal" stroke="currentColor" strokeWidth="2">
        <path d="M20 40V26" />
        <path d="M20 31c0-5-3-7-7-7 0 5 2 7 7 7Z" fill="currentColor" fillOpacity=".25" />
        <path d="M20 28c0-5 3-7 7-7 0 5-2 7-7 7Z" fill="currentColor" fillOpacity=".25" />
      </g>
    </svg>
  );
}
