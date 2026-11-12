"use client";

import { useEffect } from "react";

/**
 * Moves every [data-parallax="<speed>"] element as the page scrolls.
 * Speed is the fraction of scroll distance: positive drifts with the scroll, negative against it.
 */
export default function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        // data-parallax-min="768" keeps a layer still on narrower screens
        if (window.innerWidth < Number(el.dataset.parallaxMin ?? 0)) {
          el.style.transform = "";
          return;
        }
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) return;
        const offset = (box.top + box.height / 2 - mid) * Number(el.dataset.parallax);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    // Pages swap without a reload, so repaint when the content changes.
    const mo = new MutationObserver(queue);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
