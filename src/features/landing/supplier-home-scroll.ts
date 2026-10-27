import type { SupplierRuntimeContext } from "./supplier-home-runtime";
import { SUPPLIER_MOTION_EVENT } from "./supplier-home-motion";

type RevealGroup = {
  element: HTMLElement;
  items: RevealItem[];
  outside: boolean;
  played: boolean;
};
type RevealItem = {
  element: HTMLElement;
  kind: "copy" | "card";
  group: RevealGroup;
  state: "complete" | "ready" | "revealing";
  animation: Animation | null;
  distance: number;
  count: number;
};

export function setupSupplierScroll({
  root,
  signal,
  isArabic,
}: SupplierRuntimeContext) {
  // Static HTML always remains fully visible if animation is unavailable.
  if (typeof Element.prototype.animate !== "function") return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 760px)");
  const quiet = () => reduced.matches || root.dataset.motion === "reduced";
  const targets = new Map<HTMLElement, RevealItem>();
  const sections = new Map<HTMLElement, RevealGroup>();
  let frame = 0;
  let navigating = false;
  let navigationTimer = 0;

  const finish = (item: RevealItem) => {
    item.animation?.cancel();
    item.animation = null;
    item.state = "complete";
    item.element.dataset.scrollReveal = "complete";
  };
  const prepare = (item: RevealItem) => {
    finish(item);
    if (
      signal.aborted ||
      quiet() ||
      item.element.contains(document.activeElement)
    )
      return;
    item.distance = compact.matches ? 16 : item.kind === "card" ? 24 : 18;
    item.animation = item.element.animate(
      [
        {
          opacity: item.kind === "card" ? 0.12 : 0.35,
          transform: `translateY(${item.distance}px)`,
        },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: compact.matches ? 620 : item.kind === "card" ? 800 : 700,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "both",
      }
    );
    item.animation.pause();
    item.animation.currentTime = 0;
    void item.animation.finished.catch(() => {});
    item.state = "ready";
    item.element.dataset.scrollReveal = "ready";
  };
  const add = (selector: string, kind: RevealItem["kind"]) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      const section = element.closest<HTMLElement>("section");
      if (!section || !root.contains(section)) return;
      if (!sections.has(section))
        sections.set(section, {
          element: section,
          items: [],
          outside: false,
          played: false,
        });
      const group = sections.get(section)!;
      const item: RevealItem = {
        element,
        kind,
        group,
        state: "complete",
        animation: null,
        distance: 0,
        count: 0,
      };
      targets.set(element, item);
      group.items.push(item);
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

  const play = (item: RevealItem, delay: number) => {
    const animation = item.animation;
    if (!animation) return;
    if (item.element.contains(document.activeElement)) {
      finish(item);
      return;
    }
    item.state = "revealing";
    item.group.played = true;
    item.element.dataset.scrollReveal = "revealing";
    item.element.dataset.scrollRevealCount = String(++item.count);
    animation.effect?.updateTiming({ delay });
    animation.currentTime = 0;
    animation.play();
    void animation.finished
      .then(() => {
        if (!signal.aborted && item.animation === animation) finish(item);
      })
      .catch(() => {});
  };
  const update = () => {
    frame = 0;
    if (signal.aborted || document.hidden || quiet()) return;
    const height = innerHeight;
    const groupBounds = Array.from(sections.values()).map((group) => ({
      group,
      bounds: group.element.getBoundingClientRect(),
    }));
    for (const { group, bounds } of groupBounds) {
      const outside = bounds.bottom < -120 || bounds.top > height + 120;
      if (outside && !group.outside && group.played) {
        group.items.forEach(prepare);
        group.played = false;
      }
      group.outside = outside;
    }
    if (navigating) return;
    const entering = Array.from(targets.values())
      .filter((item) => item.state === "ready")
      .map((item) => ({ item, bounds: item.element.getBoundingClientRect() }))
      .filter(
        ({ item, bounds }) =>
          bounds.height > 0 &&
          bounds.top - item.distance < height * 0.78 &&
          bounds.bottom - item.distance > 0
      )
      .sort((a, b) => {
        const topA = a.bounds.top - a.item.distance;
        const topB = b.bounds.top - b.item.distance;
        return Math.abs(topA - topB) < 36
          ? isArabic
            ? b.bounds.right - a.bounds.right
            : a.bounds.left - b.bounds.left
          : topA - topB;
      });
    let previousTop = -Infinity;
    let previousGroup: RevealGroup | null = null;
    let column = 0;
    for (const { item, bounds } of entering) {
      const top = bounds.top - item.distance;
      column =
        item.group === previousGroup && Math.abs(top - previousTop) < 36
          ? column + 1
          : 0;
      previousTop = top;
      previousGroup = item.group;
      play(item, Math.min(column, 3) * 75);
    }
  };
  const schedule = () => {
    if (!signal.aborted && !frame && !document.hidden)
      frame = requestAnimationFrame(update);
  };
  targets.forEach((item) => {
    if (
      quiet() ||
      item.element.getBoundingClientRect().top < innerHeight * 0.78
    )
      finish(item);
    else prepare(item);
  });
  sections.forEach((group) => {
    group.played = group.items.some((item) => item.state === "complete");
  });
  schedule();

  const endNavigation = () => {
    clearTimeout(navigationTimer);
    navigating = false;
    schedule();
  };
  const beginNavigation = () => {
    navigating = true;
    clearTimeout(navigationTimer);
    navigationTimer = window.setTimeout(endNavigation, 180);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (navigating) {
        clearTimeout(navigationTimer);
        navigationTimer = window.setTimeout(endNavigation, 120);
      }
      schedule();
    },
    { passive: true, signal }
  );
  window.addEventListener(
    "scrollend",
    () => {
      if (navigating) endNavigation();
    },
    { signal }
  );
  window.addEventListener("resize", schedule, { passive: true, signal });
  window.addEventListener("load", schedule, { once: true, signal });
  void document.fonts?.ready.then(schedule);
  let resizeObserver: ResizeObserver | undefined;
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
  }

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
  root.addEventListener(
    "click",
    (event) => {
      if (
        !(event.target instanceof Element) ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link && root.contains(link)) beginNavigation();
    },
    { signal }
  );
  window.addEventListener("hashchange", beginNavigation, { signal });
  window.addEventListener(
    "wheel",
    () => {
      if (navigating) endNavigation();
    },
    { passive: true, signal }
  );
  window.addEventListener(
    "touchstart",
    () => {
      if (navigating) endNavigation();
    },
    { passive: true, signal }
  );
  root.addEventListener(
    "keydown",
    (event) => {
      if (
        navigating &&
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        endNavigation();
    },
    { signal }
  );
  root.querySelector(".fp-filters")?.addEventListener(
    "click",
    () => {
      targets.forEach((item) => {
        if (item.element.closest(".fp-section")) finish(item);
      });
      schedule();
    },
    { signal }
  );
  const applyPreference = () => {
    if (quiet()) targets.forEach(finish);
    else
      sections.forEach((group) => {
        const bounds = group.element.getBoundingClientRect();
        if (bounds.bottom < -120 || bounds.top > innerHeight + 120)
          group.items.forEach(prepare);
      });
    schedule();
  };
  reduced.addEventListener("change", applyPreference, { signal });
  root.addEventListener(SUPPLIER_MOTION_EVENT, applyPreference, { signal });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        targets.forEach((item) => {
          if (item.state === "revealing") finish(item);
        });
      } else schedule();
    },
    { signal }
  );
  const settlePage = () => {
    clearTimeout(navigationTimer);
    navigating = false;
    cancelAnimationFrame(frame);
    frame = 0;
    targets.forEach(finish);
  };
  window.addEventListener("pagehide", settlePage, { signal });
  window.addEventListener(
    "pageshow",
    (event) => {
      if (event.persisted) applyPreference();
    },
    { signal }
  );
  return () => {
    settlePage();
    resizeObserver?.disconnect();
    targets.forEach(({ element }) => {
      delete element.dataset.scrollReveal;
      delete element.dataset.scrollRevealCount;
    });
  };
}
