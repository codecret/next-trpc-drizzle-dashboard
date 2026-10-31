"use client";

import { useEffect, useRef } from "react";
import { premiumSketchArt } from "./premium-sketch-art";
import "./premium-sketch.css";

type SketchName = keyof typeof premiumSketchArt;

/** Decorative line art stays complete without JavaScript or motion support. */
export function PremiumSketch({ name }: { name: SketchName }) {
  const drawing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = drawing.current;
    if (
      !root ||
      !("IntersectionObserver" in window) ||
      typeof SVGElement.prototype.animate !== "function"
    )
      return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bounds = root.getBoundingClientRect();
    // Do not remove strokes from art that was already painted in view.
    if (preference.matches || (bounds.top < innerHeight && bounds.bottom > 0))
      return;

    const paths = Array.from(root.querySelectorAll<SVGPathElement>("path"))
      .filter((path) => getComputedStyle(path).stroke !== "none")
      .flatMap((path) => {
        try {
          const length = path.getTotalLength();
          if (!Number.isFinite(length) || length <= 0) return [];
          return [{ path, length, original: path.getAttribute("style") }];
        } catch {
          return [];
        }
      });
    if (!paths.length) return;

    const controller = new AbortController();
    const animations: Animation[] = [];
    let cancelled = false;
    let started = false;
    let complete = false;

    const restore = () => {
      paths.forEach(({ path, original }) => {
        if (original === null) path.removeAttribute("style");
        else path.setAttribute("style", original);
      });
    };
    const finish = () => {
      if (complete) return;
      complete = true;
      animations.forEach((animation) => animation.cancel());
      restore();
      root.dataset.sketchState = "complete";
      observer.disconnect();
    };
    const draw = () => {
      if (started || complete || cancelled) return;
      started = true;
      if (preference.matches || document.hidden) {
        finish();
        return;
      }
      root.dataset.sketchState = "drawing";
      try {
        paths.forEach(({ path, length }, index) => {
          const progress = index / Math.max(1, paths.length - 1);
          const skyline = name === "dubai";
          animations.push(
            path.animate(
              [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
              {
                duration: skyline ? 900 : 720,
                delay: progress * (skyline ? 260 : 180),
                easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
                fill: "both",
              }
            )
          );
        });
        void Promise.allSettled(
          animations.map((animation) => animation.finished)
        ).then(() => {
          if (!cancelled) finish();
        });
      } catch {
        finish();
      }
    };
    const visibilityThreshold = name === "dubai" ? 0.65 : 0.35;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !document.hidden &&
          entries.some(
            (entry) =>
              entry.isIntersecting &&
              entry.intersectionRatio >= visibilityThreshold
          )
        )
          draw();
      },
      {
        threshold: visibilityThreshold,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    paths.forEach(({ path, length }) => {
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = String(length);
    });
    root.dataset.sketchState = "ready";
    observer.observe(root);
    preference.addEventListener(
      "change",
      () => {
        if (preference.matches) finish();
      },
      { signal: controller.signal }
    );
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          if (started) finish();
        } else {
          const position = root.getBoundingClientRect();
          const visible =
            Math.min(position.bottom, innerHeight - 24) -
            Math.max(position.top, 0);
          if (visible / position.height >= visibilityThreshold) draw();
        }
      },
      { signal: controller.signal }
    );

    return () => {
      cancelled = true;
      controller.abort();
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      restore();
      delete root.dataset.sketchState;
    };
  }, [name]);

  return (
    <div
      ref={drawing}
      className="premium-sketch"
      data-sketch={name}
      aria-hidden="true"
      // Only the four trusted, repository-owned SVGs are accepted above.
      dangerouslySetInnerHTML={{ __html: premiumSketchArt[name] }}
    />
  );
}
