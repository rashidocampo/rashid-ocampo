"use client";

import { useCallback, useEffect, useState } from "react";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/site";

type Comment = { id: string; name: string; body: string; created_at: string };
type Captcha = { id: string; question: string };

const api = (path: string, init?: RequestInit) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", ...init?.headers },
  });

export default function Comments({ postId }: { postId: string }) {
  const [list, setList] = useState<Comment[] | null>(null);
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [answer, setAnswer] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: people never see or fill this
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const newCaptcha = useCallback(async () => {
    setAnswer("");
    try {
      const res = await api("rpc/new_captcha", { method: "POST", body: "{}" });
      setCaptcha(res.ok ? await res.json() : null);
    } catch {
      setCaptcha(null);
    }
  }, []);

  useEffect(() => {
    api(`comments?post_id=eq.${postId}&approved=eq.true&select=id,name,body,created_at&order=created_at.asc`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]));
    newCaptcha();
  }, [postId, newCaptcha]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    if (!captcha) return setMsg("The anti-spam question could not load. Please refresh the page.");
    setBusy(true);
    setMsg("");
    try {
      const res = await api("rpc/post_comment", {
        method: "POST",
        body: JSON.stringify({ p_post_id: postId, p_name: name, p_body: body, p_captcha_id: captcha.id, p_answer: parseInt(answer, 10) || 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        setList((l) => [...(l ?? []), data]);
        setBody("");
        setMsg("Thank you. Your comment is posted.");
      } else {
        setMsg(data?.message ?? "Your comment could not be posted. Please try again.");
      }
    } catch {
      setMsg("Your comment could not be posted. Please check your connection and try again.");
    }
    await newCaptcha();
    setBusy(false);
  };

  return (
    <section aria-labelledby="comments-h" className="mt-14 max-w-2xl border-t border-navy-800/15 pt-8">
      <h2 id="comments-h" className="text-4xl">Comments{list && list.length > 0 ? ` (${list.length})` : ""}</h2>

      <ul className="mt-5 space-y-4">
        {list?.map((c) => (
          <li key={c.id} className="rounded-xl bg-white/70 px-5 py-4 ring-1 ring-black/5">
            <p className="text-base text-navy-700">
              <strong dir="auto" className="text-navy-900">{c.name}</strong> · {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p dir="auto" className="mt-1 whitespace-pre-wrap break-words text-lg leading-relaxed">{c.body}</p>
          </li>
        ))}
        {list?.length === 0 && <li className="text-lg text-navy-700">No comments yet. Be the first to share your thoughts.</li>}
      </ul>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-6">
        <h3 className="text-3xl">Leave a comment</h3>
        <div>
          <label htmlFor="c-name" className="mb-1 block text-base font-semibold text-navy-700">Name</label>
          <input id="c-name" dir="auto" required maxLength={60} autoComplete="name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-body" className="mb-1 block text-base font-semibold text-navy-700">Comment</label>
          <textarea id="c-body" dir="auto" required minLength={2} maxLength={2000} rows={4} className="field" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="hidden" aria-hidden>
          <label htmlFor="c-website">Website</label>
          <input id="c-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-answer" className="mb-1 block text-base font-semibold text-navy-700">
            Anti-spam check: what is {captcha ? captcha.question : "…"}?
          </label>
          <div className="flex items-center gap-3">
            <input id="c-answer" required inputMode="numeric" pattern="[0-9]*" placeholder="Answer in digits" className="field max-w-48" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <button type="button" className="text-base text-royal underline" onClick={newCaptcha}>Different question</button>
          </div>
        </div>
        <button disabled={busy} className="btn-blue lift rounded-full px-7 py-2.5 text-lg font-semibold text-white disabled:opacity-50">
          {busy ? "Posting…" : "Post comment"}
        </button>
        {msg && <p role="status" className="text-base text-navy-800">{msg}</p>}
      </form>
    </section>
  );
}
