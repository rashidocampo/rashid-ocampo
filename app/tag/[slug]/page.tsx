import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import TagChips from "@/components/TagChips";
import { getPosts, getTags } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.length ? tags.map((t) => ({ slug: t.slug })) : [{ slug: "-" }];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = (await getTags()).find((t) => t.slug === slug);
  if (!tag) return {};
  return { title: tag.name, description: `Posts by Rashid Ocampo on ${tag.name}.`, alternates: { canonical: `/tag/${slug}` } };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();
  const list = posts.filter((p) => p.tags.some((t) => t.slug === slug));
  return (
    <PageShell eyebrow="Topic" title={tag.name}>
      <TagChips tags={tags} active={slug} />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => <div key={p.slug} data-reveal><PostCard post={p} /></div>)}
      </div>
      {list.length === 0 && <p className="muted mt-12">No posts under this topic yet.</p>}
    </PageShell>
  );
}
