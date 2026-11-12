import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import { Arrow } from "@/components/Icons";
import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import PatternCover from "@/components/PatternCover";
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
    <PageShell eyebrow={formatDate(post.published_at)} title={post.title}>
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
      <article>
        <div className="card-media relative aspect-[16/9] max-w-[60rem] rounded-[14px] bg-navy-800 sm:aspect-[2/1]" data-reveal>
          {post.cover_url ? (
            <Image src={post.cover_url} alt={post.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" />
          ) : (
            <PatternCover seed={post.slug} />
          )}
        </div>
        <div className="mx-auto mt-10 max-w-[68ch] sm:mt-14 lg:mx-0 lg:ms-[8.33%]">
          {post.excerpt && <p dir="auto" className="lede mb-8 text-navy-800">{post.excerpt}</p>}
          {post.content ? (
            <Markdown>{post.content}</Markdown>
          ) : (
            <p className="muted">This article is being written and will be published here soon, in shā’ Allāh.</p>
          )}
          {post.tags.length > 0 && <div className="mt-12"><TagChips tags={post.tags} /></div>}
        </div>
      </article>

      {next.length > 0 && (
        <nav aria-label="Read next" className="mx-auto mt-20 max-w-[68ch] lg:mx-0 lg:ms-[8.33%]">
          <h2 className="display-md">Read next</h2>
          <ul className="hairline mt-6 border-t">
            {next.map((p) => (
              <li key={p.id} className="hairline border-b" data-reveal>
                <Link href={`/blog/${p.slug}`} className="group flex items-center gap-5 py-4">
                  <span className="card-media relative block aspect-[3/2] w-28 shrink-0 rounded-[10px] bg-navy-800 sm:w-36">
                    {p.cover_url ? <Image src={p.cover_url} alt="" fill sizes="144px" className="object-cover" /> : <PatternCover seed={p.slug} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="muted block text-sm"><time dateTime={p.published_at}>{formatDate(p.published_at)}</time></span>
                    <span dir="auto" className="font-display display-sm mt-1 block transition-colors duration-200 group-hover:text-royal">{p.title}</span>
                  </span>
                  <Arrow className="h-4 w-4 shrink-0 text-royal transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="link mt-8 inline-flex min-h-11 items-center gap-2">
            <Arrow className="h-4 w-4 rotate-180" /> All posts
          </Link>
        </nav>
      )}

      <Comments postId={post.id} />
    </PageShell>
  );
}
