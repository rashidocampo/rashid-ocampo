"use client";

import { useState } from "react";
import { Play } from "./Icons";

export default function VideoPlayer({ id, title, autoplay = false, editorial = false }: { id: string; title: string; autoplay?: boolean; editorial?: boolean }) {
  const [playing, setPlaying] = useState(autoplay);

  return (
    <div id="video" className="group relative aspect-video scroll-mt-28 overflow-hidden bg-navy-900">
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
          {id ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes("hqdefault")) img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
              }}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
            />
          ) : (
            <div className="pattern absolute inset-0 bg-sky opacity-40" />
          )}
          <div className={editorial ? "absolute inset-0 bg-gradient-to-t from-[#032f25]/95 via-[#064735]/60 to-[#033a2d]/40" : "absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent"} />
          {editorial && <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 sm:bottom-7 sm:left-7 sm:right-7"><span className="mb-2 inline-block rounded-full bg-[#f4f5df] px-3 py-1 text-xs font-semibold text-[#173b2d]">Featured Video</span><h3 dir="auto" className="max-w-[80%] font-display text-xl font-semibold leading-tight text-white drop-shadow-md sm:text-3xl">{title}</h3></div>}
          <button onClick={() => id && setPlaying(true)} aria-label={`Play video: ${title}`} className="absolute inset-0 flex cursor-pointer items-center justify-center">
            <span className="play-ring relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/85 bg-navy-950/55 text-white backdrop-blur-sm transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:bg-royal group-active:scale-95 sm:h-20 sm:w-20">
              <Play className="ms-1 h-6 w-6 sm:h-8 sm:w-8" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
