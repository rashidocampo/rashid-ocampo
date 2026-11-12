"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/site";

export default function Header({ name, items }: { name: string; items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const section = pathname.startsWith("/tag") ? "/blog" : pathname;
  const isActive = (href: string) => (href === "/" ? section === "/" : section === href || section.startsWith(href + "/"));

  // The menu closes when a page is chosen or Escape is pressed, and the page behind it stays put.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="ink sticky top-0 z-50 border-b border-white/10">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" dir="auto" className="font-display min-w-0 truncate text-[1.75rem] leading-none">
          {name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {items.map((it) => (
            <Link key={it.href} href={it.href} aria-current={isActive(it.href) ? "page" : undefined} className={`link text-base ${isActive(it.href) ? "link-on text-white" : "text-white/75 hover:text-white"}`}>
              {it.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="-me-2 flex h-11 items-center gap-2.5 px-2 text-base md:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="relative block h-3 w-5">
            <span className={`absolute inset-x-0 top-0 h-px bg-white transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`absolute inset-x-0 bottom-0 h-px bg-white transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="site-menu" aria-label="Menu" className="ink fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto md:hidden">
          <ul className="wrap py-6">
            {items.map((it, i) => (
              <li key={it.href} className="rise border-b border-white/15" style={{ "--i": i } as React.CSSProperties}>
                <Link href={it.href} onClick={() => setOpen(false)} aria-current={isActive(it.href) ? "page" : undefined} className={`font-display flex min-h-16 items-center justify-between py-3 text-[2.5rem] leading-none ${isActive(it.href) ? "text-gold" : ""}`}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
