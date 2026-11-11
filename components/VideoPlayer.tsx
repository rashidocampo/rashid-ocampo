"use client";

import { useState } from "react";
import { Play, Star8 } from "./Icons";

export default function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div id="video" className="video-shadow group relative scroll-mt-28">
      {/* Frame line, then the picture, both with scooped corners */}
      <div className="video-scoop bg-gradient-to-br from-white via-sky to-royal p-[3px]">
        <div className="video-scoop relative aspect-video overflow-hidden bg-navy-900">
          {playing && id ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {id && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes("hqdefault")) img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                  }}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              )}
              {/* Themed mask: navy wash and a khatim star lattice over the thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/95 via-navy-800/70 to-royal/35 transition-opacity duration-500 group-hover:opacity-80" />
              <svg className="absolute inset-0 h-full w-full text-sky/25" aria-hidden>
                <defs>
                  <pattern id="khatim" width="56" height="56" patternUnits="userSpaceOnUse">
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="14" y="14" width="28" height="28" />
                      <rect x="14" y="14" width="28" height="28" transform="rotate(45 28 28)" />
                    </g>
                  </pattern>
                  <radialGradient id="khatim-fade">
                    <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
                    <stop offset="1" stopColor="#fff" />
                  </radialGradient>
                  <mask id="khatim-mask">
                    <rect width="100%" height="100%" fill="url(#khatim-fade)" />
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="url(#khatim)" mask="url(#khatim-mask)" />
              </svg>
              <button
                onClick={() => id && setPlaying(true)}
                aria-label={`Play video: ${title}`}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="play-ring relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/90 bg-navy-950/50 backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-royal sm:h-24 sm:w-24">
                  <Play className="ml-1 h-9 w-9 sm:h-10 sm:w-10" />
                </span>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Stars sitting in the four scooped corners */}
      {["left-0 top-0 -translate-x-1/2 -translate-y-1/2", "right-0 top-0 translate-x-1/2 -translate-y-1/2", "left-0 bottom-0 -translate-x-1/2 translate-y-1/2", "right-0 bottom-0 translate-x-1/2 translate-y-1/2"].map((pos) => (
        <Star8 key={pos} className={`pointer-events-none absolute h-7 w-7 text-sky transition-transform duration-700 group-hover:rotate-45 sm:h-9 sm:w-9 ${pos} [&>*]:stroke-[5]`} />
      ))}
    </div>
  );
}
