import Image from "next/image";
import type { Book } from "@/lib/site";
import PatternCover from "./PatternCover";

/** A book's front cover: the uploaded image, or a patterned cover with the title set on it. Spine shading on the left edge. */
export default function BookCover({ book, sizes = "240px", priority = false }: { book: Pick<Book, "slug" | "title" | "subtitle" | "author" | "cover_url">; sizes?: string; priority?: boolean }) {
  return (
    <span className="book-cover relative block aspect-[2/3] overflow-hidden rounded-[3px_8px_8px_3px] bg-navy-900">
      {book.cover_url ? (
        <Image src={book.cover_url} alt={`Cover of ${book.title}`} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <>
          <PatternCover seed={book.slug} />
          <span className="absolute inset-[9%] flex flex-col items-center border border-white/45 bg-navy-950/35 px-3 text-center text-white backdrop-blur-[1px]">
            <span className="flex flex-1 flex-col justify-center">
              <span dir="auto" className="font-display text-[clamp(1.1rem,0.8rem+1vw,1.6rem)] font-bold leading-tight">{book.title}</span>
              {book.subtitle && <span dir="auto" className="mt-2 text-[0.8125rem] italic leading-snug text-white/85">{book.subtitle}</span>}
            </span>
            {book.author && <span dir="auto" className="pb-3 text-[0.6875rem] uppercase tracking-[0.2em] text-white/80">{book.author}</span>}
          </span>
        </>
      )}
      <span aria-hidden className="book-spine absolute inset-y-0 left-0 w-[9%]" />
    </span>
  );
}
