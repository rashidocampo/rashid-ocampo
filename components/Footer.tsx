import Link from "next/link";
import { getSettings } from "@/lib/data";
import { Arrow } from "./Icons";
import Marquee from "./Marquee";
import SocialLinks from "./SocialLinks";
import SplitText from "./SplitText";

export default async function Footer() {
  const st = await getSettings();
  return (
    <footer className="ink relative isolate overflow-hidden">
      <div className="aurora -z-10 opacity-50" aria-hidden><span /><span /><span /><span /></div>
      <div className="pointer-events-none absolute -bottom-1/2 -right-[15%] -z-10 aspect-square w-[60rem]" data-parallax="0.25" aria-hidden>
        <div className="pattern spin-slow h-full w-full bg-gold opacity-[0.1]" />
      </div>
      <div className="rule" />
      <div className="wrap relative pt-16 sm:pt-24">
        <div className="flex items-end justify-between gap-6">
          <h2 dir="auto" className="display-lg"><SplitText text={st.footerHeading} /></h2>
          <div data-reveal>
            <SocialLinks
              links={{
                facebook: st.socialFacebook,
                instagram: st.socialInstagram,
                youtube: st.socialYoutube,
                tiktok: st.socialTiktok,
                linkedin: st.socialLinkedin,
                github: st.socialGithub,
              }}
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p dir="auto" className="lede max-w-[34rem] text-white/80" data-reveal>{st.footerText}</p>
          <div className="flex flex-wrap gap-3" data-reveal>
            {st.footerButton2Label && (
              <Link href={st.footerButton2Link || "/contact"} className="btn btn-light" data-magnetic>
                {st.footerButton2Label} <Arrow className="arrow h-4 w-4" />
              </Link>
            )}
            {st.footerButton1Label && (
              <Link href={st.footerButton1Link || "/blog"} className="btn btn-line" data-magnetic>
                {st.footerButton1Label}
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* The name, outlined and enormous, sliding across the foot of the page */}
      <div className="mt-14 sm:mt-20" data-drift="6">
        <Marquee items={[st.siteName]} speed={48} className="font-display outline-type text-[clamp(5rem,18vw,15rem)] leading-[0.85]" />
      </div>
      <div className="wrap relative">
        <p className="mt-8 border-t border-white/15 py-6 text-sm text-white/70">© {st.siteName}. {st.copyright}</p>
      </div>
    </footer>
  );
}
