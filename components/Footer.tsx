import Link from "next/link";
import { getSettings } from "@/lib/data";
import { Arrow } from "./Icons";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const st = await getSettings();
  return (
    <footer className="ink relative overflow-hidden">
      <div className="pattern pointer-events-none absolute -bottom-1/3 -right-1/4 aspect-[16/9] w-[70rem] max-w-none bg-gold opacity-[0.09]" aria-hidden />
      <div className="rule" />
      <div className="wrap relative pb-8 pt-16 sm:pt-20">
        <div className="flex items-end justify-between gap-6">
          <h2 dir="auto" className="display-lg">{st.footerHeading}</h2>
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
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p dir="auto" className="lede muted max-w-[34rem]">{st.footerText}</p>
          <div className="flex flex-wrap gap-3">
            {st.footerButton2Label && (
              <Link href={st.footerButton2Link || "/contact"} className="btn btn-light">
                {st.footerButton2Label} <Arrow className="arrow h-4 w-4" />
              </Link>
            )}
            {st.footerButton1Label && (
              <Link href={st.footerButton1Link || "/blog"} className="btn btn-line">
                {st.footerButton1Label}
              </Link>
            )}
          </div>
        </div>
        <p className="muted mt-16 border-t border-white/15 pt-6 text-sm">© {st.siteName}. {st.copyright}</p>
      </div>
    </footer>
  );
}
