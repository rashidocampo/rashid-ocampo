import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import TagChips from "@/components/TagChips";
import { getPosts } from "@/lib/data";
import { formatDate } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "-" }];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = (await getPosts()).find((p) => p.slug === slug);
  return { title: post?.title, description: post?.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = (await getPosts()).find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <PageShell eyebrow={formatDate(post.published_at).toUpperCase()} title={post.title}>
      <article className="max-w-2xl space-y-6">
        {post.cover_url && (
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl">
            <Image src={post.cover_url} alt="" fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" />
          </div>
        )}
        <TagChips tags={post.tags} />
        {post.excerpt && <p className="text-2xl italic text-navy-700">{post.excerpt}</p>}
        {post.content ? (
          <Markdown>{post.content}</Markdown>
        ) : (
          <p className="text-navy-700">This article is being written and will be published here soon, in shā’ Allāh.</p>
        )}
        <Link href="/blog" className="inline-block text-royal hover:underline">← All posts</Link>
      </article>
    </PageShell>
  );
}
