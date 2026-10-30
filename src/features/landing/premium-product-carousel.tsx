"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type ProductType = "batteries" | "lighting";
type ProductFilter = "all" | ProductType;

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PremiumProductCarousel({
  children,
  productTypes,
}: {
  children: ReactNode;
  productTypes: ProductType[];
}) {
  const t = useTranslations("Website.premiumProducts");
  const isRtl = useLocale() === "ar";
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [position, setPosition] = useState(0);
  const count = productTypes.filter(
    (type) => filter === "all" || type === filter
  ).length;

  const visibleCards = useCallback(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(
      ".premium-product-card"
    );
    return Array.from(cards ?? []).filter(
      (card) => filter === "all" || card.dataset.productType === filter
    );
  }, [filter]);

  const updatePosition = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const bounds = grid.getBoundingClientRect();
    const edge = isRtl ? bounds.right : bounds.left;
    let closest = 0;
    let distance = Infinity;
    visibleCards().forEach((card, index) => {
      const cardBounds = card.getBoundingClientRect();
      const nextDistance = Math.abs(
        (isRtl ? cardBounds.right : cardBounds.left) - edge
      );
      if (nextDistance < distance) {
        closest = index;
        distance = nextDistance;
      }
    });
    setPosition(closest);
  }, [isRtl, visibleCards]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    // A new filter always starts at its first matching product, including RTL.
    grid.scrollTo({ left: 0, behavior: "instant" });
    const observer = new ResizeObserver(updatePosition);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [filter, updatePosition]);

  const goTo = (index: number) => {
    if (index < 0 || index >= count) return;
    const grid = gridRef.current;
    const card = visibleCards()[index];
    if (!grid || !card) return;
    const gridBounds = grid.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    // Absolute positioning lets Home/End reach their target instead of stopping
    // at the next mandatory snap point as directional scrollBy can do.
    const targetOffset = isRtl
      ? cardBounds.right - gridBounds.right
      : cardBounds.left - gridBounds.left;
    grid.scrollTo({
      left: grid.scrollLeft + targetOffset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <div className="premium-product-selection" data-carousel-ready={isHydrated}>
      <fieldset className="premium-product-filters">
        <legend className="premium-products-visually-hidden">
          {t("filterLabel")}
        </legend>
        {(["all", "batteries", "lighting"] as const).map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="premium-product-filter"
              value={value}
              checked={filter === value}
              onChange={() => {
                setPosition(0);
                setFilter(value);
              }}
              aria-controls="premium-product-grid"
            />
            <span>{t(`filters.${value}`)}</span>
          </label>
        ))}
      </fieldset>
      <div
        id="premium-product-grid"
        className="premium-product-grid"
        ref={gridRef}
        onScroll={updatePosition}
        tabIndex={0}
        role="group"
        aria-label={t("carousel.label")}
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !window.matchMedia("(max-width: 767px)").matches
          ) {
            return;
          }
          let nextPosition = position;
          if (event.key === "ArrowRight") nextPosition += isRtl ? -1 : 1;
          else if (event.key === "ArrowLeft") nextPosition += isRtl ? 1 : -1;
          else if (event.key === "Home") nextPosition = 0;
          else if (event.key === "End") nextPosition = count - 1;
          else return;
          event.preventDefault();
          goTo(Math.max(0, Math.min(count - 1, nextPosition)));
        }}
      >
        {children}
      </div>
      {isHydrated && (
        <div className="premium-product-carousel-controls">
          <button
            type="button"
            onClick={() => {
              if (position > 0) goTo(position - 1);
            }}
            aria-disabled={position === 0}
            aria-label={t("carousel.previous")}
            aria-controls="premium-product-grid"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>
          <span role="status" aria-live="polite" aria-atomic="true">
            {t("carousel.position", { current: position + 1, total: count })}
          </span>
          <button
            type="button"
            onClick={() => {
              if (position < count - 1) goTo(position + 1);
            }}
            aria-disabled={position === count - 1}
            aria-label={t("carousel.next")}
            aria-controls="premium-product-grid"
          >
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
