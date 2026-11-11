// Public Supabase project details (the publishable key is safe to ship to browsers;
// all write access is enforced by database row-level security).
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://esnvyrhepkewnsqqvtgm.supabase.co";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_JxuS17Ko-Uw6DgRU2HBpAQ_2OCZZSCg";
export const ADMIN_EMAIL = "rashidocampo@gmail.com";

export const site = { name: "Rashid Ocampo" };

export type Settings = {
  greeting: string;
  tagline: string;
  description: string;
  heroImage: string;
  videoTitle: string;
  videoBlurb: string;
  videoDuration: string;
  youtubeUrl: string;
  aboutText: string;
  contactText: string;
  footerHeading: string;
  footerText: string;
};

export const defaultSettings: Settings = {
  greeting: "ASSALĀMU ‘ALAYKUM",
  tagline: "A Balik-Islam",
  description:
    "Sharing the beauty of Islam, reflections on faith, and reminders to return to Allah with knowledge, sincerity, and hope.",
  heroImage: "/images/hero.jpg",
  videoTitle: "My Journey to Islam",
  videoBlurb: "A short story of how Allah guided me back to Islam, and what I learned along the way.",
  videoDuration: "10:24",
  youtubeUrl: "",
  aboutText: "My full story is being written and will be shared here soon, in shā’ Allāh.",
  contactText:
    "Questions about Islam, invitations to speak, or simply a salām — you are welcome to reach out.\n\nContact details will be added here soon, in shā’ Allāh.",
  footerHeading: "Stay Connected",
  footerText: "Get the latest videos, articles, and reminders straight to your inbox.",
};

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
