import { useId } from "react";

/** The site mark: a prayer-niche arch with an R cut out of it. Takes its colour from `currentColor`. */
export default function Logo({ className = "h-9 w-[1.8rem]" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="4 1 56 77" aria-hidden className={className}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="80">
          <rect width="64" height="80" fill="#fff" />
          <path d="M22 66V34c0-5 4-8 10-12 6 4 10 7 10 13 0 5-4 8-9 8h-11M31 43l11 23" fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      <path d="M6 76V36C6 20 20 12 32 3c12 9 26 17 26 33v40Z" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}
