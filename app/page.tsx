import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FeaturedVideos from "@/components/FeaturedVideos";
import Carousel from "@/components/Carousel";
import { Arrow, Play } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import { getPosts, getSettings, getTags } from "@/lib/data";
import { defaultSettings, SITE_URL, youtubeId } from "@/lib/site";

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
    <main className="mock-home">
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "WebSite", name: st.siteName, url: SITE_URL, description: st.description, inLanguage: "en" },
        { "@context": "https://schema.org", "@type": "Person", name: st.siteName, url: SITE_URL, description: st.description, image: new URL(st.heroImage, SITE_URL).href }
      ]} />
      <section className="mock-hero" aria-label="Introduction">
        <Image src={st.heroImage} alt="Santorini portrait with blue domes and coastline" fill priority sizes="100vw" className="mock-hero-photo" />
        <div className="mock-hero-wash" />
        <div className="mock-hero-content">
          <div className="mock-accent-line" />
          <h1>A Journey of Faith.<br />A Life of Dawah.</h1>
          <p>Sharing the beauty of Islam, reflections on faith,<br className="hidden sm:block" /> and reminders to return to Allah with knowledge,<br className="hidden sm:block" /> sincerity, and hope.</p>
          <div className="mock-actions">
            <a href="#featured-videos" className="mock-button mock-button-primary"><Play className="h-4 w-4" /> Watch Latest Video</a>
            <Link href="/about" className="mock-button mock-button-outline">Explore My Journey <Arrow className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="mock-hero-wave" />
      </section>

      <section id="featured-videos" className="mock-featured mock-container" aria-label="Featured Dawah videos">
        <FeaturedVideos label="FEATURED DAWAH" videos={videos.length ? videos : [{ id: "", title: st.videoTitle, blurb: st.videoBlurb }]} />
      </section>

      <section className="mock-journal mock-container" aria-labelledby="mock-journal-title">
        <div className="mock-section-title"><span /><h2 id="mock-journal-title">Explore the Journal</h2><span /></div>
        {topics.length > 0 && <nav aria-label="Journal topics" className="mock-topics">
          <Link href="/blog" className="mock-topic mock-topic-active">All Articles</Link>
          {topics.slice(0, 4).map(t => <Link key={t.id} href={`/tag/${t.slug}`} className="mock-topic">{t.name}</Link>)}
        </nav>}
        <Carousel label="Explore the Journal">
          {posts.map(p => <div key={p.slug} className="mock-post-item shrink-0 snap-start"><PostCard post={p} sizes="(min-width: 1000px) 310px, (min-width: 640px) 45vw, 80vw" /></div>)}
        </Carousel>
      </section>

      <section className="mock-connect mock-container" aria-label="Stay connected">
        <div className="mock-connect-inner">
          <div><h2>Stay Connected</h2><p>Get the latest articles, videos, and Islamic reminders.</p></div>
          <div className="mock-connect-divider" />
          <form action="/contact" method="get" className="mock-subscribe">
            <label className="sr-only" htmlFor="mock-email">Email address</label>
            <input id="mock-email" name="email" type="email" placeholder="Enter your email address" required />
            <button type="submit" className="mock-button mock-button-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
