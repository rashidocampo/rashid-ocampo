import type { MetadataRoute } from "next";
import { getBooks, getPages, getPosts, getTags } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags, pages, books] = await Promise.all([getPosts(), getTags(), getPages(), getBooks()]);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    ...pages.map((p) => ({ url: `${SITE_URL}/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.published_at, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/books`, changeFrequency: "monthly", priority: 0.8 },
    ...books.flatMap((b) => [
      { url: `${SITE_URL}/books/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.8 },
      ...b.chapters.map((c) => ({ url: `${SITE_URL}/books/${b.slug}/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ]),
    ...tags.map((t) => ({ url: `${SITE_URL}/tag/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}
