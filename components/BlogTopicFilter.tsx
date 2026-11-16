import CoverTitle from "@/components/CoverTitle";
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PatternCover from "@/components/PatternCover";
import { formatDate, type Post } from "@/lib/site";

type Topic = { id: string; name: string; slug: string; count: number };
export default function BlogTopicFilter({ posts, topics }: { posts: Post[]; topics: Topic[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = selected ? posts.filter(p => p.tags.some(t => t.id === selected)) : posts;
  const activeName = topics.find(t => t.id === selected)?.name;
  return <>
    {topics.length > 0 && <section className="mt-9">
      <h2 className="mb-4 text-2xl font-semibold text-navy-950">Browse by Topic</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
        {topics.slice(0,10).map((t,i)=><button type="button" key={t.id} onClick={()=>setSelected(v=>v===t.id?null:t.id)} aria-pressed={selected===t.id} className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${selected===t.id?"bg-[#187039] text-white shadow-md":"bg-[#eef2e5] text-navy-950 hover:bg-[#e0ebd8]"}`}>
          
          <span className="text-sm font-semibold leading-tight">{t.name}</span>
        </button>)}
      </div>
    </section>}
    <section className="mt-8 sm:mt-11" aria-live="polite">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-navy-950">{activeName ? `Latest Articles — ${activeName}` : "Latest Articles"}</h2>
        {selected && <button type="button" onClick={()=>setSelected(null)} className="text-sm font-semibold text-royal">All Articles ×</button>}
      </div>
      {filtered.length ? <div key={selected||"all"}>{filtered.slice(0,5).map(p=><ArticleRow key={p.id} post={p}/>)}{filtered.length>5 && <details className="group"><summary className="mx-auto mt-5 w-fit cursor-pointer list-none rounded-full border border-royal px-6 py-3 text-center font-semibold text-royal transition hover:bg-royal hover:text-white"><span className="group-open:hidden">View More Articles ({filtered.length-5}) ↓</span><span className="hidden group-open:inline">Show Fewer Articles ↑</span></summary><div>{filtered.slice(5).map(p=><ArticleRow key={p.id} post={p}/>)}</div></details>}</div>:<p className="muted py-10">No articles in this topic yet.</p>}
    </section>
  </>;
}
function ArticleRow({post}:{post:Post}) {
  return <Link href={`/blog/${post.slug}`} className="group flex min-w-0 items-center gap-3 border-b border-navy-900/10 py-4 transition hover:bg-royal/[0.035]">
    <div className="relative aspect-[5/4] w-24 shrink-0 overflow-hidden rounded-xl bg-royal/15 sm:w-36">{post.cover_url?<Image src={post.cover_url} alt="" fill sizes="144px" className="object-cover transition-transform duration-300 group-hover:scale-105" style={{objectPosition:`${post.cover_x??50}% ${post.cover_y??50}%`}}/>:<PatternCover seed={post.slug}/>}<CoverTitle title={post.title}/></div>
    <div className="min-w-0 flex-1"><h3 dir="auto" className="break-words text-base font-semibold leading-snug text-navy-950 sm:text-xl">{post.title}</h3><p className="muted mt-2 text-sm">▣ <time dateTime={post.published_at}>{formatDate(post.published_at)}</time></p></div><span className="shrink-0 text-xl text-royal" aria-hidden="true">›</span>
  </Link>;
}
