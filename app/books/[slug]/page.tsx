import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookCover from "@/components/BookCover";
import { Arrow } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import Markdown from "@/components/Markdown";
import SplitText from "@/components/SplitText";
import { getBooks, getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const books = await getBooks();
  return books.length ? books.map((b) => ({ slug: b.slug })) : [{ slug: "-" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = (await getBooks()).find((b) => b.slug === slug);
  if (!book) return {};
  const description = book.description.replace(/[#*_>\[\]()`]/g, "").replace(/\s+/g, " ").trim().slice(0, 155) || undefined;
  return { title: book.title, description, alternates: { canonical: `/books/${slug}` }, openGraph: { type: "book", title: book.title, description, url: `/books/${slug}`, images: book.cover_url ? [book.cover_url] : undefined } };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const [books, st] = await Promise.all([getBooks(), getSettings()]);
  const book = books.find((b) => b.slug === slug);
  if (!book) notFound();
  const first = book.chapters[0];
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Book", name: book.title, alternativeHeadline: book.subtitle || undefined, author: { "@type": "Person", name: book.author || st.siteName }, url: `${SITE_URL}/books/${book.slug}`, image: book.cover_url || undefined, inLanguage: "fil" }} />
      <section className="relative isolate overflow-hidden bg-paper-2" data-parallax-root>
        <div className="pattern pointer-events-none absolute -right-[12%] -top-[50%] -z-10 aspect-square w-[40rem] bg-royal opacity-[0.08]" data-parallax="0.2" aria-hidden />
        <div className="wrap grid gap-10 py-12 sm:py-16 md:grid-cols-[minmax(0,17rem)_1fr] md:items-end md:gap-14 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div className="book-hero mx-auto w-[min(15rem,62vw)] md:mx-0 md:w-full" data-hero="0">
            <BookCover book={book} sizes="(min-width: 1024px) 320px, 260px" priority />
          </div>
          <div>
            <Link href="/books" className="link inline-flex min-h-11 items-center gap-2 text-[0.9375rem]" data-hero="1">
              <Arrow className="h-4 w-4 rotate-180" /> {st.booksTitle}
            </Link>
            <h1 dir="auto" className="display-lg mt-2" data-hero="1" data-hero-kind="words"><SplitText text={book.title} /></h1>
            {book.subtitle && <p dir="auto" className="font-display mt-2 text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] italic text-royal" data-hero="2">{book.subtitle}</p>}
            {book.author && <p dir="auto" className="mt-4 text-navy-800" data-hero="2">by {book.author}</p>}
            {first && (
              <div className="mt-7" data-hero="3">
                <Link href={`/books/${book.slug}/${first.slug}`} className="btn btn-deep" data-magnetic>
                  Start reading <Arrow className="arrow h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="wrap grid gap-14 pb-20 pt-12 sm:pb-24 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-20">
        <div className="max-w-[68ch]">
          {book.description ? <Markdown>{book.description}</Markdown> : null}
        </div>
        <nav aria-label="Chapters">
          <h2 className="display-sm">Chapters</h2>
          {book.chapters.length === 0 ? (
            <p className="muted mt-4">The chapters will be added here soon, in shā’ Allāh.</p>
          ) : (
            <ol className="hairline mt-4 border-t">
              {book.chapters.map((c, i) => (
                <li key={c.id} className="hairline border-b" data-reveal>
                  <Link href={`/books/${book.slug}/${c.slug}`} className="group flex items-baseline gap-4 py-4">
                    <span className="w-7 shrink-0 text-[0.9375rem] tabular-nums text-royal">{i + 1}</span>
                    <span dir="auto" className="min-w-0 flex-1 text-[1.1875rem] leading-snug transition-colors duration-200 group-hover:text-royal">{c.title}</span>
                    <Arrow className="h-4 w-4 shrink-0 self-center text-royal transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </nav>
      </div>
    </>
  );
}
