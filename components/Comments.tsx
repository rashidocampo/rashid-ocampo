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
    <section aria-labelledby="comments-h" className="mx-auto mt-20 max-w-[68ch] lg:mx-0 lg:ms-[8.33%]">
      <h2 id="comments-h" className="display-md">Comments{list && list.length > 0 ? ` (${list.length})` : ""}</h2>

      <ul className="hairline mt-6 border-t">
        {list?.map((c) => (
          <li key={c.id} className="hairline border-b py-5">
            <p className="muted text-sm">
              <strong dir="auto" className="font-medium text-navy-900">{c.name}</strong> / {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p dir="auto" className="mt-1.5 whitespace-pre-wrap break-words">{c.body}</p>
          </li>
        ))}
        {list?.length === 0 && <li className="muted hairline border-b py-5">No comments yet. Be the first to share your thoughts.</li>}
      </ul>

      <form onSubmit={submit} className="mt-10 space-y-5">
        <h3 className="display-sm">Leave a comment</h3>
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-[0.9375rem] font-medium">Name</label>
          <input id="c-name" dir="auto" required maxLength={60} autoComplete="name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-body" className="mb-1.5 block text-[0.9375rem] font-medium">Comment</label>
          <textarea id="c-body" dir="auto" required minLength={2} maxLength={2000} rows={4} className="field" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="hidden" aria-hidden>
          <label htmlFor="c-website">Website</label>
          <input id="c-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-answer" className="mb-1.5 block text-[0.9375rem] font-medium">
            Anti-spam check: what is {captcha ? captcha.question : "…"}?
          </label>
          <div className="flex items-center gap-3">
            <input id="c-answer" required inputMode="numeric" pattern="[0-9]*" placeholder="Answer in digits" className="field max-w-48" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <button type="button" className="link min-h-11 text-[0.9375rem] text-royal" onClick={newCaptcha}>Different question</button>
          </div>
        </div>
        <button disabled={busy} className="btn btn-solid">
          {busy ? "Posting…" : "Post comment"}
        </button>
        {msg && <p role="status" className="text-[0.9375rem]">{msg}</p>}
      </form>
    </section>
  );
}
