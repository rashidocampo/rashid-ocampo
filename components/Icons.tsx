type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const Arrow = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);
export const Play = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}><path d="M7 4.5v15l13-7.5z" /></svg>
);
export const Search = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
);
export const Book = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5v13" /></svg>
);
export const Layers = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
);
export const Sprout = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="M12 21v-9M12 12c0-4-3-7-8-7 0 5 3 8 8 7zM12 14c0-3 3-6 8-6 0 5-3 7-8 6zM8 21h8" /></svg>
);
export const Infinity = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="M12 12c-2-3-4-4.5-6.5-4.5a4.5 4.5 0 0 0 0 9C8 16.5 10 15 12 12zm0 0c2 3 4 4.5 6.5 4.5a4.5 4.5 0 0 0 0-9C16 7.5 14 9 12 12z" /></svg>
);
export const Calendar = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M8 3v4M16 3v4M8 14h2M14 14h2" /></svg>
);
export const Mail = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Moon = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
);
export const Heart = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" /></svg>
);
export const Star = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="m12 3 2.7 5.8 6.3.800-4.6 4.4 1.2 6.200L12 17.2 6.4 20.200l1.2-6.200L3 9.600l6.3-.800z" /></svg>
);
export const Pen = ({ className }: P) => (
  <svg {...base} strokeWidth={1.2} className={className}><path d="M4 20l1-5L16.5 3.500a2.1 2.1 0 0 1 3 3L8 18zM14 6l4 4" /></svg>
);

export const tagIcons = { book: Book, layers: Layers, sprout: Sprout, infinity: Infinity, moon: Moon, heart: Heart, star: Star, pen: Pen } as const;
export const TagIcon = ({ name, className }: { name: string; className?: string }) => {
  const I = tagIcons[name as keyof typeof tagIcons] ?? Book;
  return <I className={className} />;
};

/** Eight-pointed star (khatim): two overlapping squares. */
export const Star8 = ({ className }: P) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden className={className}>
    <rect x="18" y="18" width="64" height="64" />
    <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" />
    <circle cx="50" cy="50" r="22" />
  </svg>
);
