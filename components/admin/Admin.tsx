"use client";

import { createClient, type Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { tagIcons, TagIcon } from "@/components/Icons";
import { ADMIN_EMAIL, BLOG_NAV_SORT, DEFAULT_THEME, RESERVED_SLUGS, type Page, defaultSettings, headlineFonts, heroImageStyle, slugify, themePalette, SUPABASE_KEY, SUPABASE_URL, type Settings, type Tag } from "@/lib/site";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type PostRow = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  show_on_home: boolean;
  published_at: string;
  tagIds: string[];
};

const today = () => new Date().toISOString().slice(0, 10);
const primary = "btn btn-solid !min-h-11";
const ghost = "btn btn-line !min-h-11 text-navy-800";
const label = "mb-1 block text-sm font-semibold tracking-wide text-navy-700";

async function publish() {
  const { data } = await supabase.auth.getSession();
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { Authorization: `Bearer ${data.session?.access_token ?? ""}` },
  }).catch(() => {});
}

async function upload(file: File) {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "image"}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function ImageField({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-4">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-20 w-36 rounded-lg object-cover ring-1 ring-black/10" />
      )}
      <label className={`${ghost} cursor-pointer`}>
        {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={busy}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            setErr("");
            try {
              onChange(await upload(f));
            } catch (x) {
              setErr((x as Error).message);
            }
            setBusy(false);
          }}
        />
      </label>
      {value && <button type="button" className="text-sm text-red-700 underline" onClick={() => onChange(null)}>Remove</button>}
      {err && <p className="w-full text-sm text-red-700">{err}</p>}
    </div>
  );
}

/* ---------- Login ---------- */

function Login({ notice }: { notice?: string }) {
  const [mode, setMode] = useState<"signin" | "setup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(notice ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setMsg("Could not create the account.");
      else if (!data.session) {
        setMsg("Check your email and tap the confirmation link, then come back here and sign in.");
        setMode("signin");
      }
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-2xl bg-white p-7 shadow-xl ring-1 ring-black/5">
      <h1 className="text-4xl">{mode === "signin" ? "Sign in" : "Set your password"}</h1>
      <div>
        <label className={label} htmlFor="email">Email</label>
        <input id="email" type="email" required autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className={label} htmlFor="password">Password</label>
        <input id="password" type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className={`${primary} w-full`} disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create admin account"}</button>
      {msg && <p role="status" className="text-sm text-navy-700">{msg}</p>}
      <button type="button" className="text-sm text-royal underline" onClick={() => { setMode(mode === "signin" ? "setup" : "signin"); setMsg(""); }}>
        {mode === "signin" ? "First time here? Set your password" : "Back to sign in"}
      </button>
    </form>
  );
}

/* ---------- Posts ---------- */

