"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/** Content stays visible without JavaScript; reveal only when entering the viewport. */
export function EditorialMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const played = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    const reduced = () =>
      preference.matches ||
      document.documentElement.dataset.motion === "reduced";
    const reveal = (element: HTMLElement) => {
      if (reduced() || played.has(element)) return;
      played.add(element);
      const animation = element.animate(
        [
          { opacity: 0.1, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 780, easing: "cubic-bezier(.2,.75,.2,1)" }
      );
      animations.add(animation);
      animation.finished
        .catch(() => {})
        .finally(() => animations.delete(animation));
    };
    const setup = () => {
      observer?.disconnect();
      if (reduced()) {
        animations.forEach((animation) => animation.cancel());
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
            else if (entry.boundingClientRect.top > window.innerHeight + 100)
              played.delete(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
      );
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => observer?.observe(element));
    };
    setup();
    preference.addEventListener("change", setup);
    window.addEventListener("sfgt:motion-change", setup);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", setup);
      window.removeEventListener("sfgt:motion-change", setup);
    };
  }, [pathname]);
  return null;
}
