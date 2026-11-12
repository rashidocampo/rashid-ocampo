import Link from "next/link";
import { Arrow } from "./Icons";
import { getSettings } from "@/lib/data";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const st = await getSettings();
  return (
    <footer className="relative bg-navy-900">
      {/* Three wave layers that slide at different speeds */}
      <div className="pointer-events-none absolute inset-x-0 top-0.5 h-16 -translate-y-full overflow-hidden sm:h-20" aria-hidden>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-x-0 -top-[12%] h-[150%] w-full" data-parallax="0.07">
          <path d="M0 40C200 0 380 10 560 45s420 45 620 20 200-35 260-40v65H0z" style={{ fill: "var(--color-sky)" }} opacity=".6" />
        </svg>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-x-0 -top-[6%] h-[125%] w-full" data-parallax="0.035">
          <path d="M0 62c220-40 420-20 640 10s480 30 800-22v40H0z" style={{ fill: "var(--color-royal)" }} />
        </svg>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 74c240-34 460-14 700 8s460 16 740-20v28H0z" style={{ fill: "var(--color-navy-900)" }} />
        </svg>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-6 pt-8 sm:px-8 lg:flex-row lg:items-center lg:gap-9">
        <h2 dir="auto" className="text-5xl lg:whitespace-nowrap">{st.footerHeading}</h2>
        <p dir="auto" className="max-w-md text-lg leading-snug text-white/90 lg:border-l lg:border-white/40 lg:pl-7">
          {st.footerText}
        </p>
        <div className="flex flex-col gap-4 lg:ml-auto lg:items-end">
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
          <div className="flex flex-wrap gap-3">
            {st.footerButton1Label && (
              <Link href={st.footerButton1Link || "/blog"} className="lift group flex h-11 items-center gap-2 rounded-full border-[1.5px] border-white px-6 text-lg hover:bg-white hover:text-navy-800">
                {st.footerButton1Label}
              </Link>
            )}
            {st.footerButton2Label && (
              <Link href={st.footerButton2Link || "/contact"} className="btn-blue lift group flex h-11 items-center gap-2 rounded-full px-7 text-lg font-semibold">
                {st.footerButton2Label} <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {st.siteName}. {st.copyright}
      </p>
    </footer>
  );
}
