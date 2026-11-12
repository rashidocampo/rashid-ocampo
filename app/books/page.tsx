import type { Metadata } from "next";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import PageShell from "@/components/PageShell";
import { getBooks, getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings();
  return { title: st.booksTitle, description: st.booksIntro || undefined, alternates: { canonical: "/books" }, openGraph: { title: st.booksTitle, url: "/books" } };
}

export default async function BooksPage() {
  const [st, books] = await Promise.all([getSettings(), getBooks()]);
  return (
    <PageShell eyebrow={st.booksEyebrow} title={st.booksTitle}>
      {st.booksIntro && <p dir="auto" className="lede max-w-[44rem] text-navy-800" data-reveal>{st.booksIntro}</p>}
      {books.length === 0 ? (
        <p className="muted mt-10">The first book will be placed on this shelf soon, in shā’ Allāh.</p>
      ) : (
        <ul className="library mt-12 grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((b) => (
            <li key={b.id} className="shelf-slot" data-reveal>
              <Link href={`/books/${b.slug}`} className="group block" aria-label={`${b.title}${b.subtitle ? `: ${b.subtitle}` : ""}`}>
                <span className="book block px-[6%]">
                  <BookCover book={b} sizes="(min-width: 1280px) 200px, (min-width: 640px) 30vw, 45vw" />
                </span>
                <span aria-hidden className="shelf-ledge block" />
                <span dir="auto" className="font-display mt-4 block text-[1.25rem] font-bold leading-tight transition-colors duration-200 group-hover:text-royal">{b.title}</span>
                <span className="muted mt-1 block text-[0.9375rem]">
                  {b.chapters.length === 0 ? "Chapters coming soon" : `${b.chapters.length} chapter${b.chapters.length === 1 ? "" : "s"}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
