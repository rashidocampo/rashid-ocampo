import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/data";
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
    const story = page.content.split(/^## Connect & Follow\s*$/m)[0] || "";
    const chapters = story.split(/(?=^## )/m).filter(Boolean);
    const intro = chapters.shift() || "";
    const personal = chapters.filter(chapter => /^## Life beyond/i.test(chapter));
    const timeline = chapters.filter(chapter => !/^## Life beyond/i.test(chapter));
    return (
      <>
        <section className="relative isolate overflow-hidden bg-paper">
          <div className="wrap relative grid items-center gap-4 pt-12 pb-5 sm:gap-8 sm:py-16 lg:min-h-[35rem] lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
            <div className="relative z-10 max-w-xl">
              <p className="caps text-royal">{page.eyebrow || "About"}</p>
              <h1 dir="auto" className="display-lg mt-5 text-navy-950">{page.title}</h1>
              <div className="rule my-7" />
              <div className="lede max-w-lg"><Markdown>{intro}</Markdown></div>
            </div>
            <div className="relative -mx-4 h-[19rem] sm:h-[29rem] lg:-me-[max(3rem,calc((100vw-68rem)/2))] lg:h-[36rem]">
              <Image src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JPXSvHhaXMIGO4UpIdGIyqqbPZ/54f0c737-86b5-420b-8afc-f0f703536e9c.jpg" unoptimized alt="Rashid Ocampo in Santorini" fill priority sizes="(min-width:1024px) 55vw, 100vw" style={{objectFit:"cover",objectPosition:"center 38%",maskImage:"radial-gradient(ellipse 76% 69% at 50% 52%, black 61%, transparent 100%)",WebkitMaskImage:"radial-gradient(ellipse 76% 69% at 50% 52%, black 61%, transparent 100%)"}} className="object-cover" />
            </div>
          </div>
        </section>
        <div className="wrap pb-16 sm:pb-24">
          <div className="flex items-center gap-5 border-b border-royal/25 pb-6">
            <h2 className="font-display text-3xl text-navy-950 sm:text-4xl">My Journey</h2>
            <span aria-hidden className="h-[2px] flex-1 bg-gradient-to-r from-royal/70 to-transparent" />
          </div>
          <div className="relative mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-16">
            <div className="relative border-s-2 border-royal/35 ps-8 sm:ps-12">
              {timeline.map((chapter,index)=>(
                <section key={index} className="relative pb-12 last:pb-0">
                  <span aria-hidden className="absolute -start-[calc(2rem+1.15rem)] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-royal text-white ring-[5px] ring-paper sm:-start-[calc(3rem+1.15rem)]">
                    <span className="text-sm font-semibold">{String(index+1).padStart(2,"0")}</span>
                  </span>
                  <div className="prose max-w-none"><Markdown>{chapter}</Markdown></div>
                </section>
              ))}
            </div>
            <aside className="relative">
              <div className="relative -mx-3 h-[21rem] sm:mx-0 sm:h-[29rem] lg:sticky lg:top-28 lg:h-[35rem]">
                <Image src="https://d2ol7oe51mr4n9.cloudfront.net/user_3JPXSvHhaXMIGO4UpIdGIyqqbPZ/0eca9318-c305-4120-8e19-ddb3fdcc3ab7.jpg" unoptimized alt="Rashid Ocampo seated in Santorini" fill sizes="(min-width:1024px) 38vw, 100vw" style={{objectFit:"cover",objectPosition:"center 42%",maskImage:"radial-gradient(ellipse 75% 75% at 50% 49%, black 62%, transparent 100%)",WebkitMaskImage:"radial-gradient(ellipse 75% 75% at 50% 49%, black 62%, transparent 100%)"}} className="object-cover" />
              </div>
              <blockquote className="mt-6 border-s-2 border-royal ps-5 font-display text-xl italic leading-relaxed text-navy-950 sm:text-2xl">A journey shaped by faith, learning, and service.</blockquote>
            </aside>
          </div>
          {personal.length > 0 && <section className="mt-16 grid gap-6 border-t border-royal/25 pt-10 sm:grid-cols-[1fr_2fr]"><p className="caps text-royal">Personal life</p><div>{personal.map((part,i)=><Markdown key={i}>{part}</Markdown>)}</div></section>}
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
