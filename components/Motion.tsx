"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The site's motion, driven by data attributes so pages stay plain markup:
 *   data-hero="n"          plays in order when the page opens
 *   data-reveal            rises in when scrolled to (siblings stagger)
 *   .split                 headings rise word by word from behind a mask
 *   data-parallax="0.3"    drifts against the scroll; positive is slower (far), negative faster (near)
 *   data-img-parallax      a picture slides inside its frame
 *   data-scale-in          grows from small to full size as it comes up the screen
 *   data-magnetic          leans toward the pointer
 *   data-spot              a glow that follows the pointer across its section
 * People who ask their device for less motion get the finished page, still.
 */
export default function Motion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("motion-off");
      return;
    }
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];
    // From here the script owns the starting positions, so the stylesheet's holding state is released first.
    root.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const ease = "expo.out";

      // Opening sequence
      const hero = gsap.utils.toArray<HTMLElement>("[data-hero]").sort((a, b) => Number(a.dataset.hero) - Number(b.dataset.hero));
      if (hero.length) {
        const tl = gsap.timeline({ defaults: { ease, duration: 1.3 }, delay: 0.1 });
        hero.forEach((el, i) => {
          const at = i * 0.09;
          const kind = el.dataset.heroKind;
          if (kind === "words") {
            tl.fromTo(el.querySelectorAll(".swi"), { yPercent: 115 }, { yPercent: 0, stagger: 0.08, duration: 1.3 }, at);
          } else if (kind === "wipe") {
            tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" }, at);
            tl.fromTo(el.querySelector("[data-hero-img]"), { scale: 1.25 }, { scale: 1, duration: 2.4 }, at);
          } else if (kind === "fade") {
            tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6, ease: "power2.out" }, at);
          } else {
            tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0 }, at);
          }
        });
      }

      // Headings: word by word
      gsap.utils.toArray<HTMLElement>(".split").forEach((el) => {
        if (el.closest("[data-hero]")) return;
        gsap.fromTo(el.querySelectorAll(".swi"), { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease, stagger: 0.06, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      // Everything else rises as it arrives, neighbours one after another
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 56 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease, stagger: 0.09, overwrite: true }),
      });

      // Depth
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax);
        if (window.innerWidth < Number(el.dataset.parallaxMin ?? 0)) return;
        const trigger = (el.closest("[data-parallax-root]") as HTMLElement) ?? el.parentElement ?? el;
        const top = trigger.getBoundingClientRect().top + window.scrollY < window.innerHeight * 0.5;
        gsap.fromTo(
          el,
          { y: top ? 0 : () => speed * window.innerHeight * 0.45 },
          { y: () => -speed * window.innerHeight * (top ? 0.9 : 0.45), ease: "none", scrollTrigger: { trigger, start: top ? "top top" : "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true } },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-img-parallax]").forEach((el) => {
        gsap.fromTo(el, { yPercent: -9 }, { yPercent: 9, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
        gsap.fromTo(el, { scale: 0.78, borderRadius: 48 }, { scale: 1, borderRadius: 14, ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 30%", scrub: 0.5 } });
      });
      gsap.utils.toArray<HTMLElement>("[data-fade-out]").forEach((el) => {
        gsap.to(el, { autoAlpha: 0, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "55% top", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(el, { xPercent: Number(el.dataset.drift) }, { xPercent: -Number(el.dataset.drift), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      });

      // Pointer play, for mice only
      if (fine) {
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
          const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
          const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            x((e.clientX - r.left - r.width / 2) * 0.35);
            y((e.clientY - r.top - r.height / 2) * 0.35);
          };
          const leave = () => { x(0); y(0); };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
        });
        gsap.utils.toArray<HTMLElement>("[data-spot]").forEach((el) => {
          const host = el.parentElement!;
          const x = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
          const y = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = host.getBoundingClientRect();
            x(e.clientX - r.left);
            y(e.clientY - r.top);
            el.style.opacity = "1";
          };
          const leave = () => { el.style.opacity = "0"; };
          host.addEventListener("pointermove", move);
          host.addEventListener("pointerleave", leave);
          cleanups.push(() => { host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); });
        });
        // The portrait tips gently toward the pointer
        gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
          const host = el.closest("section") ?? el;
          const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
          const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
          const move = (e: Event) => {
            const p = e as PointerEvent;
            rx((0.5 - p.clientY / window.innerHeight) * 10);
            ry((p.clientX / window.innerWidth - 0.5) * 14);
          };
          host.addEventListener("pointermove", move);
          cleanups.push(() => host.removeEventListener("pointermove", move));
        });
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1200);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
