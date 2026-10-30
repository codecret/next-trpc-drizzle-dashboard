"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const subscribe = () => () => {};

export function CategoryNavigation({
  children,
  label,
  previousLabel,
  nextLabel,
  allLabel,
}: {
  children: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
  allLabel: string;
}) {
  const id = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const distance = Math.abs(element.scrollLeft);
      setEdges({
        start: distance <= 2,
        end: distance + element.clientWidth >= element.scrollWidth - 2,
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    const frame = requestAnimationFrame(update);
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const rtl = getComputedStyle(element).direction === "rtl";
    element.scrollBy({
      left: direction * (rtl ? -1 : 1) * element.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <nav className="premium-category-bar premium-container" aria-label={label}>
      <div id={id} ref={track} className="premium-category-track">
        {children}
      </div>
      <div className="premium-category-footer">
        <Link href="/products" className="premium-link">
          {allLabel}
          <ArrowRight aria-hidden="true" />
        </Link>
        {hydrated && (
          <div className="premium-category-controls">
            <button
              type="button"
              aria-label={previousLabel}
              aria-controls={id}
              aria-disabled={edges.start}
              onClick={() => !edges.start && move(-1)}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              aria-controls={id}
              aria-disabled={edges.end}
              onClick={() => !edges.end && move(1)}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
