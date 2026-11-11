export const site = {
  name: "Rashid Ocampo",
  tagline: "Balik-Islam",
  description:
    "Sharing the beauty of Islam, reflections on faith, and reminders to return to Allah with knowledge, sincerity, and hope.",
  // Paste a YouTube video ID here (the part after "v=") to make the featured video playable.
  featuredVideoId: "",
  featuredVideo: {
    title: "My Journey to Islam",
    blurb:
      "A short story of how Allah guided me back to Islam, and what I learned along the way.",
    duration: "10:24",
  },
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
};

export const posts: Post[] = [
  {
    slug: "why-i-returned-to-islam",
    title: "Why I Returned to Islam",
    date: "2026-10-20",
    image: "/images/post-returned.jpg",
    excerpt: "The questions, the search, and the moment everything changed.",
  },
  {
    slug: "simple-ways-to-strengthen-your-faith",
    title: "Simple Ways to Strengthen Your Faith",
    date: "2026-10-15",
    image: "/images/post-faith.jpg",
    excerpt: "Small, consistent habits that keep the heart close to Allah.",
  },
  {
    slug: "finding-peace-in-islam",
    title: "Finding Peace in Islam",
    date: "2026-10-08",
    image: "/images/post-peace.jpg",
    excerpt: "On stillness, remembrance, and trusting the plan of Allah.",
  },
];

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
