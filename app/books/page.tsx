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
        <div className="wrap relative grid items-center gap-8 py-10 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:py-20">
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
          <div className="relative isolate min-h-[19rem] overflow-hidden rounded-[1.75rem] bg-[#e9e8d8] shadow-[0_20px_60px_-30px_rgba(4,50,41,.35)] sm:min-h-[25rem] lg:min-h-[30rem]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#fff8e7_0%,transparent_55%),linear-gradient(140deg,#f4f1e4,#d9e4d6)]" />
            <svg viewBox="0 0 560 440" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs><linearGradient id="woodShelf" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#a57c4c"/><stop offset="1" stopColor="#694b30"/></linearGradient><linearGradient id="bookSpine" x1="0" x2="1"><stop stopColor="#092e34"/><stop offset=".55" stopColor="#174d50"/><stop offset="1" stopColor="#092e34"/></linearGradient><radialGradient id="lanternGlow"><stop stopColor="#ffdb83" stopOpacity=".9"/><stop offset="1" stopColor="#ffdb83" stopOpacity="0"/></radialGradient></defs>
              <path d="M170 0 Q85 70 120 165 L120 410 L430 410 L430 165 Q460 70 380 0" fill="#7a9d84" opacity=".13"/>
              <circle cx="280" cy="178" r="160" fill="#fff7e5" opacity=".4"/>
              <ellipse cx="185" cy="285" rx="125" ry="125" fill="url(#lanternGlow)"/>
              <rect x="15" y="362" width="540" height="24" rx="4" fill="url(#woodShelf)"/><rect x="20" y="386" width="530" height="9" fill="#59442e" opacity=".3"/>
              <g stroke="#d9b779" strokeWidth="2"><rect x="265" y="121" width="62" height="240" rx="4" fill="url(#bookSpine)"/><rect x="332" y="111" width="57" height="250" rx="4" fill="#164a50"/><rect x="393" y="131" width="47" height="230" rx="4" fill="#a98652"/><rect x="445" y="142" width="51" height="219" rx="4" fill="#17454b"/></g>
              {Array.from({length:4},(_,i)=><g key={i} stroke="#d9b779" strokeWidth="1.5" fill="none"><path d={`M${277+i*61} 146 v180 M${315+i*61} 146 v180`} opacity=".5"/><path d={`M${274+i*61} 165 h45 M${274+i*61} 319 h45`}/><path d={`M${295+i*61} 200 l12 20 -12 20 -12 -20z`}/></g>)}
              <g stroke="#513a20" strokeWidth="5" strokeLinejoin="round"><path d="M108 202 L152 202 L163 231 L163 352 L96 352 L96 231 Z" fill="#ad7837"/><path d="M130 173 L130 201 M114 201 Q130 176 146 201" fill="none"/><path d="M103 228 L156 228 M103 343 L156 343" fill="none"/><path d="M130 235 L148 272 L130 311 L111 272 Z" fill="#ffe0a0" stroke="#bd924c" strokeWidth="3"/><path d="M130 235 L130 311 M111 272 L148 272" strokeWidth="2"/></g>
              <path d="M517 363 L522 260 L540 260 L544 363" fill="#b7a38a"/><path d="M530 267 Q490 225 475 171 M528 283 Q550 235 565 205 M529 309 Q485 283 476 253" stroke="#527a48" strokeWidth="6" fill="none"/><g fill="#668f56"><ellipse cx="488" cy="184" rx="28" ry="12" transform="rotate(30 488 184)"/><ellipse cx="541" cy="231" rx="28" ry="12" transform="rotate(-35 541 231)"/><ellipse cx="490" cy="266" rx="25" ry="12" transform="rotate(25 490 266)"/></g>
            </svg>
            <div className="absolute bottom-5 left-5 rounded-full border border-[#cbb58c]/60 bg-[#fff9eb]/85 px-4 py-2 text-xs font-semibold tracking-[.14em] text-[#1d5344] backdrop-blur-sm">READ • REFLECT • GROW</div>
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
              <li key={b.id} className="group relative min-w-0 overflow-hidden rounded-[1.5rem] border border-[#b9d4c8] bg-[#f5f2e6] shadow-[0_12px_35px_-24px_rgba(4,50,41,.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative z-10 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] items-center gap-4 p-4 pb-8 sm:gap-7 sm:p-7 sm:pb-12">
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
                <svg aria-hidden="true" viewBox="0 0 600 75" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full"><path d="M0 46 Q90 0 185 40 T370 40 T600 18 V75 H0Z" fill="#b8d9cb"/><path d="M0 60 Q120 15 235 54 T480 43 T600 49 V75 H0Z" fill="#7bb3a0"/><path d="M0 68 Q130 38 290 63 T600 60 V75 H0Z" fill="#2f806f"/></svg>
              </li>
            ))}
          </ul>
        )}
        <div className="relative isolate mt-12 min-h-[19rem] overflow-hidden rounded-[1.5rem] bg-[#06463e] text-white sm:mt-16 sm:min-h-[18rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#073b33] via-[#0c6253] to-[#398d7b]" />
          <svg aria-hidden="true" viewBox="0 0 1000 330" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <circle cx="930" cy="60" r="35" fill="#f9e6ac"/><circle cx="947" cy="49" r="35" fill="#398d7b"/>
            <path d="M0 275 Q170 195 350 255 T720 230 T1000 220 V330 H0Z" fill="#267e6c"/><path d="M0 300 Q160 245 350 290 T700 255 T1000 280 V330 H0Z" fill="#125c51"/><path d="M0 315 Q260 275 440 310 T1000 300 V330 H0Z" fill="#073b33"/>
            <g fill="#073b33"><path d="M790 267 v-50 q25-35 50 0 v50z M800 218 q15-28 30 0z"/><rect x="778" y="265" width="75" height="18"/><rect x="874" y="217" width="12" height="62"/><path d="M870 218 l10-30 10 30z"/><rect x="727" y="237" width="10" height="42"/><path d="M722 239 l10-23 10 23z"/></g>
            <g transform="translate(32 58) rotate(-13 95 140)"><rect x="0" y="150" width="190" height="45" rx="5" fill="#bba078" stroke="#f2cf8a" strokeWidth="3"/><rect x="8" y="155" width="174" height="34" fill="#113d3c"/><path d="M20 170 H165 M25 180 H160" stroke="#cba65d" strokeWidth="2"/><rect x="15" y="100" width="200" height="48" rx="5" fill="#153c40" stroke="#f2cf8a" strokeWidth="3"/><path d="M35 110 V138 M195 110 V138 M65 124 H165" stroke="#d4b276" strokeWidth="3"/><rect x="28" y="50" width="190" height="48" rx="5" fill="#1b5251" stroke="#f2cf8a" strokeWidth="3"/><path d="M43 60 V89 M200 60 V89 M75 75 H180" stroke="#d4b276" strokeWidth="3"/></g>
          </svg>
          <div className="relative z-10 ml-auto max-w-[43rem] px-6 py-11 sm:px-12 sm:py-14 lg:w-[70%]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e4d3a4]">The library is growing</p>
            <h2 className="font-display mt-3 break-words text-[clamp(1.7rem,5vw,2.75rem)] leading-tight">More Books Coming Soon</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-white/90">Patuloy ang pagsusulat at pagdaragdag ng mga aklat at kabanata. Balikan ang pahinang ito para sa mga bagong babasahin.</p>
            <a href="#library" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/80 bg-[#06463e]/30 px-6 py-2 font-semibold transition hover:bg-white hover:text-[#073d35]">Browse Books ↑</a>
          </div>
        </div>
      </section>
    </div>
  );
}
