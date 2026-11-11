import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import { posts } from "@/lib/site";

export const metadata = { title: "Blog" };

export default function Blog() {
  return (
    <PageShell eyebrow="LATEST" title="Blog Posts">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
    </PageShell>
  );
}
