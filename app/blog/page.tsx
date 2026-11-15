import Image from "next/image";
import Link from "next/link";
import { getPosts, getSettings, getTags } from "@/lib/data";
import { formatDate, type Post } from "@/lib/site";
import PatternCover from "@/components/PatternCover";

export const instant = false;

export const metadata = {
  title: "Blog",
  description: "Articles and reminders by Rashid Ocampo on faith, his journey to Islam, and everyday reflections.",
  alternates: { canonical: "/blog" },
};

type Props = { searchParams: Promise<{ q?: string }> };

function ArticleRow({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-5 border-b border-navy-900/10 py-4 transition hover:bg-royal/[0.035]">
      <div className="relative aspect-[5/4] w-28 shrink-0 overflow-hidden rounded-xl bg-royal/15 sm:w-36">
        {post.cover_url ? <Image src={post.cover_url} alt="" fill sizes="144px" className="object-cover transition-transform duration-300 group-hover:scale-105" style={{ objectPosition: `${post.cover_x ?? 50}% ${post.cover_y ?? 50}%` }} /> : <PatternCover seed={post.slug} />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 dir="auto" className="text-lg font-semibold leading-snug text-navy-950 sm:text-xl">{post.title}</h3>
        <p className="muted mt-2 text-sm"><span aria-hidden="true">▣</span> <time dateTime={post.published_at}>{formatDate(post.published_at)}</time></p>
      </div>
      <span className="text-2xl text-royal" aria-hidden="true">›</span>
    </Link>
  );
}

export default async function Blog({ searchParams }: Props) {
  const [posts, tags, st] = await Promise.all([getPosts(), getTags(), getSettings()]);
  const { q = "" } = await searchParams;
  const search = q.trim().toLocaleLowerCase();
  const matching = search ? posts.filter(p => [p.title, p.excerpt, p.content, ...p.tags.map(t => t.name)].some(v => v.toLocaleLowerCase().includes(search))) : posts;
  const featured = !search ? posts[0] : undefined;
  const latest = featured ? matching.filter(p => p.id !== featured.id) : matching;
  const tagCounts = tags.map(t => ({ ...t, count: posts.filter(p => p.tags.some(pt => pt.id === t.id)).length }));
  return (
    <div className="wrap pb-20 pt-9 sm:pt-12">
      <header className="mb-8">
        <h1 className="flex items-center gap-4 text-[clamp(2.5rem,4vw,3.7rem)] font-semibold leading-tight text-navy-950"><span className="text-royal" aria-hidden="true">▣</span> {st.blogTitle || "Blog"}</h1>
        <p className="mt-1 text-lg text-navy-800">{st.description}</p>
      </header>
      <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          {featured && <Link href={`/blog/${featured.slug}`} className="group relative flex min-h-[310px] overflow-hidden rounded-[18px] bg-[#123e34] text-white sm:min-h-[350px]">
            <div className="absolute inset-0">
              {featured.cover_url ? <Image src={featured.cover_url} alt="" fill priority sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" style={{ objectPosition: `${featured.cover_x ?? 50}% ${featured.cover_y ?? 50}%` }} /> : <PatternCover seed={featured.slug} />}
              <div className="absolute inset-0 bg-gradient-to-r from-[#06432f]/95 via-[#06432f]/80 to-[#06432f]/10" />
            </div>
            <div className="relative flex max-w-[550px] flex-col items-start justify-center p-7 sm:p-10">
              <span className="rounded-full bg-[#f3f4dd] px-4 py-1.5 text-sm font-semibold text-[#183c2b]">Featured</span>
              <h2 dir="auto" className="mt-5 text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.12]">{featured.title}</h2>
              <p className="mt-5 text-sm text-white/90">▣ <time dateTime={featured.published_at}>{formatDate(featured.published_at)}</time></p>
              <span className="mt-5 rounded-full border border-white/80 bg-royal px-6 py-2.5 text-base font-semibold transition group-hover:bg-[#126c3a]">Read Article →</span>
            </div>
          </Link>}
          {tagCounts.length > 0 && <section className="mt-9">
            <h2 className="mb-4 text-2xl font-semibold text-navy-950">Browse by Topic</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {tagCounts.slice(0, 10).map((t, i) => <Link href={`/tag/${t.slug}`} key={t.id} className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-[#eef2e5] px-2 py-4 text-center transition hover:bg-[#e0ebd8]">
                <span className="text-3xl text-[#187039]" aria-hidden="true">{["◇","♧","♡","♧","✦"][i % 5]}</span>
                <span className="text-sm font-semibold leading-tight text-navy-950">{t.name}</span>
              </Link>)}
            </div>
          </section>}
          <section className="mt-11">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-navy-950">{search ? `Search results for “${q}”` : "Latest Articles"}</h2>
              {search && <Link href="/blog" className="text-sm font-semibold text-royal">Clear search →</Link>}
            </div>
            {latest.length ? <div>{latest.slice(0, 5).map(p => <ArticleRow key={p.id} post={p} />)}{latest.length > 5 && <details className="group"><summary className="mx-auto mt-5 w-fit cursor-pointer list-none rounded-full border border-royal px-6 py-3 text-center font-semibold text-royal transition hover:bg-royal hover:text-white"><span className="group-open:hidden">View More Articles ({latest.length - 5}) ↓</span><span className="hidden group-open:inline">Show Fewer Articles ↑</span></summary><div>{latest.slice(5).map(p => <ArticleRow key={p.id} post={p} />)}</div></details>}</div> : <p className="muted py-10">No matching articles found.</p>}
          </section>
        </main>
        <aside className="space-y-6 lg:sticky lg:top-24">
          <form action="/blog" method="get" role="search" className="flex items-center gap-2 rounded-2xl border border-navy-900/15 bg-white px-4 py-3">
            <span aria-hidden="true" className="text-xl">⌕</span>
            <input type="search" name="q" defaultValue={q} aria-label="Search articles" placeholder="Search articles..." className="min-w-0 flex-1 bg-transparent text-base outline-none" />
            <button type="submit" className="text-sm font-semibold text-royal">Go</button>
          </form>
          <div className="rounded-2xl border border-navy-900/10 bg-white p-5">
            <h2 className="mb-5 text-xl font-semibold text-navy-950">Categories</h2>
            <nav aria-label="Article categories" className="space-y-1">
              {tagCounts.map(t => <Link href={`/tag/${t.slug}`} key={t.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 hover:bg-royal/10"><span className="text-base font-medium">{t.name}</span><span className="muted text-sm">({t.count})</span></Link>)}
              <Link href="/blog" className="flex items-center justify-between rounded-lg px-2 py-2.5 font-semibold hover:bg-royal/10"><span>All Articles</span><span className="muted text-sm">({posts.length})</span></Link>
            </nav>
          </div>
          <div className="rounded-2xl bg-[#eef2e5] p-6">
            <h2 className="text-xl font-semibold text-navy-950">Stay Updated</h2>
            <p className="mt-3 text-base">Discover new articles and reminders.</p>
            <Link href="/contact" className="mt-5 block rounded-full bg-[#187039] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#11592e]">Contact Me</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
