"use client";

import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useEffect, useRef } from "react";
import styles from "./parallax-scrolling.module.css";

const layerOffsets = [26, 18, 10, 4];

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
      <div ref={layersRef} className={styles.landscape} data-parallax-layers aria-hidden="true">
        <div className={styles.haze} data-parallax-layer="1" />
        <div className={styles.distant} data-parallax-layer="2" />
        <div className={styles.middle} data-parallax-layer="3" />
        <div className={styles.foreground} data-parallax-layer="4" />
      </div>
      {children}
    </section>
  );
}
