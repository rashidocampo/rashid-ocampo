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
export const Bookmark = ({ className }: P) => (
  <svg {...base} className={className}><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-5-7 5V4a1 1 0 0 1 1-1Z" /></svg>
);
export const ReadOnline = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="4.5" width="18" height="12" rx="1.5" /><path d="M3 20h18M8 9h8m-8 3h6" /></svg>
);
export const Readers = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="9" cy="7" r="3" /><path d="M2.5 20v-2a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v2m.5-16a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4.5 5v2" /></svg>
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


/** Additional topic icons, drawn with the same lightweight stroke as existing icons. */
const TopicGlyph = ({ className, children }: P & { children: React.ReactNode }) => (
  <svg {...base} className={className}>{children}</svg>
);
export const Scale = ({ className }: P) => <TopicGlyph className={className}><path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6Zm10 0-4 7h8l-4-7ZM7 21h10" /></TopicGlyph>;
export const Cross = ({ className }: P) => <TopicGlyph className={className}><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" /></TopicGlyph>;
export const Globe = ({ className }: P) => <TopicGlyph className={className}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></TopicGlyph>;
export const Compass = ({ className }: P) => <TopicGlyph className={className}><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></TopicGlyph>;
export const Landmark = ({ className }: P) => <TopicGlyph className={className}><path d="m3 9 9-6 9 6M4 10h16M6 10v9m4-9v9m4-9v9m4-9v9M3 21h18"/></TopicGlyph>;
export const Shield = ({ className }: P) => <TopicGlyph className={className}><path d="M12 2 4 5v6c0 5 3 8 8 11 5-3 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/></TopicGlyph>;
export const Message = ({ className }: P) => <TopicGlyph className={className}><path d="M4 4h16v13H9l-5 4V4z"/><path d="M8 9h8m-8 4h5"/></TopicGlyph>;
export const Users = ({ className }: P) => <TopicGlyph className={className}><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5v1"/></TopicGlyph>;
export const Lightbulb = ({ className }: P) => <TopicGlyph className={className}><path d="M9 18h6m-5 3h4M9 15c-2-1.3-3-3-3-5a6 6 0 0 1 12 0c0 2-1 3.7-3 5l-.5 3h-5z"/></TopicGlyph>;
export const Graduation = ({ className }: P) => <TopicGlyph className={className}><path d="m2 9 10-5 10 5-10 5zM6 12v5c4 3 8 3 12 0v-5m4-3v8"/></TopicGlyph>;
export const Scroll = ({ className }: P) => <TopicGlyph className={className}><path d="M8 4h12v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 6 0v11M9 9h7m-7 4h7"/></TopicGlyph>;
export const History = ({ className }: P) => <TopicGlyph className={className}><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6m3-3v5l4 2"/></TopicGlyph>;
export const Hands = ({ className }: P) => <TopicGlyph className={className}><path d="M3 12v7l5 2 4-3 4 3 5-2v-7M3 12l4-5 5 5 5-5 4 5M8 14l4 4 4-4"/></TopicGlyph>;
export const Leaf = ({ className }: P) => <TopicGlyph className={className}><path d="M20 4C9 3 4 8 4 15a5 5 0 0 0 5 5c7 0 12-5 11-16ZM4 20l12-12"/></TopicGlyph>;
export const Camera = ({ className }: P) => <TopicGlyph className={className}><path d="M3 7h5l2-3h4l2 3h5v13H3z"/><circle cx="12" cy="13" r="4"/></TopicGlyph>;
export const Map = ({ className }: P) => <TopicGlyph className={className}><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16m6-14v16"/></TopicGlyph>;
export const Mic = ({ className }: P) => <TopicGlyph className={className}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0m-7 7v4m-4 0h8"/></TopicGlyph>;
export const FileText = ({ className }: P) => <TopicGlyph className={className}><path d="M6 2h8l5 5v15H6zM14 2v5h5M9 12h7m-7 4h7"/></TopicGlyph>;
export const Puzzle = ({ className }: P) => <TopicGlyph className={className}><path d="M4 4h6a2 2 0 1 1 4 0h6v6a2 2 0 1 1 0 4v6h-6a2 2 0 1 1-4 0H4v-6a2 2 0 1 1 0-4z"/></TopicGlyph>;
export const Sparkles = ({ className }: P) => <TopicGlyph className={className}><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></TopicGlyph>;

export const tagIcons = { book: Book, layers: Layers, sprout: Sprout, infinity: Infinity, moon: Moon, heart: Heart, star: Star, pen: Pen, scale: Scale, cross: Cross, globe: Globe, compass: Compass, landmark: Landmark, shield: Shield, message: Message, users: Users, lightbulb: Lightbulb, graduation: Graduation, scroll: Scroll, history: History, hands: Hands, leaf: Leaf, camera: Camera, map: Map, mic: Mic, file: FileText, puzzle: Puzzle, sparkles: Sparkles } as const;
export const TagIcon = ({ name, className }: { name: string; className?: string }) => {
  const I = tagIcons[name as keyof typeof tagIcons] ?? Book;
  return <I className={className} />;
};
