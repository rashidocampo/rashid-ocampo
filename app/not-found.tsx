import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you requested could not be found. Return to Rashid Ocampo's homepage or explore the blog.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[min(75vh,760px)] items-center overflow-hidden bg-paper px-5 py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_30%,rgba(75,125,109,.13),transparent_55%)]" />
      <div className="wrap relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-royal/25 bg-royal/10 px-4 py-2 text-sm font-semibold tracking-[.12em] text-royal uppercase">
            Lost your way?
          </p>
          <p className="font-display text-[clamp(6rem,18vw,12rem)] font-bold leading-[.8] tracking-[-.07em] text-royal" aria-label="Error 404">404<span className="text-navy-950">.</span></p>
          <h1 className="mt-8 font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight text-navy-950">This page could not be found.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-700">The link may have changed, or the page may no longer exist. You can return home or continue reading the latest articles.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-royal px-7 py-3 font-semibold text-white shadow-sm transition hover:brightness-90">← Back to Home</Link>
            <Link href="/blog" className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy-950/30 px-7 py-3 font-semibold text-navy-950 transition hover:border-royal hover:text-royal">Explore the Blog →</Link>
          </div>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[2.5rem] border border-royal/15 bg-gradient-to-br from-[#e8f1e9] via-[#f8f7ef] to-[#c5dcd2] shadow-[0_25px_70px_-40px_rgba(16,31,56,.35)]">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgba(39,107,78,.23),transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <Image src="/ro-mark.svg" alt="Rashid Ocampo RO logo" width={86} height={86} unoptimized className="h-20 w-20 drop-shadow-sm" />
            <div className="h-px w-24 bg-royal/35" />
            <p className="font-display text-2xl font-semibold tracking-wide text-navy-950">RASHID OCAMPO</p>
            <p className="text-sm text-navy-700">A journey of faith and learning continues.</p>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#a5c7b6]/55 to-transparent" />
        </div>
      </div>
    </section>
  );
}
