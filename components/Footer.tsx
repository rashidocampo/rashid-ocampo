import Subscribe from "./Subscribe";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative bg-navy-900">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute top-0.5 left-0 h-16 w-full -translate-y-full sm:h-20" aria-hidden>
        <path d="M0 40C200 0 380 10 560 45s420 45 620 20 200-35 260-40v65H0z" fill="#7fb2f5" opacity=".55" />
        <path d="M0 62c220-40 420-20 640 10s480 30 800-22v40H0z" fill="#1c56c4" />
        <path d="M0 74c240-34 460-14 700 8s460 16 740-20v28H0z" fill="#06153a" />
      </svg>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-6 pt-8 sm:px-8 lg:flex-row lg:items-center lg:gap-9">
        <h2 className="whitespace-nowrap text-4xl font-medium italic">Stay Connected</h2>
        <p className="max-w-sm text-lg leading-snug text-white/90 lg:border-l lg:border-white/40 lg:pl-7">
          Get the latest videos, articles, and reminders straight to your inbox.
        </p>
        <div className="lg:ml-auto"><Subscribe /></div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
