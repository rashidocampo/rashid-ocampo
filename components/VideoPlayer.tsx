"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Play } from "./Icons";

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  const id = site.featuredVideoId;

  return (
    <div id="video" className="relative aspect-[5/2] w-full scroll-mt-28 overflow-hidden rounded-2xl border-2 border-white/90 bg-navy-900 shadow-2xl shadow-black/40">
      {playing && id ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={site.featuredVideo.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <svg viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#27477f" /><stop offset=".45" stopColor="#7d8fb0" />
                <stop offset=".62" stopColor="#f0a35e" /><stop offset=".75" stopColor="#f6c98a" />
              </linearGradient>
              <radialGradient id="sun" cx=".62" cy=".52" r=".35">
                <stop offset="0" stopColor="#fff6d8" /><stop offset=".12" stopColor="#ffcf7a" stopOpacity=".9" />
                <stop offset="1" stopColor="#ff9d4a" stopOpacity="0" />
              </radialGradient>
              <filter id="blur"><feGaussianBlur stdDeviation="5" /></filter>
            </defs>
            <rect width="600" height="240" fill="url(#sky)" />
            <g filter="url(#blur)" opacity=".55">
              <ellipse cx="150" cy="50" rx="150" ry="12" fill="#f3b78a" />
              <ellipse cx="430" cy="30" rx="170" ry="10" fill="#c7b3c4" />
              <ellipse cx="330" cy="78" rx="120" ry="8" fill="#ffd9a8" />
            </g>
            <rect width="600" height="240" fill="url(#sun)" />
            <path d="M0 132l70-14 60 10 80-20 90 18 80-14 100 16 120-12v124H0z" fill="#5d6d94" />
            <path d="M0 150l90-16 110 20 100-22 120 20 180-24v112H0z" fill="#3c4c75" />
            <g filter="url(#blur)"><ellipse cx="300" cy="182" rx="330" ry="16" fill="#e9d6c8" opacity=".8" /></g>
            <path d="M0 196l120-10 140 14 120-18 220-6v64H0z" fill="#1d2944" />
            <path d="M330 240l110-50 160-24v74z" fill="#141c30" />
          </svg>
          <button
            onClick={() => id && setPlaying(true)}
            aria-label={`Play video: ${site.featuredVideo.title}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/80 bg-black/45 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-royal/80">
              <Play className="ml-1 h-9 w-9" />
            </span>
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-2.5 pt-8">
            <div className="mb-2 h-[3px] rounded bg-white/40"><div className="h-full w-[15%] rounded bg-white" /></div>
            <div className="flex items-center gap-3 font-sans text-xs font-semibold">
              <Play className="h-4 w-4" />
              <span>0:00 / {site.featuredVideo.duration}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
