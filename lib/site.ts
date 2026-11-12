// Public Supabase project details (the publishable key is safe to ship to browsers;
// all write access is enforced by database row-level security).
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://esnvyrhepkewnsqqvtgm.supabase.co";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_JxuS17Ko-Uw6DgRU2HBpAQ_2OCZZSCg";
export const ADMIN_EMAIL = "rashidocampo@gmail.com";

/** Public address of the site. Set NEXT_PUBLIC_SITE_URL when a custom domain is added. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rashid-ocampo.vercel.app").replace(/\/$/, "");

export const site = { name: "Rashid Ocampo" };

export const DEFAULT_THEME = "#1560e8";

export type Settings = {
  siteName: string;
  homeNavLabel: string;
  blogNavLabel: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  heroSecondaryLink: string;
  featuredLabel: string;
  homeBlogEyebrow: string;
  homeBlogTitle: string;
  homeBlogLinkLabel: string;
  blogEyebrow: string;
  blogTitle: string;
  footerButton1Label: string;
  footerButton1Link: string;
  footerButton2Label: string;
  footerButton2Link: string;
  copyright: string;
  socialFacebook: string;
  socialInstagram: string;
  socialGithub: string;
  socialLinkedin: string;
  socialYoutube: string;
  socialTiktok: string;
  greeting: string;
  tagline: string;
  description: string;
  heroImage: string;
  videoTitle: string;
  videoBlurb: string;
  youtubeUrl: string;
  footerHeading: string;
  footerText: string;
  headlineFont: "solid" | "inline";
  /** How the hero photo sits in its frame. */
  heroFit: "cover" | "contain";
  heroZoom: number;
  heroX: number;
  heroY: number;
  /** Main theme colour as #rrggbb; the rest of the palette is derived from it. */
  themeColor: string;
};

export const defaultSettings: Settings = {
  siteName: "Rashid Ocampo",
  homeNavLabel: "Home",
  blogNavLabel: "Blog",
  heroPrimaryLabel: "Watch My Latest Video",
  heroSecondaryLabel: "Learn More About Me",
  heroSecondaryLink: "/about",
  featuredLabel: "FEATURED VIDEO",
  homeBlogEyebrow: "LATEST",
  homeBlogTitle: "Blog Posts",
  homeBlogLinkLabel: "View All Posts",
  blogEyebrow: "LATEST",
  blogTitle: "Blog Posts",
  footerButton1Label: "Read the Blog",
  footerButton1Link: "/blog",
  footerButton2Label: "Get in Touch",
  footerButton2Link: "/contact",
  copyright: "All rights reserved.",
  socialFacebook: "",
  socialInstagram: "",
  socialGithub: "",
  socialLinkedin: "",
  socialYoutube: "",
  socialTiktok: "",
  greeting: "ASSALĀMU ‘ALAYKUM",
  tagline: "A Balik-Islam",
  description:
    "Sharing the beauty of Islam, reflections on faith, and reminders to return to Allah with knowledge, sincerity, and hope.",
  heroImage: "/images/hero.jpg",
  videoTitle: "My Journey to Islam",
  videoBlurb: "A short story of how Allah guided me back to Islam, and what I learned along the way.",
  youtubeUrl: "",
  footerHeading: "Stay Connected",
  headlineFont: "solid",
  heroFit: "cover",
  heroZoom: 100,
  heroX: 50,
  heroY: 0,
  themeColor: DEFAULT_THEME,
  footerText: "New videos, articles, and reminders are shared here. Questions and invitations are always welcome.",
};

/** A page the owner writes in the dashboard, shown at /<slug>. */
export type Page = {
  id: string;
  slug: string;
  title: string;
  nav_label: string;
  eyebrow: string;
  description: string;
  content: string;
  icon: string;
  show_in_nav: boolean;
  sort: number;
  published: boolean;
};

