import { cacheLife, cacheTag } from "next/cache";
import { defaultSettings, SUPABASE_KEY, SUPABASE_URL, type Post, type Settings, type Tag } from "./site";

async function rest<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type PostRow = Omit<Post, "tags"> & { post_tags: { tags: Tag | null }[] };
const toPost = ({ post_tags, ...p }: PostRow): Post => ({
  ...p,
  tags: post_tags.map((pt) => pt.tags).filter((t): t is Tag => !!t),
});

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag("site");
  cacheLife("minutes");
  const rows = await rest<{ value: Partial<Settings> }[]>("settings?key=eq.site&select=value");
  return { ...defaultSettings, ...(rows?.[0]?.value ?? {}) };
}

export async function getTags(): Promise<Tag[]> {
  "use cache";
  cacheTag("site");
  cacheLife("minutes");
  return (await rest<Tag[]>("tags?select=*&order=sort.asc,name.asc")) ?? [];
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag("site");
  cacheLife("minutes");
  const rows = await rest<PostRow[]>(
    "posts?select=*,post_tags(tags(*))&published=eq.true&order=published_at.desc,created_at.desc",
  );
  return (rows ?? []).map(toPost);
}
