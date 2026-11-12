import Image from "next/image";
import Link from "next/link";
import { formatDate, type Post } from "@/lib/site";
import { Calendar } from "./Icons";
import PatternCover from "./PatternCover";

/** A post as a white card: picture, title, and the date with a small calendar. */
export default function PostCard({ post, sizes = "(min-width: 1024px) 260px, (min-width: 640px) 50vw, 78vw" }: { post: Post; sizes?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group block h-full overflow-hidden rounded-[14px] bg-white shadow-[0_14px_30px_-24px_rgb(16_31_56/0.5)] ring-1 ring-navy-900/[0.06]">
      <div className="card-media relative aspect-[5/3] bg-navy-800">
        <div className="absolute inset-0">
          {post.cover_url ? <Image src={post.cover_url} alt="" fill sizes={sizes} className="object-cover" /> : <PatternCover seed={post.slug} />}
        </div>
      </div>
      <div className="px-5 pb-5 pt-4">
        <h3 dir="auto" className="display-sm transition-colors duration-300 group-hover:text-royal">{post.title}</h3>
        <p className="muted mt-3 flex items-center gap-2.5 text-[0.9375rem]">
          <Calendar className="h-4 w-4 text-royal transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110" />
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </p>
      </div>
    </Link>
  );
}
