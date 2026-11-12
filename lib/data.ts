import { cacheLife, cacheTag } from "next/cache";
import { defaultSettings, fallbackPages, SUPABASE_KEY, SUPABASE_URL, type Page, type Post, type Settings, type Tag } from "./site";

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

// Sample content for previewing the design offline (set DEMO_CONTENT=1). Never used when the database answers.
const DEMO = process.env.DEMO_CONTENT === "1";
const demoTags: Tag[] = ["Faith & Reminders", "My Journey (Balik-Islam)", "Islamic Reflections", "Life & Learnings"].map((name, i) => ({
  id: `t${i}`, name, slug: `topic-${i}`, icon: ["book", "layers", "sprout", "infinity"][i], show_on_home: true, sort: i,
}));
const demoPosts: Post[] = ["Ang Pagbisita ng DIP sa Ballesteros, Cagayan", "Huwag Hanapin ang Unos", "Kapag Nawala ang Dawah", "Dawah Is Solving Problem", "Sino ang Hallaf"].map((title, i) => ({
  id: `p${i}`, slug: `sample-${i}`, title, excerpt: "A short sample summary for this post.", content: "", published: true, show_on_home: true,
  cover_url: i % 2 ? null : ["/images/post-returned.jpg", "/images/post-faith.jpg", "/images/post-peace.jpg"][i % 3],
  published_at: "2026-11-11", tags: [demoTags[i % 4]],
}));

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
  return (await rest<Tag[]>("tags?select=*&order=sort.asc,name.asc")) ?? (DEMO ? demoTags : []);
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag("site");
  cacheLife("minutes");
  const rows = await rest<PostRow[]>(
    "posts?select=*,post_tags(tags(*))&published=eq.true&order=published_at.desc,created_at.desc",
  );
  return rows ? rows.map(toPost) : DEMO ? demoPosts : [];
}

export async function getPages(): Promise<Page[]> {
  "use cache";
  cacheTag("site");
  cacheLife("minutes");
  return (await rest<Page[]>("pages?select=*&published=eq.true&order=sort.asc,title.asc")) ?? fallbackPages;
}
