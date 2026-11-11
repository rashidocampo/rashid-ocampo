import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { formatDate, posts } from "@/lib/site";

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: posts.find((p) => p.slug === slug)?.title };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <PageShell eyebrow={formatDate(post.date).toUpperCase()} title={post.title}>
      <div className="max-w-2xl space-y-5">
        <p>{post.excerpt}</p>
        <p className="text-navy-700">This article is being written and will be published here soon, in shā’ Allāh.</p>
        <Link href="/blog" className="inline-block text-royal hover:underline">← All posts</Link>
      </div>
    </PageShell>
  );
}
