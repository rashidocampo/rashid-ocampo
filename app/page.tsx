import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import FeaturedVideos from "@/components/FeaturedVideos";
import { Arrow, Play, TagIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
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
  const posts = allPosts.filter((p) => p.show_on_home !== false).slice(0, 12);

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: st.siteName, url: SITE_URL, description: st.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Person", name: st.siteName, url: SITE_URL, description: st.description, image: new URL(st.heroImage, SITE_URL).href },
        ]}
      />
      {/* Shape used to cut the hero photo's inner edge into a soft wave */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="wave-edge" clipPathUnits="objectBoundingBox">
            <path d="M0 0H0.93C1.03 0.16 0.84 0.3 0.89 0.52C0.94 0.74 1.02 0.86 0.9 1H0Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-paper-2" data-parallax-root>
        <div className="pattern pointer-events-none absolute -right-[18%] -top-[30%] -z-10 aspect-square w-[46rem] bg-royal opacity-[0.1]" data-parallax="0.25" aria-hidden />
        <div className="grid lg:min-h-[26rem] lg:grid-cols-2">
          <div className="relative h-[19rem] sm:h-[24rem] lg:h-auto" data-hero="0" data-hero-kind="wipe">
            {/* A paler copy of the wave sits just behind the photo, as in the design */}
            <div className="wave-edge absolute inset-y-0 left-0 hidden w-[104%] bg-paper lg:block" aria-hidden />
            <div className="wave-edge absolute inset-0 overflow-hidden bg-navy-800">
              <div className="absolute -inset-y-[8%] inset-x-0" data-parallax="0.18" data-hero-img>
                <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" style={heroImageStyle(st)} />
              </div>
            </div>
          </div>

          <div className="flex items-center px-5 pb-12 pt-8 sm:px-10 lg:py-16 lg:pe-[max(2rem,calc((100vw-68rem)/2+3rem))] lg:ps-10">
            <div className="w-full max-w-[30rem]">
              <p dir="auto" className="caps flex items-center gap-4" data-hero="1">
                {st.greeting} <span className="h-px w-20 bg-gradient-to-r from-royal to-transparent" />
              </p>
              <h1 dir="auto" className="display-xl mt-3" data-hero="2" data-hero-kind="words"><SplitText text={st.siteName} /></h1>
              <div className="mt-2" data-hero="3">
                <p className="inline-block -skew-x-[18deg] bg-gradient-to-r from-royal via-royal to-royal/70 px-7 py-1">
                  <span dir="auto" className="font-display inline-block skew-x-[18deg] text-[1.875rem] italic text-white sm:text-[2.25rem]">{st.tagline}</span>
                </p>
              </div>
              <p dir="auto" className="lede mt-6" data-hero="4">{st.description}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center" data-hero="5">
                <a href="#video" className="btn btn-solid" data-magnetic>
                  <Play className="h-4 w-4" /> {st.heroPrimaryLabel}
                </a>
                <Link href={st.heroSecondaryLink || "/about"} className="btn btn-line" data-magnetic>
                  {st.heroSecondaryLabel} <Arrow className="arrow h-4 w-4" />
                </Link>
              </div>
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
