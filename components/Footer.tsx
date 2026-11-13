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
        <div className="wrap relative flex flex-col gap-6 pb-[max(12rem,16vw)] pt-12 lg:flex-row lg:items-center lg:gap-9">
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
        {st.footerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={st.footerImage} alt="" loading="lazy" className="footer-photo pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />
        ) : (
          <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[max(13rem,20.8vw)] w-full" aria-hidden="true">
            <defs>
              <radialGradient id="footerSun"><stop stopColor="#F7D8A4" stopOpacity=".75"/><stop offset="1" stopColor="#F7D8A4" stopOpacity="0"/></radialGradient>
              <linearGradient id="footerNear" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#477F79"/><stop offset="1" stopColor="#183F55"/></linearGradient>
              <linearGradient id="footerMist" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FBF9F4" stopOpacity=".75"/><stop offset="1" stopColor="#FBF9F4" stopOpacity="0"/></linearGradient>
            </defs>
            <ellipse cx="730" cy="205" rx="420" ry="150" fill="url(#footerSun)"/>
            <path d="M0 235 85 198 154 211 245 168 328 201 417 149 486 178 558 123 646 173 732 129 815 177 903 124 987 176 1072 144 1168 185 1269 138 1360 177 1440 146V320H0Z" fill="#CBD8D2" opacity=".65"/>
            <path d="M0 247 82 216 160 233 248 195 342 221 428 182 521 219 606 173 697 211 786 173 867 214 963 170 1055 210 1146 180 1244 216 1342 177 1440 207V320H0Z" fill="#A6C0BD" opacity=".78"/>
            <path d="M0 262 94 229 178 247 272 216 373 252 467 207 563 246 662 213 758 250 854 207 949 243 1044 209 1138 251 1237 215 1338 248 1440 222V320H0Z" fill="#79A3A0" opacity=".82"/>
            <path d="M0 276 89 253 176 269 269 241 365 277 459 245 554 269 652 236 747 270 845 236 938 269 1034 239 1130 277 1228 245 1332 268 1440 247V320H0Z" fill="url(#footerNear)"/>
            <path d="M0 294Q175 268 350 293T710 290T1080 294T1440 280V320H0Z" fill="#183F55" opacity=".8"/>
            <path d="M0 237Q360 207 720 248T1440 235V272Q1080 235 720 269T0 267Z" fill="url(#footerMist)" opacity=".55"/>
            <path d="M0 312Q180 274 360 298T720 298T1080 298T1440 291" fill="none" stroke="#D5B26D" strokeWidth="2.5" opacity=".8"/>
          </svg>
        )}
      </section>

      {/* Bottom bar */}
      <div className="ink">
        <div className="wrap flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-[1.7rem] text-white" />
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
