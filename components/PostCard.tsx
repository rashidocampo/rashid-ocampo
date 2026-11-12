import Image from "next/image";
import Link from "next/link";
import { formatDate, type Post } from "@/lib/site";
import PatternCover from "./PatternCover";

/** A post as a picture with its date, first tag and title beneath. No box: the picture is the object. */
export default function PostCard({ post, sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 84vw" }: { post: Post; sizes?: string }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group block">
      <div className="card-media relative aspect-[3/2] bg-navy-800">
        <div className="absolute -inset-y-[10%] inset-x-0" data-img-parallax>
          {post.cover_url ? <Image src={post.cover_url} alt="" fill sizes={sizes} className="object-cover" /> : <PatternCover seed={post.slug} />}
        </div>
      </div>
      <p className="muted mt-4 flex flex-wrap gap-x-2 text-sm">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        {post.tags[0] && <span dir="auto">/ {post.tags[0].name}</span>}
      </p>
      <h3 dir="auto" className="stretch-hover display-sm mt-2 transition-colors duration-300 group-hover:text-royal">{post.title}</h3>
    </Link>
  );
}
