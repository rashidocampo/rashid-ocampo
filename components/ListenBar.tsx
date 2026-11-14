"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Listen to this article": reads the article aloud with the speech voice built into the reader's
 * own phone or browser (Web Speech API). Free, no server, no account. Prefers a Filipino voice,
 * then Philippine or other English. Arabic passages are skipped, since these voices cannot read them.
 */

type Chunk = { el: HTMLElement | null; text: string };
const SPEEDS = [0.85, 1, 1.25, 1.5];
const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g;

function splitSentences(text: string, max = 220): string[] {
  const parts = text.match(/[^.!?…]+[.!?…]*["”’)]*\s*/g) ?? [text];
  const out: string[] = [];
  let buf = "";
  for (const p of parts) {
    if ((buf + p).length > max && buf) {
      out.push(buf.trim());
      buf = "";
    }
    if (p.length > max) {
      // very long sentence: cut at commas or spaces
      for (const piece of p.match(new RegExp(`.{1,${max}}(\\s|,|$)`, "g")) ?? [p]) out.push(piece.trim());
    } else buf += p;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter(Boolean);
}

function collect(root: HTMLElement): Chunk[] {
  const blocks = root.querySelectorAll<HTMLElement>("h1, h2, h3, h4, p, li, blockquote > p, td");
  const chunks: Chunk[] = [];
  blocks.forEach((el) => {
    if (el.closest("[data-listen-skip]")) return;
    if (el.tagName === "LI" && el.querySelector("p")) return; // its paragraphs are read instead
    const raw = (el.innerText || "").replace(/\s+/g, " ").trim();
    if (!raw) return;
    const arabic = (raw.match(ARABIC) ?? []).length;
    if (arabic > raw.length * 0.4) return; // mostly Arabic script
    const text = raw.replace(ARABIC, "").replace(/\s+/g, " ").trim();
    if (text.length < 2) return;
    for (const s of splitSentences(text)) chunks.push({ el, text: s });
  });
  return chunks;
}

function pickVoice(voices: SpeechSynthesisVoice[], wanted?: string) {
  if (wanted) {
    const v = voices.find((x) => x.voiceURI === wanted);
    if (v) return v;
  }
  const by = (re: RegExp) => voices.filter((v) => re.test(v.lang.replace("_", "-")));
  const fil = by(/^(fil|tl)(-|$)/i);
  const enPH = by(/^en-PH$/i);
  const en = by(/^en(-|$)/i);
  const good = (list: SpeechSynthesisVoice[]) => list.find((v) => /natural|online|google|premium|enhanced/i.test(v.name)) ?? list[0];
  return good(fil) ?? good(enPH) ?? good(en) ?? voices[0];
}

export default function ListenBar({ target, title }: { target: string; title?: string }) {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState(1);
  const [pos, setPos] = useState(0);
  const [total, setTotal] = useState(0);
  const chunks = useRef<Chunk[]>([]);
  const index = useRef(0);
  const run = useRef(0); // invalidates callbacks from cancelled utterances
  const rateRef = useRef(1);
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    try {
      const saved = JSON.parse(localStorage.getItem("listen") || "{}");
      if (saved.rate) { setRate(saved.rate); rateRef.current = saved.rate; }
      if (saved.voice) setVoiceURI(saved.voice);
    } catch {}
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      run.current++;
      window.speechSynthesis.cancel();
      document.querySelectorAll(".is-reading").forEach((n) => n.classList.remove("is-reading"));
    };
  }, []);

  useEffect(() => {
    voiceRef.current = voices.length ? pickVoice(voices, voiceURI) : undefined;
  }, [voices, voiceURI]);

  const mark = (el?: HTMLElement) => {
    document.querySelectorAll(".is-reading").forEach((n) => n.classList.remove("is-reading"));
    if (el) {
      el.classList.add("is-reading");
      const r = el.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 120) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const speakFrom = useCallback((i: number) => {
    const synth = window.speechSynthesis;
    const id = ++run.current;
    synth.cancel();
    const list = chunks.current;
    if (i >= list.length) {
      setState("idle");
      index.current = 0;
      setPos(0);
      mark();
      return;
    }
    index.current = i;
    setPos(i);
    mark(list[i].el ?? undefined);
    const u = new SpeechSynthesisUtterance(list[i].text);
    const v = voiceRef.current;
    u.lang = v?.lang ?? "fil-PH";
    try { if (v) u.voice = v; } catch {}
    u.rate = rateRef.current;
    u.onend = () => { if (run.current === id) speakFrom(i + 1); };
    u.onerror = (e) => { if (run.current === id && e.error !== "interrupted" && e.error !== "canceled") speakFrom(i + 1); };
    synth.speak(u);
    setState("playing");
  }, []);

  const play = () => {
    if (state === "playing") return;
    if (!chunks.current.length || state === "idle") {
      const root = document.getElementById(target);
      if (!root) return;
      chunks.current = (title ? [{ el: null, text: title }] : []).concat(collect(root));
      setTotal(chunks.current.length);
      speakFrom(0);
    } else speakFrom(index.current); // resume from the start of the current sentence
  };
  const pause = () => { run.current++; window.speechSynthesis.cancel(); setState("paused"); };
  const stop = () => { run.current++; window.speechSynthesis.cancel(); setState("idle"); index.current = 0; setPos(0); mark(); };
  const skip = (d: number) => { if (state !== "idle") speakFrom(Math.min(Math.max(index.current + d, 0), chunks.current.length - 1)); };
  const save = (o: object) => { try { localStorage.setItem("listen", JSON.stringify({ rate: rateRef.current, voice: voiceURI, ...o })); } catch {} };
  const changeRate = () => {
    const next = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length] ?? 1;
    setRate(next); rateRef.current = next; save({ rate: next });
    if (state === "playing") speakFrom(index.current);
  };
  const changeVoice = (uri: string) => {
    setVoiceURI(uri); save({ voice: uri });
    voiceRef.current = pickVoice(voices, uri);
    if (state === "playing") speakFrom(index.current);
  };

  if (!supported) return null;
  const active = state !== "idle";
  const pct = total ? Math.round((pos / total) * 100) : 0;
  const choices = voices.filter((v) => /^(fil|tl|en)/i.test(v.lang));
  const btn = "inline-flex h-11 w-11 items-center justify-center rounded-full transition-[transform,background-color] duration-150 ease-out active:scale-95";

  return (
    <div data-listen-skip className={active ? "listen-bar is-active" : "listen-bar"} role="region" aria-label="Listen to this article">
      <div className="flex items-center gap-2 sm:gap-3">
        {state === "playing" ? (
          <button type="button" onClick={pause} className={`${btn} bg-royal text-white`} aria-label="Pause">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          </button>
        ) : (
          <button type="button" onClick={play} className={`${btn} bg-royal text-white`} aria-label={state === "paused" ? "Resume" : "Listen to this article"}>
            <svg viewBox="0 0 24 24" className="ms-0.5 h-5 w-5" fill="currentColor" aria-hidden><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9375rem] font-semibold leading-tight">
            {state === "idle" ? "Listen to this article" : state === "playing" ? "Playing" : "Paused"}
          </p>
          {active ? (
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-navy-900/10" aria-hidden>
              <div className="h-full rounded-full bg-royal transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
          ) : (
            <p className="muted text-[0.8125rem] leading-tight">Free voice from your device</p>
          )}
        </div>
        {active && (
          <>
            <button type="button" onClick={() => skip(-1)} className={`${btn} hidden hover:bg-navy-900/5 sm:inline-flex`} aria-label="Back one sentence">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 17 6 12l5-5M18 17l-5-5 5-5" /></svg>
            </button>
            <button type="button" onClick={() => skip(1)} className={`${btn} hover:bg-navy-900/5`} aria-label="Skip one sentence">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m13 17 5-5-5-5M6 17l5-5-5-5" /></svg>
            </button>
          </>
        )}
        <button type="button" onClick={changeRate} className="h-11 min-w-12 rounded-full px-2 text-[0.875rem] font-semibold tabular-nums transition-colors hover:bg-navy-900/5" aria-label={`Reading speed ${rate} times`}>
          {rate}×
        </button>
        {active && (
          <button type="button" onClick={stop} className={`${btn} hover:bg-navy-900/5`} aria-label="Stop">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          </button>
        )}
      </div>
      {choices.length > 1 && (
        <label className="mt-2 flex items-center gap-2 text-[0.8125rem] text-navy-800">
          <span className="shrink-0">Voice</span>
          <select className="w-0 min-w-0 flex-1 truncate rounded-md border border-navy-900/15 bg-white px-2 py-1" value={voiceRef.current?.voiceURI ?? ""} onChange={(e) => changeVoice(e.target.value)}>
            {choices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
      )}
    </div>
  );
}
