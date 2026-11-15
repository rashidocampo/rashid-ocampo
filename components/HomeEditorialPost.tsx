import Image from "next/image";
import Link from "next/link";
import { formatDate, type Post } from "@/lib/site";
import PatternCover from "@/components/PatternCover";

/** Homepage-only editorial card; other blog listings retain their existing design. */
export default function HomeEditorialPost({ post }: { post: Post }) {
  return <Link href={`/blog/${post.slug}`} className="group relative flex aspect-[4/5] h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-[16px] bg-[#073f2f] text-white shadow-[0_14px_30px_-24px_rgb(16_31_56/0.5)] sm:aspect-[3/4]">
    <div className="absolute inset-0">
      {post.cover_url ? <Image src={post.cover_url} alt="" fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{objectPosition:`${post.cover_x??50}% ${post.cover_y??50}%`}}/> : <PatternCover seed={post.slug}/>}
      <div className="absolute inset-0 bg-gradient-to-t from-[#032f25]/95 via-[#064735]/65 to-[#033a2d]/45" />
    </div>
    <div className="relative z-10 flex flex-col items-start p-5 sm:p-6">
      <span className="mb-3 rounded-full bg-[#f4f5df] px-3 py-1 text-xs font-semibold text-[#173b2d]">Blog Post</span>
      <h3 dir="auto" className="font-display text-[clamp(1.3rem,2vw,1.8rem)] font-semibold leading-tight drop-shadow-sm">{post.title}</h3>
      <time dateTime={post.published_at} className="mt-3 text-xs tracking-wide text-white/85">{formatDate(post.published_at)}</time>
      <span className="mt-5 rounded-full border border-white/80 bg-[#4c8a75]/80 px-4 py-2 text-sm font-semibold transition group-hover:bg-[#22704f]">Read Article →</span>
    </div>
  </Link>;
}
