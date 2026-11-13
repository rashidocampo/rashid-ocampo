"use client";

import { useEffect, useRef, useState } from "react";

export default function HeaderAudio({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const el = audio.current;
    if (!el || !src) return;
    el.autoplay = true;
    el.play().then(() => setPlaying(true)).catch(() => {
      // Browsers commonly block unmuted autoplay. Try muted autoplay.
      el.muted = true;
      setMuted(true);
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    });
    const resume = () => {
      if (el.paused) el.play().catch(() => {});
    };
    document.addEventListener("pointerdown", resume, { once: true });
    document.addEventListener("keydown", resume, { once: true });
    return () => {
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
  }, [src]);

  if (!src) return null;

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) { el.pause(); setPlaying(false); return; }
    try { await el.play(); setPlaying(true); } catch { setPlaying(false); }
  };

  return (
    <div className="relative z-40 border-b border-navy-900/10 bg-paper">
      <div className="wrap flex min-h-12 items-center gap-3 py-2 text-navy-900">
        <audio ref={audio} src={src} autoPlay loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        <button type="button" onClick={toggle} className="rounded-full bg-royal px-4 py-1.5 text-sm font-semibold text-white" aria-label={playing ? "Pause audio" : "Play audio"}>{playing ? "Pause" : "Play"}</button>
        <span className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">Mula sa Dilim Tungo sa Liwanag</span>
        <button type="button" onClick={() => { const el = audio.current; if (el) { el.muted = !el.muted; setMuted(el.muted); } }} className="rounded-full border border-navy-900/20 px-3 py-1.5 text-xs" aria-label={muted ? "Unmute audio" : "Mute audio"}>{muted ? "Unmute" : "Mute"}</button>
        <span className="hidden text-xs text-navy-900/60 sm:inline">{playing ? (muted ? "Playing muted" : "Playing") : "Paused"}</span>
      </div>
    </div>
  );
}
