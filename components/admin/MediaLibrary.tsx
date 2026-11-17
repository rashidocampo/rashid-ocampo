"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/site";

const storage = createClient(SUPABASE_URL, SUPABASE_KEY).storage.from("media");
type MediaObject = { name: string; id?: string | null; created_at?: string; updated_at?: string; metadata?: { size?: number; mimetype?: string } };
const formatSize = (n?: number) => n == null ? "Unknown" : n < 1024 * 1024 ? (n / 1024).toFixed(1) + " KB" : (n / (1024 * 1024)).toFixed(2) + " MB";
const imageFile = (n: string) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(n);
const audioFile = (n: string) => /\.(mp3|wav|ogg|m4a)$/i.test(n);
const allowed = /\.(png|jpe?g|webp|gif|avif|svg|mp3|wav|ogg|m4a)$/i;

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaObject[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState("");
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setMessage("");
    const all: MediaObject[] = [];
    for (let offset = 0; offset < 10000; offset += 100) {
      const { data, error } = await storage.list("", { limit: 100, offset, sortBy: { column: "created_at", order: "desc" } });
      if (error) { setMessage("Unable to list media: " + error.message); break; }
      const page = (data ?? []).filter((item) => item.id);
      all.push(...page);
      if ((data ?? []).length < 100) break;
    }
    setFiles(all);
    setLoaded(true);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  async function uploadFiles(selected: FileList | null) {
    if (!selected?.length) return;
    setBusy(true);
    setMessage("");
    let successes = 0;
    for (const file of Array.from(selected)) {
      if (!allowed.test(file.name)) { setMessage("Unsupported file: " + file.name); continue; }
      if (file.size > 50 * 1024 * 1024) { setMessage("File exceeds 50 MB: " + file.name); continue; }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const name = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "-" + safeName;
      const { error } = await storage.upload(name, file, { cacheControl: "3600", contentType: file.type || undefined });
      if (error) setMessage("Upload failed for " + file.name + ": " + error.message);
      else successes++;
    }
    if (successes) { await refresh(); setMessage(successes + " file(s) uploaded. Public URLs are ready to copy."); }
    setBusy(false);
  }

  const shown = files.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Media Library</h2>
        <p className="mt-1 text-sm text-navy-700">Upload photos and audio, preview files, and copy their permanent public URLs for pages, posts, or embeds.</p>
      </div>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-navy-800/30 bg-paper-2 px-4 py-8 text-center">
        <span className="font-semibold">{busy ? "Uploading…" : "Choose photos or audio files"}</span>
        <span className="text-xs text-navy-700">JPG, PNG, WebP, GIF, AVIF, SVG, MP3, WAV, OGG, M4A · up to 50 MB per file</span>
        <input type="file" multiple accept="image/*,audio/*,.mp3,.wav,.ogg,.m4a" disabled={busy} className="max-w-full text-sm" onChange={e => { void uploadFiles(e.target.files); e.target.value = ""; }} />
      </label>
      {message && <p role="status" className="rounded-lg bg-paper-2 p-3 text-sm">{message}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input aria-label="Search uploaded files" className="field min-w-0 flex-1" placeholder="Search file names…" value={filter} onChange={e => setFilter(e.target.value)} />
        <button type="button" className="btn btn-line" onClick={() => void refresh()}>Refresh</button>
      </div>
      <p className="text-sm text-navy-700">{loaded ? shown.length + " files shown" : "Loading files…"}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map(file => {
          const url = storage.getPublicUrl(file.name).data.publicUrl;
          return <article key={file.name} className="min-w-0 space-y-3 rounded-xl border border-navy-800/15 bg-white p-4">
            <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-paper-2">
              {imageFile(file.name) ? <img src={url} alt={file.name} loading="lazy" className="h-full w-full object-contain" /> :
               audioFile(file.name) ? <audio controls preload="none" src={url} className="w-full" /> : <span>File</span>}
            </div>
            <p className="break-all text-sm font-semibold">{file.name}</p>
            <dl className="space-y-1 text-xs text-navy-700">
              <div><dt className="inline font-semibold">Type: </dt><dd className="inline">{file.metadata?.mimetype || file.name.split(".").pop()?.toUpperCase()}</dd></div>
              <div><dt className="inline font-semibold">Size: </dt><dd className="inline">{formatSize(file.metadata?.size)}</dd></div>
              <div><dt className="inline font-semibold">Uploaded: </dt><dd className="inline">{file.created_at ? new Date(file.created_at).toLocaleString() : "Unknown"}</dd></div>
            </dl>
            <input readOnly aria-label={"Public URL for " + file.name} className="field w-full min-w-0 text-xs" value={url} onFocus={e => e.target.select()} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-solid !min-h-10" onClick={async () => { await navigator.clipboard.writeText(url); setCopied(file.name); }}>{copied === file.name ? "Copied" : "Copy URL"}</button>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-line !min-h-10">Open file</a>
            </div>
          </article>;
        })}
      </div>
      {loaded && shown.length === 0 && <p className="text-sm text-navy-700">No matching files found.</p>}
    </section>
  );
}
