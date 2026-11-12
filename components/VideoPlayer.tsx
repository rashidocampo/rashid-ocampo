"use client";

import { useState } from "react";
import { Play } from "./Icons";

export default function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div id="video" className="group relative aspect-video scroll-mt-24 overflow-hidden rounded-[inherit] bg-navy-900 ring-1 ring-white/15">
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
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
            />
          )}
          {/* The thumbnail is toned to the site's ink so any video sits in the page */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/55 to-navy-800/35" />
          {!id && <div className="pattern absolute inset-0 bg-gold opacity-25" />}
          <button onClick={() => id && setPlaying(true)} aria-label={`Play video: ${title}`} className="absolute inset-0 flex cursor-pointer items-center justify-center">
            <span className="play-ring relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-navy-950 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-125 group-hover:bg-gold group-active:scale-95">
              <Play className="ml-1 h-7 w-7" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