function PostEditor({ post, tags, onDone }: { post: PostRow; tags: Tag[]; onDone: () => void }) {
  const [p, setP] = useState(post);
  const [slugTouched, setSlugTouched] = useState(!!post.id);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof PostRow>(k: K, v: PostRow[K]) => setP((o) => ({ ...o, [k]: v }));

  const save = async () => {
    setBusy(true);
    setErr("");
    const { tagIds, id, ...fields } = p;
    const row = { ...fields, slug: slugify(p.slug || p.title), updated_at: new Date().toISOString() };
    if (!row.title.trim() || !row.slug) {
      setErr("A title is required.");
      setBusy(false);
      return;
    }
    const q = id
      ? supabase.from("posts").update(row).eq("id", id).select("id").single()
      : supabase.from("posts").insert(row).select("id").single();
    const { data, error } = await q;
    if (error || !data) {
      setErr(error?.code === "23505" ? "Another post already uses this web address (slug)." : error?.message ?? "Could not save.");
      setBusy(false);
      return;
    }
    await supabase.from("post_tags").delete().eq("post_id", data.id);
    if (tagIds.length) {
      const { error: tagErr } = await supabase.from("post_tags").insert(tagIds.map((tag_id) => ({ post_id: data.id, tag_id })));
      if (tagErr) {
        setErr("The post was saved, but its tags were not: " + tagErr.message);
        setBusy(false);
        return;
      }
    }
    await publish();
    onDone();
  };

  return (
    <div className="space-y-5">
      <button className="text-royal underline" onClick={onDone}>← Back to posts</button>
      <div>
        <label className={label}>Title</label>
        <input dir="auto" className="field text-xl" value={p.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Web address: /blog/…</label>
          <input className="field" value={p.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
        </div>
        <div>
          <label className={label}>Date</label>
          <input type="date" className="field" value={p.published_at} onChange={(e) => set("published_at", e.target.value)} />
        </div>
      </div>
      <div>
        <label className={label}>Short summary</label>
        <textarea dir="auto" className="field" rows={2} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>
      <div>
        <label className={label}>Cover image</label>
        <ImageField value={p.cover_url} onChange={(v) => set("cover_url", v)} />
      </div>
      <div>
        <label className={label}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const on = p.tagIds.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => set("tagIds", on ? p.tagIds.filter((x) => x !== t.id) : [...p.tagIds, t.id])}
                className={`rounded-full border px-4 py-1 ${on ? "border-royal bg-royal text-white" : "border-navy-800/30 text-navy-800"}`}
              >
                {t.name}
              </button>
            );
          })}
          {tags.length === 0 && <p className="text-sm text-navy-700">No tags yet. Add some in the Tags tab.</p>}
        </div>
      </div>
      <div>
        <label className={label}>Article</label>
        <textarea dir="auto" className="field text-base leading-relaxed" rows={18} value={p.content} onChange={(e) => set("content", e.target.value)} placeholder={"Write here. Leave a blank line between paragraphs.\n\n## Heading\n**bold**, *italic*, [link text](https://…), > quote, - list item"} />
      </div>
      <label className="flex items-center gap-3 text-lg">
        <input type="checkbox" className="h-5 w-5" checked={p.published} onChange={(e) => set("published", e.target.checked)} />
        Published (visible on the site)
      </label>
      <label className="flex items-center gap-3 text-lg">
        <input type="checkbox" className="h-5 w-5" checked={p.show_on_home} onChange={(e) => set("show_on_home", e.target.checked)} />
        Show on homepage (under Latest Blog Posts)
      </label>
      {err && <p role="alert" className="text-red-700">{err}</p>}
      <div className="flex gap-3">
        <button className={primary} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save post"}</button>
        <button className={ghost} onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

function Posts({ tags }: { tags: Tag[] }) {
  const [rows, setRows] = useState<PostRow[] | null>(null);
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, post_tags(tag_id)")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) return setErr(error.message);
    setRows(
      (data ?? []).map((d) => ({
        id: d.id, slug: d.slug, title: d.title, excerpt: d.excerpt, content: d.content,
        cover_url: d.cover_url, published: d.published, show_on_home: d.show_on_home, published_at: d.published_at,
        tagIds: (d.post_tags as { tag_id: string }[]).map((x) => x.tag_id),
      })),
    );
  }, []);
  useEffect(() => { load(); }, [load]);

  if (editing) return <PostEditor post={editing} tags={tags} onDone={() => { setEditing(null); load(); }} />;

  return (
    <div className="space-y-4">
      <button className={primary} onClick={() => setEditing({ slug: "", title: "", excerpt: "", content: "", cover_url: null, published: false, show_on_home: true, published_at: today(), tagIds: [] })}>
        + New post
      </button>
      {err && <p role="alert" className="text-red-700">{err}</p>}
      {!rows && !err && <p>Loading…</p>}
      <ul className="divide-y divide-navy-800/10 rounded-xl bg-white ring-1 ring-black/5">
        {rows?.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold">{r.title}</p>
              <p className="text-sm text-navy-700">
                {r.published_at} · {r.published ? "Published" : "Draft"}{r.published && !r.show_on_home ? " · Hidden from homepage" : ""}
                {r.tagIds.length > 0 && " · " + r.tagIds.map((id) => tags.find((t) => t.id === id)?.name).filter(Boolean).join(", ")}
              </p>
            </div>
            <button className={ghost} onClick={() => setEditing(r)}>Edit</button>
            <button
              className="text-sm text-red-700 underline"
              onClick={async () => {
                if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
                const { error } = await supabase.from("posts").delete().eq("id", r.id!);
                if (error) return setErr(error.message);
                await publish();
                load();
              }}
            >
              Delete
            </button>
          </li>
        ))}
        {rows?.length === 0 && <li className="px-4 py-6 text-navy-700">No posts yet.</li>}
      </ul>
    </div>
  );
}

