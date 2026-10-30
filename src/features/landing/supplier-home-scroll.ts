import type { SupplierRuntimeContext } from "./supplier-home-runtime";
import { SUPPLIER_MOTION_EVENT } from "./supplier-home-motion";

type RevealItem = {
  element: HTMLElement;
  kind: "copy" | "card";
  complete: boolean;
  animation: Animation | null;
};

export function setupSupplierScroll({
  root,
  signal,
  isArabic,
}: SupplierRuntimeContext) {
  // Content is always readable; only apply motion as it reaches the viewport.
  if (
    !("IntersectionObserver" in window) ||
    typeof Element.prototype.animate !== "function"
  )
    return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 760px)");
  const quiet = () => reduced.matches || root.dataset.motion === "reduced";
  const targets = new Map<HTMLElement, RevealItem>();

  const finish = (item: RevealItem) => {
    item.animation?.cancel();
    item.animation = null;
    item.complete = true;
    item.element.dataset.scrollReveal = "complete";
    observer.unobserve(item.element);
  };

  const play = (item: RevealItem, delay: number) => {
    if (item.complete) return;
    if (quiet() || item.element.contains(document.activeElement)) {
      finish(item);
      return;
    }
    // Observe once. Revisiting a section must never hide or replay its content.
    observer.unobserve(item.element);
    item.complete = true;
    item.element.dataset.scrollReveal = "revealing";
    item.element.dataset.scrollRevealCount = "1";
    const distance = compact.matches ? 6 : item.kind === "card" ? 10 : 7;
    const animation = item.element.animate(
      [
        { opacity: 0.88, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: compact.matches ? 300 : 380,
        delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      }
    );
    item.animation = animation;
    void animation.finished
      .then(() => {
        if (!signal.aborted && item.animation === animation) finish(item);
      })
      .catch(() => {});
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (signal.aborted || document.hidden) return;
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          const top = a.boundingClientRect.top - b.boundingClientRect.top;
          return Math.abs(top) < 24
            ? isArabic
              ? b.boundingClientRect.right - a.boundingClientRect.right
              : a.boundingClientRect.left - b.boundingClientRect.left
            : top;
        });
      let previousTop = -Infinity;
      let column = 0;
      for (const entry of entering) {
        const item = targets.get(entry.target as HTMLElement);
        if (!item) continue;
        column =
          Math.abs(entry.boundingClientRect.top - previousTop) < 24
            ? column + 1
            : 0;
        previousTop = entry.boundingClientRect.top;
        play(item, Math.min(column, 2) * 35);
      }
    },
    // Start at the viewport edge rather than waiting until content is well inside.
    { threshold: 0, rootMargin: "0px 0px -16px 0px" }
  );

  const add = (selector: string, kind: RevealItem["kind"]) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      if (targets.has(element)) return;
      const item: RevealItem = {
        element,
        kind,
        complete: false,
        animation: null,
      };
      targets.set(element, item);
      const bounds = element.getBoundingClientRect();
      // Avoid making already-painted content jump when hydration completes.
      if (quiet() || (bounds.height > 0 && bounds.top < innerHeight))
        finish(item);
      else {
        element.dataset.scrollReveal = "ready";
        observer.observe(element);
      }
    });
  };
  add(
    ".toshiba-ranges .section-head, .fp-heading-copy, .ct-heading > div, .tb-heading-copy, .capabilities-intro > h2, .capabilities-intro > p, .company-story > h2, .company-story > p, .quote-copy > h2",
    "copy"
  );
  add(
    ".range-grid > .range, .fp-group .fp-card, .ct-food-card, .ct-supply-card, .tb-card, .capabilities-list > details, .company-record > div",
    "card"
  );

  const settleInteraction = (event: Event) => {
    if (!(event.target instanceof Node)) return;
    const target = event.target;
    targets.forEach((item) => {
      if (item.element.contains(target)) finish(item);
    });
  };
  root.addEventListener("focusin", settleInteraction, { signal });
  root.addEventListener("pointerdown", settleInteraction, {
    passive: true,
    signal,
  });
  root.querySelector(".fp-filters")?.addEventListener(
    "click",
    () => {
      // Product switching has its own compact transition, never two animations.
      targets.forEach((item) => {
        if (item.element.closest(".fp-section")) finish(item);
      });
    },
    { signal }
  );
  const applyPreference = () => {
    if (quiet()) targets.forEach(finish);
  };
  reduced.addEventListener("change", applyPreference, { signal });
  root.addEventListener(SUPPLIER_MOTION_EVENT, applyPreference, { signal });
  document.addEventListener(
    "visibilitychange",
    () => {
      targets.forEach((item) => {
        if (document.hidden) {
          if (item.animation) finish(item);
          return;
        }
        // Observer notifications can arrive while a background tab is hidden.
        // Settle anything now visible instead of introducing a delayed entrance.
        const bounds = item.element.getBoundingClientRect();
        if (bounds.height > 0 && bounds.top < innerHeight && bounds.bottom > 0)
          finish(item);
      });
    },
    { signal }
  );
  window.addEventListener("pagehide", () => targets.forEach(finish), {
    signal,
  });

  return () => {
    observer.disconnect();
    targets.forEach((item) => {
      item.animation?.cancel();
      delete item.element.dataset.scrollReveal;
      delete item.element.dataset.scrollRevealCount;
    });
  };
}
