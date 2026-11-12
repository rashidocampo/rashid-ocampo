"use client";

import { useState } from "react";
import { Play } from "./Icons";
import VideoPlayer from "./VideoPlayer";

export type FeaturedVideo = { id: string; title: string; blurb: string };

/** The featured player with its text, plus small previews to switch between up to three videos. */
export default function FeaturedVideos({ label, videos }: { label: string; videos: FeaturedVideo[] }) {
  const [index, setIndex] = useState(0);
  const current = videos[Math.min(index, videos.length - 1)] ?? { id: "", title: "", blurb: "" };

  return (
    <div className="grid items-center gap-8 pb-10 lg:grid-cols-[1.5fr_1fr] lg:gap-0 lg:px-6">
      <div data-parallax="0.1" data-parallax-min="1024">
        <VideoPlayer key={current.id} id={current.id} title={current.title} />
      </div>
      <div className="lg:ml-10 lg:border-s lg:border-white/50 lg:py-2 lg:ps-10">
        <p dir="auto" className="text-xs font-semibold tracking-[0.3em]">{label}</p>
        <h2 dir="auto" className="mt-2 text-5xl leading-none sm:text-6xl">{current.title}</h2>
        <p dir="auto" className="mt-4 text-xl leading-snug text-white/95">{current.blurb}</p>

        {videos.length > 1 && (
          <ul className="mt-6 grid grid-cols-3 gap-3" aria-label="More videos">
            {videos.map((v, i) => (
              <li key={v.id + i}>
                <button
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  aria-label={`Show video: ${v.title}`}
                  className={`group/thumb block w-full text-start transition ${i === index ? "" : "opacity-75 hover:opacity-100"}`}
                >
                  <span className={`relative block aspect-video overflow-hidden rounded-lg bg-navy-900 ring-2 transition ${i === index ? "ring-sky" : "ring-white/25 group-hover/thumb:ring-white/70"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover/thumb:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 to-navy-800/30" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/80 transition ${i === index ? "bg-royal" : "bg-navy-950/50 group-hover/thumb:bg-royal"}`}>
                        <Play className="ml-0.5 h-3.5 w-3.5" />
                      </span>
                    </span>
                  </span>
                  <span dir="auto" className="mt-1.5 line-clamp-2 block text-sm leading-tight">{v.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
