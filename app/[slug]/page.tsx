import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Icons";
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
    const parts = page.content.split(/\n\s*\n/);
    const introduction = parts[0] || "";
    const biography = parts.slice(1).join("\n\n");
    return (
      <>
        <PageShell eyebrow={page.eyebrow} title={page.title}>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-paper-2 lg:sticky lg:top-24">
              <div className="relative aspect-[5/4] sm:aspect-[4/3] lg:aspect-[3/4]">
                <Image src={st.heroImage} alt={st.siteName} fill sizes="(min-width:1024px) 40vw, 100vw" style={heroImageStyle(st)} className="object-cover" />
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper-2 to-transparent" />
              </div>
              <div className="relative px-6 pb-8 pt-2 sm:px-8">
                <p className="caps text-royal">{page.eyebrow || "About"}</p>
                <h2 dir="auto" className="font-display mt-3 text-[2rem] leading-tight text-navy-950">{st.siteName}</h2>
                <div className="rule mt-5" />
              </div>
            </div>
            <div className="min-w-0">
              {introduction && <div className="border-s-2 border-royal/60 ps-5 sm:ps-7"><Markdown>{introduction}</Markdown></div>}
              {biography && <div className="mt-9 border-t border-navy-800/15 pt-8"><Markdown>{biography}</Markdown></div>}
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-5 border-t border-navy-800/20 pt-9 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="caps text-royal">Get in touch</p><h2 className="font-display mt-2 text-3xl italic text-navy-950">Continue the conversation</h2></div>
            <Link href="/contact" className="btn btn-accent self-start" data-magnetic>Get in Touch <Arrow className="arrow h-4 w-4" /></Link>
          </div>
        </PageShell>
      </>
    );
  }
  return (
    <PageShell eyebrow={page.eyebrow} title={page.title}>
      <div className="lg:ms-[8.33%]"><Markdown>{page.content}</Markdown></div>
    </PageShell>
  );
}
