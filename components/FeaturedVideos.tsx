"use client";

import { useState } from "react";
import { Arrow, Play } from "./Icons";
import VideoPlayer from "./VideoPlayer";

export type FeaturedVideo = { id: string; title: string; blurb: string };

/** The featured-video panel: player on one side, the chosen video's text on the other, and small previews to switch between videos. */
export default function FeaturedVideos({ label, videos }: { label: string; videos: FeaturedVideo[] }) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const current = videos[Math.min(index, videos.length - 1)] ?? { id: "", title: "", blurb: "" };

  return (
    <div className="panel grid items-center gap-x-9 gap-y-6 p-4 sm:p-5 lg:grid-cols-[1.55fr_1fr]" data-reveal>
      <div className="overflow-hidden rounded-[14px]">
        <VideoPlayer key={current.id + autoplay} id={current.id} title={current.title} autoplay={autoplay} />
      </div>
      <div className="px-1 pb-2 lg:px-0 lg:pb-0 lg:pe-4">
        <p dir="auto" className="caps text-royal">{label}</p>
        <h2 dir="auto" className="display-md mt-2">{current.title}</h2>
        <p dir="auto" className="mt-3 text-[1.1875rem] leading-snug">{current.blurb}</p>
        {current.id && (
          <button type="button" className="btn btn-solid mt-6" onClick={() => setAutoplay(true)} data-magnetic>
            Watch Now <Arrow className="arrow h-4 w-4" />
          </button>
        )}

        {videos.length > 1 && (
          <ul className="mt-6 grid grid-cols-3 gap-3" aria-label="More videos">
            {videos.map((v, i) => (
              <li key={v.id + i}>
                <button onClick={() => { setIndex(i); setAutoplay(false); }} aria-pressed={i === index} aria-label={`Show video: ${v.title}`} className="group/v block w-full cursor-pointer text-start">
                  <span className={`relative block aspect-video overflow-hidden rounded-lg bg-navy-800 ring-2 ring-offset-2 ring-offset-paper-2 transition duration-300 ${i === index ? "ring-royal" : "ring-transparent group-hover/v:ring-royal/50"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/v:scale-110" />
                    <span className="absolute inset-0 flex items-center justify-center bg-navy-950/25">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors duration-300 ${i === index ? "bg-royal" : "bg-navy-950/60 group-hover/v:bg-royal"}`}>
                        <Play className="ms-0.5 h-3 w-3" />
                      </span>
                    </span>
                  </span>
                  <span dir="auto" className={`mt-1.5 line-clamp-2 block text-sm leading-tight ${i === index ? "font-semibold" : "muted"}`}>{v.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
