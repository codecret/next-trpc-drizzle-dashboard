"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, ScanLine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import "./product-detail.css";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const isRtl = useLocale() === "ar";
  const imageId = useId();
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailRail = useRef<HTMLDivElement>(null);
  const t = useTranslations("Website.catalogue");
  const changeImage = (direction: number) =>
    setActive(
      (current) => (current + direction + images.length) % images.length
    );

  useEffect(() => {
    const rail = thumbnailRail.current;
    const thumbnail = thumbnails.current[active];
    if (rail && thumbnail) {
      rail.scrollBy({
        left:
          thumbnail.getBoundingClientRect().left -
          rail.getBoundingClientRect().left -
          (rail.clientWidth - thumbnail.clientWidth) / 2,
        behavior: "auto",
      });
    }
  }, [active]);

  function navigateThumbnails(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let next = index;
    if (event.key === "ArrowRight")
      next = (index + (isRtl ? -1 : 1) + images.length) % images.length;
    else if (event.key === "ArrowLeft")
      next = (index + (isRtl ? 1 : -1) + images.length) % images.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = images.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    thumbnails.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section className="product-gallery" aria-label={name}>
      <div className="product-gallery-stage" id={imageId}>
        <Image
          src={images[active]}
          alt={
            name +
            " — " +
            t("image", { number: active + 1, total: images.length })
          }
          fill
          priority
          className="product-gallery-photo"
          sizes="(min-width: 1440px) 720px, (min-width: 768px) 52vw, 90vw"
        />
        <a
          href={images[active]}
          target="_blank"
          rel="noopener noreferrer"
          className="product-gallery-expand"
          aria-label={t("fullImage")}
        >
          <ScanLine aria-hidden="true" />
        </a>
        {images.length > 1 && (
          <div className="product-gallery-controls">
            <button
              type="button"
              onClick={() => changeImage(-1)}
              aria-label={t("previous")}
              aria-controls={imageId}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => changeImage(1)}
              aria-label={t("next")}
              aria-controls={imageId}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="product-gallery-toolbar">
        <p role="status" aria-live="polite" aria-atomic="true">
          {t("image", { number: active + 1, total: images.length })}
        </p>
        <a
          href={images[active]}
          target="_blank"
          rel="noopener noreferrer"
          className="product-gallery-full-link"
        >
          {t("fullImage")}
          <ExternalLink aria-hidden="true" />
        </a>
      </div>

      {images.length > 1 && (
        <div
          ref={thumbnailRail}
          className="product-gallery-thumbnails"
          role="group"
          aria-label={name}
        >
          {images.map((src, index) => (
            <button
              key={src}
              ref={(element) => {
                thumbnails.current[index] = element;
              }}
              type="button"
              onClick={() => setActive(index)}
              onKeyDown={(event) => navigateThumbnails(event, index)}
              aria-label={t("imageView", { number: index + 1 })}
              aria-pressed={active === index}
              aria-controls={imageId}
              className="product-gallery-thumbnail"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="78px"
                className="product-gallery-thumbnail-photo"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
