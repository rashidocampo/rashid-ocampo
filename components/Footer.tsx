import Link from "next/link";
import { Arrow } from "./Icons";
import { getSettings } from "@/lib/data";
import { site } from "@/lib/site";

export default async function Footer() {
  const st = await getSettings();
  return (
    <footer className="relative bg-navy-900">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute top-0.5 left-0 h-16 w-full -translate-y-full sm:h-20" aria-hidden>
        <path d="M0 40C200 0 380 10 560 45s420 45 620 20 200-35 260-40v65H0z" style={{ fill: "var(--color-sky)" }} opacity=".6" />
        <path d="M0 62c220-40 420-20 640 10s480 30 800-22v40H0z" style={{ fill: "var(--color-royal)" }} />
        <path d="M0 74c240-34 460-14 700 8s460 16 740-20v28H0z" style={{ fill: "var(--color-navy-900)" }} />
      </svg>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-6 pt-8 sm:px-8 lg:flex-row lg:items-center lg:gap-9">
        <h2 dir="auto" className="whitespace-nowrap text-5xl">{st.footerHeading}</h2>
        <p dir="auto" className="max-w-md text-lg leading-snug text-white/90 lg:border-l lg:border-white/40 lg:pl-7">
          {st.footerText}
        </p>
        <div className="flex flex-wrap gap-3 lg:ml-auto">
          <Link href="/blog" className="lift group flex h-11 items-center gap-2 rounded-full border-[1.5px] border-white px-6 text-lg hover:bg-white hover:text-navy-800">
            Read the Blog
          </Link>
          <Link href="/contact" className="btn-blue lift group flex h-11 items-center gap-2 rounded-full px-7 text-lg font-semibold">
            Get in Touch <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