/* ---------- Tags ---------- */

function Tags({ tags, reload }: { tags: Tag[]; reload: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const run = async (q: PromiseLike<{ error: { message: string; code?: string } | null }>) => {
    setErr("");
    const { error } = await q;
    if (error) return setErr(error.code === "23505" ? "A tag with that name already exists." : error.message);
    await publish();
    await reload();
  };

  return (
    <div className="space-y-5">
      <p className="text-navy-700">Tick <strong>Show on homepage</strong> to feature a tag in the row under the video. Lower order numbers come first.</p>
      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          run(supabase.from("tags").insert({ name: name.trim(), slug: slugify(name), sort: tags.length + 1 })).then(() => setName(""));
        }}
      >
        <input className="field" dir="auto" placeholder="New tag name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className={`${primary} shrink-0`}>Add tag</button>
      </form>
      {err && <p role="alert" className="text-red-700">{err}</p>}
      <ul className="space-y-3">
        {tags.map((t) => (
          <li key={t.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-black/5">
            <TagIcon name={t.icon} className="h-9 w-9 shrink-0 text-royal" />
            <input
              className="field min-w-40 flex-1"
              defaultValue={t.name}
              aria-label="Tag name"
              onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== t.name) run(supabase.from("tags").update({ name: v }).eq("id", t.id)); }}
            />
            <select className="field w-auto" aria-label="Icon" value={t.icon} onChange={(e) => run(supabase.from("tags").update({ icon: e.target.value }).eq("id", t.id))}>
              {Object.keys(tagIcons).map((k) => <option key={k}>{k}</option>)}
            </select>
            <input type="number" className="field w-20" aria-label="Order" defaultValue={t.sort}
              onBlur={(e) => { const v = Number(e.target.value); if (v !== t.sort) run(supabase.from("tags").update({ sort: v }).eq("id", t.id)); }} />
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-5 w-5" checked={t.show_on_home} onChange={(e) => run(supabase.from("tags").update({ show_on_home: e.target.checked }).eq("id", t.id))} />
              Show on homepage
            </label>
            <button className="text-sm text-red-700 underline" onClick={() => { if (window.confirm(`Delete the tag "${t.name}"? Posts keep their content.`)) run(supabase.from("tags").delete().eq("id", t.id)); }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Site content ---------- */

type TextKey = { [K in keyof Settings]: Settings[K] extends string ? K : never }[keyof Settings];
type Group = "home" | "blog" | "site";
const textFields: { group: Group; section?: string; key: Exclude<TextKey, "headlineFont" | "heroFit" | "themeColor" | "heroImage">; label: string; rows?: number; hint?: string }[] = [
  { group: "home", section: "Hero", key: "greeting", label: "Greeting above your name" },
  { group: "home", key: "tagline", label: "Tagline under your name" },
  { group: "home", key: "description", label: "Description", rows: 3 },
  { group: "home", key: "heroPrimaryLabel", label: "First button text" },
  { group: "home", key: "heroSecondaryLabel", label: "Second button text" },
  { group: "home", key: "heroSecondaryLink", label: "Second button link", hint: "A page address such as /about, or a full https:// link." },
  { group: "home", section: "Featured videos", key: "featuredLabel", label: "Small label" },
  { group: "home", key: "youtubeUrl", label: "Video 1: YouTube link", hint: "This one shows first. Add a second or third video below and visitors can switch between them." },
  { group: "home", key: "videoTitle", label: "Video 1: headline" },
  { group: "home", key: "videoBlurb", label: "Video 1: description", rows: 2 },
  { group: "home", key: "youtubeUrl2", label: "Video 2: YouTube link", hint: "Optional." },
  { group: "home", key: "videoTitle2", label: "Video 2: headline" },
  { group: "home", key: "videoBlurb2", label: "Video 2: description", rows: 2 },
  { group: "home", key: "youtubeUrl3", label: "Video 3: YouTube link", hint: "Optional." },
  { group: "home", key: "videoTitle3", label: "Video 3: headline" },
  { group: "home", key: "videoBlurb3", label: "Video 3: description", rows: 2 },
  { group: "home", section: "Topics section on the homepage", key: "homeTopicsTitle", label: "Headline" },
  { group: "home", section: "Blog section on the homepage", key: "homeBlogTitle", label: "Headline" },
  { group: "home", key: "homeBlogLinkLabel", label: "Link text" },
  { group: "blog", section: "Blog page", key: "blogTitle", label: "Headline" },
  { group: "blog", key: "blogEyebrow", label: "Small line under the headline (optional)" },
  { group: "blog", key: "blogNavLabel", label: "Name in the menu" },
  { group: "site", section: "Name and menu", key: "siteName", label: "Site name", hint: "Shown in the header, the hero, the footer and in search results." },
  { group: "site", key: "homeNavLabel", label: "Menu name for the homepage" },
  { group: "site", section: "Footer", key: "footerHeading", label: "Headline" },
  { group: "site", key: "footerText", label: "Text", rows: 2 },
  { group: "site", key: "footerButton1Label", label: "First button text", hint: "Leave empty to hide the button." },
  { group: "site", key: "footerButton1Link", label: "First button link" },
  { group: "site", key: "footerButton2Label", label: "Second button text", hint: "Leave empty to hide the button." },
  { group: "site", key: "footerButton2Link", label: "Second button link" },
  { group: "site", key: "copyright", label: "Copyright line (after your name)" },
  { group: "site", key: "footerMotto", label: "Three words in the bottom bar", hint: "Shown in the dark bar at the very bottom. Separate the words with a middle dot ( · )." },
  { group: "site", section: "Social media links", key: "socialFacebook", label: "Facebook", hint: "Paste the full link starting with https://. An icon appears in the footer for each link you fill in." },
  { group: "site", key: "socialInstagram", label: "Instagram" },
  { group: "site", key: "socialYoutube", label: "YouTube" },
  { group: "site", key: "socialTiktok", label: "TikTok" },
  { group: "site", key: "socialLinkedin", label: "LinkedIn" },
  { group: "site", key: "socialGithub", label: "GitHub" },
];

function SiteContent({ group }: { group: Group }) {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("value").eq("key", "site").maybeSingle().then(({ data }) => setS({ ...defaultSettings, ...(data?.value ?? {}) }));
  }, []);
  if (!s) return <p>Loading…</p>;

  return (
    <div className="space-y-5">
      {group === "home" && (
      <div>
        <label className={label}>Hero photo</label>
        <ImageField value={s.heroImage} onChange={(v) => setS({ ...s, heroImage: v ?? defaultSettings.heroImage })} />
        <div className="mt-4 grid gap-5 sm:grid-cols-[240px_1fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-navy-950 ring-1 ring-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.heroImage} alt="" className="absolute inset-0 h-full w-full" style={heroImageStyle(s)} />
            </div>
            <p className="mt-1 text-sm text-navy-700">Preview of the photo area on a computer.</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className={label} htmlFor="heroFit">Fit</label>
              <select id="heroFit" className="field" value={s.heroFit} onChange={(e) => setS({ ...s, heroFit: e.target.value as Settings["heroFit"] })}>
                <option value="cover">Fill the area (edges may be cropped)</option>
                <option value="contain">Show the whole photo</option>
              </select>
            </div>
            {([["heroZoom", "Size", 50, 250], ["heroX", "Move left / right", 0, 100], ["heroY", "Move up / down", 0, 100]] as const).map(([key, text, min, max]) => (
              <div key={key}>
                <label className={label} htmlFor={key}>{text}: {s[key]}{key === "heroZoom" ? "%" : ""}</label>
                <input id={key} type="range" min={min} max={max} value={s[key]} className="w-full" onChange={(e) => setS({ ...s, [key]: Number(e.target.value) })} />
              </div>
            ))}
            <button type="button" className="text-sm text-royal underline" onClick={() => setS({ ...s, heroFit: "cover", heroZoom: 100, heroX: 50, heroY: 0 })}>Reset photo position</button>
          </div>
        </div>
      </div>
      )}
      {group === "site" && (
      <>
      <div>
        <label className={label} htmlFor="themeColor">Theme colour</label>
        <div className="flex flex-wrap items-center gap-4">
          <input id="themeColor" type="color" value={s.themeColor} className="h-12 w-20 cursor-pointer rounded-lg border border-navy-800/25 bg-white p-1" onChange={(e) => setS({ ...s, themeColor: e.target.value })} />
          <div className="flex overflow-hidden rounded-lg ring-1 ring-black/10" style={(themePalette(s.themeColor) ?? {}) as React.CSSProperties} aria-hidden>
            {["bg-navy-900", "bg-royal", "bg-royal-light", "bg-sky", "bg-paper-2"].map((c) => <span key={c} className={`h-12 w-10 ${c}`} />)}
          </div>
          <button type="button" className="text-sm text-royal underline" onClick={() => setS({ ...s, themeColor: DEFAULT_THEME })}>Reset to the sage green</button>
        </div>
        <p className="mt-1 text-sm text-navy-700">Pick one colour; buttons, icons and highlights are matched to it. The text stays navy.</p>
      </div>
      <div>
        <label className={label} htmlFor="headlineFont">Headline font</label>
        <select id="headlineFont" className="field" value={s.headlineFont} onChange={(e) => setS({ ...s, headlineFont: e.target.value as Settings["headlineFont"] })}>
          {Object.entries(headlineFonts).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}
        </select>
        <p className="mt-2 text-4xl text-navy-900" style={{ fontFamily: (headlineFonts[s.headlineFont] ?? headlineFonts.serif).family, fontWeight: (headlineFonts[s.headlineFont] ?? headlineFonts.serif).weight, fontStretch: (headlineFonts[s.headlineFont] ?? headlineFonts.serif).stretch, textTransform: (headlineFonts[s.headlineFont] ?? headlineFonts.serif).transform }}>
          {s.siteName}
        </p>
      </div>
      </>
      )}
      {textFields.filter((f) => f.group === group).map((f) => (
        <div key={f.key}>
          {f.section && <h2 className="mb-3 mt-8 border-t border-navy-800/15 pt-6 text-3xl">{f.section}</h2>}
          <label className={label}>{f.label}</label>
          {f.rows ? (
            <textarea dir="auto" className="field" rows={f.rows} value={s[f.key]} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} />
          ) : (
            <input dir="auto" className="field" value={s[f.key]} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} />
          )}
          {f.hint && <p className="mt-1 text-sm text-navy-700">{f.hint}</p>}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button
          className={primary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const { error } = await supabase.from("settings").upsert({ key: "site", value: s });
            if (!error) await publish();
            setMsg(error ? error.message : "Saved. The site is updated.");
            setBusy(false);
          }}
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        {msg && <p role="status">{msg}</p>}
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */

function CommentsAdmin() {
  type Row = { id: string; name: string; body: string; approved: boolean; created_at: string; posts: { title: string } | null };
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("comments").select("id, name, body, approved, created_at, posts(title)").order("created_at", { ascending: false }).limit(200);
    if (error) return setErr(error.message);
    setRows((data ?? []) as unknown as Row[]);
  }, []);
  useEffect(() => { load(); }, [load]);
  const run = async (q: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await q;
    if (error) setErr(error.message);
    load();
  };
  return (
    <div className="space-y-4">
      {err && <p role="alert" className="text-red-700">{err}</p>}
      {!rows && !err && <p>Loading…</p>}
      {rows?.length === 0 && <p className="text-navy-700">No comments yet.</p>}
      <ul className="space-y-3">
        {rows?.map((c) => (
          <li key={c.id} className={`rounded-xl bg-white px-4 py-3 ring-1 ring-black/5 ${c.approved ? "" : "opacity-60"}`}>
            <p className="text-sm text-navy-700">
              <strong dir="auto">{c.name}</strong> on “{c.posts?.title ?? "deleted post"}” · {new Date(c.created_at).toLocaleString()} {c.approved ? "" : "· Hidden"}
            </p>
            <p dir="auto" className="mt-1 whitespace-pre-wrap">{c.body}</p>
            <div className="mt-2 flex gap-4 text-sm">
              <button className="text-royal underline" onClick={() => run(supabase.from("comments").update({ approved: !c.approved }).eq("id", c.id))}>{c.approved ? "Hide" : "Show"}</button>
              <button className="text-red-700 underline" onClick={() => { if (window.confirm("Delete this comment? This cannot be undone.")) run(supabase.from("comments").delete().eq("id", c.id)); }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PageRow = Omit<Page, "id"> & { id?: string };
const blankPage: PageRow = { slug: "", title: "", nav_label: "", eyebrow: "", description: "", content: "", icon: "user", show_in_nav: true, sort: 40, published: true };

function PageEditor({ page, onDone }: { page: PageRow; onDone: () => void }) {
  const [p, setP] = useState(page);
  const [slugTouched, setSlugTouched] = useState(!!page.id);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = <K extends keyof PageRow>(k: K, v: PageRow[K]) => setP((o) => ({ ...o, [k]: v }));

  const save = async () => {
    const { id, ...fields } = p;
    const row = { ...fields, slug: slugify(p.slug || p.title), updated_at: new Date().toISOString() };
    if (!row.title.trim() || !row.slug) return setErr("A headline is required.");
    if (RESERVED_SLUGS.includes(row.slug)) return setErr(`The address /${row.slug} is used by the site itself. Please choose another.`);
    setBusy(true);
    setErr("");
    const { error } = id ? await supabase.from("pages").update(row).eq("id", id) : await supabase.from("pages").insert(row);
    if (error) {
      setErr(error.code === "23505" ? "Another page already uses this web address." : error.message);
      setBusy(false);
      return;
    }
    await publish();
    onDone();
  };

  return (
    <div className="space-y-5">
      <button className="text-royal underline" onClick={onDone}>← Back to pages</button>
      <div>
        <label className={label}>Headline</label>
        <input dir="auto" className="field text-xl" value={p.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Small line under the headline (optional)</label>
          <input dir="auto" className="field" value={p.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="e.g. About" />
        </div>
        <div>
          <label className={label}>Web address: /…</label>
          <input className="field" value={p.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
          {page.id && <p className="mt-1 text-sm text-navy-700">Changing this breaks links that point to the old address.</p>}
        </div>
      </div>
      <div>
        <label className={label}>Page text</label>
        <textarea dir="auto" className="field text-base leading-relaxed" rows={16} value={p.content} onChange={(e) => set("content", e.target.value)} placeholder={"Write here. Leave a blank line between paragraphs.\n\n## Heading\n**bold**, *italic*, [link text](https://…), > quote, - list item"} />
      </div>
      <div>
        <label className={label}>Short description for Google and link previews (optional)</label>
        <textarea dir="auto" className="field" rows={2} value={p.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <label className={label}>Name in the menu</label>
        <input dir="auto" className="field" value={p.nav_label} onChange={(e) => set("nav_label", e.target.value)} placeholder="Short name, e.g. About. Leave empty to use the headline." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-lg sm:pt-6">
          <input type="checkbox" className="h-5 w-5" checked={p.show_in_nav} onChange={(e) => set("show_in_nav", e.target.checked)} />
          Show in the menu
        </label>
        <div>
          <label className={label}>Menu position</label>
          <input type="number" className="field" value={p.sort} onChange={(e) => set("sort", Number(e.target.value))} />
          <p className="mt-1 text-sm text-navy-700">Lower comes first. Blog sits at {BLOG_NAV_SORT}.</p>
        </div>
      </div>
      <label className="flex items-center gap-3 text-lg">
        <input type="checkbox" className="h-5 w-5" checked={p.published} onChange={(e) => set("published", e.target.checked)} />
        Published (visible on the site)
      </label>
      {err && <p role="alert" className="text-red-700">{err}</p>}
      <div className="flex gap-3">
        <button className={primary} disabled={busy} onClick={save}>{busy ? "Saving…" : "Save page"}</button>
        <button className={ghost} onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

function Pages() {
  const [rows, setRows] = useState<Page[] | null>(null);
  const [editing, setEditing] = useState<PageRow | null>(null);
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("pages").select("*").order("sort").order("title");
    if (error) return setErr(error.message);
    setRows((data ?? []) as Page[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (editing) return <PageEditor page={editing} onDone={() => { setEditing(null); load(); }} />;

  return (
    <div className="space-y-4">
      <button className={primary} onClick={() => setEditing(blankPage)}>+ New page</button>
      <p className="text-navy-700">The homepage and the blog page are edited in their own tabs.</p>
      {err && <p role="alert" className="text-red-700">{err}</p>}
      {!rows && !err && <p>Loading…</p>}
      <ul className="divide-y divide-navy-800/10 rounded-xl bg-white ring-1 ring-black/5">
        {rows?.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p dir="auto" className="truncate text-lg font-semibold">{r.title}</p>
              <p className="text-sm text-navy-700">/{r.slug} · {r.published ? "Published" : "Draft"} · {r.show_in_nav ? `In the menu (position ${r.sort})` : "Not in the menu"}</p>
            </div>
            <a href={`/${r.slug}`} target="_blank" className="text-sm text-royal underline">View</a>
            <button className={ghost} onClick={() => setEditing(r)}>Edit</button>
            <button
              className="text-sm text-red-700 underline"
              onClick={async () => {
                if (!window.confirm(`Delete the page "${r.title}"? This cannot be undone.`)) return;
                const { error } = await supabase.from("pages").delete().eq("id", r.id);
                if (error) return setErr(error.message);
                await publish();
                load();
              }}
            >
              Delete
            </button>
          </li>
        ))}
        {rows?.length === 0 && <li className="px-4 py-6 text-navy-700">No pages yet.</li>}
      </ul>
    </div>
  );
}

const tabs = ["Posts", "Pages", "Homepage", "Blog page", "Tags", "Comments", "Site & footer"] as const;

export default function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Posts");
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const isAdmin = session?.user.email?.toLowerCase() === ADMIN_EMAIL;
  const loadTags = useCallback(async () => {
    const { data } = await supabase.from("tags").select("*").order("sort").order("name");
    setTags((data as Tag[]) ?? []);
  }, []);
  useEffect(() => { if (isAdmin) loadTags(); }, [isAdmin, loadTags]);

  if (session === undefined) return <p>Loading…</p>;
  if (!session) return <Login />;
  if (!isAdmin) {
    supabase.auth.signOut();
    return <Login notice="This account cannot manage the site." />;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-4">
        <a href="/" target="_blank" className="text-royal underline">View site</a>
        <button className="text-navy-700 underline" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
      <nav aria-label="Dashboard sections" className="carousel -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} aria-current={tab === t} className={`shrink-0 ${tab === t ? primary : ghost}`}>{t}</button>
        ))}
      </nav>
      {tab === "Posts" && <Posts tags={tags} />}
      {tab === "Tags" && <Tags tags={tags} reload={loadTags} />}
      {tab === "Comments" && <CommentsAdmin />}
      {tab === "Pages" && <Pages />}
      {tab === "Homepage" && <SiteContent key="home" group="home" />}
      {tab === "Blog page" && <SiteContent key="blog" group="blog" />}
      {tab === "Site & footer" && <SiteContent key="site" group="site" />}
    </div>
  );
}
