"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/site";
import { Search } from "./Icons";
import Logo from "./Logo";

export default function Header({ name, items }: { name: string; items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const section = pathname.startsWith("/tag") ? "/blog" : pathname;
  const isActive = (href: string) => (href === "/" ? section === "/" : section === href || section.startsWith(href + "/"));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
    <>
    <header className={`sticky top-0 z-50 bg-paper/90 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-[0_10px_30px_-20px_rgb(16_31_56/0.5)]" : ""}`}>
      <div className="wrap flex h-[4.75rem] items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <Logo className="h-8 w-[1.7rem] shrink-0 sm:h-9 sm:w-[1.9rem] text-navy-900 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-105" />
          <span className="flex min-w-0 items-center leading-none">
            <span dir="auto" className="font-display block truncate text-[1.5rem] leading-none sm:text-[1.875rem]">{name}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={isActive(it.href) ? "page" : undefined}
              className={`flex min-h-9 items-center rounded-full px-4 text-base transition-colors duration-300 ${
                isActive(it.href) ? "bg-royal text-white" : "hover:bg-royal/12 hover:text-royal"
              }`}
            >
              {it.label}
            </Link>
          ))}
          <Link href="/blog" aria-label="Search posts" className="ms-3 flex h-10 w-10 items-center justify-center rounded-full transition duration-300 hover:bg-royal/12 hover:text-royal">
            <Search className="h-6 w-6" />
          </Link>
        </nav>

        <button type="button" className="-me-2 flex h-11 items-center gap-2.5 px-2 text-base md:hidden" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
          <span aria-hidden className="relative block h-3 w-5">
            <span className={`absolute inset-x-0 top-0 h-[1.5px] bg-navy-900 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-y-[5.5px] rotate-45" : ""}`} />
            <span className={`absolute inset-x-0 bottom-0 h-[1.5px] bg-navy-900 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

    </header>
      {open && (
        <nav id="site-menu" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-[4.75rem] z-50 overflow-y-auto bg-paper md:hidden">
          <ul className="wrap py-4">
            {items.map((it, i) => (
              <li key={it.href} className="rise hairline border-b" style={{ "--i": i } as React.CSSProperties}>
                <Link href={it.href} onClick={() => setOpen(false)} aria-current={isActive(it.href) ? "page" : undefined} className={`font-display flex min-h-16 items-center py-3 text-[2.25rem] leading-none ${isActive(it.href) ? "text-royal" : ""}`}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
