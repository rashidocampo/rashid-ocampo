import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { type Settings, SITE_URL, themePalette } from "./site";

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/** Loads a picture as a data URI. Only PNG and JPEG are used; anything else falls back to the bundled portrait. */
async function picture(src: string | null | undefined): Promise<string> {
  try {
    if (src && /^https?:/.test(src)) {
      const res = await fetch(src);
      const type = res.headers.get("content-type") ?? "";
      if (res.ok && /image\/(png|jpeg)/.test(type)) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 8_000_000) return `data:${type};base64,${buf.toString("base64")}`;
      }
    } else if (src && /^\/images\/[\w.-]+\.(jpg|png)$/.test(src)) {
      const buf = await readFile(join(process.cwd(), "public", src));
      return `data:image/${src.endsWith("png") ? "png" : "jpeg"};base64,${buf.toString("base64")}`;
    }
  } catch {
    // fall through to the bundled portrait
  }
  const buf = await readFile(join(process.cwd(), "public/images/hero.jpg"));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/** The share image: photo on the left fading into the theme colour, headline on the right. */
export async function ogImage(opts: { st: Settings; eyebrow: string; title: string; banner?: string; text?: string; photo?: string | null; position?: string }) {
  const { st, eyebrow, title, banner, text } = opts;
  const pal = themePalette(st.themeColor) ?? {};
  const c = (name: string, fallback: string) => pal[`--color-${name}`] ?? fallback;
  const navy950 = c("navy-950", "#030d24");
  const navy800 = c("navy-800", "#0a2152");
  const royal = c("royal", "#1560e8");
  const sky = c("sky", "#8cc4ff");
  const [photo, display, displayExt, body, bodyExt, bodyBold] = await Promise.all([
    picture(opts.photo),
    font("markazi-text-latin-600-normal.woff"),
    font("markazi-text-latin-ext-600-normal.woff"),
    font("readex-pro-latin-400-normal.woff"),
    font("readex-pro-latin-ext-400-normal.woff"),
    font("readex-pro-latin-600-normal.woff"),
  ]);
  const titleSize = title.length > 46 ? 76 : title.length > 26 ? 96 : title.length > 16 ? 118 : 150;

  const png = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundImage: `linear-gradient(135deg, ${navy950} 0%, ${navy800} 100%)`, color: "#fff", fontFamily: "Body, BodyExt" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={photo} width={560} height={630} style={{ position: "absolute", left: 0, top: 0, width: 560, height: 630, objectFit: "cover", objectPosition: opts.position ?? "50% 0%" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 562, height: 630, display: "flex", backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, ${navy950} 100%)` }} />
        <div style={{ position: "absolute", left: 480, top: 0, width: 720, height: 630, display: "flex", backgroundImage: `radial-gradient(circle at 75% 55%, ${royal} 0%, rgba(0,0,0,0) 62%)`, opacity: 0.45 }} />
        <div style={{ position: "absolute", left: 540, top: 0, width: 620, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Display, DisplayExt", fontSize: 34, color: "#c9a45c" }}>
            {eyebrow.charAt(0).toUpperCase() + eyebrow.slice(1).toLowerCase()}
            <div style={{ display: "flex", width: 120, height: 2, marginLeft: 18, backgroundImage: "linear-gradient(90deg, #c9a45c, rgba(0,0,0,0))" }} />
          </div>
          <div style={{ display: "flex", marginTop: 14, fontFamily: "Display, DisplayExt", fontSize: titleSize, lineHeight: 0.92, letterSpacing: -1 }}>{title}</div>
          {banner ? <div style={{ display: "flex", marginTop: 10, fontFamily: "Display, DisplayExt", fontSize: 50, color: "rgba(255,255,255,0.8)" }}>{banner}</div> : null}
          {text ? (
            <div style={{ display: "flex", marginTop: 26, fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.95)" }}>
              {text.length > 150 ? text.slice(0, 147).trimEnd() + "…" : text}
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", right: 44, bottom: 30, display: "flex", fontSize: 24, fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.85)" }}>{SITE_URL.replace(/^https?:\/\//, "")}</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 1200, height: 8, display: "flex", backgroundImage: "linear-gradient(90deg, #c9a45c, rgba(201,164,92,0))" }} />
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Display", data: display, weight: 400, style: "normal" },
        { name: "DisplayExt", data: displayExt, weight: 400, style: "normal" },
        { name: "Body", data: body, weight: 400, style: "normal" },
        { name: "BodyExt", data: bodyExt, weight: 400, style: "normal" },
        { name: "Body", data: bodyBold, weight: 600, style: "normal" },
      ],
    },
  );

  // Messaging apps skip large preview images, so the PNG is re-encoded as a compact JPEG.
  const headers = { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" };
  const data = Buffer.from(await png.arrayBuffer());
  try {
    const sharp = (await import("sharp")).default;
    const jpeg = await sharp(data).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { ...headers, "Content-Type": "image/jpeg" } });
  } catch {
    return new Response(new Uint8Array(data), { headers: { ...headers, "Content-Type": "image/png" } });
  }
}
