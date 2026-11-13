import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import { heroImageStyle } from "@/lib/site";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import PageShell from "@/components/PageShell";
import { getPages } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.length ? pages.map((p) => ({ slug: p.slug })) : [{ slug: "-" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug);
  if (!page) return {};
  const description = page.description || page.content.replace(/[#*_>\[\]()`]/g, "").replace(/\s+/g, " ").trim().slice(0, 155) || undefined;
  return { title: page.title, description, alternates: { canonical: `/${slug}` }, openGraph: { title: page.title, description, url: `/${slug}` } };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug);
  if (!page) notFound();
  if (slug === "about") {
    const st = await getSettings();
    const chapters = page.content.split(/(?=^## )/m);
    const intro = chapters.shift() || "";
    return (
      <>
        <section className="relative isolate overflow-hidden bg-paper-2">
          <div className="relative h-[22rem] sm:h-[31rem] lg:h-[38rem]">
            <Image src={st.heroImage} alt={st.siteName} fill priority sizes="100vw" style={heroImageStyle(st)} className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/35 via-transparent to-transparent" />
          </div>
          <div className="wrap relative -mt-24 pb-10 sm:-mt-36 sm:pb-16">
            <p className="caps text-royal" data-reveal>{page.eyebrow || "About"}</p>
            <h1 dir="auto" className="display-lg mt-3 max-w-[17ch] text-navy-950" data-reveal>{page.title}</h1>
            <div className="rule mt-6" />
          </div>
        </section>
        <div className="wrap pb-20 sm:pb-24">
          <div className="grid gap-8 border-b border-navy-800/20 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-16">
            <div>
              <p className="caps text-royal">The journey</p>
              <h2 className="font-display mt-3 text-3xl italic text-navy-950 sm:text-4xl">A life shaped by faith and learning</h2>
            </div>
            <div className="min-w-0 border-s-2 border-royal/50 ps-5 sm:ps-8"><Markdown>{intro}</Markdown></div>
          </div>
          {chapters.map((chapter, index) => (
            <section key={index} className="grid gap-6 border-b border-navy-800/15 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-16">
              <div className="flex items-start gap-4">
                <span className="font-display text-3xl italic text-royal/70">{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden className="mt-5 h-px flex-1 bg-royal/40" />
              </div>
              <div className="min-w-0"><Markdown>{chapter}</Markdown></div>
            </section>
          ))}
        </div>
      </>
    );
  }
  return (
    <PageShell eyebrow={page.eyebrow} title={page.title}>
      <div className="lg:ms-[8.33%]"><Markdown>{page.content}</Markdown></div>
    </PageShell>
  );
}
