import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Icons";
import Markdown from "@/components/Markdown";
import { getBooks, getChapter } from "@/lib/data";

type Props = { params: Promise<{ slug: string; chapter: string }> };

export async function generateStaticParams() {
  const books = await getBooks();
  const all = books.flatMap((b) => b.chapters.map((c) => ({ slug: b.slug, chapter: c.slug })));
  return all.length ? all : [{ slug: "-", chapter: "-" }];
}

async function load(slug: string, chapterSlug: string) {
  const book = (await getBooks()).find((b) => b.slug === slug);
  if (!book) return null;
  const index = book.chapters.findIndex((c) => c.slug === chapterSlug);
  if (index < 0) return null;
  const chapter = await getChapter(book.id, chapterSlug);
  return chapter ? { book, chapter, index } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, chapter } = await params;
  const data = await load(slug, chapter);
  if (!data) return {};
  const title = `${data.chapter.title} · ${data.book.title}`;
  const description = (data.chapter.content ?? "").replace(/[#*_>\[\]()`]/g, "").replace(/\s+/g, " ").trim().slice(0, 155) || undefined;
  return { title, description, alternates: { canonical: `/books/${slug}/${chapter}` }, openGraph: { type: "article", title, description, url: `/books/${slug}/${chapter}` } };
}

export default async function ChapterPage({ params }: Props) {
  const { slug, chapter: chapterSlug } = await params;
  const data = await load(slug, chapterSlug);
  if (!data) notFound();
  const { book, chapter, index } = data;
  const prev = book.chapters[index - 1];
  const next = book.chapters[index + 1];
  return (
    <div className="wrap pb-20 pt-8 sm:pb-24 sm:pt-12">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="Chapters" className="sticky top-28">
            <Link href={`/books/${book.slug}`} dir="auto" className="font-display block text-[1.25rem] font-bold leading-tight hover:text-royal">{book.title}</Link>
            <ol className="mt-4 space-y-1 border-s border-line">
              {book.chapters.map((c, i) => (
                <li key={c.id}>
                  <Link href={`/books/${book.slug}/${c.slug}`} aria-current={i === index ? "page" : undefined} className={`-ms-px block border-s-2 py-1.5 ps-4 text-[0.9375rem] leading-snug transition-colors duration-200 ${i === index ? "border-royal text-royal" : "border-transparent text-navy-800 hover:text-royal"}`}>
                    <span dir="auto">{c.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-[68ch]">
          <Link href={`/books/${book.slug}`} className="link inline-flex min-h-11 items-center gap-2 text-[0.9375rem] lg:hidden">
            <Arrow className="h-4 w-4 rotate-180" /> <span dir="auto">{book.title}</span>
          </Link>
          <p className="caps mt-2 text-royal">Chapter {index + 1} of {book.chapters.length}</p>
          <h1 dir="auto" className="display-lg mt-3">{chapter.title}</h1>
          <div className="rule mt-6" />
          <div className="chapter-text mt-10">
            {chapter.content?.trim() ? <Markdown>{chapter.content}</Markdown> : <p className="muted">This chapter is being written and will be added soon, in shā’ Allāh.</p>}
          </div>

          <nav aria-label="Chapter navigation" className="mt-16 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/books/${book.slug}/${prev.slug}`} className="panel group flex flex-col gap-1 p-5 transition-colors duration-200 hover:text-royal">
                <span className="muted flex items-center gap-2 text-sm"><Arrow className="h-4 w-4 rotate-180" /> Previous chapter</span>
                <span dir="auto" className="font-display text-[1.25rem] font-bold leading-tight">{prev.title}</span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {next ? (
              <Link href={`/books/${book.slug}/${next.slug}`} className="panel group flex flex-col items-end gap-1 p-5 text-end transition-colors duration-200 hover:text-royal">
                <span className="muted flex items-center gap-2 text-sm">Next chapter <Arrow className="h-4 w-4" /></span>
                <span dir="auto" className="font-display text-[1.25rem] font-bold leading-tight">{next.title}</span>
              </Link>
            ) : (
              <Link href={`/books/${book.slug}`} className="panel flex flex-col items-end gap-1 p-5 text-end transition-colors duration-200 hover:text-royal">
                <span className="muted text-sm">You have reached the end</span>
                <span dir="auto" className="font-display text-[1.25rem] font-bold leading-tight">Back to {book.title}</span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
