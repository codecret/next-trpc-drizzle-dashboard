"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "./hero-bulb.css";

// All shapes use the original photograph's 2172 × 724 coordinate system.
const diffuser =
  "M1576 312 C1558 281 1557 252 1566 217 C1580 151 1638 107 1705 107 C1776 107 1832 155 1845 219 C1852 252 1846 284 1833 312 C1781 292 1630 292 1576 312 Z";
const bulb =
  "M1576 312 C1558 281 1557 252 1566 217 C1580 151 1638 107 1705 107 C1776 107 1832 155 1845 219 C1852 252 1846 284 1833 312 C1818 352 1791 382 1782 472 L1765 495 L1765 578 L1734 614 L1677 614 L1640 578 L1640 495 L1620 472 C1611 400 1595 354 1576 312 Z";
const housing =
  "M1576 312 C1630 292 1781 292 1833 312 C1818 352 1791 382 1782 472 L1765 495 H1640 L1620 472 C1611 400 1595 354 1576 312 Z";

export function HeroBulb() {
  const t = useTranslations("Website.premiumHome.hero");
  const id = useId().replace(/:/g, "");
  const layer = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [lit, setLit] = useState(false);
  const url = (name: string) => `url(#${id}-${name})`;

  useEffect(() => {
    const art = layer.current?.closest<HTMLElement>(".premium-hero-art");
    const image = art?.querySelector("img");
    const target = layer.current?.querySelector("button");
    if (!art || !image || !target) return;
    const controller = new AbortController();
    const { signal } = controller;
    let inView = false;
    const ignite = () => {
      if (
        started.current ||
        !inView ||
        document.hidden ||
        !image.complete ||
        image.naturalWidth === 0
      )
        return;
      started.current = true;
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
    let frame = 0;
    if (observer) observer.observe(target);
    else {
      inView = true;
      frame = requestAnimationFrame(ignite);
    }
    image.addEventListener("load", ignite, { signal });
    document.addEventListener("visibilitychange", ignite, { signal });
    return () => {
      controller.abort();
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layer} className="premium-bulb-lighting" data-lit={lit}>
      <div className="premium-bulb-scene">
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
            {/* The original luminance keeps lettering and chrome grooves dark.
                Use the same uncropped source and coordinates as the hero. */}
            <filter
              id={`${id}-material-response`}
              filterUnits="userSpaceOnUse"
              x="1550"
              y="295"
              width="310"
              height="305"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="2" intercept="-0.9" />
                <feFuncG type="linear" slope="2" intercept="-0.9" />
                <feFuncB type="linear" slope="2" intercept="-0.9" />
              </feComponentTransfer>
            </filter>
            <mask
              id={`${id}-material-detail`}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x="1550"
              y="295"
              width="310"
              height="305"
              style={{ maskType: "luminance" }}
            >
              <image
                href="/images/premium-home/hero-dubai.webp"
                x="0"
                y="0"
                width="2172"
                height="724"
                filter={url("material-response")}
              />
            </mask>
            <mask id={`${id}-surroundings`}>
              <rect width="2172" height="724" fill="white" />
              <path d={bulb} fill="black" />
              <rect x="1366" y="208" width="138" height="412" fill="black" />
              {/* Retain the small contact shadow anchoring the bulb to the stone. */}
              <ellipse cx="1708" cy="617" rx="27" ry="4" fill="black" />
            </mask>
            <clipPath id={`${id}-panel`}>
              <path d="M1728 0H1940V550H1728Z" />
            </clipPath>
            <linearGradient
              id={`${id}-panel-falloff`}
              gradientUnits="userSpaceOnUse"
              x1="1728"
              x2="1940"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.1" stopColor="white" />
              <stop offset="0.8" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={`${id}-panel-feather`}>
              <rect
                x="1728"
                width="212"
                height="550"
                fill={url("panel-falloff")}
              />
            </mask>
            <clipPath id={`${id}-marble`}>
              <path d="M1238 555L1914 550L2172 598L1818 650L1078 606L1238 590Z" />
            </clipPath>
            <clipPath id={`${id}-metal`}>
              <path d="M1640 497H1764V578L1747 596H1658L1640 578Z" />
            </clipPath>
            <radialGradient id={`${id}-off`} cx="32%" cy="27%" r="85%">
              <stop stopColor="#d2d0ca" />
              <stop offset="0.65" stopColor="#b3b3ad" />
              <stop offset="1" stopColor="#90938f" />
            </radialGradient>
            <radialGradient
              id={`${id}-core`}
              cx="48%"
              cy="54%"
              fx="44%"
              fy="61%"
            >
              <stop stopColor="#fffef5" stopOpacity="0.99" />
              <stop offset="0.25" stopColor="#fffbed" stopOpacity="0.9" />
              <stop offset="0.58" stopColor="#fff4da" stopOpacity="0.5" />
              <stop offset="0.84" stopColor="#ffedcc" stopOpacity="0.12" />
              <stop offset="1" stopColor="#fff0e2" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-edge`} cx="48%" cy="55%" r="76%">
              <stop stopColor="#fff4de" stopOpacity="0" />
              <stop offset="0.3" stopColor="#fff0d0" stopOpacity="0.04" />
              <stop offset="0.62" stopColor="#ffe2a8" stopOpacity="0.36" />
              <stop offset="0.84" stopColor="#ffedc9" stopOpacity="0.16" />
              <stop offset="1" stopColor="#fff6e6" stopOpacity="0.04" />
            </radialGradient>
            <radialGradient id={`${id}-contour`} cx="43%" cy="52%" r="74%">
              <stop offset="0.32" stopColor="#897e6c" stopOpacity="0" />
              <stop offset="0.64" stopColor="#897e6c" stopOpacity="0.015" />
              <stop offset="0.84" stopColor="#897e6c" stopOpacity="0.07" />
              <stop offset="1" stopColor="#897e6c" stopOpacity="0.15" />
            </radialGradient>
            <radialGradient
              id={`${id}-spill`}
              gradientUnits="userSpaceOnUse"
              cx="1852"
              cy="210"
              r="215"
              gradientTransform="translate(1852 210) scale(0.62 1) translate(-1852 -210)"
            >
              <stop stopColor="#fff5e6" stopOpacity="0.95" />
              <stop offset="0.3" stopColor="#fff2e1" stopOpacity="0.7" />
              <stop offset="0.64" stopColor="#fff0de" stopOpacity="0.26" />
              <stop offset="0.85" stopColor="#fff0de" stopOpacity="0.025" />
              <stop offset="1" stopColor="#fff0de" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-marble-warmth`}>
              <stop stopColor="#ffe3b3" stopOpacity="0.8" />
              <stop offset="0.32" stopColor="#ffe7c1" stopOpacity="0.5" />
              <stop offset="0.68" stopColor="#fff0d9" stopOpacity="0.13" />
              <stop offset="0.86" stopColor="#fff5e5" stopOpacity="0.025" />
              <stop offset="1" stopColor="#fff5e5" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-reflection`}>
              <stop stopColor="#fffaf0" stopOpacity="0.7" />
              <stop offset="0.26" stopColor="#fff0d6" stopOpacity="0.4" />
              <stop offset="0.65" stopColor="#ffe8c5" stopOpacity="0.1" />
              <stop offset="1" stopColor="#ffe8c5" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id={`${id}-housing-warmth`}
              gradientUnits="userSpaceOnUse"
              x1="1704"
              y1="300"
              x2="1704"
              y2="495"
            >
              <stop stopColor="#ffdba3" stopOpacity="0.8" />
              <stop offset="0.3" stopColor="#ffe1b2" stopOpacity="0.58" />
              <stop offset="0.7" stopColor="#fff0d8" stopOpacity="0.28" />
              <stop offset="1" stopColor="#fff6e7" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient
              id={`${id}-housing-shoulder`}
              cx="48%"
              cy="-8%"
              r="112%"
            >
              <stop stopColor="#fff5e7" stopOpacity="0.4" />
              <stop offset="0.38" stopColor="#fff4e4" stopOpacity="0.28" />
              <stop offset="0.7" stopColor="#fff6eb" stopOpacity="0.1" />
              <stop offset="1" stopColor="#fff8ee" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id={`${id}-body-scatter`}
              gradientUnits="userSpaceOnUse"
              x1="1704"
              y1="295"
              x2="1704"
              y2="615"
            >
              <stop stopColor="#ffe3b5" stopOpacity="0.5" />
              <stop offset="0.4" stopColor="#ffe7c2" stopOpacity="0.24" />
              <stop offset="0.75" stopColor="#ffefd7" stopOpacity="0.09" />
              <stop offset="1" stopColor="#fff4e5" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`${id}-metal-warmth`}
              gradientUnits="userSpaceOnUse"
              x1="1645"
              y1="497"
              x2="1760"
              y2="596"
            >
              <stop stopColor="#ffcc85" stopOpacity="0.92" />
              <stop offset="0.24" stopColor="#ffd69c" stopOpacity="0.78" />
              <stop offset="0.65" stopColor="#ffdfad" stopOpacity="0.58" />
              <stop offset="1" stopColor="#ffedce" stopOpacity="0.26" />
            </linearGradient>
            <filter
              id={`${id}-near`}
              x="-30%"
              y="-40%"
              width="160%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter
              id={`${id}-far`}
              x="-70%"
              y="-90%"
              width="240%"
              height="280%"
            >
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>

          <path className="bulb-off-shade" d={diffuser} fill={url("off")} />

          <g
            className="bulb-environment bulb-panel-reflection"
            mask={url("surroundings")}
          >
            <g clipPath={url("panel")} mask={url("panel-feather")}>
              <rect
                x="1728"
                y="0"
                width="212"
                height="550"
                fill={url("spill")}
              />
            </g>
          </g>
          <g
            className="bulb-environment bulb-marble-bounce"
            mask={url("surroundings")}
          >
            <g clipPath={url("marble")}>
              <ellipse
                cx="1740"
                cy="575"
                rx="200"
                ry="30"
                fill={url("marble-warmth")}
              />
            </g>
          </g>
          <g
            className="bulb-environment bulb-marble-warmth"
            mask={url("surroundings")}
          >
            <g clipPath={url("marble")}>
              <ellipse
                cx="1715"
                cy="626"
                rx="155"
                ry="18"
                transform="rotate(3 1715 626)"
                fill={url("marble-warmth")}
              />
            </g>
          </g>
          <g
            className="bulb-environment bulb-marble-glint"
            mask={url("surroundings")}
          >
            <g clipPath={url("marble")}>
              <ellipse
                cx="1712"
                cy="624"
                rx="120"
                ry="13"
                transform="rotate(3 1712 624)"
                fill={url("reflection")}
              />
            </g>
          </g>
          <g className="bulb-halo" mask={url("surroundings")}>
            <g className="bulb-bloom-spread">
              <path
                d={diffuser}
                fill="#fff1dd"
                opacity="0.45"
                filter={url("far")}
              />
              <path d={diffuser} fill="#fff8ed" filter={url("near")} />
            </g>
          </g>
          <g className="bulb-body-atmosphere" mask={url("surroundings")}>
            <path d={housing} fill={url("body-scatter")} filter={url("near")} />
            <path
              d="M1640 497H1764V578L1747 596H1658L1640 578Z"
              fill={url("body-scatter")}
              filter={url("near")}
            />
          </g>
          <path
            className="bulb-surface-depth"
            d={diffuser}
            fill={url("contour")}
          />
          <ellipse
            className="bulb-core"
            clipPath={url("diffuser")}
            cx="1697"
            cy="232"
            rx="130"
            ry="110"
            fill={url("core")}
          />
          <path className="bulb-edge" d={diffuser} fill={url("edge")} />
          <g
            className="bulb-housing-reflection bulb-housing-warmth"
            mask={url("material-detail")}
          >
            <path d={housing} fill={url("housing-warmth")} />
          </g>
          <g
            className="bulb-housing-reflection bulb-housing-shoulder"
            mask={url("material-detail")}
          >
            <path d={housing} fill={url("housing-shoulder")} />
          </g>
          <g
            className="bulb-metal-reflection bulb-metal-warmth"
            clipPath={url("metal")}
            mask={url("material-detail")}
          >
            <rect
              x="1640"
              y="497"
              width="124"
              height="99"
              fill={url("metal-warmth")}
            />
          </g>
          <g
            className="bulb-metal-reflection bulb-metal-glint"
            clipPath={url("metal")}
            mask={url("material-detail")}
          >
            <ellipse
              cx="1673"
              cy="539"
              rx="27"
              ry="48"
              opacity="0.5"
              fill={url("reflection")}
            />
            <ellipse
              cx="1651"
              cy="538"
              rx="4"
              ry="38"
              fill={url("reflection")}
            />
          </g>

          <g className="bulb-hover-light">
            <g mask={url("surroundings")}>
              <path
                d={diffuser}
                fill="#fff6e8"
                opacity="0.3"
                filter={url("near")}
              />
            </g>
            <g clipPath={url("diffuser")}>
              <ellipse
                cx="1697"
                cy="232"
                rx="104"
                ry="94"
                opacity="0.9"
                fill={url("core")}
              />
            </g>
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
            setLit((value) => !value);
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
