"use client";

import { useEffect, useRef } from "react";

/** Reveal each content block once, only when it enters the visible page. */
export function PremiumHomeMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".premium-home");
    if (!root || !("IntersectionObserver" in window)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-premium-reveal]")
    );
    const isRtl = getComputedStyle(root).direction === "rtl";
    const controller = new AbortController();
    const { signal } = controller;

    const finish = (item: HTMLElement) => {
      item.dataset.revealState = "complete";
      item.style.removeProperty("--premium-reveal-delay");
      observer.unobserve(item);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (document.hidden) return;
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const row = a.boundingClientRect.top - b.boundingClientRect.top;
            return Math.abs(row) > 24
              ? row
              : (a.boundingClientRect.left - b.boundingClientRect.left) *
                  (isRtl ? -1 : 1);
          });
        let previousTop = -Infinity;
        let column = 0;
        entering.forEach((entry) => {
          const item = entry.target as HTMLElement;
          if (item.dataset.revealState !== "pending") return;
          if (motion.matches || item.contains(document.activeElement)) {
            finish(item);
            return;
          }
          column =
            Math.abs(entry.boundingClientRect.top - previousTop) < 24
              ? column + 1
              : 0;
          previousTop = entry.boundingClientRect.top;
          item.style.setProperty(
            "--premium-reveal-delay",
            `${Math.min(column, 3) * 60}ms`
          );
          item.dataset.revealState = "visible";
          observer.unobserve(item);
        });
      },
      // Leave enough of the block in view for the entrance to be noticed.
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    items.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      // Do not hide content that was already painted before hydration.
      if (motion.matches || bounds.top < window.innerHeight) finish(item);
      else {
        item.dataset.revealState = "pending";
        observer.observe(item);
      }
    });

    const settleInteraction = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      items.forEach((item) => {
        if (item.contains(target)) finish(item);
      });
    };
    root.addEventListener("focusin", settleInteraction, { signal });
    root.addEventListener("pointerdown", settleInteraction, {
      signal,
      passive: true,
    });
    root.addEventListener(
      "animationend",
      (event) => {
        if (
          event.animationName === "premium-section-reveal" &&
          event.target instanceof HTMLElement
        )
          finish(event.target);
      },
      { signal }
    );
    motion.addEventListener(
      "change",
      () => {
        if (motion.matches) items.forEach(finish);
      },
      { signal }
    );
    document.addEventListener(
      "visibilitychange",
      () => {
        items.forEach((item) => {
          const bounds = item.getBoundingClientRect();
          if (
            item.dataset.revealState === "visible" ||
            (!document.hidden &&
              bounds.top < window.innerHeight &&
              bounds.bottom > 0)
          )
            finish(item);
        });
      },
      { signal }
    );

    return () => {
      controller.abort();
      observer.disconnect();
      items.forEach((item) => {
        delete item.dataset.revealState;
        item.style.removeProperty("--premium-reveal-delay");
      });
    };
  }, []);

  return <span ref={marker} hidden aria-hidden="true" />;
}
