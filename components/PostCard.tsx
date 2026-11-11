import Image from "next/image";
import Link from "next/link";
import { formatDate, type Post } from "@/lib/site";
import { Calendar } from "./Icons";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-xl bg-white/70 shadow-[0_8px_24px_rgb(10_33_82/0.12)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgb(10_33_82/0.2)]"
    >
      <div className="relative aspect-[14/5] overflow-hidden">
        <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 280px, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="px-6 pb-5 pt-3">
        <h3 className="text-[22px] font-semibold leading-tight text-navy-900 group-hover:text-royal">{post.title}</h3>
        <p className="mt-3 flex items-center gap-2 text-sm text-navy-800">
          <Calendar className="h-4 w-4 text-royal" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
      </div>
    </Link>
  );
}
