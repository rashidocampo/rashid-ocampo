import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import PostCard from "@/components/PostCard";
import VideoPlayer from "@/components/VideoPlayer";
import { Arrow, Play, TagIcon } from "@/components/Icons";
import Backdrop from "@/components/Backdrop";
import Spotlight from "@/components/Spotlight";
import { getPosts, getSettings, getTags } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import { heroImageStyle, SITE_URL, youtubeId } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [st, tags, allPosts] = await Promise.all([getSettings(), getTags(), getPosts()]);
  const topics = tags.filter((t) => t.show_on_home);
  const heroStyle = heroImageStyle(st);
  const posts = allPosts.filter((p) => p.show_on_home !== false).slice(0, 9);
  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: st.siteName, url: SITE_URL, description: st.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Person", name: st.siteName, url: SITE_URL, description: st.description, image: new URL(st.heroImage, SITE_URL).href },
        ]}
      />
      <section className="hero-bg relative overflow-hidden">
        {/* Depth layers, far to near: pattern and aurora, portrait, content, bokeh */}
        <Backdrop />
        <Spotlight />
        {/* Portrait */}
        <div className="portrait-fade group/portrait absolute inset-y-0 left-0 hidden w-[46%] max-w-[640px] md:block" style={{ maxHeight: 540 }}>
          <div className="absolute inset-x-0 -top-[10%] h-[128%]" data-parallax="-0.22">
            <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover/portrait:scale-[1.06]">
              <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="46vw" style={heroStyle} />
            </div>
          </div>
        </div>
        <div className="portrait-fade-mobile relative -mb-10 h-80 overflow-hidden md:hidden">
          <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="100vw" style={heroStyle} />
        </div>


        <div className="pointer-events-none absolute inset-0 z-10" data-parallax="-0.3" aria-hidden>
          <span className="orb left-[52%] top-[8%] h-16 w-16 bg-sky/25" />
          <span className="orb left-[78%] top-[20%] h-24 w-24 bg-royal-light/25" style={{ animationDelay: "-3s" }} />
          <span className="orb left-[92%] top-[52%] h-14 w-14 bg-[#ffcf8a]/25" style={{ animationDelay: "-5s" }} />
          <span className="orb left-[40%] top-[62%] h-10 w-10 bg-[#ffcf8a]/20" style={{ animationDelay: "-7s" }} />
          <span className="orb left-[8%] top-[80%] h-20 w-20 bg-sky/15" style={{ animationDelay: "-2s" }} />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="pb-10 pt-6 md:ml-[44%] md:pb-14 md:pt-12" data-parallax="-0.1" data-parallax-min="768">
            <p dir="auto" className="rise flex items-center gap-4 text-sm font-medium tracking-[0.35em] text-white/90">
              {st.greeting}
              <span className="h-px w-36 bg-gradient-to-r from-white/80 to-transparent" />
            </p>
            <h1 className="rise mt-2 text-[76px] leading-[0.9] sm:text-[96px] lg:whitespace-nowrap lg:text-[112px]" style={{ animationDelay: "0.1s" }}>
              <span className="sheen inline-block">{st.siteName}</span>
            </h1>
            <div className="rise mt-2" style={{ animationDelay: "0.2s" }}>
              <p className="shine inline-block -skew-x-[24deg] bg-gradient-to-r from-royal via-royal/80 to-royal/0 px-9 py-0.5 transition-[padding] duration-500 hover:px-12">
                <span dir="auto" className="font-display inline-block skew-x-[24deg] text-4xl sm:text-[44px]">{st.tagline}</span>
              </p>
            </div>
            <p dir="auto" className="rise mt-6 max-w-lg border-s border-white/60 ps-6 text-xl leading-snug transition-colors duration-500 hover:border-sky sm:text-[22px]" style={{ animationDelay: "0.3s" }}>
              {st.description}
            </p>
            <div className="rise mt-7 flex flex-wrap gap-4" style={{ animationDelay: "0.4s" }}>
              <a href="#video" className="lift shine group flex h-12 items-center gap-3 rounded-full bg-white px-7 text-lg font-semibold text-navy-800 shadow-lg hover:bg-sky">
                <Play className="h-4 w-4 transition-transform group-hover:scale-125" /> {st.heroPrimaryLabel}
              </a>
              <Link href={st.heroSecondaryLink || "/about"} className="lift shine group flex h-12 items-center gap-4 rounded-full border-[1.5px] border-white px-9 text-lg font-medium hover:bg-white hover:text-navy-800">
                {st.heroSecondaryLabel} <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

          {/* Featured video */}
          <div className="grid items-center gap-8 pb-10 lg:grid-cols-[1.5fr_1fr] lg:gap-0 lg:px-6">
            <div data-parallax="0.1" data-parallax-min="1024">
              <VideoPlayer id={youtubeId(st.youtubeUrl)} title={st.videoTitle} />
            </div>
            <div className="lg:ml-10 lg:border-s lg:border-white/50 lg:py-4 lg:ps-10">
              <p dir="auto" className="text-xs font-semibold tracking-[0.3em]">{st.featuredLabel}</p>
              <h2 dir="auto" className="mt-2 text-5xl leading-none sm:text-6xl">{st.videoTitle}</h2>
              <p dir="auto" className="mt-4 text-xl leading-snug text-white/95">{st.videoBlurb}</p>
            </div>
          </div>

          {/* Topics */}
          {topics.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-y-6 border-t border-royal-light/30 py-6">
              {topics.map((t) => (
                <li key={t.id} className="w-1/2 border-white/30 px-2 lg:w-1/4 lg:border-l lg:first:border-l-0">
                  <Link href={`/tag/${t.slug}`} className="group flex items-center justify-center gap-4 transition hover:text-sky">
                    <TagIcon name={t.icon} className="h-12 w-12 shrink-0 text-sky transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1.5 group-hover:-rotate-6 group-hover:scale-110 sm:h-14 sm:w-14" />
                    <span dir="auto" className="max-w-[9.5rem] text-lg leading-tight sm:text-xl">{t.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Blog */}
      <section className="relative overflow-hidden bg-gradient-to-br from-paper via-white to-[#e6e9f0] pb-28 pt-9 text-navy-900 sm:pb-32">
        <Backdrop tone="light" aurora={false} />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[250px_1fr]">
          <div className="lg:pt-5" data-parallax="0.12" data-parallax-min="1024">
            <p dir="auto" className="text-sm font-semibold tracking-[0.35em]">{st.homeBlogEyebrow}</p>
            <h2 dir="auto" className="text-[68px] leading-none">{st.homeBlogTitle}</h2>
            <span className="mt-4 block h-1 w-20 rounded bg-gradient-to-r from-royal to-transparent" />
            <Link href="/blog" className="group mt-8 inline-flex items-center gap-3 text-lg hover:text-royal">
              {st.homeBlogLinkLabel} <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>
          <Carousel label="Latest blog posts">
            {posts.map((p) => (
              <div key={p.slug} className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
                <PostCard post={p} />
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    </>
  );
}
