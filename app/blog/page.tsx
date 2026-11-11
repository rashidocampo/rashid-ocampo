import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import TagChips from "@/components/TagChips";
import { getPosts, getTags } from "@/lib/data";

export const metadata = {
  title: "Blog",
  description: "Articles and reminders by Rashid Ocampo on faith, his journey to Islam, and everyday reflections.",
  alternates: { canonical: "/blog" },
};

export default async function Blog() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);
  return (
    <PageShell eyebrow="LATEST" title="Blog Posts">
      <TagChips tags={tags} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
      {posts.length === 0 && <p>No posts yet.</p>}
    </PageShell>
  );
}
