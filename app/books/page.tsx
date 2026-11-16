import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { Arrow, Book, Layers, Readers, ReadOnline } from "@/components/Icons";
import { getBooks, getSettings } from "@/lib/data";
import type { Book as LibraryBook } from "@/lib/site";
import BookShelf from "./BookShelf";
import "./books.css";

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings();
  return {
    title: st.booksTitle,
    description: st.booksIntro || undefined,
    alternates: { canonical: "/books" },
    openGraph: { title: st.booksTitle, url: "/books" },
  };
}

function BookCard({ book }: { book: LibraryBook }) {
  const detailsHref = `/books/${book.slug}`;
  const firstChapter = book.chapters[0];
  const description = book.description?.replace(/[#*_>\[\]()`]/g, "").replace(/\s+/g, " ").trim();

  return (
    <>
      <Link href={detailsHref} className="books-cover" aria-label={`View ${book.title}`}>
        <BookCover book={book} sizes="(min-width: 1240px) 210px, (min-width: 800px) 18vw, 36vw" />
      </Link>
      <div className="books-card-copy">
        <h3 dir="auto">{book.title}</h3>
        <p className="books-chapter-count">
          <Layers className="size-5 shrink-0" />
          {book.chapters.length} {book.chapters.length === 1 ? "Chapter" : "Chapters"}
        </p>
        {book.subtitle && <p className="books-subtitle" dir="auto">{book.subtitle}</p>}
        {description && <p className="books-description" dir="auto">{description}</p>}
        <div className="books-card-actions">
          {firstChapter && (
            <Link className="books-primary-button" href={`${detailsHref}/${firstChapter.slug}`}>
              Read Online <Arrow />
            </Link>
          )}
          <Link className="books-outline-button" href={detailsHref}>View Details</Link>
        </div>
      </div>
    </>
  );
}

export default async function BooksPage() {
  const [st, books] = await Promise.all([getSettings(), getBooks()]);
  const chapters = books.reduce((sum, book) => sum + book.chapters.length, 0);
  const firstBook = books.find((book) => book.chapters.length > 0);
  const stats = [
    { icon: Book, value: books.length, label: "Books" },
    { icon: Layers, value: chapters, label: "Chapters" },
    { icon: ReadOnline, value: "Free", label: "To Read" },
    { icon: Readers, value: "For All", label: "Readers" },
  ];

  return (
    <div className="books-landing">
      <section className="books-hero" aria-labelledby="books-title">
        <div className="books-hero-inner">
          <div className="books-hero-copy">
            <Book className="books-hero-icon" />
            <h1 id="books-title" dir="auto">{st.booksTitle}</h1>
            <p dir="auto">{st.booksIntro || "Explore the books and read each chapter online."}</p>
            <div className="books-hero-actions">
              <a href="#library" className="books-primary-button">
                <Book className="size-6" /> Browse Books
              </a>
              {firstBook && (
                <Link href={`/books/${firstBook.slug}/${firstBook.chapters[0].slug}`} className="books-outline-button">
                  <ReadOnline className="size-5" /> Start Reading
                </Link>
              )}
            </div>
          </div>
          <div className="books-hero-visual">
            <div className="books-hero-photo">
              <Image
                src="/images/books-hero.webp"
                alt="Ornate Islamic books beside a lantern and a plant on a sunlit table"
                fill
                sizes="(min-width: 800px) 58vw, 100vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover object-[62%_54%]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="books-shell">
        <section aria-label="Library at a glance">
          <ul className="books-stats">
            {stats.map(({ icon: Icon, value, label }) => (
              <li key={label}>
                <Icon className="books-stat-icon" />
                <div><strong>{value}</strong><span>{label}</span></div>
              </li>
            ))}
          </ul>
        </section>

        <BookShelf entries={books.map((book) => ({ slug: book.slug, title: book.title, card: <BookCard book={book} /> }))} />

        <section className="books-coming-soon" aria-labelledby="more-books-title">
          <div className="books-coming-soon-copy">
            <Book className="books-banner-icon" />
            <div>
              <h2 id="more-books-title">More Books Coming Soon</h2>
              <p lang="tl">Patuloy akong sumusulat ng mga bagong aklat upang magbahagi ng kaalaman at mga paalala tungkol sa Islam.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
