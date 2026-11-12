import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import TagChips from "@/components/TagChips";
import { getPosts, getSettings } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import { formatDate, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "-" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [posts, st] = await Promise.all([getPosts(), getSettings()]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  const description = post.excerpt || undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${slug}`,
      publishedTime: post.published_at,
      authors: [st.siteName],
      tags: post.tags.map((t) => t.name),
    },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [posts, st] = await Promise.all([getPosts(), getSettings()]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  // Read next: posts sharing the most tags first, then the most recent.
  const mine = new Set(post.tags.map((t) => t.id));
  const next = posts
    .filter((p) => p.id !== post.id)
    .map((p, i) => ({ p, score: p.tags.filter((t) => mine.has(t.id)).length, i }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.p);
  return (
    <PageShell eyebrow={formatDate(post.published_at).toUpperCase()} title={post.title}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || undefined,
          datePublished: post.published_at,
          image: post.cover_url ? new URL(post.cover_url, SITE_URL).href : undefined,
          author: { "@type": "Person", name: st.siteName, url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          keywords: post.tags.map((t) => t.name).join(", ") || undefined,
        }}
      />
      <article className="max-w-2xl space-y-6">
        {post.cover_url && (
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl">
            <Image src={post.cover_url} alt={post.title} fill priority sizes="(min-width: 768px) 672px, 100vw" className="object-cover" />
          </div>
        )}
        <TagChips tags={post.tags} />
        {post.excerpt && <p dir="auto" className="text-2xl italic text-navy-700">{post.excerpt}</p>}
        {post.content ? (
          <Markdown>{post.content}</Markdown>
        ) : (
          <p className="text-navy-700">This article is being written and will be published here soon, in shā’ Allāh.</p>
        )}
      </article>

      {next.length > 0 && (
        <nav aria-label="Read next" className="mt-14 max-w-2xl border-t border-navy-800/15 pt-8">
          <h2 className="text-4xl">Read next</h2>
          <ul className="mt-5 space-y-3">
            {next.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group flex items-center gap-4 rounded-xl bg-white/70 p-2.5 ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-navy-800 to-royal sm:h-20 sm:w-32">
                    {p.cover_url && <Image src={p.cover_url} alt="" fill sizes="128px" className="object-cover transition duration-500 group-hover:scale-110" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span dir="auto" className="font-display block text-2xl leading-tight text-navy-900 transition-colors group-hover:text-royal">{p.title}</span>
                    <span className="mt-1 block text-sm text-navy-700">{formatDate(p.published_at)}</span>
                  </span>
                  <span aria-hidden className="pe-2 text-2xl text-royal transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="mt-6 inline-block text-lg text-royal hover:underline">← All posts</Link>
        </nav>
      )}

      <Comments postId={post.id} />
    </PageShell>
  );
}
