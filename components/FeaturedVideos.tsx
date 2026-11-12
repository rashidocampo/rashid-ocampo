"use client";

import { useState } from "react";
import { Play } from "./Icons";
import SplitText from "./SplitText";
import VideoPlayer from "./VideoPlayer";

export type FeaturedVideo = { id: string; title: string; blurb: string };

/** The player with the chosen video's text, and the other videos as a short list to switch between. */
export default function FeaturedVideos({ heading, videos }: { heading: string; videos: FeaturedVideo[] }) {
  const [index, setIndex] = useState(0);
  const current = videos[Math.min(index, videos.length - 1)] ?? { id: "", title: "", blurb: "" };

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-start">
      <h2 dir="auto" className="display-lg lg:col-span-12"><SplitText text={heading} /></h2>
      <div className="lg:col-span-8" data-scale-in>
        <VideoPlayer key={current.id} id={current.id} title={current.title} />
      </div>
      <div className="lg:col-span-4" data-reveal>
        <h3 dir="auto" className="display-md text-sky">{current.title}</h3>
        <p dir="auto" className="mt-4 text-white/80">{current.blurb}</p>

        {videos.length > 1 && (
          <ul className="mt-8 border-t border-white/20" aria-label="More videos">
            {videos.map((v, i) => (
              <li key={v.id + i} className="border-b border-white/20">
                <button onClick={() => setIndex(i)} aria-pressed={i === index} className="group/v flex w-full cursor-pointer items-center gap-4 py-3 text-start transition-[padding] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:ps-2">
                  <span className="relative block aspect-video w-24 shrink-0 overflow-hidden rounded-[6px] bg-navy-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/v:scale-110" />
                    <span className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${i === index ? "bg-gold/80 text-navy-950" : "bg-navy-950/45 group-hover/v:bg-navy-950/10"}`}>
                      <Play className="h-4 w-4" />
                    </span>
                  </span>
                  <span dir="auto" className={`line-clamp-2 text-[0.9375rem] leading-snug ${i === index ? "font-semibold text-white" : "text-white/70 group-hover/v:text-white"}`}>{v.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
