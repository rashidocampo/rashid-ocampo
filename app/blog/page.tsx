import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import TagChips from "@/components/TagChips";
import { getPosts, getSettings, getTags } from "@/lib/data";

export const metadata = {
  title: "Blog",
  description: "Articles and reminders by Rashid Ocampo on faith, his journey to Islam, and everyday reflections.",
  alternates: { canonical: "/blog" },
};

export default async function Blog() {
  const [posts, tags, st] = await Promise.all([getPosts(), getTags(), getSettings()]);
  return (
    <PageShell eyebrow={st.blogEyebrow} title={st.blogTitle}>
      <TagChips tags={tags} />
      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
      {posts.length === 0 && <p className="muted mt-12">No posts yet.</p>}
    </PageShell>
  );
}
