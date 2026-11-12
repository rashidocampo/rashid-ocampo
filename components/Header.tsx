"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LiquidNavbar, NimbusIcons, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { site } from "@/lib/site";
import { Search } from "./Icons";

const book = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Zm0 0v13" />
  </svg>
);

const items: LiquidNavItem[] = [
  { label: "Home", href: "/", icon: NimbusIcons.home, fx: "glow" },
  { label: "About", href: "/about", icon: NimbusIcons.user, fx: "wave" },
  { label: "Blog", href: "/blog", icon: book, fx: "spin" },
  { label: "Contact", href: "/contact", icon: NimbusIcons.plane, fx: "plane" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname.startsWith("/about") ? 1 : pathname.startsWith("/blog") || pathname.startsWith("/tag") ? 2 : pathname.startsWith("/contact") ? 3 : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" className="shrink-0 leading-none">
          <span className="font-display block text-[26px] sm:text-[34px]">{site.name}</span>
        </Link>

        <div className="flex items-center gap-4">
          <LiquidNavbar tone="dark" items={items} active={active} onChange={(_, item) => item.href && router.push(item.href)} />
          <Link href="/blog" aria-label="Search posts" className="hidden text-white/90 transition hover:scale-110 hover:text-sky md:block">
            <Search />
          </Link>
        </div>
      </div>
    </header>
  );
}
