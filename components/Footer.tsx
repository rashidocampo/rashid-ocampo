import Link from "next/link";
import { getSettings } from "@/lib/data";
import { Arrow } from "./Icons";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const st = await getSettings();
  const motto = st.footerMotto.split(/\s*[·•|]\s*/).filter(Boolean);
  return (
    <footer>
      {/* Stay connected, over a misty range of hills in the accent colour */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-paper to-paper-2">
        <div className="wrap relative flex flex-col gap-6 pb-36 pt-12 lg:flex-row lg:items-center lg:gap-9 lg:pb-40">
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
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 w-full lg:h-40" aria-hidden>
          <g className="drift" style={{ transformOrigin: "center" }}>
            <path d="M-80 150c120-50 220-70 340-40s180 50 300 10 220-80 360-50 240 60 360 30 200-60 280-40v160H-80Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 16%, var(--color-paper))" }} />
          </g>
          <path d="M0 170c140-46 260-30 380-6s220 20 340-16 240-44 360-16 220 40 360 10v78H0Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 34%, var(--color-paper))" }} />
          <path d="M0 196c160-30 300-34 460-12s300 22 460-6 320-30 520 0v42H0Z" style={{ fill: "color-mix(in oklab, var(--color-royal) 62%, var(--color-navy-900))" }} />
        </svg>
      </section>

      {/* Bottom bar */}
      <div className="ink">
        <div className="wrap flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-9 w-8 text-white" />
            <span dir="auto" className="font-display text-[1.375rem] leading-none">{st.siteName}</span>
          </Link>
          {motto.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] italic text-white/85 sm:border-s sm:border-white/30 sm:ps-8">
              {motto.map((m, i) => (
                <span key={i} dir="auto" className="flex items-center gap-4">
                  {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-white/60" />}
                  {m}
                </span>
              ))}
            </p>
          )}
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
