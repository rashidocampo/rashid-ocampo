import { NimbusIcons } from "@/components/ui/liquid-glass-navbar";

const I = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

/** Icons a page can use in the menu, with the small animation each one plays when tapped. */
export const navIcons = {
  home: { icon: NimbusIcons.home, fx: "glow" },
  user: { icon: NimbusIcons.user, fx: "wave" },
  book: { icon: I(<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Zm0 0v13" />), fx: "spin" },
  plane: { icon: NimbusIcons.plane, fx: "plane" },
  globe: { icon: NimbusIcons.globe, fx: "spin" },
  drop: { icon: NimbusIcons.drop, fx: "drop" },
  video: { icon: I(<><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="m16 10.5 5-3v9l-5-3" /></>), fx: "pop" },
  heart: { icon: I(<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />), fx: "pop" },
  star: { icon: I(<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.800L12 16.800l-5.3 2.8 1.1-5.8-4.3-4.1 5.9-.8Z" />), fx: "spin" },
  mic: { icon: I(<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11.500a6.5 6.5 0 0 0 13 0M12 18v3" /></>), fx: "wave" },
} as const;

export type NavIconName = keyof typeof navIcons;

/** Social glyphs, drawn in one line weight to match the rest of the site's icons. */
export const socialIcons = {
  facebook: I(<path d="M17.5 3h-3A4.5 4.5 0 0 0 10 7.5V10H7v4h3v7h4v-7h3l1-4h-4V7.5a1 1 0 0 1 1-1h2.5Z" />),
  instagram: I(<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><path d="M17.2 6.8h.01" /></>),
  github: I(<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.100a4.2 4.2 0 0 0-.1 3.200A4.6 4.6 0 0 0 4 9.500c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />),
  linkedin: I(<><path d="M10 20v-6.500a3.5 3.5 0 0 1 7 0V20h3.500v-6.500a7 7 0 0 0-10.5-6V9" /><path d="M10 9v11H6.500V9ZM3.5 9H7v11H3.500Z" /><circle cx="5.25" cy="4.8" r="1.8" /></>),
  youtube: I(<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.3 5 2.7-5 2.700Z" /></>),
  tiktok: I(<><path d="M13.5 3.500v11a3.8 3.8 0 1 1-3.8-3.8" /><path d="M13.5 3.500c.4 2.8 2.3 4.7 5.2 5" /></>),
} as const;
