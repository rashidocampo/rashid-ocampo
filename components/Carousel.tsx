"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Icons";

/** Horizontal, swipeable row with snap points and previous/next buttons. */
export default function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [can, setCan] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setCan({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
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
    const card = el?.firstElementChild as HTMLElement | null;
    if (el) el.scrollBy({ left: dir * (card ? card.offsetWidth + 32 : el.clientWidth), behavior: "smooth" });
  };

  return (
    <div className="min-w-0">
      <div ref={ref} role="region" aria-label={label} tabIndex={0} className="carousel flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-2 pt-1">
        {children}
      </div>
      {(can.left || can.right) && (
        <div className="mt-8 flex gap-2">
          <button className="btn btn-line !min-h-11 !w-11 !p-0" onClick={() => move(-1)} disabled={!can.left} aria-label="Previous posts">
            <Arrow className="h-4 w-4 rotate-180" />
          </button>
          <button className="btn btn-line !min-h-11 !w-11 !p-0" onClick={() => move(1)} disabled={!can.right} aria-label="Next posts">
            <Arrow className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
