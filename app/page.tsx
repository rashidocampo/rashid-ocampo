import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeaturedVideos from "@/components/FeaturedVideos";
import { Arrow, Play, TagIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import SplitText from "@/components/SplitText";
import { getPosts, getSettings, getTags } from "@/lib/data";
import { defaultSettings, heroImageStyle, SITE_URL, youtubeId } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const st = await getSettings();
  const title = st.ogTitle?.trim() || defaultSettings.ogTitle;
  const description = st.ogDescription?.trim() || defaultSettings.ogDescription;
  const url = st.ogImage || defaultSettings.ogImage;
  const image = { url, alt: `${title} — ${description}` };
  return {
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: st.siteName, locale: "en_US", title, description, url: "/", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Home() {
  const [st, tags, allPosts] = await Promise.all([getSettings(), getTags(), getPosts()]);
  const topics = tags.filter((t) => t.show_on_home);
  const videos = [
    { id: youtubeId(st.youtubeUrl), title: st.videoTitle, blurb: st.videoBlurb },
    { id: youtubeId(st.youtubeUrl2), title: st.videoTitle2, blurb: st.videoBlurb2 },
    { id: youtubeId(st.youtubeUrl3), title: st.videoTitle3, blurb: st.videoBlurb3 },
    { id: youtubeId(st.youtubeUrl4), title: st.videoTitle4, blurb: st.videoBlurb4 },
  ].filter((v) => v.id);
  const posts = allPosts.filter((p) => p.show_on_home !== false).slice(0, 12);

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: st.siteName, url: SITE_URL, description: st.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Person", name: st.siteName, url: SITE_URL, description: st.description, image: new URL(st.heroImage, SITE_URL).href },
        ]}
      />
      {/* Editorial Santorini-style hero: existing font settings and all four videos remain intact. */}
      <section className="relative isolate min-h-[570px] overflow-hidden bg-[#dcebf5] lg:min-h-[610px]">
        <div className="absolute inset-0">
          <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: `${st.heroX ?? 50}% ${st.heroY ?? 50}%` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8fbff]/95 via-[#f8fbff]/80 via-40% to-transparent lg:via-[#f8fbff]/20" />
        </div>
        <div className="wrap relative flex min-h-[570px] items-center py-24 lg:min-h-[610px]">
          <div className="max-w-[550px]">
            <div className="mb-6 h-[3px] w-24 bg-[#0875ad]" />
            <h1 className="font-display text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[1.04] tracking-tight text-[#092b49]">A Journey of Faith.<br />A Life of Dawah.</h1>
            <p className="mt-7 max-w-[440px] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-[#092b49]">{st.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#video" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#075b91] px-7 text-white transition hover:bg-[#093d65]"><Play className="h-4 w-4" /> {st.heroPrimaryLabel}</a>
              <Link href={st.heroSecondaryLink || "/about"} className="inline-flex min-h-12 items-center gap-3 rounded-full border border-[#075b91] bg-white/65 px-7 text-[#092b49] transition hover:bg-white">{st.heroSecondaryLabel} <Arrow className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-1 left-0 h-12 w-full rounded-t-[50%] bg-[#fbf9f4] sm:h-16" />
      </section>

      {/* Featured video */}
      <section className="pt-7">
        <div className="wrap">
          <FeaturedVideos label={st.featuredLabel} videos={videos.length ? videos : [{ id: "", title: st.videoTitle, blurb: st.videoBlurb }]} />
        </div>
      </section>

      {/* Topics */}
      {topics.length > 0 && (
        <section className="pt-7">
          <div className="wrap">
            <ul className="panel grid grid-cols-2 gap-y-2 px-3 py-5 lg:flex lg:px-6" data-reveal>
              {topics.map((t, i) => (
                <li key={t.id} className={`lg:flex-1 ${i > 0 ? "lg:border-s lg:border-navy-800/25" : ""}`}>
                  <Link href={`/tag/${t.slug}`} className="topic flex min-h-16 items-center justify-center gap-4 px-3 py-2">
                    <TagIcon name={t.icon} className="topic-icon h-11 w-11 shrink-0 text-royal sm:h-12 sm:w-12" />
                    <span dir="auto" className="max-w-[9rem] text-[1.0625rem] leading-tight">{t.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <h2 dir="auto" className="caps-title"><SplitText text={st.homeBlogTitle} /></h2>
                <div className="rule mt-4" data-reveal />
              </div>
              <Link href="/blog" className="link inline-flex min-h-11 items-center gap-3" data-reveal>
                {st.homeBlogLinkLabel} <Arrow className="arrow h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <div key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]" data-reveal>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
