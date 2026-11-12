import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import FeaturedVideos from "@/components/FeaturedVideos";
import { Arrow, Play, TagIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
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
  const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "WebSite", name: st.siteName, url: SITE_URL, description: st.description, inLanguage: "en" },
          { "@context": "https://schema.org", "@type": "Person", name: st.siteName, url: SITE_URL, description: st.description, image: new URL(st.heroImage, SITE_URL).href },
        ]}
      />

      {/* Hero: the name set large, the portrait in an arch */}
      <section className="ink relative overflow-hidden">
        <div className="pattern fade pointer-events-none absolute -right-[38%] top-1/2 aspect-[16/9] w-[110rem] max-w-none -translate-y-1/2 bg-gold opacity-[0.07] lg:-right-[30%]" aria-hidden />
        <div className="wrap relative grid min-h-[calc(100svh-4rem)] items-center gap-x-12 gap-y-7 py-8 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <p dir="auto" className="sentence rise font-display text-[1.75rem] leading-none text-gold" style={i(0)}>{st.greeting}</p>
            <h1 dir="auto" className="rise display-xl mt-3 lg:mt-5" style={i(1)}>{st.siteName}</h1>
            <p dir="auto" className="rise font-display display-md mt-3 text-white/80" style={i(2)}>{st.tagline}</p>
            <div className="rise rule mt-6 max-w-40 lg:mt-8" style={i(3)} />
            <p dir="auto" className="rise lede mt-6 max-w-[34rem] text-white/85 lg:mt-8" style={i(4)}>{st.description}</p>
            <div className="rise mt-7 flex flex-col gap-x-7 gap-y-3 sm:flex-row sm:items-center lg:mt-9" style={i(5)}>
              <a href="#video" className="btn btn-light">
                <Play className="h-3.5 w-3.5" /> {st.heroPrimaryLabel}
              </a>
              <Link href={st.heroSecondaryLink || "/about"} className="link inline-flex min-h-11 items-center gap-2 self-start sm:self-auto">
                {st.heroSecondaryLabel} <Arrow className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="order-first lg:order-none lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-[min(44vw,10.5rem)] lg:w-[min(100%,25rem)]">
              <div className="arch fade absolute -inset-2.5 border border-gold/70 lg:-inset-4" aria-hidden />
              <div className="arch unveil relative h-full overflow-hidden bg-navy-800">
                <div className="settle absolute inset-0">
                  <Image src={st.heroImage} alt={`Portrait of ${st.siteName}`} fill priority sizes="(min-width: 1024px) 400px, 44vw" style={heroImageStyle(st)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="paper section">
        <div className="wrap">
          <FeaturedVideos heading={st.featuredLabel} videos={videos.length ? videos : [{ id: "", title: st.videoTitle, blurb: st.videoBlurb }]} />
        </div>
      </section>

      {/* Topics */}
      {topics.length > 0 && (
        <section className="paper-2 section">
          <div className="wrap grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <h2 dir="auto" className="display-lg lg:col-span-4">{st.homeTopicsTitle}</h2>
            <ul className="hairline border-t sm:grid sm:grid-cols-2 sm:gap-x-10 lg:col-span-8">
              {topics.map((t) => (
                <li key={t.id} className="hairline border-b">
                  <Link href={`/tag/${t.slug}`} className="group flex min-h-20 items-center gap-4 py-4">
                    <TagIcon name={t.icon} className="h-8 w-8 shrink-0 text-royal" />
                    <span dir="auto" className="font-display display-sm flex-1 transition-colors duration-200 group-hover:text-royal">{t.name}</span>
                    <span className="muted tabular text-sm">{count(t.id)}</span>
                    <Arrow className="h-4 w-4 shrink-0 text-gold-deep transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="paper section">
          <div className="wrap">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mb-14">
              <h2 dir="auto" className="display-lg">{st.homeBlogTitle}</h2>
              <Link href="/blog" className="link inline-flex min-h-11 items-center gap-2">
                {st.homeBlogLinkLabel} <Arrow className="h-4 w-4" />
              </Link>
            </div>
            <Carousel label={st.homeBlogTitle}>
              {posts.map((p) => (
                <div key={p.slug} className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
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
