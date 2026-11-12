import Link from "next/link";
import { getSettings } from "@/lib/data";
import { Arrow } from "./Icons";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const st = await getSettings();
  return (
    <footer>
      {/* Stay connected, over a misty mountain range in the accent colour */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-paper to-paper-2">
        <div className="wrap relative flex flex-col gap-6 pb-48 pt-12 lg:flex-row lg:items-center lg:gap-9 lg:pb-60">
          <h2 dir="auto" className="font-display text-[2.5rem] italic leading-none sm:text-[2.75rem] lg:whitespace-nowrap" data-reveal>{st.footerHeading}</h2>
          <p dir="auto" className="max-w-sm leading-snug lg:border-s-2 lg:border-royal/60 lg:ps-7" data-reveal>{st.footerText}</p>
          <div className="flex flex-wrap gap-3 lg:ms-auto lg:flex-nowrap" data-reveal>
            {st.footerButton1Label && (
              <Link href={st.footerButton1Link || "/blog"} className="btn btn-line bg-paper/70">
                {st.footerButton1Label}
              </Link>
            )}
            {st.footerButton2Label && (
              <Link href={st.footerButton2Link || "/contact"} className="btn btn-accent" data-magnetic>
                {st.footerButton2Label} <Arrow className="arrow h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <svg viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 w-full lg:h-56" aria-hidden>
          <defs>
            <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-paper)" stopOpacity="0" />
              <stop offset="1" stopColor="var(--color-paper)" stopOpacity=".55" />
            </linearGradient>
          </defs>
          <path d="M-40 240 L-40 67 L59 141 L114 119 L132 116 L181 82 L233 113 L251 115 L297 114 L341 89 L356 89 L395 53 L508 142 L572 115 L593 119 L650 67 L712 118 L733 111 L789 131 L844 108 L863 109 L912 47 L964 90 L981 80 L1027 133 L1165 71 L1290 112 L1350 71 L1370 91 L1423 61 L1484 109 L1505 91 L1480 240Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 16%, var(--color-paper))" }} />
          <rect x="-40" y="110" width="1520" height="130" fill="url(#mist)" />
          <path d="M-40 240 L-40 123 L64 166 L145 94 L188 122 L203 114 L241 169 L286 140 L300 151 L340 120 L412 158 L526 128 L565 152 L578 160 L612 169 L690 124 L743 166 L760 156 L807 165 L842 142 L854 151 L886 95 L966 153 L1074 104 L1122 141 L1138 141 L1181 174 L1297 112 L1337 140 L1350 145 L1385 168 L1417 149 L1428 149 L1456 108 L1499 145 L1513 131 L1480 240Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 32%, var(--color-paper))" }} />
          <rect x="-40" y="150" width="1520" height="90" fill="url(#mist)" />
          <path d="M-40 240 L-40 153 L50 190 L139 173 L218 197 L261 174 L276 179 L314 155 L351 180 L364 177 L397 191 L438 165 L451 176 L488 153 L517 181 L527 169 L553 206 L652 164 L750 196 L819 150 L917 205 L951 190 L962 193 L992 164 L1029 196 L1042 186 L1076 204 L1117 184 L1131 185 L1169 150 L1231 211 L1321 173 L1362 207 L1376 192 L1412 210 L1480 167 L1480 240Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 58%, var(--color-paper))" }} />
          <rect x="-40" y="190" width="1520" height="50" fill="url(#mist)" />
          <path d="M-40 240 L-40 204 L32 228 L103 209 L173 224 L227 211 L309 233 L399 201 L432 219 L443 223 L473 233 L499 223 L508 221 L531 205 L615 226 L685 204 L746 221 L829 207 L856 223 L865 227 L888 229 L972 195 L1010 219 L1023 225 L1056 228 L1145 212 L1221 231 L1274 195 L1310 219 L1322 213 L1354 233 L1391 212 L1404 216 L1436 209 L1472 239 L1484 227 L1480 240Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 70%, var(--color-navy-900))" }} />
        </svg>
      </section>

      {/* Bottom bar */}
      <div className="ink">
        <div className="wrap flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-9 w-9 text-white" />
            <span dir="auto" className="font-display text-[1.375rem] leading-none">{st.siteName}</span>
          </Link>
          <div className="sm:ms-auto">
            <SocialLinks
              links={{
                youtube: st.socialYoutube,
                facebook: st.socialFacebook,
                instagram: st.socialInstagram,
                tiktok: st.socialTiktok,
                linkedin: st.socialLinkedin,
                github: st.socialGithub,
              }}
            />
          </div>
        </div>
        <p className="wrap border-t border-white/12 py-4 text-sm text-white/65">© {st.siteName}. {st.copyright}</p>
      </div>
    </footer>
  );
}
