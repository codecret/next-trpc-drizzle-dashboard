"use client";

import { useEffect } from "react";

export function PremiumHomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".premium-home");
    if (!root || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const items = root.querySelectorAll<HTMLElement>("[data-premium-reveal]");
    const setup = () => {
      observer?.disconnect();
      items.forEach((item) => item.removeAttribute("data-reveal-state"));
      if (motion.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-reveal-state", "visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      items.forEach((item) => {
        if (item.getBoundingClientRect().top < window.innerHeight - 40) return;
        item.setAttribute("data-reveal-state", "pending");
        observer?.observe(item);
      });
    };
    const finishReveal = (event: AnimationEvent) => {
      if (event.animationName !== "premium-section-reveal") return;
      (event.target as HTMLElement).removeAttribute("data-reveal-state");
    };
    root.addEventListener("animationend", finishReveal);
    setup();
    motion.addEventListener("change", setup);
    return () => {
      root.removeEventListener("animationend", finishReveal);
      observer?.disconnect();
      items.forEach((item) => item.removeAttribute("data-reveal-state"));
      motion.removeEventListener("change", setup);
    };
  }, []);
  return null;
}
