"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Icons";

/** Horizontal, swipeable row with snap points and left/right buttons. */
export default function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [can, setCan] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setCan({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-navy-800/30 text-navy-800 transition enabled:hover:border-royal enabled:hover:bg-royal enabled:hover:text-white disabled:opacity-30";

  return (
    <div className="min-w-0">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="carousel -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6 pt-1 sm:mx-0 sm:px-1"
      >
        {children}
      </div>
      {(can.left || can.right) && (
        <div className="flex justify-end gap-3">
          <button className={btn} onClick={() => move(-1)} disabled={!can.left} aria-label="Previous posts">
            <Arrow className="h-5 w-5 rotate-180" />
          </button>
          <button className={btn} onClick={() => move(1)} disabled={!can.right} aria-label="Next posts">
            <Arrow className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
