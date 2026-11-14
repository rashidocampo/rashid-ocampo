"use client";

import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useEffect, useRef } from "react";

const layerOffsets = [12, 8, 1, -7];

export function ParallaxComponent({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const layers = layersRef.current?.querySelectorAll("[data-parallax-layer]");
    if (!hero || !layers?.length) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.35,
        },
      });

      layers.forEach((layer, index) => {
        timeline.to(layer, { yPercent: layerOffsets[index], ease: "none" }, 0);
      });
    });

    // Smooth wheel input over the hero only. Touch and keyboard keep native scrolling.
    media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const lenis = new Lenis({ eventsTarget: hero });
      const tick = (seconds: number) => lenis.raf(seconds * 1000);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero relative isolate overflow-hidden bg-paper" data-parallax-root>
      <div ref={layersRef} className="hero-parallax-landscape" data-parallax-layers aria-hidden="true">
        <div className="hero-parallax-haze" data-parallax-layer="1" />
        <div className="hero-parallax-distant" data-parallax-layer="2" />
        <div className="hero-parallax-middle" data-parallax-layer="3" />
        <div className="hero-parallax-foreground" data-parallax-layer="4" />
      </div>
      {children}
    </section>
  );
}
