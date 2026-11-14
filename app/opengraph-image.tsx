import { getSettings } from "@/lib/data";
import { ogSize } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Rashid Ocampo — Calling Hearts to Tawhid. Defending Truth with Clarity.";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const st = await getSettings();
  const photo = st.heroImage || "/images/hero.jpg";
  const imageUrl = /^https?:/.test(photo) ? photo : new URL(photo, "https://rashidocampo.com").href;
  return new ImageResponse(
    <div style={{ width: 1200, height: 630, display: "flex", background: "#FBF9F4", position: "relative", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} width={580} height={630} alt="" style={{ position: "absolute", left: 0, top: 0, width: 580, height: 630, objectFit: "cover", objectPosition: `${st.heroX ?? 50}% ${st.heroY ?? 50}%` }} />
      <div style={{ position: "absolute", left: 490, top: 0, width: 150, height: 630, display: "flex", background: "linear-gradient(90deg, transparent, #FBF9F4)" }} />
      <div style={{ position: "absolute", left: 535, top: 130, width: 630, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: -2, color: "#172A47" }}>Rashid Ocampo</div>
        <div style={{ display: "flex", marginTop: 32, alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 155, height: 2, background: "#4B7D6D" }} />
          <div style={{ display: "flex", fontSize: 28, color: "#4B7D6D" }}>◆</div>
          <div style={{ display: "flex", width: 155, height: 2, background: "#4B7D6D" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, textAlign: "center", alignItems: "center", fontSize: 37, lineHeight: 1.35, fontStyle: "italic", color: "#4B7D6D" }}>
          <div style={{ display: "flex" }}>Calling Hearts to Tawhid.</div>
          <div style={{ display: "flex" }}>Defending Truth with Clarity.</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: -140, left: 570, width: 850, height: 230, borderRadius: "50%", background: "#B9D3C9", opacity: 0.55, display: "flex" }} />
      <div style={{ position: "absolute", bottom: -190, left: 620, width: 850, height: 240, borderRadius: "50%", background: "#4B7D6D", opacity: 0.55, display: "flex" }} />
    </div>,
    { ...ogSize }
  );
}
