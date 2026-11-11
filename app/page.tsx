import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import VideoPlayer from "@/components/VideoPlayer";
import { Arrow, Book, Infinity, Layers, Play, Sprout } from "@/components/Icons";
import { posts, site } from "@/lib/site";

const topics = [
  { icon: Book, label: ["Faith &", "Reminders"] },
  { icon: Layers, label: ["My Journey", "(Balik-Islam)"] },
  { icon: Sprout, label: ["Islamic", "Reflections"] },
  { icon: Infinity, label: ["Life &", "Learnings"] },
];

export default function Home() {
  return (
    <>
      <section className="hero-bg relative overflow-hidden">
        {/* Portrait */}
        <div className="absolute inset-y-0 left-0 hidden w-[46%] max-w-[640px] md:block" style={{ maxHeight: 540, maskImage: "linear-gradient(to bottom, black 70%, transparent)" }}>
          <Image src="/images/hero.jpg" alt={`Portrait of ${site.name}`} fill priority sizes="46vw" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#051537]" />
        </div>
        <div className="relative h-72 md:hidden">
          <Image src="/images/hero.jpg" alt={`Portrait of ${site.name}`} fill priority sizes="100vw" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040f2b] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="pb-10 pt-6 md:ml-[44%] md:pb-14 md:pt-12">
            <p className="rise flex items-center gap-4 text-sm font-medium tracking-[0.35em] text-white/90">
              ASSALĀMU ‘ALAYKUM
              <span className="h-px w-36 bg-gradient-to-r from-white/80 to-transparent" />
            </p>
            <h1 className="rise mt-1 text-[52px] font-medium leading-none tracking-tight sm:text-6xl lg:whitespace-nowrap lg:text-[74px]" style={{ animationDelay: "0.1s" }}>
              {site.name}
            </h1>
            <div className="rise mt-2" style={{ animationDelay: "0.2s" }}>
              <p className="inline-block -skew-x-[24deg] bg-gradient-to-r from-royal via-royal/80 to-royal/0 px-9 py-0.5">
                <span className="inline-block skew-x-[24deg] text-4xl font-medium italic sm:text-[44px]">A Balik-Islam</span>
              </p>
            </div>
            <p className="rise mt-6 max-w-lg border-l border-white/60 pl-6 text-xl leading-snug sm:text-[22px]" style={{ animationDelay: "0.3s" }}>
              {site.description}
            </p>
            <div className="rise mt-7 flex flex-wrap gap-4" style={{ animationDelay: "0.4s" }}>
              <a href="#video" className="flex h-12 items-center gap-3 rounded-full bg-white px-7 text-lg font-semibold text-navy-800 shadow-lg transition hover:bg-sky">
                <Play className="h-4 w-4" /> Watch My Latest Video
              </a>
              <Link href="/about" className="flex h-12 items-center gap-4 rounded-full border-[1.5px] border-white px-9 text-lg font-medium transition hover:bg-white hover:text-navy-800">
                Learn More About Me <Arrow className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Featured video */}
          <div className="grid items-center gap-8 pb-7 lg:grid-cols-[1.35fr_1fr] lg:gap-0 lg:px-10">
            <VideoPlayer />
            <div className="lg:ml-9 lg:border-l lg:border-white/50 lg:py-4 lg:pl-9">
              <p className="text-xs font-semibold tracking-[0.3em]">FEATURED VIDEO</p>
              <h2 className="mt-1 text-4xl font-medium leading-tight lg:whitespace-nowrap">{site.featuredVideo.title}</h2>
              <p className="mt-3 text-xl leading-snug text-white/95">{site.featuredVideo.blurb}</p>
              <a href="#video" className="btn-blue mt-6 inline-flex h-12 items-center gap-4 rounded-full px-10 text-lg font-medium transition">
                Watch Now <Arrow className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Topics */}
          <ul className="grid grid-cols-2 gap-y-6 border-t border-royal-light/30 py-6 lg:grid-cols-4 lg:divide-x lg:divide-white/30">
            {topics.map(({ icon: Icon, label }) => (
              <li key={label[0]} className="flex items-center justify-center gap-4 px-2">
                <Icon className="h-12 w-12 shrink-0 text-sky sm:h-14 sm:w-14" />
                <span className="text-lg leading-tight sm:text-xl">{label[0]}<br />{label[1]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Blog */}
      <section className="bg-gradient-to-br from-paper via-white to-[#e6e9f0] pb-28 pt-9 text-navy-900 sm:pb-32">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[250px_1fr]">
          <div className="lg:pt-5">
            <p className="text-sm font-semibold tracking-[0.35em]">LATEST</p>
            <h2 className="whitespace-nowrap text-[52px] font-semibold italic leading-none tracking-tight">Blog Posts</h2>
            <span className="mt-4 block h-1 w-20 rounded bg-gradient-to-r from-royal to-transparent" />
            <Link href="/blog" className="mt-8 inline-flex items-center gap-3 text-lg hover:text-royal">
              View All Posts <Arrow />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {posts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
