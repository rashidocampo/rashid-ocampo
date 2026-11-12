"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import type { NavItem } from "@/lib/site";
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

  // The bar floats clear over the top of the page, turns to glass once you scroll,
  // slips away while you read down and returns the moment you scroll up.
  const [state, setState] = useState({ solid: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setState((s) => {
        const next = { solid: y > 24, hidden: y > 320 && y > last + 4 ? true : y < last - 4 ? false : s.hidden };
        return next.solid === s.solid && next.hidden === s.hidden ? s : next;
      });
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        state.hidden ? "-translate-y-full" : ""
      } ${state.solid ? "border-b border-white/10 bg-navy-950/70 backdrop-blur-xl" : "border-b border-transparent"}`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-3">
        <Link href="/" className="group min-w-0 shrink leading-none">
          <span dir="auto" className="font-display stretch-hover block truncate text-[1.375rem] sm:text-[2.125rem]">{name}</span>
        </Link>
        <LiquidNavbar tone="dark" items={nav} active={active} compact={items.length > 5 ? true : undefined} onChange={(_, item) => item.href && router.push(item.href)} />
      </div>
    </header>
  );
}
