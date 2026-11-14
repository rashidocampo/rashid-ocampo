import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import FeaturedVideos from "@/components/FeaturedVideos";
import { Arrow, Play, TagIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import Skyline from "@/components/Skyline";
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
      {/* Hero: the photo fills the left and fades into the paper; the words sit on the right */}
      <section className="hero relative isolate overflow-hidden bg-paper" data-parallax-root>
        <div className="pattern pointer-events-none absolute -right-[10%] -top-[35%] -z-10 aspect-square w-[40rem] bg-royal opacity-[0.07]" data-parallax="0.25" aria-hidden />
        <Skyline className="pointer-events-none absolute bottom-0 right-0 -z-10 hidden w-[46%] max-w-[44rem] opacity-80 lg:block" />

        <div className="hero-photo relative h-[22rem] overflow-hidden sm:h-[28rem] lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[56%]" data-hero="0">
          <div className="absolute -inset-y-[6%] inset-x-0" data-parallax="0.15" data-hero-img>
            <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="(min-width: 1024px) 56vw, 100vw" style={heroImageStyle(st)} />
          </div>
        </div>

        <div className="wrap relative grid lg:min-h-[40rem] lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div className="-mt-4 pb-14 sm:-mt-8 lg:col-start-2 lg:mt-0 lg:pb-44 lg:pt-16">
            <p dir="auto" className="caps flex items-center gap-4 text-navy-950" data-hero="1">
              {st.greeting} <span className="h-px w-16 bg-royal sm:w-24" />
            </p>
            <h1 dir="auto" className="hero-name mt-4" data-hero="2" data-hero-kind="words"><SplitText text={st.heroTitle} /></h1>
            {st.tagline && (
              <div className="mt-2" data-hero="3">
                {st.taglineHighlight ? (
                  <p className="mt-2 inline-block -skew-x-[18deg] bg-gradient-to-r from-royal via-royal to-royal/70 px-7 py-1">
                    <span dir="auto" className="font-display inline-block skew-x-[18deg] text-[1.875rem] italic text-white sm:text-[2.25rem]">{st.tagline}</span>
                  </p>
                ) : (
                  <p dir="auto" className="hero-tagline font-display italic">{st.tagline}</p>
                )}
              </div>
            )}
            <p dir="auto" className="lede mt-6 max-w-[34rem] text-navy-950" data-hero="4">{st.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" data-hero="5">
              <a href="#video" className="btn btn-deep" data-magnetic>
                <Play className="h-4 w-4" /> {st.heroPrimaryLabel}
              </a>
              <Link href={st.heroSecondaryLink || "/about"} className="btn btn-line" data-magnetic>
                {st.heroSecondaryLabel} <Arrow className="arrow h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
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
            <Carousel label={st.homeBlogTitle}>
              {posts.map((p) => (
                <div key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]" data-reveal>
                  <PostCard post={p} />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}
    </>
  );
}
