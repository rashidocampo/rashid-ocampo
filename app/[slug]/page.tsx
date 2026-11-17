import type { Metadata } from "next";
import Image from "next/image";
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
    const story = page.content.split(/^## Connect & Follow\s*$/m)[0] || "";
    const chapters = story.split(/(?=^## )/m).filter(Boolean);
    const intro = chapters.shift() || "";
    const personal = chapters.filter((chapter) => /^## Life beyond/i.test(chapter));
    const timeline = chapters.filter((chapter) => !/^## Life beyond/i.test(chapter));
    const firstPhoto = "https://d2ol7oe51mr4n9.cloudfront.net/user_3JPXSvHhaXMIGO4UpIdGIyqqbPZ/54f0c737-86b5-420b-8afc-f0f703536e9c.jpg";
    const secondPhoto = "https://d2ol7oe51mr4n9.cloudfront.net/user_3JPXSvHhaXMIGO4UpIdGIyqqbPZ/0eca9318-c305-4120-8e19-ddb3fdcc3ab7.jpg";
    return (
      <main className="bg-paper">
        <div className="wrap max-w-5xl py-12 sm:py-16 lg:py-20">
          <header className="mx-auto max-w-3xl">
            <p className="caps text-royal">{page.eyebrow || "About"}</p>
            <h1 dir="auto" className="display-lg mt-4 text-navy-950">{page.title}</h1>
            <div className="rule my-7" />
            <section aria-label="Audio biography" className="mt-8 overflow-hidden rounded-2xl border border-royal/25 bg-white/85 p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-royal/10 text-royal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4"/></svg>
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-navy-950 sm:text-2xl">Listen to My Story</h2>
                  <p className="mt-1 text-sm leading-relaxed text-navy-700">Prefer listening? Play my narrated biography, or continue reading below.</p>
                </div>
              </div>
              <audio className="mt-5 block w-full" controls preload="metadata" aria-label="Listen to Rashid Ocampo's biography">
                <source src="https://esnvyrhepkewnsqqvtgm.supabase.co/storage/v1/object/public/media/1794886413766-dwhk9q-ABOUT-RASHID.mp3" type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>
            </section>
            <div className="leading-relaxed"><Markdown>{intro}</Markdown></div>
          </header>
          <figure className="relative mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-2xl sm:mt-12">
            <div className="relative aspect-[4/3] sm:aspect-[16/9]">
              <Image src={firstPhoto} unoptimized alt="Rashid Ocampo in Santorini" fill priority sizes="(min-width:1024px) 896px, 100vw" className="object-cover object-center" />
            </div>
          </figure>
          <div className="mx-auto mt-14 max-w-3xl sm:mt-20">
            <h2 className="font-display border-b border-royal/30 pb-5 text-3xl text-navy-950 sm:text-4xl">My Journey</h2>
            <div className="mt-10 space-y-10 sm:space-y-12">
              {timeline.map((chapter,index)=>(
                <div key={index}>
                  <section className="min-w-0 border-s-2 border-royal/35 ps-5 sm:ps-7">
                    <div className="prose max-w-none"><Markdown>{chapter}</Markdown></div>
                  </section>
                  {index === Math.floor((timeline.length - 1) / 2) && (
                    <figure className="mt-10 overflow-hidden rounded-2xl">
                      <div className="relative aspect-[4/3] sm:aspect-[16/9]">
                        <Image src={secondPhoto} unoptimized alt="Rashid Ocampo seated overlooking Santorini" fill sizes="(min-width:768px) 768px, 100vw" className="object-cover object-center" />
                      </div>
                    </figure>
                  )}
                </div>
              ))}
            </div>
            {personal.length > 0 && (
              <section className="mt-14 border-t border-royal/30 pt-10">
                {personal.map((chapter,index)=><div className="prose max-w-none" key={index}><Markdown>{chapter}</Markdown></div>)}
              </section>
            )}
          </div>
        </div>
      </main>
    );
  }
  return (
    <PageShell eyebrow={page.eyebrow} title={page.title}>
      <div className="lg:ms-[8.33%]"><Markdown>{page.content}</Markdown></div>
    </PageShell>
  );
}
