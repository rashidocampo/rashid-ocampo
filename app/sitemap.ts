import type { MetadataRoute } from "next";
import { getPosts, getTags } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.published_at, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...tags.map((t) => ({ url: `${SITE_URL}/tag/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}
