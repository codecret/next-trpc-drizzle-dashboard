"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "./hero-bulb.css";

// Both photographs share the original artwork's 2172 × 724 pixel grid.
const illuminatedSource = "/images/premium-home/hero-dubai-on.webp";
const diffuser =
  "M1576 312 C1558 281 1557 252 1566 217 C1580 151 1638 107 1705 107 C1776 107 1832 155 1845 219 C1852 252 1846 284 1833 312 C1781 292 1630 292 1576 312 Z";

async function decodeImage(image: HTMLImageElement, signal: AbortSignal) {
  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        image.removeEventListener("load", loaded);
        image.removeEventListener("error", failed);
        signal.removeEventListener("abort", aborted);
      };
      const loaded = () => {
        cleanup();
        resolve();
      };
      const failed = () => {
        cleanup();
        reject(new Error("Hero artwork could not be loaded."));
      };
      const aborted = () => {
        cleanup();
        reject(new DOMException("Image decoding cancelled.", "AbortError"));
      };
      image.addEventListener("load", loaded, { once: true });
      image.addEventListener("error", failed, { once: true });
      signal.addEventListener("abort", aborted, { once: true });
      if (signal.aborted) aborted();
    });
  }
  if (signal.aborted) throw new DOMException("Cancelled.", "AbortError");
  if (!image.naturalWidth) throw new Error("Hero artwork is unavailable.");
  await image.decode();
}

export function HeroBulb() {
  const t = useTranslations("Website.premiumHome.hero");
  const id = useId().replace(/:/g, "");
  const layer = useRef<HTMLDivElement>(null);
  const onImage = useRef<HTMLImageElement>(null);
  const started = useRef(false);
  const ready = useRef(false);
  const desired = useRef(false);
  const [lit, setLit] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = (name: string) => `url(#${id}-${name})`;

  useEffect(() => {
    const art = layer.current?.closest<HTMLElement>(".premium-hero-art");
    const original = art?.querySelector("img");
    const illuminated = onImage.current;
    const target = layer.current?.querySelector("button");
    if (!original || !illuminated || !target) return;
    const controller = new AbortController();
    const { signal } = controller;
    let inView = false;
    const ignite = () => {
      if (started.current || !ready.current || !inView || document.hidden)
        return;
      started.current = true;
      desired.current = true;
      setLit(true);
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;
              ignite();
            },
            { threshold: 0.15 }
          )
        : undefined;
    if (observer) observer.observe(target);
    else inView = true;
    document.addEventListener("visibilitychange", ignite, { signal });

    // Decode the actual rendered images, including cached images. Never begin a
    // fade toward an empty image, or replace the user's pending toggle intent.
    Promise.all([
      decodeImage(original, signal),
      decodeImage(illuminated, signal),
    ])
      .then(() => {
        if (signal.aborted) return;
        ready.current = true;
        if (started.current) setLit(desired.current);
        else ignite();
      })
      .catch(() => {
        if (signal.aborted) return;
        controller.abort();
        observer?.disconnect();
        ready.current = false;
        desired.current = false;
        setLit(false);
        setFailed(true);
      });

    return () => {
      controller.abort();
      observer?.disconnect();
    };
  }, []);

  // The base photograph remains visible if either asset fails; do not leave an
  // invisible, nonfunctional button in the keyboard order.
  if (failed) return null;

  return (
    <div ref={layer} className="premium-bulb-lighting" data-lit={lit}>
      <div className="premium-bulb-scene">
        <Image
          ref={onImage}
          className="premium-bulb-on-image"
          src={illuminatedSource}
          width={2172}
          height={724}
          alt=""
          aria-hidden="true"
          loading="eager"
          unoptimized
          draggable={false}
        />
        <svg
          className="premium-bulb-effects"
          viewBox="0 0 2172 724"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={`${id}-diffuser`}>
              <path d={diffuser} />
            </clipPath>
            <filter
              id={`${id}-feather`}
              filterUnits="userSpaceOnUse"
              x="1550"
              y="100"
              width="310"
              height="220"
            >
              <feGaussianBlur stdDeviation="0.65" />
            </filter>
            <mask
              id={`${id}-diffuser-feather`}
              maskUnits="userSpaceOnUse"
              x="1550"
              y="100"
              width="310"
              height="220"
              style={{ maskType: "alpha" }}
            >
              <path d={diffuser} fill="white" filter={url("feather")} />
            </mask>
            <radialGradient id={`${id}-hover`} cx="46%" cy="53%" r="55%">
              <stop stopColor="#fffdf5" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#fff7e8" stopOpacity="0.4" />
              <stop offset="1" stopColor="#fff7e8" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* The diffuser leads with the same edited pixels, then the full
              photograph catches up. No additive lighting or doubled edges. */}
          <g clipPath={url("diffuser")} mask={url("diffuser-feather")}>
            <image
              className="premium-bulb-ignition-image"
              href={illuminatedSource}
              x="0"
              y="0"
              width="2172"
              height="724"
            />
            <path
              className="bulb-hover-light"
              d={diffuser}
              fill={url("hover")}
            />
          </g>
          <path className="bulb-focus-outline" d={diffuser} />
        </svg>
        <button
          type="button"
          className="premium-bulb-switch"
          aria-label={t("bulbLabel")}
          aria-pressed={lit}
          aria-describedby={`${id}-hint`}
          title={t(lit ? "bulbOff" : "bulbOn")}
          onClick={() => {
            started.current = true;
            desired.current = !desired.current;
            if (ready.current) setLit(desired.current);
          }}
        >
          <span id={`${id}-hint`} className="bulb-screen-reader-text">
            {t("bulbHint")}
          </span>
        </button>
      </div>
    </div>
  );
}
