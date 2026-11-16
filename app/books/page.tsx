import type { Metadata } from "next";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { getBooks, getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings();
  return { title: st.booksTitle, description: st.booksIntro || undefined, alternates: { canonical: "/books" }, openGraph: { title: st.booksTitle, url: "/books" } };
}

export default async function BooksPage() {
  const [st, books] = await Promise.all([getSettings(), getBooks()]);
  const chapters = books.reduce((sum, book) => sum + book.chapters.length, 0);
  return (
    <div className="min-w-0 overflow-hidden bg-paper">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-paper via-paper-2 to-royal/15">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[35px] border-royal/10 sm:h-[34rem] sm:w-[34rem]" />
        <div className="wrap relative grid items-center gap-8 py-10 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:py-20">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-royal">Digital library</p>
            <h1 dir="auto" className="font-display break-words text-[clamp(2.7rem,9vw,5.5rem)] leading-[1.05] text-navy-950">{st.booksTitle}</h1>
            <div className="mt-5 h-1 w-16 rounded-full bg-royal" />
            <p dir="auto" className="mt-6 max-w-[42rem] text-base leading-relaxed text-navy-800 sm:text-xl">{st.booksIntro || "Explore the books and read each chapter online."}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#library" className="btn btn-deep min-h-12">Browse Books <span aria-hidden>↓</span></a>
              {books[0]?.chapters[0] && <Link href={`/books/${books[0].slug}/${books[0].chapters[0].slug}`} className="btn btn-line min-h-12 bg-paper/80">Start Reading <span aria-hidden>→</span></Link>}
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-[32rem] items-end justify-center gap-4 rounded-[2rem] border border-royal/10 bg-gradient-to-tr from-royal/15 via-paper-2 to-paper p-6 pb-10 shadow-xl shadow-navy-950/5 sm:gap-8 sm:p-10">
            <div aria-hidden className="absolute inset-x-[10%] bottom-7 h-3 rounded-full bg-navy-950/15 blur-md" />
            {books.slice(0, 3).map((b, i) => (
              <Link key={b.id} href={`/books/${b.slug}`} aria-label={`Explore ${b.title}`} className={`relative block min-w-0 flex-1 transition-transform duration-300 hover:-translate-y-3 ${i === 1 ? "translate-y-3" : ""}`}>
                <BookCover book={b} sizes="(min-width: 1024px) 190px, 38vw" priority={i === 0} />
              </Link>
            ))}
            {books.length === 0 && <div className="flex aspect-[4/3] items-center justify-center text-6xl text-royal" aria-hidden>▤</div>}
          </div>
        </div>
      </section>

      <section className="wrap relative z-10 -mt-1 py-7 sm:py-10" aria-label="Library statistics">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-navy-950/10 bg-paper-2 p-4 sm:grid-cols-3 sm:p-6">
          <div className="flex items-center gap-3"><span className="text-3xl text-royal" aria-hidden>▤</span><div><p className="text-2xl font-bold tabular-nums">{books.length}</p><p className="text-sm text-navy-800">Books</p></div></div>
          <div className="flex items-center gap-3"><span className="text-3xl text-royal" aria-hidden>≡</span><div><p className="text-2xl font-bold tabular-nums">{chapters}</p><p className="text-sm text-navy-800">Chapters</p></div></div>
          <div className="col-span-2 flex items-center gap-3 border-t border-navy-950/10 pt-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"><span className="text-3xl text-royal" aria-hidden>↗</span><div><p className="font-semibold">Read online</p><p className="text-sm text-navy-800">Explore at your own pace</p></div></div>
        </div>
      </section>

      <section id="library" className="wrap scroll-mt-24 pb-16 pt-6 sm:pb-24 sm:pt-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-royal">Explore the collection</p><h2 className="font-display mt-2 text-[clamp(2rem,5vw,3.25rem)] leading-tight">My Books</h2></div>
          <span className="rounded-full border border-royal/30 px-4 py-2 text-sm text-navy-800">{books.length} {books.length === 1 ? "book" : "books"} available</span>
        </div>
        {books.length === 0 ? <p className="rounded-2xl bg-paper-2 p-8">The first book will be added soon.</p> : (
          <ul className="grid gap-5 md:grid-cols-2 xl:gap-7">
            {books.map((b) => (
              <li key={b.id} className="group relative min-w-0 overflow-hidden rounded-[1.5rem] border border-navy-950/10 bg-gradient-to-br from-paper-2 via-paper to-royal/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-4 p-4 sm:gap-7 sm:p-7">
                  <Link href={`/books/${b.slug}`} className="block min-w-0 drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-2" aria-label={`View ${b.title}`}>
                    <BookCover book={b} sizes="(min-width: 1280px) 240px, (min-width: 640px) 35vw, 40vw" />
                  </Link>
                  <div className="min-w-0">
                    <h3 dir="auto" className="font-display break-words text-[clamp(1.15rem,3vw,1.8rem)] font-bold leading-tight">{b.title}</h3>
                    {b.subtitle && <p dir="auto" className="mt-2 break-words text-sm text-navy-800">{b.subtitle}</p>}
                    <p className="mt-3 text-sm font-medium text-royal">{b.chapters.length} {b.chapters.length === 1 ? "chapter" : "chapters"}</p>
                    {b.description && <p dir="auto" className="mt-3 line-clamp-3 break-words text-sm leading-relaxed text-navy-800">{b.description.replace(/[#*_>\[\]()`]/g, "").replace(/\s+/g, " ").trim()}</p>}
                    <div className="mt-5 flex flex-col items-start gap-2">
                      {b.chapters[0] && <Link href={`/books/${b.slug}/${b.chapters[0].slug}`} className="btn btn-deep min-h-11 text-sm">Read Online <span aria-hidden>→</span></Link>}
                      <Link href={`/books/${b.slug}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-royal underline underline-offset-4">View Details</Link>
                    </div>
                  </div>
                </div>
                <div aria-hidden className="h-2 bg-gradient-to-r from-royal/15 via-royal/45 to-royal/15" />
              </li>
            ))}
          </ul>
        )}
        <div className="relative mt-12 overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-[#073d35] via-[#145a4e] to-[#397f6e] px-6 py-10 text-white sm:mt-16 sm:px-12 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full border-[25px] border-white/10" />
          <div className="relative max-w-[38rem]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">The library is growing</p><h2 className="font-display mt-3 text-[clamp(1.7rem,5vw,2.75rem)] leading-tight">More Books Coming Soon</h2><p className="mt-4 leading-relaxed text-white/85">New books and chapters will appear here as they are published. In the meantime, explore the available collection.</p><a href="#library" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/70 px-6 py-2 font-semibold transition hover:bg-white hover:text-[#073d35]">Explore Books ↑</a></div>
        </div>
      </section>
    </div>
  );
}
