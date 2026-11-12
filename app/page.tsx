import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import FeaturedVideos from "@/components/FeaturedVideos";
import { Arrow, Play, TagIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import PostCard from "@/components/PostCard";
import Smoke from "@/components/Smoke";
import SplitText from "@/components/SplitText";
import { getPosts, getSettings, getTags } from "@/lib/data";
import { heroImageStyle, SITE_URL, youtubeId } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [st, tags, allPosts] = await Promise.all([getSettings(), getTags(), getPosts()]);
  const topics = tags.filter((t) => t.show_on_home);
  const videos = [
    { id: youtubeId(st.youtubeUrl), title: st.videoTitle, blurb: st.videoBlurb },
    { id: youtubeId(st.youtubeUrl2), title: st.videoTitle2, blurb: st.videoBlurb2 },
    { id: youtubeId(st.youtubeUrl3), title: st.videoTitle3, blurb: st.videoBlurb3 },
  ].filter((v) => v.id);
  const posts = allPosts.filter((p) => p.show_on_home !== false).slice(0, 9);
  const count = (tagId: string) => allPosts.filter((p) => p.tags.some((t) => t.id === tagId)).length;
  const ticker = topics.length ? topics.map((t) => t.name) : [st.tagline, st.siteName];
  // The ring of text that turns beside the portrait
  const ring = `${st.tagline} · ${st.tagline} · `;

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: st.siteName, url: SITE_URL, description: st.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Person", name: st.siteName, url: SITE_URL, description: st.description, image: new URL(st.heroImage, SITE_URL).href },
        ]}
      />

      {/* Hero. Layers, far to near: smoke aurora, turning ornament, name, portrait, ticker */}
      <section className="ink relative isolate overflow-hidden" data-parallax-root>
        <div className="absolute inset-0 -z-10" data-parallax="0.35" data-hero="0" data-hero-kind="fade" aria-hidden>
          <Smoke />
        </div>
        <div className="pointer-events-none absolute -right-[30%] top-1/2 -z-10 aspect-square w-[78rem] -translate-y-1/2 lg:-right-[12%]" data-parallax="0.2" aria-hidden>
          <div className="pattern spin-slow h-full w-full bg-gold opacity-[0.13]" />
        </div>
        <div className="spot -z-10" data-spot aria-hidden />

        <div className="wrap relative grid min-h-svh items-center gap-x-10 gap-y-8 pb-24 pt-24 lg:grid-cols-12 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7" data-parallax="-0.16" data-parallax-min="1024">
            <p dir="auto" className="flex items-center gap-4 text-sm font-semibold tracking-[0.3em] text-gold" data-hero="2">
              <span className="h-px w-10 bg-gold" /> {st.greeting}
            </p>
            <h1 dir="auto" className="display-xl mt-4 lg:mt-6" data-hero="1" data-hero-kind="letters">
              <SplitText text={st.siteName} letters />
            </h1>
            <p dir="auto" className="font-display display-sm mt-3 text-sky lg:mt-5 lg:text-[2.75rem]" data-hero="3">{st.tagline}</p>
            <p dir="auto" className="lede mt-5 max-w-[33rem] text-white/85 lg:mt-6" data-hero="4">{st.description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8" data-hero="5">
              <a href="#video" className="btn btn-light" data-magnetic>
                <Play className="h-3.5 w-3.5" /> {st.heroPrimaryLabel}
              </a>
              <Link href={st.heroSecondaryLink || "/about"} className="btn btn-line" data-magnetic>
                {st.heroSecondaryLabel} <Arrow className="arrow h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="order-first lg:order-none lg:col-span-5" data-parallax="0.12" data-parallax-min="1024">
            <div className="relative mx-auto aspect-[4/5] w-[min(48vw,12rem)] [perspective:1000px] lg:w-[min(100%,26rem)]">
              <div className="h-full" data-tilt>
                <div className="arch absolute -inset-2.5 border border-gold/70 lg:-inset-4" data-hero="6" data-hero-kind="fade" aria-hidden />
                <div className="arch relative h-full overflow-hidden bg-navy-800" data-hero="2" data-hero-kind="arch">
                  <div className="absolute inset-0" data-hero-img>
                    <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="(min-width: 1024px) 420px, 48vw" style={heroImageStyle(st)} />
                  </div>
                </div>
              </div>
              {/* A ring of text turning at the portrait's shoulder */}
              <div className="absolute -bottom-8 -left-8 h-24 w-24 lg:-bottom-12 lg:-left-16 lg:h-40 lg:w-40" data-hero="7" data-hero-kind="fade" aria-hidden>
                <svg viewBox="0 0 200 200" className="spin h-full w-full overflow-visible text-gold">
                  <defs><path id="ring" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs>
                  <text className="fill-current" style={{ fontFamily: "var(--font-display)", fontStretch: "75%", fontWeight: 700, fontSize: 21, letterSpacing: 3, textTransform: "uppercase" }}>
                    <textPath href="#ring" textLength="486">{ring}</textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy-950 lg:h-14 lg:w-14">
                  <Arrow className="bob h-4 w-4 rotate-90 lg:h-5 lg:w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-y border-white/15 bg-navy-950/40 py-3 backdrop-blur-sm" data-hero="8" data-hero-kind="fade">
          <Marquee items={ticker} className="font-display text-[1.75rem] leading-none text-white/90 lg:text-[2.25rem]" />
        </div>
      </section>

      {/* Videos: the player grows to full size as it comes up the screen */}
      <section className="ink section relative overflow-hidden">
        <div className="aurora opacity-60" data-parallax="0.25" aria-hidden><span /><span /><span /><span /></div>
        <div className="wrap relative">
          <FeaturedVideos heading={st.featuredLabel} videos={videos.length ? videos : [{ id: "", title: st.videoTitle, blurb: st.videoBlurb }]} />
        </div>
      </section>

      {/* Topics */}
      {topics.length > 0 && (
        <section className="ink section relative overflow-hidden">
          <div className="pointer-events-none absolute -left-[20%] top-0 aspect-square w-[60rem]" data-parallax="0.3" aria-hidden>
            <div className="pattern spin-slow h-full w-full bg-sky opacity-[0.08]" />
          </div>
          <div className="wrap relative">
            <h2 dir="auto" className="display-lg"><SplitText text={st.homeTopicsTitle} /></h2>
            <ul className="mt-10 border-t border-white/20 lg:mt-16">
              {topics.map((t) => (
                <li key={t.id} className="border-b border-white/20" data-reveal>
                  <Link href={`/tag/${t.slug}`} className="fill-row group flex min-h-24 items-center gap-5 py-5 lg:min-h-32 lg:gap-8">
                    <TagIcon name={t.icon} className="fill-icon h-10 w-10 shrink-0 text-gold group-hover:text-navy-950 lg:h-14 lg:w-14" />
                    <span dir="auto" className="font-display stretch-hover display-md flex-1">{t.name}</span>
                    <span className="tabular text-base opacity-70">{String(count(t.id)).padStart(2, "0")}</span>
                    <Arrow className="fill-arrow h-6 w-6 shrink-0 lg:h-8 lg:w-8" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="paper section relative overflow-hidden">
          <div className="pointer-events-none absolute -right-[25%] -top-[10%] aspect-square w-[64rem]" data-parallax="0.3" aria-hidden>
            <div className="pattern spin-slow h-full w-full bg-royal opacity-[0.07]" />
          </div>
          <div className="wrap relative">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 lg:mb-16">
              <h2 dir="auto" className="display-lg"><SplitText text={st.homeBlogTitle} /></h2>
              <Link href="/blog" className="btn btn-line" data-reveal data-magnetic>
                {st.homeBlogLinkLabel} <Arrow className="arrow h-4 w-4" />
              </Link>
            </div>
            <Carousel label={st.homeBlogTitle}>
              {posts.map((p) => (
                <div key={p.slug} className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]" data-reveal>
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
