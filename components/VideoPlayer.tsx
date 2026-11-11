"use client";

import { useState } from "react";
import { Play } from "./Icons";
import Ribbons from "./Ribbons";

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
              {/* Themed mask: navy wash and the ribbon of light over the thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/95 via-navy-800/70 to-royal/35 transition-opacity duration-500 group-hover:opacity-75" />
              <Ribbons lines={14} className="absolute -inset-x-[10%] inset-y-0 h-full w-[120%] text-sky/45 transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
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
    </div>
  );
}