/** The Blog link sits at this position among the pages in the menu. */
export const BLOG_NAV_SORT = 20;

/** Addresses that belong to built-in parts of the site and cannot be used for a page. */
export const RESERVED_SLUGS = ["blog", "tag", "admin", "api", "images", "opengraph-image", "sitemap.xml", "robots.txt", "icon.png", "apple-icon.png", "favicon.ico", "manifest.webmanifest"];

/** Used only if the database cannot be reached. */
export const fallbackPages: Page[] = [
  { id: "about", slug: "about", title: "About", nav_label: "About", eyebrow: "ABOUT", description: "", content: "My full story is being written and will be shared here soon, in shā’ Allāh.", icon: "user", show_in_nav: true, sort: 10, published: true },
  { id: "contact", slug: "contact", title: "Get in Touch", nav_label: "Contact", eyebrow: "CONTACT", description: "", content: "Questions about Islam, invitations to speak, or simply a salām — you are welcome to reach out.", icon: "plane", show_in_nav: true, sort: 30, published: true },
];

export type NavItem = { label: string; href: string; icon: string };

/** Menu: Home, then pages and the Blog link in their chosen order. */
export function buildNav(st: Settings, pages: Page[]): NavItem[] {
  const rest = [
    ...pages.filter((p) => p.show_in_nav).map((p) => ({ label: p.nav_label || p.title, href: `/${p.slug}`, icon: p.icon, sort: p.sort })),
    { label: st.blogNavLabel, href: "/blog", icon: "book", sort: BLOG_NAV_SORT },
  ].sort((a, b) => a.sort - b.sort);
  return [{ label: st.homeNavLabel, href: "/", icon: "home" }, ...rest.map(({ sort: _sort, ...item }) => item)];
}

export type Tag = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  show_on_home: boolean;
  sort: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  show_on_home: boolean;
  published_at: string;
  tags: Tag[];
};

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const youtubeId = (url: string) => {
  const m = url.trim().match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(url.trim()) ? url.trim() : "";
};

/** Headline typefaces the owner can switch between in the dashboard. */
export const headlineFonts = {
  solid: { label: "New Amsterdam (solid)", family: '"New Amsterdam", "El Messiri", "Arial Narrow", sans-serif', weight: 400, transform: "none" },
  inline: { label: "Big Shoulders Inline (same shape, with an inline)", family: '"Big Shoulders Inline Variable", "El Messiri", "Arial Narrow", sans-serif', weight: 800, transform: "uppercase" },
} as const;

/** Inline style for the hero photo, from the owner's fit / zoom / position settings. */
export const heroImageStyle = (st: Settings) => ({
  objectFit: st.heroFit === "contain" ? ("contain" as const) : ("cover" as const),
  objectPosition: `${st.heroX}% ${st.heroY}%`,
  transform: `scale(${Math.max(50, Math.min(300, Number(st.heroZoom) || 100)) / 100})`,
  transformOrigin: `${st.heroX}% ${st.heroY}%`,
});

/** Builds the whole site palette (dark backgrounds, accent, highlights) from one chosen colour. */
export function themePalette(hex: string): Record<string, string> | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m || `#${m[1].toLowerCase()}` === DEFAULT_THEME) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = Math.round((h * 60 + 360) % 360);
  const k = Math.min(1, sat / 0.8); // greys stay grey
  const c = (s: number, li: number) => `hsl(${h} ${Math.round(s * k)}% ${li}%)`;
  // Yellows and greens are bright, so the accent is darkened to keep white text readable on it.
  const accent = h > 40 && h < 200 ? 34 : 47;
  return {
    "--color-navy-950": c(85, 7),
    "--color-navy-900": c(80, 12),
    "--color-navy-800": c(76, 17),
    "--color-navy-700": c(72, 24),
    "--color-royal": c(83, accent),
    "--color-royal-light": c(95, 64),
    "--color-sky": c(100, 78),
  };
}
