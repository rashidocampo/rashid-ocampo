"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import type { NavItem } from "@/lib/site";
import { Search } from "./Icons";
import { navIcons, type NavIconName } from "./NavIcons";

export default function Header({ name, items }: { name: string; items: NavItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = items.map((it) => ({ label: it.label, href: it.href, ...(navIcons[it.icon as NavIconName] ?? navIcons.user) }));
  // The longest matching address wins, so /blog/post lights up Blog and / only matches the homepage.
  const section = pathname.startsWith("/tag") ? "/blog" : pathname;
  let active = 0;
  items.forEach((it, i) => {
    if (it.href !== "/" && (section === it.href || section.startsWith(it.href + "/"))) active = i;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" className="min-w-0 shrink leading-none">
          <span dir="auto" className="font-display block truncate text-[26px] sm:text-[34px]">{name}</span>
        </Link>

        <div className="flex shrink-0 items-center gap-4">
          <LiquidNavbar tone="dark" items={nav} active={active} compact={items.length > 5 ? true : undefined} onChange={(_, item) => item.href && router.push(item.href)} />
          <Link href="/blog" aria-label="Search posts" className="hidden text-white/90 transition hover:scale-110 hover:text-sky md:block">
            <Search />
          </Link>
        </div>
      </div>
    </header>
  );
}
