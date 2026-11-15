"use client";
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/site";

type Counts = { view_count: number; like_count: number };
export default function PostEngagement({ postId, title }: { postId: string; title: string }) {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [liked, setLiked] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const key = `post-liked-${postId}`;
  const viewKey = `post-viewed-${postId}`;
  async function call(action: "view" | "like" | "unlike" | "read") {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_post_engagement`, {
      method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_post_id: postId, p_action: action })
    });
    if (!response.ok) throw new Error("Engagement unavailable");
    const result = await response.json();
    setCounts(Array.isArray(result) ? result[0] : result);
  }
  useEffect(() => {
    try {
      setLiked(localStorage.getItem(key) === "1");
      const already = sessionStorage.getItem(viewKey) === "1";
      if (!already) sessionStorage.setItem(viewKey, "1");
      call(already ? "read" : "view").catch(() => { if (!already) sessionStorage.removeItem(viewKey); });
    } catch { call("read").catch(() => {}); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);
  async function toggleLike() {
    const next = !liked;
    try {
      await call(next ? "like" : "unlike");
      setLiked(next);
      localStorage.setItem(key, next ? "1" : "0");
    } catch { /* Keep state unchanged if saving fails. */ }
  }
  const url = typeof window !== "undefined" ? window.location.href : "";
  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* user cancelled or unsupported */ }
    }
    setSharing(v => !v);
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(url); setCopied(true); } catch { /* clipboard unavailable */ }
  }
  return (
    <div className="my-8 border-y border-navy-900/15 py-4" data-listen-skip>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span aria-label="Article reads" className="rounded-full bg-navy-900/5 px-4 py-2 text-navy-800">◉ {counts?.view_count?.toLocaleString() ?? "—"} reads</span>
        <button type="button" onClick={toggleLike} aria-pressed={liked} className="rounded-full border border-navy-900/15 px-4 py-2 transition hover:border-royal" style={{ color: liked ? "#bd3150" : undefined }}>{liked ? "♥" : "♡"} {counts?.like_count?.toLocaleString() ?? "—"} likes</button>
        <button type="button" onClick={share} aria-expanded={sharing} className="rounded-full border border-navy-900/15 px-4 py-2 transition hover:border-royal">↗ Share</button>
      </div>
      {sharing && <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="link">Facebook</a>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="link">X</a>
        <a href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`} target="_blank" rel="noopener noreferrer" className="link">WhatsApp</a>
        <button type="button" onClick={copyLink} className="link">{copied ? "Copied" : "Copy link"}</button>
      </div>}
    </div>
  );
}
