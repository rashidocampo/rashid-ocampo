import Link from "next/link";
import { getSettings } from "@/lib/data";
import { Arrow } from "./Icons";
import Landscape from "./Landscape";
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
          <Landscape className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[max(13rem,20.8vw)] w-full" />
        )}
      </section>

      {/* Bottom bar */}
      <div className="ink">
        <div className="wrap flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-7 w-[1.15rem] text-white" />
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
